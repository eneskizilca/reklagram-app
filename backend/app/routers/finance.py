# backend/app/routers/finance.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from decimal import Decimal
from typing import List

from ..models.finance import Wallet, Transaction, TransactionType, TransactionStatus
from ..models.collaboration import Collaboration
from ..models.user import User
from ..models.base import RoleType
from ..schemas.finance import WalletResponse, TransactionResponse, PayRequest, ReleaseRequest
from ..dependencies.auth import get_db, get_current_user
from ..schemas.user import User as UserSchema

router = APIRouter(
    prefix="/finance",
    tags=["Finance"]
)


@router.post("/pay/{collaboration_id}", response_model=TransactionResponse)
def pay_collaboration(
    collaboration_id: int,
    pay_data: PayRequest,
    current_user: UserSchema = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Brand pays for a collaboration. Deducts amount from brand's wallet and creates PAYMENT_ESCROW transaction.
    """
    # Only brands can pay
    if current_user.role != RoleType.Brand:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only brands can make payments"
        )
    
    # Get collaboration
    collaboration = db.query(Collaboration).filter(Collaboration.id == collaboration_id).first()
    if not collaboration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collaboration not found"
        )
    
    # Verify brand owns this collaboration
    if collaboration.brand_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only pay for your own collaborations"
        )
    
    # Check if payment already exists for this collaboration
    existing_payment = db.query(Transaction).filter(
        Transaction.collaboration_id == collaboration_id,
        Transaction.type == TransactionType.PAYMENT_ESCROW,
        Transaction.status == TransactionStatus.COMPLETED
    ).first()
    
    if existing_payment:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payment already made for this collaboration"
        )
    
    # Get brand's wallet
    wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).first()
    if not wallet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Wallet not found"
        )
    
    # Check sufficient balance
    if wallet.balance < pay_data.amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient balance"
        )
    
    # Deduct from wallet
    wallet.balance -= pay_data.amount
    
    # Create escrow transaction
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
    """
    Release payment for completed collaboration. Splits money: 85% to Influencer, 15% to Platform.
    Only brand or admin can release payment.
    """
    # Only brands or admins can release
    if current_user.role not in [RoleType.Brand, RoleType.SuperAdmin]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only brands or admins can release payments"
        )
    
    # Get collaboration
    collaboration = db.query(Collaboration).filter(Collaboration.id == collaboration_id).first()
    if not collaboration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collaboration not found"
        )
    
    # Verify brand owns this collaboration (if not admin)
    if current_user.role == RoleType.Brand and collaboration.brand_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only release payments for your own collaborations"
        )
    
    # Find the escrow transaction
    escrow_transaction = db.query(Transaction).filter(
        Transaction.collaboration_id == collaboration_id,
        Transaction.type == TransactionType.PAYMENT_ESCROW,
        Transaction.status == TransactionStatus.COMPLETED
    ).first()
    
    if not escrow_transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No escrow payment found for this collaboration"
        )
    
    # Check if already released
    existing_release = db.query(Transaction).filter(
        Transaction.collaboration_id == collaboration_id,
        Transaction.type.in_([TransactionType.PAYOUT_INFLUENCER, TransactionType.PAYOUT_PLATFORM])
    ).first()
    
    if existing_release:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payment already released for this collaboration"
        )
    
    # Calculate splits
    total_amount = escrow_transaction.amount
    influencer_amount = total_amount * Decimal("0.85")
    platform_amount = total_amount * Decimal("0.15")
    
    # Get influencer's wallet
    influencer_wallet = db.query(Wallet).filter(Wallet.user_id == collaboration.influencer_id).first()
    if not influencer_wallet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Influencer wallet not found"
        )
    
    # Get platform wallet (we'll use a system user or create a platform wallet)
    # For now, we'll create a platform wallet if it doesn't exist
    # Platform wallet user_id could be 0 or a special system user
    platform_user = db.query(User).filter(User.role == RoleType.SuperAdmin).first()
    if not platform_user:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Platform wallet not configured"
        )
    
    platform_wallet = db.query(Wallet).filter(Wallet.user_id == platform_user.id).first()
    if not platform_wallet:
        # Create platform wallet if it doesn't exist
        platform_wallet = Wallet(
            user_id=platform_user.id,
            balance=Decimal("0.00")
        )
        db.add(platform_wallet)
        db.commit()
        db.refresh(platform_wallet)
    
    # Update wallets
    influencer_wallet.balance += influencer_amount
    platform_wallet.balance += platform_amount
    
    # Create payout transactions
    influencer_transaction = Transaction(
        wallet_id=influencer_wallet.id,
        collaboration_id=collaboration_id,
        amount=influencer_amount,
        description=release_data.description or f"Payout for collaboration {collaboration_id} (85%)",
        type=TransactionType.PAYOUT_INFLUENCER,
        status=TransactionStatus.COMPLETED
    )
    
    platform_transaction = Transaction(
        wallet_id=platform_wallet.id,
        collaboration_id=collaboration_id,
        amount=platform_amount,
        description=release_data.description or f"Platform fee for collaboration {collaboration_id} (15%)",
        type=TransactionType.PAYOUT_PLATFORM,
        status=TransactionStatus.COMPLETED
    )
    
    db.add(influencer_transaction)
    db.add(platform_transaction)
    db.commit()
    
    db.refresh(influencer_transaction)
    db.refresh(platform_transaction)
    
    return [influencer_transaction, platform_transaction]


@router.get("/my-wallet", response_model=WalletResponse)
def get_my_wallet(
    current_user: UserSchema = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get current user's wallet balance and transaction history.
    """
    wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).first()
    
    if not wallet:
        # Create wallet if it doesn't exist (for backward compatibility)
        initial_balance = Decimal("50000.00") if current_user.role == RoleType.Brand else Decimal("0.00")
        wallet = Wallet(
            user_id=current_user.id,
            balance=initial_balance
        )
        db.add(wallet)
        db.commit()
        db.refresh(wallet)
    
    # Get all transactions for this wallet
    transactions = db.query(Transaction).filter(
        Transaction.wallet_id == wallet.id
    ).order_by(Transaction.timestamp.desc()).all()
    
    # Convert to response format
    wallet_response = WalletResponse(
        id=wallet.id,
        user_id=wallet.user_id,
        balance=wallet.balance,
        transactions=[TransactionResponse(
            id=t.id,
            wallet_id=t.wallet_id,
            collaboration_id=t.collaboration_id,
            amount=t.amount,
            description=t.description,
            type=t.type.value,
            status=t.status.value,
            timestamp=t.timestamp
        ) for t in transactions]
    )
    
    return wallet_response

