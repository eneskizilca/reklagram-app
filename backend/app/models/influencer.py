from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base  # Base'i base.py'den import et


class Influencer(Base):
    __tablename__ = "influencers"
    
    id = Column(Integer, ForeignKey("users.id"), primary_key=True, index=True)
    display_name = Column(String, nullable=False)
    
    # Sosyal medya hesapları
    instagram_username = Column(String, nullable=True)
    youtube_channel_url = Column(String, nullable=True)
    tiktok_username = Column(String, nullable=True)
    
    # Profil bilgileri
    category = Column(String, nullable=True)  # Ana kategori (örn: Seyahat, Teknoloji)
    bio = Column(Text, nullable=True)
    location = Column(String, nullable=True)  # Konum (örn: İstanbul, Turkey)
    
    # Hedef kitle bilgileri
    target_age_range = Column(String, nullable=True)  # Hedef yaş aralığı (örn: 18-24, 25-34)
    target_gender = Column(String, nullable=True)  # Hedef cinsiyet (örn: Kadın, Erkek, Hepsi)
    
    # İlişkiler
    user = relationship("User", back_populates="influencer")
    collaborations = relationship("Collaboration", back_populates="influencer")
    
    def __repr__(self):
        return f"<Influencer(id={self.id}, display_name='{self.display_name}')>"