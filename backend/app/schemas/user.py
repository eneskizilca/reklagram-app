# backend/app/schemas/user.py

from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from ..models.base import RoleType  # RoleType Enum'ını base.py'den import et


# Yeni bir kullanıcı oluşturmak için temel şema.
# Kayıt sırasında frontend'den beklenen veriyi tanımlar.
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: RoleType  # Enum tabanlı rol
    
    @validator('password')
    def validate_password(cls, v):
        if not v or len(v.strip()) == 0:
            raise ValueError('Şifre boş olamaz')
        if len(v) < 6:
            raise ValueError('Şifre en az 6 karakter olmalıdır')
        if len(v) > 200:
            raise ValueError('Şifre en fazla 200 karakter olabilir')
        # Not: 72 byte limiti backend'de otomatik olarak yönetiliyor
        return v
    
    # Influencer'a özel opsiyonel alanlar
    display_name: Optional[str] = None
    instagram_username: Optional[str] = None
    youtube_channel_url: Optional[str] = None
    tiktok_username: Optional[str] = None
    category: Optional[str] = None  # Ana kategori (örn: Seyahat, Teknoloji)
    bio: Optional[str] = None
    target_age_range: Optional[str] = None  # Hedef yaş aralığı (örn: 18-24, 25-34)
    target_gender: Optional[str] = None  # Hedef cinsiyet (örn: Kadın, Erkek, Hepsi)
    location: Optional[str] = None  # Konum (örn: İstanbul, Turkey)
    
    # Marka'ya özel opsiyonel alanlar
    company_name: Optional[str] = None
    industry: Optional[str] = None  # Sektör (örn: E-ticaret, Moda)
    website_url: Optional[str] = None
    contact_person: Optional[str] = None
    phone_number: Optional[str] = None


# Kullanıcı girişi için şema.
class UserLogin(BaseModel):
    email: EmailStr
    password: str


# API'den kullanıcı verisi dönerken kullanılacak ana şema.
# Güvenlik için şifre gibi hassas bilgileri İÇERMEZ.
class User(BaseModel):
    id: int
    email: EmailStr
    is_active: bool
    role: RoleType  # Enum tabanlı rol

    class Config:
        # Bu, Pydantic'in SQLAlchemy modelleri ile uyumlu çalışmasını sağlar.
        from_attributes = True