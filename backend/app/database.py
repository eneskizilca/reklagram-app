# app/database.py

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv # Yeni!
import os # Yeni!

# .env dosyasını yükle
load_dotenv()

# Veritabanı URL'ini .env dosyasından oku
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")
if not SQLALCHEMY_DATABASE_URL:
    raise ValueError("DATABASE_URL ortam değişkeni ayarlanmadı.")

# 2. SQLAlchemy motorunu oluştur
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# 3. Veritabanı oturumları (sessions) için bir fabrika oluştur
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. Modellerimizin miras alacağı temel Base sınıfını oluştur
Base = declarative_base()