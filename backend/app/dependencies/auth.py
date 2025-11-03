# app/dependencies/auth.py

from datetime import datetime, timedelta
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
import bcrypt  # Direkt bcrypt kullanacağız (passlib yerine)

# --- DEĞİŞEN KISIM ---
from ..database import SessionLocal, get_db # get_db'yi buradan import edeceğiz
from ..models.base import RoleType  # RoleType Enum'ını import et
from ..models.user import User as DBUser # SQLAlchemy modelini DBUser olarak import et
from ..schemas.user import User as UserSchema # Pydantic modelini UserSchema olarak import et
# --- DEĞİŞİKLİK SONU ---

from dotenv import load_dotenv
import os

# .env dosyasını yükle
load_dotenv()

# ----- Ayarlar ve Konfigürasyonlar (Şimdi .env'den okunuyor!) -----
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

if not SECRET_KEY:
    raise ValueError("SECRET_KEY ortam değişkeni ayarlanmadı.")

# ----- Şifreleme ve Token Ayarları -----
# OAuth2 şifre akışı için güvenlik şeması (Swagger UI için)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login") # tokenUrl path'i /auth/login olacak

# ----- Yardımcı Fonksiyonlar (Direkt bcrypt kullanıyor) -----

# Şifre hashleme
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Şifreyi doğrula (bcrypt ile)
    """
    # String'i byte'a çevir
    password_bytes = plain_password.encode('utf-8')
    hashed_bytes = hashed_password.encode('utf-8')
    
    # 72 byte limitini kontrol et
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
    
    try:
        return bcrypt.checkpw(password_bytes, hashed_bytes)
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    """
    Şifreyi hashle (bcrypt ile)
    Otomatik olarak 72 byte limitini yönetir
    """
    # String'i byte'a çevir
    password_bytes = password.encode('utf-8')
    
    # 72 byte limitini kontrol et
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
    
    # Salt oluştur ve hashle
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    
    # Byte'ı string'e çevir (veritabanına kaydetmek için)
    return hashed.decode('utf-8')

# JWT oluşturma
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# ----- JWT Doğrulama ve Kullanıcı Çekme (DBUser kullanılarak güncellendi) -----

# JWT token'ı doğrular ve mevcut kullanıcıyı (Pydantic model olarak) döndürür
async def get_current_user(token: str = Depends(oauth2_scheme), db: SessionLocal = Depends(get_db)): # SessionLocal -> Session
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Kimlik bilgileri doğrulanamadı",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id_str: str = payload.get("sub") # JWT'deki 'sub' genelde string olur
        if user_id_str is None:
            raise credentials_exception
        user_id = int(user_id_str) # Integer'a çevir
    except JWTError:
        raise credentials_exception
    except ValueError: # Eğer user_id_str integer'a çevrilemezse
        raise credentials_exception

    user = db.query(DBUser).filter(DBUser.id == user_id).first() # DBUser modelini kullan
    if user is None:
        raise credentials_exception

    return UserSchema.from_orm(user) # Pydantic model olarak döndür

# ----- Rol Doğrulama Fonksiyonları (Enum tabanlı) -----

# Mevcut influencer'ı doğrular
async def get_current_influencer(current_user: UserSchema = Depends(get_current_user)):
    if current_user.role != RoleType.Influencer:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Sadece Influencer'lara özel.")
    return current_user

# Mevcut markayı doğrular
async def get_current_brand(current_user: UserSchema = Depends(get_current_user)):
    if current_user.role != RoleType.Brand:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Sadece Markalara özel.")
    return current_user

# Mevcut super admini doğrular
async def get_current_super_admin(current_user: UserSchema = Depends(get_current_user)):
    if current_user.role != RoleType.SuperAdmin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Sadece SuperAdmin'lere özel.")
    return current_user