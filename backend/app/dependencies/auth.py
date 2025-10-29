# app/dependencies/auth.py

from datetime import datetime, timedelta
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext

# --- DEĞİŞEN KISIM ---
from ..database import SessionLocal, get_db # get_db'yi buradan import edeceğiz
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

# ----- Şifreleme ve Token Ayarları (Aynı kalacak) -----
# OAuth2 şifre akışı için güvenlik şeması (Swagger UI için)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login") # tokenUrl path'i /auth/login olacak

# Şifre hashleme için bağlam (context)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ----- Yardımcı Fonksiyonlar (Aynı kalacak) -----

# Şifre hashleme
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

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

# ----- Rol Doğrulama Fonksiyonları (Aynı kalacak) -----

# Mevcut influencer'ı doğrular
async def get_current_influencer(current_user: UserSchema = Depends(get_current_user)):
    if current_user.role_id != 1: # 1: Influencer rolü
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Sadece Influencer'lara özel.")
    return current_user

# Mevcut markayı doğrular
async def get_current_brand(current_user: UserSchema = Depends(get_current_user)):
    if current_user.role_id != 2: # 2: Brand rolü
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Sadece Markalara özel.")
    return current_user

# Mevcut super admini doğrular
async def get_current_super_admin(current_user: UserSchema = Depends(get_current_user)):
    if current_user.role_id != 3: # 3: SuperAdmin rolü
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Sadece SuperAdmin'lere özel.")
    return current_user