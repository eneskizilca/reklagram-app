# backend/app/models/collaboration.py

from sqlalchemy import Column, Integer, String, ForeignKey, Text, Numeric, Date, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .base import Base  # Base'i base.py'den import et


class Collaboration(Base):
    __tablename__ = "collaborations"
    
    id = Column(Integer, primary_key=True, index=True)
    brand_id = Column(Integer, ForeignKey("brands.id"), nullable=False)
    influencer_id = Column(Integer, ForeignKey("influencers.id"), nullable=False)
    title = Column(String, nullable=True)
    brief = Column(Text, nullable=True)
    agreed_price = Column(Numeric(10, 2), nullable=True)
    status = Column(String, default="pending")  # pending, active, completed, cancelled
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # İlişkiler
    influencer = relationship("Influencer", back_populates="collaborations")
    brand = relationship("Brand", back_populates="collaborations")