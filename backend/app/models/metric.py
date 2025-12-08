# backend/app/models/metric.py

from sqlalchemy import Column, Integer, ForeignKey, TIMESTAMP, BigInteger
from sqlalchemy.sql import func
from .base import Base

class InfluencerMetric(Base):
    __tablename__ = "influencer_metrics"

    # TimescaleDB için zaman damgası birincil anahtardır
    time = Column(TIMESTAMP(timezone=True), primary_key=True, server_default=func.now(), nullable=False)
    
    # Hangi influencer'a ait olduğu
    influencer_id = Column(Integer, ForeignKey("influencers.id"), primary_key=True, nullable=False)
    
    # Kaydedilecek veriler
    follower_count = Column(BigInteger, nullable=True)
    media_count = Column(Integer, nullable=True)
    
    # İleride engagement_rate gibi başka metrikler de eklenebilir