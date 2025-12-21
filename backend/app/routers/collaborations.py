from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models.collaboration import Collaboration
from ..models.user import User
from ..models.brand import Brand
from ..models.influencer import Influencer
from ..schemas.collaboration import CollaborationCreate, CollaborationUpdate, CollaborationResponse
from ..routers.auth import get_current_user

router = APIRouter(
    prefix="/collaborations",
    tags=["collaborations"]
)


@router.get("/my-collaborations", response_model=List[CollaborationResponse])
def get_my_collaborations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Kullanıcının işbirliklerini getir (role göre brand veya influencer)
    """
    collaborations = []
    
    if current_user.role == "brand":
        # Brand ise brand_id ile filtrele
        brand = db.query(Brand).filter(Brand.user_id == current_user.id).first()
        if not brand:
            return []
        
        collabs = db.query(Collaboration).filter(
            Collaboration.brand_id == brand.id
        ).order_by(Collaboration.created_at.desc()).all()
        
        # İlişkili influencer bilgilerini ekle
        for collab in collabs:
            influencer = db.query(Influencer).filter(Influencer.id == collab.influencer_id).first()
            influencer_user = db.query(User).filter(User.id == influencer.user_id).first() if influencer else None
            
            collab_dict = {
                "id": collab.id,
                "brand_id": collab.brand_id,
                "influencer_id": collab.influencer_id,
                "title": collab.title,
                "brief": collab.brief,
                "agreed_price": collab.agreed_price,
                "status": collab.status,
                "start_date": collab.start_date,
                "end_date": collab.end_date,
                "created_at": collab.created_at,
                "updated_at": collab.updated_at,
                "influencer_name": influencer_user.email.split('@')[0] if influencer_user else "Unknown",
                "influencer_avatar": None  # TODO: Add avatar support
            }
            collaborations.append(collab_dict)
    
    elif current_user.role == "influencer":
        # Influencer ise influencer_id ile filtrele
        influencer = db.query(Influencer).filter(Influencer.user_id == current_user.id).first()
        if not influencer:
            return []
        
        collabs = db.query(Collaboration).filter(
            Collaboration.influencer_id == influencer.id
        ).order_by(Collaboration.created_at.desc()).all()
        
        # İlişkili brand bilgilerini ekle
        for collab in collabs:
            brand = db.query(Brand).filter(Brand.id == collab.brand_id).first()
            brand_user = db.query(User).filter(User.id == brand.user_id).first() if brand else None
            
            collab_dict = {
                "id": collab.id,
                "brand_id": collab.brand_id,
                "influencer_id": collab.influencer_id,
                "title": collab.title,
                "brief": collab.brief,
                "agreed_price": collab.agreed_price,
                "status": collab.status,
                "start_date": collab.start_date,
                "end_date": collab.end_date,
                "created_at": collab.created_at,
                "updated_at": collab.updated_at,
                "brand_name": brand.company_name if brand else "Unknown",
                "brand_logo": None  # TODO: Add logo support
            }
            collaborations.append(collab_dict)
    
    return collaborations


@router.get("/{collaboration_id}", response_model=CollaborationResponse)
def get_collaboration(
    collaboration_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Belirli bir işbirliğinin detaylarını getir
    """
    collab = db.query(Collaboration).filter(Collaboration.id == collaboration_id).first()
    
    if not collab:
        raise HTTPException(status_code=404, detail="İşbirliği bulunamadı")
    
    # Yetki kontrolü - sadece ilgili brand veya influencer görebilir
    if current_user.role == "brand":
        brand = db.query(Brand).filter(Brand.user_id == current_user.id).first()
        if not brand or collab.brand_id != brand.id:
            raise HTTPException(status_code=403, detail="Bu işbirliğini görüntüleme yetkiniz yok")
    
    elif current_user.role == "influencer":
        influencer = db.query(Influencer).filter(Influencer.user_id == current_user.id).first()
        if not influencer or collab.influencer_id != influencer.id:
            raise HTTPException(status_code=403, detail="Bu işbirliğini görüntüleme yetkiniz yok")
    
    # İlişkili verileri ekle
    if current_user.role == "brand":
        influencer = db.query(Influencer).filter(Influencer.id == collab.influencer_id).first()
        influencer_user = db.query(User).filter(User.id == influencer.user_id).first() if influencer else None
        
        return {
            **collab.__dict__,
            "influencer_name": influencer_user.email.split('@')[0] if influencer_user else "Unknown",
            "influencer_avatar": None
        }
    else:
        brand = db.query(Brand).filter(Brand.id == collab.brand_id).first()
        
        return {
            **collab.__dict__,
            "brand_name": brand.company_name if brand else "Unknown",
            "brand_logo": None
        }


@router.post("/", response_model=CollaborationResponse, status_code=status.HTTP_201_CREATED)
def create_collaboration(
    collaboration: CollaborationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Yeni işbirliği oluştur (sadece brand)
    """
    if current_user.role != "brand":
        raise HTTPException(status_code=403, detail="Sadece markalar işbirliği oluşturabilir")
    
    brand = db.query(Brand).filter(Brand.user_id == current_user.id).first()
    if not brand:
        raise HTTPException(status_code=404, detail="Marka profili bulunamadı")
    
    # Brand ID'yi kontrol et
    if collaboration.brand_id != brand.id:
        raise HTTPException(status_code=403, detail="Başka bir marka adına işbirliği oluşturamazsınız")
    
    # Influencer'ın var olduğunu kontrol et
    influencer = db.query(Influencer).filter(Influencer.id == collaboration.influencer_id).first()
    if not influencer:
        raise HTTPException(status_code=404, detail="Influencer bulunamadı")
    
    new_collab = Collaboration(**collaboration.dict())
    db.add(new_collab)
    db.commit()
    db.refresh(new_collab)
    
    return {
        **new_collab.__dict__,
        "brand_name": brand.company_name,
        "brand_logo": None
    }


@router.put("/{collaboration_id}", response_model=CollaborationResponse)
def update_collaboration(
    collaboration_id: int,
    collaboration_update: CollaborationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    İşbirliğini güncelle
    """
    collab = db.query(Collaboration).filter(Collaboration.id == collaboration_id).first()
    
    if not collab:
        raise HTTPException(status_code=404, detail="İşbirliği bulunamadı")
    
    # Yetki kontrolü
    if current_user.role == "brand":
        brand = db.query(Brand).filter(Brand.user_id == current_user.id).first()
        if not brand or collab.brand_id != brand.id:
            raise HTTPException(status_code=403, detail="Bu işbirliğini güncelleme yetkiniz yok")
    
    elif current_user.role == "influencer":
        influencer = db.query(Influencer).filter(Influencer.user_id == current_user.id).first()
        if not influencer or collab.influencer_id != influencer.id:
            raise HTTPException(status_code=403, detail="Bu işbirliğini güncelleme yetkiniz yok")
    
    # Güncelleme
    update_data = collaboration_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(collab, key, value)
    
    db.commit()
    db.refresh(collab)
    
    return collab


@router.delete("/{collaboration_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_collaboration(
    collaboration_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    İşbirliğini sil (sadece brand)
    """
    if current_user.role != "brand":
        raise HTTPException(status_code=403, detail="Sadece markalar işbirliği silebilir")
    
    collab = db.query(Collaboration).filter(Collaboration.id == collaboration_id).first()
    
    if not collab:
        raise HTTPException(status_code=404, detail="İşbirliği bulunamadı")
    
    brand = db.query(Brand).filter(Brand.user_id == current_user.id).first()
    if not brand or collab.brand_id != brand.id:
        raise HTTPException(status_code=403, detail="Bu işbirliğini silme yetkiniz yok")
    
    db.delete(collab)
    db.commit()
    
    return None
