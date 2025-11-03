# backend/app/models/base.py

import enum
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Text, Float
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import ENUM

# SQLAlchemy Base sınıfını tanımlıyoruz
Base = declarative_base()


# Roller için Enum tanımı
class RoleType(enum.Enum):
    Influencer = "influencer"
    Brand = "brand"
    SuperAdmin = "superadmin"

