from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base  # Base'i base.py'den import et


class Brand(Base):
    __tablename__ = "brands"
    
    id = Column(Integer, ForeignKey("users.id"), primary_key=True, index=True)
    company_name = Column(String, nullable=False)
    contact_person = Column(String, nullable=True)
    phone_number = Column(String, nullable=True)
    website_url = Column(String, nullable=True)
    industry = Column(String, nullable=True)  # Sektör (örn: E-ticaret, Moda)
    
    # İlişkiler
    user = relationship("User", back_populates="brand")
    collaborations = relationship("Collaboration", back_populates="brand")
    
    def __repr__(self):
        return f"<Brand(id={self.id}, company_name='{self.company_name}')>"
    