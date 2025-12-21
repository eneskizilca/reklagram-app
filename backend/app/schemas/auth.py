# backend/app/schemas/auth.py

from pydantic import BaseModel
from typing import Optional

# Bu, /login endpoint'inden dönecek olan access token'ın şemasıdır.
class Token(BaseModel):
    access_token: str
    token_type: str

# Bu, JWT token'ının içindeki veriyi temsil eder.
class TokenData(BaseModel):
    id: Optional[str] = None
    role_id: Optional[int] = None

# Şifremi unuttum için e-posta isteği
class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str