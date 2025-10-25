# app/models/brand.py

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from ..database import Base

class Brand(Base):
    __tablename__ = "brands"

    # id alanı aynı zamanda Foreign Key olarak users.id'ye referans veriyor.
    # Bu, One-to-One ilişkiyi kurar.
    id = Column(Integer, ForeignKey("users.id"), primary_key=True, index=True)
    company_name = Column(String(255), nullable=False)
    contact_person = Column(String(255), nullable=True)
    phone_number = Column(String(20), nullable=True)
    website_url = Column(String(255), nullable=True)
    logo_url = Column(String(255), nullable=True)
    industry = Column(String(100), nullable=True)

    # User modeli ile geri ilişkiyi tanımla
    user = relationship("User", back_populates="brand")