# backend/app/models/__init__.py

from ..database import Base  # Base'i dışarıdan import et
from .user import User
from .influencer import Influencer
from .brand import Brand
from .collaboration import Collaboration