from sqlalchemy import Column, Integer, String, ForeignKey, Float, DateTime, Enum, Text
from sqlalchemy.orm import relationship
import enum
from datetime import datetime

# 🛠️ HATALI OLAN SATIR buydu: from app.database import Base
# ✅ DOĞRUSU BU OLMALI:
from app.models.base import Base 

# İşbirliği Durumları (Statü)
class CollaborationStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    COMPLETED = "completed"
    REJECTED = "rejected"
    CANCELLED = "cancelled"

class Collaboration(Base):
    __tablename__ = "collaborations"

    id = Column(Integer, primary_key=True, index=True)
    
    # Kim Kiminle?
    brand_id = Column(Integer, ForeignKey("brands.id"), nullable=False)
    influencer_id = Column(Integer, ForeignKey("influencers.id"), nullable=False)
    
    # İş Detayları
    campaign_name = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    platform = Column(String, default="Instagram")
    
    # Finansal
    budget = Column(Float, nullable=True) 
    
    # Durum ve Zamanlama
    status = Column(String, default="pending")
    start_date = Column(DateTime, default=datetime.utcnow)
    end_date = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    # İlişkiler
    brand = relationship("Brand", back_populates="collaborations")
    influencer = relationship("Influencer", back_populates="collaborations")

    # Transaction İlişkisi
    transactions = relationship("Transaction", back_populates="collaboration")