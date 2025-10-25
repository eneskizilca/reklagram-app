# app/main.py

from fastapi import FastAPI
from fastapi.responses import JSONResponse

from . import models
from .database import engine, SessionLocal, get_db
from .routers import auth # auth yönlendiricisini import et


# Veritabanı tablolarını oluştur
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ReklaGram API",
    description="Influencer ve Marka işbirliği platformu için API",
    version="0.1.0",
)

# Auth yönlendiricisini uygulamaya dahil et
app.include_router(auth.router)

@app.get("/", tags=["Root"]) # tags ekleyebiliriz
def read_root():
    content = {"message": "ReklaGram Backend Çalışıyor ve Veritabanı Bağlantısı Hazır!"}
    return JSONResponse(content=content , media_type="application/json; charset=utf-8")