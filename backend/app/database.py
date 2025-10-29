# app/database.py

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
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

Base = declarative_base()

# --- YENİ EKLENEN KISIM ---
# Veritabanı oturumu almak için bağımlılık fonksiyonu
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()