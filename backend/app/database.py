# app/database.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

# .env dosyasını yükle
load_dotenv()

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")
if not SQLALCHEMY_DATABASE_URL:
    raise ValueError("DATABASE_URL ortam değişkeni ayarlanmadı.")

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base artık models/base.py'de tanımlanıyor
# from .models.base import Base # (Bu satırı burada kullanmıyoruz, circular import olmasın diye)

# Veritabanı oturumu almak için bağımlılık fonksiyonu
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()