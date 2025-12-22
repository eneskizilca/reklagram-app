from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

# Veritabanı ve Modeller
from app.database import get_db
from app.models.finance import Wallet, Transaction

# 👇 DÜZELTME BURADA: Senin auth.py dosyasındaki fonksiyonun adı 'get_current_user_info'
# Onu çağırıyoruz ama kodun geri kalanı bozulmasın diye 'as get_current_user' diyerek takma ad takıyoruz.
from app.routers.auth import get_current_user_info as get_current_user
from app.models.user import User 

router = APIRouter(prefix="/finance", tags=["Finance"])

# --- ŞEMALAR ---
class TransactionSchema(BaseModel):
    id: int
    type: str
    amount: float
    description: str
    date: str
    time: str
    status: str
    class Config:
        from_attributes = True

class WalletResponse(BaseModel):
    balance: float
    transactions: List[TransactionSchema]

class DepositRequest(BaseModel):
    amount: float
    card_number: str

class WithdrawRequest(BaseModel):
    amount: float
    iban: str

# --- YARDIMCI: Cüzdan Bul veya Yarat ---
def get_or_create_wallet(db: Session, user_email: str):
    # Kullanıcının mailine göre cüzdanı bul
    wallet = db.query(Wallet).filter(Wallet.user_email == user_email).first()
    
    if not wallet:
        # Yoksa 0 bakiye ile oluştur
        wallet = Wallet(user_email=user_email, balance=0.0)
        db.add(wallet)
        db.commit()
        db.refresh(wallet)
        
    return wallet

# --- ENDPOINTLER (Hepsi Auth Korumalı) ---

# 1. CÜZDAN DURUMUNU GETİR
@router.get("/wallet", response_model=WalletResponse)
async def get_wallet(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user) # 👈 Artık doğru fonksiyonu kullanıyor
):
    wallet = get_or_create_wallet(db, current_user.email)
    
    transactions = db.query(Transaction).filter(Transaction.wallet_id == wallet.id).order_by(Transaction.created_at.desc()).all()
    
    formatted_txs = []
    for tx in transactions:
        formatted_txs.append({
            "id": tx.id,
            "type": tx.type,
            "amount": tx.amount,
            "description": tx.description,
            "date": tx.created_at.strftime("%d.%m.%Y"),
            "time": tx.created_at.strftime("%H:%M"),
            "status": tx.status
        })

    return {"balance": wallet.balance, "transactions": formatted_txs}

# 2. PARA YÜKLE
@router.post("/deposit")
async def deposit_money(
    request: DepositRequest, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if request.amount <= 0:
        raise HTTPException(status_code=400, detail="Miktar geçersiz")
    
    wallet = get_or_create_wallet(db, current_user.email)
    wallet.balance += request.amount
    
    new_tx = Transaction(
        wallet_id=wallet.id,
        type="deposit",
        amount=request.amount,
        description=f"Kredi Kartı ile Yükleme (**{request.card_number[-4:]})",
        status="completed"
    )
    
    db.add(new_tx)
    db.commit()
    db.refresh(wallet)
    
    return {"message": "Yükleme başarılı", "new_balance": wallet.balance}

# 3. PARA ÇEK
@router.post("/withdraw")
async def withdraw_money(
    request: WithdrawRequest, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    wallet = get_or_create_wallet(db, current_user.email)
    
    if request.amount > wallet.balance:
        raise HTTPException(status_code=400, detail="Yetersiz bakiye")
        
    wallet.balance -= request.amount
    
    new_tx = Transaction(
        wallet_id=wallet.id,
        type="withdraw",
        amount=request.amount,
        description=f"Para Çekme Talebi ({request.iban})",
        status="pending"
    )
    
    db.add(new_tx)
    db.commit()
    db.refresh(wallet)
    
    return {"message": "Çekim talebi alındı", "new_balance": wallet.balance}