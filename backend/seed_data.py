import os
import random
from dotenv import load_dotenv

# .env dosyasını yükle (Veritabanı bağlantısı için şart)
load_dotenv()

from sqlalchemy.orm import Session
from faker import Faker
from passlib.context import CryptContext

# Kendi proje yapına göre importlar
from app.database import SessionLocal, engine
# Base'i import ediyoruz ki tabloları oluşturabilelim
from app.models.user import User, RoleType, Base 
from app.models.influencer import Influencer
from app.models.brand import Brand

# Faker Ayarları (Türkçe)
fake = Faker('tr_TR')

# Şifreleme Ayarları
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
DEFAULT_PASSWORD_HASH = pwd_context.hash("123123")

# Sabit Listeler
CATEGORIES = [
    "Moda & Giyim", "Teknoloji", "Seyahat", "Yemek & Gurme", 
    "Oyun & E-Spor", "Güzellik & Bakım", "Spor & Fitness", 
    "Eğitim", "Sanat", "Mizah", "Ebeveynlik", "Otomotiv"
]

INDUSTRIES = [
    "E-Ticaret", "Yazılım & Bilişim", "Finans", "Otomotiv", 
    "Tekstil", "Gıda & İçecek", "Sağlık", "Turizm", 
    "Eğitim", "Medya", "İnşaat", "Lojistik"
]

def seed_database():
    print("🛠️  Tablolar kontrol ediliyor ve oluşturuluyor...")
    # KRİTİK SATIR: Eğer tablolar silindiyse veya yoksa, modellerden tekrar oluşturur.
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    print("🌱 Veritabanı tohumlama işlemi başladı...")

    try:
        # --- 1. INFLUENCER OLUŞTURMA (50 Adet) ---
        print("📸 50 Influencer oluşturuluyor...")
        
        for i in range(50):
            email = f"influencer{i+1}@reklagram.com"
            
            # Eğer kullanıcı zaten varsa atla
            if db.query(User).filter(User.email == email).first():
                continue

            # User Oluştur
            user = User(
                email=email,
                password_hashed=DEFAULT_PASSWORD_HASH,
                is_active=True,
                role=RoleType.Influencer
            )
            db.add(user)
            db.flush() # ID almak için flush

            # Influencer Detayları
            full_name = fake.name()
            # Boşlukları ve Türkçe karakterleri temizleyerek kullanıcı adı yapma
            username_base = full_name.lower().replace(" ", "").replace("ç","c").replace("ğ","g").replace("ı","i").replace("ö","o").replace("ş","s").replace("ü","u")
            username = f"{username_base}{random.randint(10, 99)}"
            
            influencer = Influencer(
                id=user.id,
                display_name=full_name,
                instagram_username=f"@{username}",
                youtube_channel_url=f"https://youtube.com/{username}",
                tiktok_username=f"@{username}_tiktok",
                instagram_account_id=str(fake.random_number(digits=10)),
                instagram_access_token_encrypted="mock_token",
                is_verified=random.choice([True, False, False]), # %33 şansla onaylı
                category=random.choice(CATEGORIES),
                bio=fake.text(max_nb_chars=140),
                location=fake.city(),
                target_age_range=random.choice(["13-17", "18-24", "25-34", "35-44", "45+"]),
                target_gender=random.choice(["Kadın", "Erkek", "Hepsi"]),
                media_kit_url=None,
                media_kit_last_generated_at=None
            )
            db.add(influencer)

        # --- 2. BRAND (MARKA) OLUŞTURMA (50 Adet) ---
        print("🏢 50 Marka oluşturuluyor..")
        
        for i in range(50):
            email = f"brand{i+1}@reklagram.com"

            if db.query(User).filter(User.email == email).first():
                continue
            
            user = User(
                email=email,
                password_hashed=DEFAULT_PASSWORD_HASH,
                is_active=True,
                role=RoleType.Brand
            )
            db.add(user)
            db.flush()

            brand = Brand(
                id=user.id,
                company_name=fake.company(),
                contact_person=fake.name(),
                phone_number=fake.phone_number(),
                website_url=fake.url(),
                industry=random.choice(INDUSTRIES)
            )
            db.add(brand)

        db.commit()
        print("✅ İŞLEM TAMAMLANDI!")
        print("------------------------------------------------")
        print("👤 Influencer Giriş: influencer1@reklagram.com")
        print("🏢 Marka Giriş:      brand1@reklagram.com")
        print("🔑 Şifre (Hepsi):    123123")
        print("------------------------------------------------")

    except Exception as e:
        print(f"❌ HATA OLUŞTU: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()