# app/main.py

from fastapi import FastAPI
from fastapi.responses import JSONResponse

# --- BURASI ÖNEMLİ ---
from .database import engine, Base 

# Şimdi modelleri models/__init__.py üzerinden import ediyoruz
# Bu importlar sayesinde Base.metadata.create_all() tüm modelleri tanır.
from .models import Role, User, Influencer, Brand, Collaboration # <-- BU ŞEKİLDE OLMALI

# Tüm modeller import edildikten sonra tabloları oluştur
Base.metadata.create_all(bind=engine)
# --- BURASI ÖNEMLİ SONU ---

from .routers import auth

app = FastAPI(
    title="ReklaGram API",
    description="Influencer ve Marka işbirliği platformu için API",
    version="0.1.0",
)

app.include_router(auth.router)

@app.get("/", tags=["Root"])
def read_root():
    content = {"message": "ReklaGram Backend Çalışıyor ve Veritabanı Bağlantısı Hazır!"}
    return JSONResponse(content=content)