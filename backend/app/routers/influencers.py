from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models.influencer import Influencer
from ..models.user import User
from pydantic import BaseModel

router = APIRouter(
    prefix="/influencers",
    tags=["influencers"]
)


class InfluencerListResponse(BaseModel):
    id: int
    display_name: str
    username: str
    email: str
    category: Optional[str]
    bio: Optional[str]
    location: Optional[str]
    instagram_username: Optional[str]
    is_verified: bool
    
    # Metrics (şimdilik sample, ileride Instagram API'den gelecek)
    followers: int
    engagement_rate: float
    avg_likes: int
    avg_comments: int
    total_reach: str
    profile_picture: Optional[str] = None
    
    class Config:
        from_attributes = True


@router.get("/list", response_model=List[InfluencerListResponse])
def get_influencers_list(
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search by name"),
    limit: int = Query(50, ge=1, le=100),
    skip: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """
    Database'deki influencer'ları listele (sample metrics ile)
    İleride her influencer Instagram bağladığında gerçek metrics eklenecek
    """
    # Base query
    query = db.query(
        Influencer.id,
        Influencer.display_name,
        Influencer.category,
        Influencer.bio,
        Influencer.location,
        Influencer.instagram_username,
        Influencer.is_verified,
        User.email
    ).join(User, Influencer.id == User.id)
    
    # Filters
    if category:
        query = query.filter(Influencer.category == category)
    
    if search:
        query = query.filter(
            Influencer.display_name.ilike(f"%{search}%")
        )
    
    # Get results
    results = query.offset(skip).limit(limit).all()
    
    # Sample metrics (her influencer için farklı değerler)
    sample_data = [
        {"followers": 125000, "engagement": 4.5, "likes": 5625, "comments": 843},
        {"followers": 89000, "engagement": 3.8, "likes": 3382, "comments": 507},
        {"followers": 256000, "engagement": 5.2, "likes": 13312, "comments": 1996},
        {"followers": 180000, "engagement": 4.1, "likes": 7380, "comments": 1107},
        {"followers": 95000, "engagement": 6.3, "likes": 5985, "comments": 897},
        {"followers": 342000, "engagement": 3.5, "likes": 11970, "comments": 1795},
        {"followers": 67000, "engagement": 5.8, "likes": 3886, "comments": 582},
        {"followers": 198000, "engagement": 4.7, "likes": 9306, "comments": 1395},
        {"followers": 445000, "engagement": 3.2, "likes": 14240, "comments": 2136},
        {"followers": 78000, "engagement": 5.1, "likes": 3978, "comments": 596},
    ]
    
    # Format response
    influencers = []
    for idx, result in enumerate(results):
        # Cycle through sample data
        sample = sample_data[idx % len(sample_data)]
        
        # Format followers (125K, 1.2M, etc.)
        followers_count = sample["followers"]
        if followers_count >= 1000000:
            total_reach = f"{followers_count / 1000000:.1f}M"
        elif followers_count >= 1000:
            total_reach = f"{followers_count // 1000}K"
        else:
            total_reach = str(followers_count)
        
        influencers.append({
            "id": result.id,
            "display_name": result.display_name,
            "username": f"@{result.instagram_username or result.display_name.lower().replace(' ', '_')}",
            "email": result.email,
            "category": result.category or "Genel",
            "bio": result.bio or "Henüz bio eklenmemiş.",
            "location": result.location or "Türkiye",
            "instagram_username": result.instagram_username,
            "is_verified": result.is_verified or False,
            "followers": followers_count,
            "engagement_rate": sample["engagement"],
            "avg_likes": sample["likes"],
            "avg_comments": sample["comments"],
            "total_reach": total_reach,
            "profile_picture": None  # İleride eklenecek
        })
    
    return influencers
