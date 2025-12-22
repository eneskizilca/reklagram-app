"""
SuperAdmin kullanıcısı oluşturma scripti
Kullanım: python create_superadmin.py
"""

import sys
import os
from sqlalchemy.orm import Session

# Backend modüllerini import edebilmek için path'e ekle
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, engine
from app.models.user import User
from app.models.base import RoleType, Base
from app.dependencies.auth import get_password_hash

def create_superadmin():
    """SuperAdmin kullanıcısı oluştur"""
    
    # Database tabloları oluştur
    Base.metadata.create_all(bind=engine)
    
    # Database session
    db = SessionLocal()
    
    try:
        # SuperAdmin bilgileri
        email = input("SuperAdmin email (varsayılan: admin@reklagram.com): ") or "admin@reklagram.com"
        password = input("SuperAdmin şifre (varsayılan: admin123): ") or "admin123"
        
        # Email kontrolü
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            print(f"\n⚠️  {email} zaten kayıtlı!")
            
            # Role'ü superadmin yap
            if existing_user.role != RoleType.SuperAdmin:
                existing_user.role = RoleType.SuperAdmin
                db.commit()
                print(f"✅ {email} kullanıcısının rolü superadmin olarak güncellendi!")
            else:
                print(f"ℹ️  {email} zaten superadmin!")
            
            return
        
        # Şifreyi hashle
        hashed_password = get_password_hash(password)
        
        # Yeni SuperAdmin kullanıcısı oluştur
        superadmin = User(
            email=email,
            password_hashed=hashed_password,
            role=RoleType.SuperAdmin,
            is_active=True
        )
        
        db.add(superadmin)
        db.commit()
        db.refresh(superadmin)
        
        print("\n" + "="*50)
        print("✅ SuperAdmin kullanıcısı başarıyla oluşturuldu!")
        print("="*50)
        print(f"📧 Email: {email}")
        print(f"🔑 Şifre: {password}")
        print(f"🎯 Role: superadmin")
        print(f"\n🌐 Giriş URL: http://localhost:3000/admin")
        print("="*50)
        
    except Exception as e:
        print(f"\n❌ Hata oluştu: {str(e)}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    print("\n🔐 SuperAdmin Oluşturma Scripti\n")
    create_superadmin()



