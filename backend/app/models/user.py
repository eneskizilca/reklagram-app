from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ENUM
from .base import Base, RoleType  # Base ve RoleType'ı base.py'den import et


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hashed = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)

    # Enum tabanlı rol sistemi
    role = Column(ENUM(RoleType, values_callable=lambda x: [e.value for e in x], name="role_type"), default=RoleType.Influencer, nullable=False)

    # İlişkiler
    influencer = relationship("Influencer", back_populates="user", uselist=False)
    brand = relationship("Brand", back_populates="user", uselist=False)
    
    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', role='{self.role.value}')>"
