# app/routers/auth.py

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

# Modelleri ve Enum'ı import et
from ..models.base import RoleType
from ..models.user import User
from ..models.influencer import Influencer
from ..models.brand import Brand

# Şemaları import et
from ..schemas import user as user_schema
from ..schemas import auth as auth_schema

# Auth bağımlılıklarını import et
from ..dependencies.auth import (
    get_db,
    get_password_hash,
    verify_password,
    create_access_token,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    oauth2_scheme,
    SECRET_KEY,
    ALGORITHM
)

from jose import JWTError, jwt
from ..utils.email import send_password_reset_email

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

# Kullanıcı Kayıt Endpoint'i
@router.post("/register", response_model=user_schema.User)
def register_user(user_data: user_schema.UserCreate, db: Session = Depends(get_db)):
    # Email kontrolü
    db_user = db.query(User).filter(User.email == user_data.email).first()
    if db_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="E-posta zaten kayıtlı.")
    
    # Şifreyi hashle (72 byte limiti otomatik yönetiliyor)
    hashed_password = get_password_hash(user_data.password)
    
    # Yeni kullanıcı oluştur
    new_user = User(
        email=user_data.email,
        password_hashed=hashed_password,
        role=user_data.role  # Enum tabanlı rol
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Rolüne göre profil oluştur
    if new_user.role == RoleType.Influencer:
        # Influencer için gerekli alanları kontrol et
        if user_data.display_name:
            new_influencer = Influencer(
                id=new_user.id,
                display_name=user_data.display_name,
                instagram_username=user_data.instagram_username,
                youtube_channel_url=user_data.youtube_channel_url,
                tiktok_username=user_data.tiktok_username,
                category=user_data.category,
                bio=user_data.bio,
                location=user_data.location,
                target_age_range=user_data.target_age_range,
                target_gender=user_data.target_gender
            )
            db.add(new_influencer)
        else:
            # Kullanıcıyı geri al
            db.delete(new_user)
            db.commit()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Influencer kayıt için display_name alanı zorunludur."
            )
    
    elif new_user.role == RoleType.Brand:
        # Marka için company_name zorunlu
        if user_data.company_name:
            new_brand = Brand(
                id=new_user.id,
                company_name=user_data.company_name,
                contact_person=user_data.contact_person,
                phone_number=user_data.phone_number,
                website_url=user_data.website_url,
                industry=user_data.industry
            )
            db.add(new_brand)
        else:
            # Kullanıcıyı geri al
            db.delete(new_user)
            db.commit()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Marka kayıt için company_name alanı zorunludur."
            )
    
    # Profil ekleme işlemini kaydet
    db.commit()
    db.refresh(new_user)
    
    return new_user

# Kullanıcı Giriş Endpoint'i
@router.post("/login", response_model=auth_schema.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    
    if not user or not verify_password(form_data.password, user.password_hashed):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Yanlış e-posta veya şifre",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Hesap pasif durumda.")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id), "role": user.role.value},  # Enum değerini kullan
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "role": user.role.value,
        "email": user.email
    }


# Kullanıcı Bilgisi Endpoint'i (Token ile)
@router.get("/me", response_model=user_schema.User)
async def get_current_user_info(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    """
    Token ile giriş yapmış kullanıcının bilgilerini döndür
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Kimlik bilgileri doğrulanamadı",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id_str: str = payload.get("sub")
        if user_id_str is None:
            raise credentials_exception
        user_id = int(user_id_str)
    except (JWTError, ValueError):
        raise credentials_exception
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
        
    # Profil bilgilerini ekle
    if user.role == RoleType.Influencer and user.influencer:
        user.display_name = user.influencer.display_name
    elif user.role == RoleType.Brand and user.brand:
        user.company_name = user.brand.company_name
    
    return user


# Şifremi Unuttum Endpoint'i
@router.post("/forgot-password")
async def forgot_password(email_data: auth_schema.ForgotPasswordRequest, db: Session = Depends(get_db)):
    """
    Şifre sıfırlama için e-posta gönder
    """
    user = db.query(User).filter(User.email == email_data.email).first()
    
    # Güvenlik için kullanıcı bulunamasa bile başarılı response dön (email enumeration prevention)
    if not user:
        return {"message": "Eğer e-posta kayıtlıysa, şifre sıfırlama bağlantısı gönderildi."}
    
    # Reset token oluştur (24 saat geçerli)
    reset_token_expires = timedelta(hours=24)
    reset_token = create_access_token(
        data={"sub": str(user.id), "type": "password_reset"},
        expires_delta=reset_token_expires
    )
    
    # E-posta gönder
    email_sent = await send_password_reset_email(user.email, reset_token)
    
    # Geliştirme ortamında token'ı console'a yazdır
    print(f"Password reset token for {user.email}: {reset_token}")
    print(f"Reset link: http://localhost:3000/reset-password?token={reset_token}")
    print(f"Email sent: {email_sent}")
    
    return {"message": "Eğer e-posta kayıtlıysa, şifre sıfırlama bağlantısı gönderildi."}


# Şifre Sıfırlama Endpoint'i
@router.post("/reset-password")
def reset_password(reset_data: auth_schema.ResetPasswordRequest, db: Session = Depends(get_db)):
    """
    Token ile şifre sıfırlama
    """
    try:
        # Token'ı decode et
        payload = jwt.decode(reset_data.token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        token_type: str = payload.get("type")
        
        # Token tipini kontrol et
        if token_type != "password_reset":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Geçersiz token"
            )
        
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Geçersiz token"
            )
        
        # Kullanıcıyı bul
        user = db.query(User).filter(User.id == int(user_id)).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Kullanıcı bulunamadı"
            )
        
        # Yeni şifreyi hashle ve güncelle
        old_hash = user.password_hashed
        new_hash = get_password_hash(reset_data.new_password)
        user.password_hashed = new_hash
        
        print(f"Password reset for user {user.email} (ID: {user.id})")
        print(f"Old hash: {old_hash[:50]}...")
        print(f"New hash: {new_hash[:50]}...")
        
        db.commit()
        db.refresh(user)
        
        print(f"After commit, current hash: {user.password_hashed[:50]}...")
        
        return {"message": "Şifreniz başarıyla güncellendi"}
        
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token süresi dolmuş veya geçersiz"
        )