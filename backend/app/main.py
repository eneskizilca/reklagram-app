# app/main.py

from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.routers import finance

# --- BURASI ÖNEMLİ ---
from .database import engine

# Base'i ve tüm modelleri models paketinden import et
# Bu importlar sayesinde Base.metadata.create_all() tüm modelleri tanır.
from .models.base import Base
from .models.user import User
from .models.influencer import Influencer
from .models.brand import Brand
from .models.collaboration import Collaboration
# Finans Modellerini ekle ki tablolar oluşsun
from .models.finance import Wallet, Transaction

# Tüm modeller import edildikten sonra tabloları oluştur
Base.metadata.create_all(bind=engine)
# --- BURASI ÖNEMLİ SONU ---

from .routers import auth, instagram, collaborations, admin, influencers

app = FastAPI(
    title="ReklaGram API",
    description="Influencer ve Marka işbirliği platformu için API",
    version="0.1.0",
)

# CORS Middleware - Frontend'den gelen isteklere izin ver
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Frontend URL'leri
    allow_credentials=True,
    allow_methods=["*"],  # Tüm HTTP metodlarına izin ver (GET, POST, OPTIONS, vb.)
    allow_headers=["*"],  # Tüm header'lara izin ver
)

app.include_router(auth.router)
app.include_router(instagram.router)
app.include_router(collaborations.router)
app.include_router(admin.router)
app.include_router(influencers.router)
app.include_router(finance.router)
@app.get("/", tags=["Root"])
def read_root():
    content = {"message": "ReklaGram Backend Çalışıyor ve Veritabanı Bağlantısı Hazır!"}
    return JSONResponse(content=content)