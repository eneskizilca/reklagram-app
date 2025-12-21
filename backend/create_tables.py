import sys
import os

sys.path.append(os.getcwd())

from app.database import engine
from app.models.base import Base

# TÜM Modelleri buraya çağırıyoruz ki hepsi oluşsun
from app.models.user import User
from app.models.influencer import Influencer
from app.models.brand import Brand
from app.models.collaboration import Collaboration
from app.models.message import Message 

def init_db():
    print("⏳ Veritabanı tabloları kontrol ediliyor...")
    # create_all: Sadece EKSİK olan tabloları yaratır, var olanlara dokunmaz.
    Base.metadata.create_all(bind=engine)
    print("✅ TÜM Tablolar (User, Brand, Influencer, Message) hazır!")

if __name__ == "__main__":
    init_db()