from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class Influencer(Base):
    __tablename__ = "influencers"
    id = Column(Integer, ForeignKey("users.id"), primary_key=True, index=True) 
    # ... diğer influencer alanları ...
    user = relationship("User", back_populates="influencer")
    collaborations = relationship("Collaboration", back_populates="influencer")
    # collaborations = relationship("Collaboration", back_populates="influencer") # Bu satırı şimdilik yoruma alabiliriz