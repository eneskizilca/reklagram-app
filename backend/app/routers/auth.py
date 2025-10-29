# app/routers/auth.py

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

# --- İŞTE BU KISIM TÜM SORUNU ÇÖZECEK ---
from .. import models
# schemas klasörünün içindeki dosyaları özel olarak import ediyoruz
from ..schemas import user as user_schema
from ..schemas import auth as auth_schema
# ---------------------------------------------

from ..dependencies.auth import (
    get_db,
    get_password_hash,
    verify_password,
    create_access_token,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

# Yardımcı Fonksiyon
def create_profile_for_user(db: Session, user: models.User):
    if user.role_id == 1: # Influencer
        if not db.query(models.Influencer).filter(models.Influencer.id == user.id).first():
            new_influencer = models.Influencer(id=user.id)
            db.add(new_influencer)
    elif user.role_id == 2: # Brand
        if not db.query(models.Brand).filter(models.Brand.id == user.id).first():
            new_brand = models.Brand(id=user.id, company_name=f"Marka {user.id}")
            db.add(new_brand)
    db.commit()


# Kullanıcı Kayıt Endpoint'i
@router.post("/register", response_model=user_schema.User) # Değişti
def register_user(user_data: user_schema.UserCreate, db: Session = Depends(get_db)): # Değişti
    db_user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if db_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="E-posta zaten kayıtlı.")
    
    hashed_password = get_password_hash(user_data.password)
    
    new_user = models.User(
        email=user_data.email,
        password_hashed=hashed_password,
        role_id=user_data.role_id
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    create_profile_for_user(db, new_user)
    
    return new_user

# Kullanıcı Giriş Endpoint'i
@router.post("/login", response_model=auth_schema.Token) # Değişti
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    
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
        data={"sub": str(user.id), "role_id": user.role_id},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}