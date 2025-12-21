# backend/app/models/finance.py

import enum
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Numeric, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from decimal import Decimal
from .base import Base


class TransactionType(enum.Enum):
    DEPOSIT = "deposit"
    PAYMENT_ESCROW = "payment_escrow"
    PAYOUT_INFLUENCER = "payout_influencer"
    PAYOUT_PLATFORM = "payout_platform"


class TransactionStatus(enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class Wallet(Base):
    __tablename__ = "wallets"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    balance = Column(Numeric(10, 2), default=Decimal("0.00"), nullable=False)
    
    # İlişkiler
    user = relationship("User", back_populates="wallet")
    transactions = relationship("Transaction", back_populates="wallet", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Wallet(id={self.id}, user_id={self.user_id}, balance={self.balance})>"


class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    wallet_id = Column(Integer, ForeignKey("wallets.id"), nullable=False)
    collaboration_id = Column(Integer, ForeignKey("collaborations.id"), nullable=True)
    amount = Column(Numeric(10, 2), nullable=False)
    description = Column(Text, nullable=True)
    type = Column(
        SQLEnum(TransactionType, values_callable=lambda x: [e.value for e in x], name="transaction_type"),
        nullable=False
    )
    status = Column(
        SQLEnum(TransactionStatus, values_callable=lambda x: [e.value for e in x], name="transaction_status"),
        default=TransactionStatus.PENDING,
        nullable=False
    )
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    # İlişkiler
    wallet = relationship("Wallet", back_populates="transactions")
    collaboration = relationship("Collaboration", back_populates="transactions")
    
    def __repr__(self):
        return f"<Transaction(id={self.id}, wallet_id={self.wallet_id}, amount={self.amount}, type={self.type.value}, status={self.status.value})>"

