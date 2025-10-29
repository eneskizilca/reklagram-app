# backend/app/schemas/user.py

from pydantic import BaseModel, EmailStr

# Yeni bir kullanıcı oluşturmak için temel şema.
# Kayıt sırasında frontend'den beklenen veriyi tanımlar.
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role_id: int # 1: Influencer, 2: Brand, 3: SuperAdmin

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
    role_id: int

    class Config:
        # Bu, Pydantic'in SQLAlchemy modelleri ile uyumlu çalışmasını sağlar.
        from_attributes = True