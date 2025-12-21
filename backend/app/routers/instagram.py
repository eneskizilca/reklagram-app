# backend/app/routers/instagram.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import requests
import os
from dotenv import load_dotenv
from pydantic import BaseModel

from .. import models
from ..dependencies.auth import get_db, get_current_influencer

load_dotenv()

router = APIRouter(prefix="/instagram", tags=["Instagram Integration"])

class InstagramCode(BaseModel):
    code: str

@router.post("/connect")
def connect_instagram(
    data: InstagramCode,
    current_user: models.User = Depends(get_current_influencer),
    db: Session = Depends(get_db)
):
    print(f"--- Instagram Bağlantı Süreci Başladı: User {current_user.email} ---")

    # 1. Token Takası
    token_url = "https://graph.facebook.com/v18.0/oauth/access_token"
    params = {
        "client_id": os.getenv("INSTAGRAM_CLIENT_ID"),
        "client_secret": os.getenv("INSTAGRAM_CLIENT_SECRET"),
        "redirect_uri": os.getenv("INSTAGRAM_REDIRECT_URI"),
        "code": data.code
    }

    response = requests.get(token_url, params=params)
    token_data = response.json()

    if "error" in token_data:
        print("Facebook Token Hatası:", token_data)
        raise HTTPException(status_code=400, detail=f"Facebook Hatası: {token_data['error']['message']}")

    short_lived_token = token_data["access_token"]
    print("Kısa Ömürlü Token Alındı ✅")

    # 2. Uzun Token Alma
    long_token_url = "https://graph.facebook.com/v18.0/oauth/access_token"
    long_params = {
        "grant_type": "fb_exchange_token",
        "client_id": os.getenv("INSTAGRAM_CLIENT_ID"),
        "client_secret": os.getenv("INSTAGRAM_CLIENT_SECRET"),
        "fb_exchange_token": short_lived_token
    }
    long_resp = requests.get(long_token_url, params=long_params)
    long_token_data = long_resp.json()
    final_token = long_token_data.get("access_token", short_lived_token)
    print("Uzun Ömürlü Token Alındı ✅")

    # 3. Sayfaları ve Instagram ID'sini Ara
    instagram_id = None
    instagram_username = None
    
    # Kullanıcının yetki verdiği sayfaları listele
    pages_url = f"https://graph.facebook.com/v18.0/me/accounts?fields=name,instagram_business_account&access_token={final_token}"
    pages_resp = requests.get(pages_url)
    pages_data = pages_resp.json()

    print("--- Facebook'tan Gelen Sayfa Listesi ---")
    print(pages_data) # <--- BU ÇIKTI ÇOK ÖNEMLİ, KONSOLDA BURAYA BAK
    print("----------------------------------------")

    if "data" in pages_data:
        # Sayfaları tek tek gez
        for page in pages_data["data"]:
            page_name = page.get("name", "Bilinmeyen Sayfa")
            
            # Bu sayfaya bağlı bir Instagram var mı?
            if "instagram_business_account" in page:
                ig_account = page["instagram_business_account"]
                temp_id = ig_account.get("id")
                print(f"BULUNDU! Sayfa: {page_name} -> IG ID: {temp_id}")
                
                # Detayları çek (Username lazım)
                if temp_id:
                    ig_detail_url = f"https://graph.facebook.com/v18.0/{temp_id}?fields=username&access_token={final_token}"
                    ig_detail_resp = requests.get(ig_detail_url)
                    ig_detail_data = ig_detail_resp.json()
                    
                    if "username" in ig_detail_data:
                        instagram_id = temp_id
                        instagram_username = ig_detail_data["username"]
                        print(f"Kullanıcı Adı Çekildi: {instagram_username}")
                        break # İlk bulduğumuzu alıp çıkıyoruz
            else:
                print(f"Sayfa: {page_name} -> Instagram hesabı BAĞLI DEĞİL ❌")
    else:
        print("Facebook hiç sayfa döndürmedi. Kullanıcı sayfa izni vermemiş olabilir.")

    if not instagram_id:
        # Hata fırlatmadan önce son durumu logla
        print("KRİTİK HATA: Döngü bitti ama geçerli bir Instagram ID bulunamadı.")
        raise HTTPException(
            status_code=400, 
            detail="Instagram hesabı bulunamadı. Lütfen Facebook giriş ekranında SAYFALARI DA seçtiğinizden ve Instagram hesabınızın o sayfaya bağlı olduğundan emin olun."
        )

    # 4. Kayıt
    influencer = db.query(models.Influencer).filter(models.Influencer.id == current_user.id).first()
    influencer.instagram_access_token_encrypted = final_token
    influencer.instagram_account_id = instagram_id
    influencer.instagram_username = instagram_username
    influencer.is_verified = True
    
    db.commit()

    return {"message": "Instagram başarıyla bağlandı!", "username": instagram_username}