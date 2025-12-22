from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from decimal import Decimal
from typing import List
from pydantic import BaseModel
from datetime import datetime

# Modeller, Şemalar ve Auth Bağımlılıkları
from ..models.finance import Wallet, Transaction, TransactionType, TransactionStatus
from ..models.collaboration import Collaboration
from ..models.user import User
from ..models.base import RoleType
from ..schemas.finance import WalletResponse, TransactionResponse, PayRequest, ReleaseRequest
# Enes'in profesyonel auth bağımlılığını kullanıyoruz
from ..dependencies.auth import get_db, get_current_user
from ..schemas.user import User as UserSchema

router = APIRouter(
    prefix="/finance",
    tags=["Finance"]
)

# --- SENİN ŞEMALARIN (Para Yükleme/Çekme İçin) ---
class DepositRequest(BaseModel):
    amount: float
    card_number: str

class WithdrawRequest(BaseModel):
    amount: float
    iban: str

# --- ENES'İN TİCARİ MANTIĞI (Ödeme Yap ve Serbest Bırak) ---

@router.post("/pay/{collaboration_id}", response_model=TransactionResponse)
def pay_collaboration(
    collaboration_id: int,
    pay_data: PayRequest,
    current_user: UserSchema = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != RoleType.Brand:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only brands can make payments")
    
    collaboration = db.query(Collaboration).filter(Collaboration.id == collaboration_id).first()
    if not collaboration:
        raise HTTPException(status_code=404, detail="Collaboration not found")
    
    wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).first()
    if not wallet or wallet.balance < pay_data.amount:
        raise HTTPException(status_code=400, detail="Insufficient balance")
    
    wallet.balance -= Decimal(str(pay_data.amount))
    transaction = Transaction(
        wallet_id=wallet.id,
        collaboration_id=collaboration_id,
        amount=pay_data.amount,
        description=pay_data.description or f"Payment for collaboration {collaboration_id}",
        type=TransactionType.PAYMENT_ESCROW,
        status=TransactionStatus.COMPLETED
    )
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction

@router.post("/release/{collaboration_id}", response_model=List[TransactionResponse])
def release_payment(
    collaboration_id: int,
    release_data: ReleaseRequest,
    current_user: UserSchema = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Enes'in kritik %85 Influencer %15 Platform dağıtım mantığı
    if current_user.role not in [RoleType.Brand, RoleType.SuperAdmin]:
        raise HTTPException(status_code=403, detail="Unauthorized")
    
    # ... (Orijinal koddaki escrow bulma ve dağıtım işlemleri burada aynen devam eder)
    return [] # Rebase sırasında burayı orijinal Enes kodundaki gibi tut

@router.get("/my-wallet", response_model=WalletResponse)
def get_my_wallet(
    current_user: UserSchema = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).first()
    if not wallet:
        initial_balance = Decimal("50000.00") if current_user.role == RoleType.Brand else Decimal("0.00")
        wallet = Wallet(user_id=current_user.id, balance=initial_balance)
        db.add(wallet)
        db.commit()
        db.refresh(wallet)
    
    transactions = db.query(Transaction).filter(Transaction.wallet_id == wallet.id).order_by(Transaction.timestamp.desc()).all()
    return wallet

# --- SENİN FONKSİYONLARIN (Giriş/Çıkış Kapıları) ---

@router.post("/deposit")
async def deposit_money(
    request: DepositRequest, 
    db: Session = Depends(get_db),
    current_user: UserSchema = Depends(get_current_user)
):
    if request.amount <= 0:
        raise HTTPException(status_code=400, detail="Miktar geçersiz")
    
    wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).first()
    amount_decimal = Decimal(str(request.amount))
    wallet.balance += amount_decimal
    
    new_tx = Transaction(
        wallet_id=wallet.id,
        type=TransactionType.DEPOSIT,
        amount=amount_decimal,
        description=f"Kredi Kartı ile Yükleme (**{request.card_number[-4:]})",
        status=TransactionStatus.COMPLETED
    )
    db.add(new_tx)
    db.commit()
    return {"message": "Yükleme başarılı", "new_balance": wallet.balance}

@router.post("/withdraw")
async def withdraw_money(
    request: WithdrawRequest, 
    db: Session = Depends(get_db),
    current_user: UserSchema = Depends(get_current_user)
):
    wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).first()
    amount_decimal = Decimal(str(request.amount))
    
    if amount_decimal > wallet.balance:
        raise HTTPException(status_code=400, detail="Yetersiz bakiye")
        
    wallet.balance -= amount_decimal
    new_tx = Transaction(
        wallet_id=wallet.id,
        type=TransactionType.PAYOUT_INFLUENCER, # Çekim işlemini influencer ödemesi tipinde kaydediyoruz
        amount=amount_decimal,
        description=f"Para Çekme Talebi ({request.iban})",
        status=TransactionStatus.PENDING
    )
    db.add(new_tx)
    db.commit()
    return {"message": "Çekim talebi alındı", "new_balance": wallet.balance}