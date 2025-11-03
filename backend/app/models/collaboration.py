# backend/app/models/collaboration.py

from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from .base import Base  # Base'i base.py'den import et


class Collaboration(Base):
    __tablename__ = "collaborations"
    
    id = Column(Integer, primary_key=True, index=True)
    influencer_id = Column(Integer, ForeignKey("influencers.id"), nullable=False)
    brand_id = Column(Integer, ForeignKey("brands.id"), nullable=False)
    campaign_name = Column(String, nullable=True)
    status = Column(String, default="pending")  # pending, active, completed, cancelled
    description = Column(Text, nullable=True)
    
    # İlişkiler
    influencer = relationship("Influencer", back_populates="collaborations")
    brand = relationship("Brand", back_populates="collaborations")