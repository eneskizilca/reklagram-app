from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional
from decimal import Decimal


class CollaborationBase(BaseModel):
    title: Optional[str] = None
    brief: Optional[str] = None
    agreed_price: Optional[Decimal] = None
    status: str = "pending"
    start_date: Optional[date] = None
    end_date: Optional[date] = None


class CollaborationCreate(CollaborationBase):
    brand_id: int
    influencer_id: int


class CollaborationUpdate(BaseModel):
    title: Optional[str] = None
    brief: Optional[str] = None
    agreed_price: Optional[Decimal] = None
    status: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None


class CollaborationResponse(CollaborationBase):
    id: int
    brand_id: int
    influencer_id: int
    created_at: datetime
    updated_at: datetime
    
    # İlişkili veriler
    brand_name: Optional[str] = None
    brand_logo: Optional[str] = None
    influencer_name: Optional[str] = None
    influencer_avatar: Optional[str] = None
    
    class Config:
        from_attributes = True
