# app/dependencies/auth.py

from datetime import datetime, timedelta
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext

from ..database import SessionLocal
from ..models.user import User as DBUser
from ..schemas.user import User as UserSchema

from dotenv import load_dotenv # Yeni!
import os # Yeni!

# .env dosyasını yükle
load_dotenv()

# ----- Ayarlar ve Konfigürasyonlar (Şimdi .env'den okunuyor!) -----
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256") # Varsayılan değer de verebiliriz
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

if not SECRET_KEY:
    raise ValueError("SECRET_KEY ortam değişkeni ayarlanmadı.")

# ... (geri kalan kod aynı kalacak) ...