import os
import random
from dotenv import load_dotenv

# .env yükle
load_dotenv()

from sqlalchemy.orm import Session
from faker import Faker
from app.database import SessionLocal, engine

# Senin Modellerin
from app.models.user import Base # Base'i user'dan veya base dosyasından çek
from app.models.brand import Brand
from app.models.influencer import Influencer
from app.models.collaboration import Collaboration # Senin model dosyan

fake = Faker('tr_TR')

# Modelindeki durumlara uygun liste
STATUS_OPTIONS = ["pending", "active", "completed", "cancelled"]

# Gerçekçi Kampanya İsimleri Üretmek İçin Kelimeler
CAMPAIGN_PREFIXES = [
    "Yaz Sezonu", "Kış İndirimi", "Okula Dönüş", "Yeni Ürün", "Lansman", 
    "Sürdürülebilirlik", "Black Friday", "Yılbaşı", "Sevgililer Günü", 
    "Viral", "Marka Yüzü", "Unboxing", "Makyaj Trendleri"
]

def seed_collaborations():
    print("🛠️  Collaboration tablosu kontrol ediliyor..")
    # KRİTİK: Tablo yoksa oluşturur
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    print("🤝 İşbirlikleri (Collaborations) oluşturuluyor..")

    try:
        # Önce Marka ve Influencerları çek
        brands = db.query(Brand).all()
        influencers = db.query(Influencer).all()

        if not brands or not influencers:
            print("❌ HATA: Önce Marka ve Influencer verisi oluşturmalısın! (seed_data.py çalıştır)")
            return

        for i in range(50):
            # Rastgele eşleştirme
            random_brand = random.choice(brands)
            random_influencer = random.choice(influencers)
            
            # Rastgele Kampanya İsmi (Örn: "Yaz Sezonu Kampanyası #42")
            campaign_name = f"{random.choice(CAMPAIGN_PREFIXES)} Kampanyası #{random.randint(100, 999)}"

            collab = Collaboration(
                brand_id=random_brand.id,
                influencer_id=random_influencer.id,
                campaign_name=campaign_name,
                status=random.choice(STATUS_OPTIONS),
                description=fake.paragraph(nb_sentences=3)
            )
            
            db.add(collab)

        db.commit()
        print("✅ BAŞARILI: 50 Adet İşbirliği veritabanına eklendi!")
        print("📊 Tablo: collaborations")

    except Exception as e:
        print(f"❌ HATA: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_collaborations()