# backend/app/models/finance.py

from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .base import Base

class Wallet(Base):
    # 👇 İsimleri değiştirdik ki eski bozuk tabloyla çakışmasın
    __tablename__ = "finance_wallets"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String, unique=True, index=True) 
    balance = Column(Float, default=0.0)

    transactions = relationship("Transaction", back_populates="wallet", cascade="all, delete-orphan")

class Transaction(Base):
    # 👇 İsimleri değiştirdik
    __tablename__ = "finance_transactions"

    id = Column(Integer, primary_key=True, index=True)
    # 👇 Foreign Key referansını da yeni tabloya göre güncelledik
    wallet_id = Column(Integer, ForeignKey("finance_wallets.id"))
    
    type = Column(String)
    amount = Column(Float)
    description = Column(String)
    
    created_at = Column(DateTime, default=datetime.now)
    status = Column(String, default="completed")

    wallet = relationship("Wallet", back_populates="transactions")