from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List, Dict, Any
from datetime import datetime, timedelta
from ..database import get_db
from ..models.user import User
from ..models.brand import Brand
from ..models.influencer import Influencer
from ..models.collaboration import Collaboration
from ..dependencies.auth import get_current_user

router = APIRouter(
    prefix="/admin",
    tags=["admin"]
)


def verify_admin(current_user: User = Depends(get_current_user)):
    """SuperAdmin yetkisi kontrolü"""
    if current_user.role != "superadmin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bu işlem için superadmin yetkisi gereklidir"
        )
    return current_user


@router.get("/dashboard/stats")
def get_dashboard_stats(
    current_user: User = Depends(verify_admin),
    db: Session = Depends(get_db)
):
    """
    Admin dashboard için genel istatistikler
    """
    # Toplam kullanıcı sayıları
    total_users = db.query(User).count()
    total_brands = db.query(User).filter(User.role == "brand").count()
    total_influencers = db.query(User).filter(User.role == "influencer").count()
    
    # Toplam işbirliği sayıları
    total_collaborations = db.query(Collaboration).count()
    active_collaborations = db.query(Collaboration).filter(Collaboration.status == "active").count()
    pending_collaborations = db.query(Collaboration).filter(Collaboration.status == "pending").count()
    completed_collaborations = db.query(Collaboration).filter(Collaboration.status == "completed").count()
    
    # Son 30 gün içinde kaydolan kullanıcılar
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    new_users_30d = db.query(User).filter(User.created_at >= thirty_days_ago).count()
    
    # Son 7 gün içinde kaydolan kullanıcılar
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    new_users_7d = db.query(User).filter(User.created_at >= seven_days_ago).count()
    
    return {
        "users": {
            "total": total_users,
            "brands": total_brands,
            "influencers": total_influencers,
            "new_30d": new_users_30d,
            "new_7d": new_users_7d
        },
        "collaborations": {
            "total": total_collaborations,
            "active": active_collaborations,
            "pending": pending_collaborations,
            "completed": completed_collaborations
        }
    }


@router.get("/users")
def get_all_users(
    skip: int = 0,
    limit: int = 50,
    role: str = None,
    current_user: User = Depends(verify_admin),
    db: Session = Depends(get_db)
):
    """
    Tüm kullanıcıları listele (pagination ile)
    """
    query = db.query(User)
    
    # Role filtresi
    if role and role in ["brand", "influencer", "superadmin"]:
        query = query.filter(User.role == role)
    
    total = query.count()
    users = query.order_by(desc(User.created_at)).offset(skip).limit(limit).all()
    
    users_data = []
    for user in users:
        user_dict = {
            "id": user.id,
            "email": user.email,
            "role": user.role,
            "created_at": user.created_at,
            "is_active": user.is_active if hasattr(user, 'is_active') else True
        }
        
        # Role göre ek bilgiler
        if user.role == "brand":
            brand = db.query(Brand).filter(Brand.user_id == user.id).first()
            if brand:
                user_dict["company_name"] = brand.company_name
                user_dict["industry"] = brand.industry
        elif user.role == "influencer":
            influencer = db.query(Influencer).filter(Influencer.user_id == user.id).first()
            if influencer:
                user_dict["name"] = influencer.name
                user_dict["category"] = influencer.category
        
        users_data.append(user_dict)
    
    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "users": users_data
    }


@router.get("/collaborations")
def get_all_collaborations(
    skip: int = 0,
    limit: int = 50,
    status: str = None,
    current_user: User = Depends(verify_admin),
    db: Session = Depends(get_db)
):
    """
    Tüm işbirlikleri listele (pagination ile)
    """
    query = db.query(Collaboration)
    
    # Status filtresi
    if status:
        query = query.filter(Collaboration.status == status)
    
    total = query.count()
    collaborations = query.order_by(desc(Collaboration.created_at)).offset(skip).limit(limit).all()
    
    collabs_data = []
    for collab in collaborations:
        # Brand bilgisi
        brand = db.query(Brand).filter(Brand.id == collab.brand_id).first()
        brand_user = db.query(User).filter(User.id == brand.user_id).first() if brand else None
        
        # Influencer bilgisi
        influencer = db.query(Influencer).filter(Influencer.id == collab.influencer_id).first()
        influencer_user = db.query(User).filter(User.id == influencer.user_id).first() if influencer else None
        
        collabs_data.append({
            "id": collab.id,
            "title": collab.title,
            "status": collab.status,
            "agreed_price": float(collab.agreed_price) if collab.agreed_price else None,
            "start_date": collab.start_date,
            "end_date": collab.end_date,
            "created_at": collab.created_at,
            "brand": {
                "id": brand.id if brand else None,
                "company_name": brand.company_name if brand else "Unknown",
                "email": brand_user.email if brand_user else None
            },
            "influencer": {
                "id": influencer.id if influencer else None,
                "name": influencer.name if influencer else "Unknown",
                "email": influencer_user.email if influencer_user else None
            }
        })
    
    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "collaborations": collabs_data
    }


@router.get("/recent-activity")
def get_recent_activity(
    limit: int = 10,
    current_user: User = Depends(verify_admin),
    db: Session = Depends(get_db)
):
    """
    Son aktiviteleri getir
    """
    activities = []
    
    # Son kaydolan kullanıcılar
    recent_users = db.query(User).order_by(desc(User.created_at)).limit(5).all()
    for user in recent_users:
        activities.append({
            "type": "user_registered",
            "description": f"Yeni {user.role} kaydı: {user.email}",
            "timestamp": user.created_at,
            "role": user.role
        })
    
    # Son işbirlikleri
    recent_collabs = db.query(Collaboration).order_by(desc(Collaboration.created_at)).limit(5).all()
    for collab in recent_collabs:
        brand = db.query(Brand).filter(Brand.id == collab.brand_id).first()
        influencer = db.query(Influencer).filter(Influencer.id == collab.influencer_id).first()
        
        activities.append({
            "type": "collaboration_created",
            "description": f"Yeni işbirliği: {brand.company_name if brand else 'Brand'} - {influencer.name if influencer else 'Influencer'}",
            "timestamp": collab.created_at,
            "status": collab.status
        })
    
    # Timestamp'e göre sırala
    activities.sort(key=lambda x: x["timestamp"], reverse=True)
    
    return activities[:limit]


@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    current_user: User = Depends(verify_admin),
    db: Session = Depends(get_db)
):
    """
    Kullanıcı sil (sadece superadmin)
    """
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")
    
    if user.role == "superadmin":
        raise HTTPException(status_code=403, detail="SuperAdmin kullanıcıları silinemez")
    
    # İlişkili kayıtları da sil
    if user.role == "brand":
        brand = db.query(Brand).filter(Brand.user_id == user_id).first()
        if brand:
            db.query(Collaboration).filter(Collaboration.brand_id == brand.id).delete()
            db.delete(brand)
    elif user.role == "influencer":
        influencer = db.query(Influencer).filter(Influencer.user_id == user_id).first()
        if influencer:
            db.query(Collaboration).filter(Collaboration.influencer_id == influencer.id).delete()
            db.delete(influencer)
    
    db.delete(user)
    db.commit()
    
    return {"message": f"Kullanıcı {user.email} başarıyla silindi"}
