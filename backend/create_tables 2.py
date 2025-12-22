import sys
import os

sys.path.append(os.getcwd())

from app.database import engine
from app.models.base import Base

# Mevcut Modeller
from app.models.user import User
from app.models.influencer import Influencer
from app.models.brand import Brand
from app.models.collaboration import Collaboration
from app.models.message import Message 

# YENİ EKLENEN FİNANS MODELLERİ (Bunları unutmuştuk)
from app.models.finance import Wallet, Transaction

def init_db():
    print("⏳ Veritabanı tabloları kontrol ediliyor...")
    Base.metadata.create_all(bind=engine)
    print("✅ TÜM Tablolar (User, Brand, Inf, Msg, Wallet, Transaction) HAZIR!")

if __name__ == "__main__":
    init_db()