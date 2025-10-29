from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, TIMESTAMP
from sqlalchemy.sql.expression import text
from sqlalchemy.orm import relationship
from ..database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    # ... diğer user alanları ...

    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False)
    role = relationship("Role", back_populates="users")

    influencer = relationship("Influencer", back_populates="user", uselist=False)
    brand = relationship("Brand", back_populates="user", uselist=False)
