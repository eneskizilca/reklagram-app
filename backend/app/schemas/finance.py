# backend/app/schemas/finance.py

from pydantic import BaseModel
from decimal import Decimal
from datetime import datetime
from typing import Optional, List
from ..models.finance import TransactionType, TransactionStatus


class TransactionResponse(BaseModel):
    id: int
    wallet_id: int
    collaboration_id: Optional[int]
    amount: Decimal
    description: Optional[str]
    type: str
    status: str
    timestamp: datetime

    class Config:
        from_attributes = True


class WalletResponse(BaseModel):
    id: int
    user_id: int
    balance: Decimal
    transactions: List[TransactionResponse] = []

    class Config:
        from_attributes = True


class PayRequest(BaseModel):
    amount: Decimal
    description: Optional[str] = None


class ReleaseRequest(BaseModel):
    description: Optional[str] = None

