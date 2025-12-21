from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr
from typing import List
import os

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),
    MAIL_SERVER=os.getenv("MAIL_SERVER", "smtp.gmail.com"),
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

fm = FastMail(conf)

async def send_password_reset_email(email: EmailStr, reset_token: str, frontend_url: str = "http://localhost:3000"):
    """
    Şifre sıfırlama e-postası gönder
    """
    reset_link = f"{frontend_url}/reset-password?token={reset_token}"
    
    html = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fd; border-radius: 10px;">
                <div style="background: linear-gradient(135deg, #1A2A6C 0%, #7C3AED 50%, #F97316 100%); padding: 30px; border-radius: 10px; text-align: center;">
                    <h1 style="color: white; margin: 0;">ReklaGram</h1>
                    <p style="color: white; margin-top: 10px;">Şifre Sıfırlama</p>
                </div>
                
                <div style="background-color: white; padding: 30px; margin-top: 20px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <h2 style="color: #1A2A6C; margin-top: 0;">Merhaba,</h2>
                    <p>Şifrenizi sıfırlamak için bir talep aldık. Eğer bu talebi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
                    
                    <p>Şifrenizi sıfırlamak için aşağıdaki butona tıklayın:</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{reset_link}" style="background: linear-gradient(135deg, #1A2A6C 0%, #7C3AED 50%, #F97316 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                            Şifremi Sıfırla
                        </a>
                    </div>
                    
                    <p style="color: #666; font-size: 14px;">Veya aşağıdaki linki tarayıcınıza kopyalayın:</p>
                    <p style="background-color: #f5f5f5; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 12px; color: #666;">
                        {reset_link}
                    </p>
                    
                    <p style="color: #666; font-size: 14px; margin-top: 30px;">
                        <strong>Not:</strong> Bu link 24 saat geçerlidir.
                    </p>
                </div>
                
                <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
                    <p>© 2025 ReklaGram. Tüm hakları saklıdır.</p>
                    <p>Bu e-posta otomatik olarak gönderilmiştir, lütfen yanıtlamayın.</p>
                </div>
            </div>
        </body>
    </html>
    """
    
    message = MessageSchema(
        subject="ReklaGram - Şifre Sıfırlama Talebi",
        recipients=[email],
        body=html,
        subtype="html"
    )
    
    try:
        await fm.send_message(message)
        return True
    except Exception as e:
        print(f"Email gönderme hatası: {str(e)}")
        return False
