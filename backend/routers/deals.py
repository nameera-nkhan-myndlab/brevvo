from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Deal, Contact
from schemas import DealCreate, DealOut, DealStageUpdate
from datetime import datetime

router = APIRouter(prefix="/api/deals", tags=["deals"])

def _enrich(d):
    d.contact_name = f"{d.contact.first_name} {d.contact.last_name}" if d.contact else None
    return d

@router.get("", response_model=list[DealOut])
def list_deals(db: Session = Depends(get_db)):
    deals = db.query(Deal).order_by(Deal.created_at.desc()).all()
    return [_enrich(d) for d in deals]

@router.post("", response_model=DealOut, status_code=201)
def create_deal(data: DealCreate, db: Session = Depends(get_db)):
    if not db.query(Contact).filter(Contact.id == data.contact_id).first():
        raise HTTPException(400, "Contact not found")
    d = Deal(**data.model_dump())
    db.add(d); db.commit(); db.refresh(d)
    return _enrich(d)

@router.get("/{id}", response_model=DealOut)
def get_deal(id: int, db: Session = Depends(get_db)):
    d = db.query(Deal).filter(Deal.id == id).first()
    if not d: raise HTTPException(404, "Deal not found")
    return _enrich(d)

@router.put("/{id}", response_model=DealOut)
def update_deal(id: int, data: DealCreate, db: Session = Depends(get_db)):
    d = db.query(Deal).filter(Deal.id == id).first()
    if not d: raise HTTPException(404, "Deal not found")
    for k, v in data.model_dump().items(): setattr(d, k, v)
    d.updated_at = datetime.utcnow()
    db.commit(); db.refresh(d)
    return _enrich(d)

@router.delete("/{id}")
def delete_deal(id: int, db: Session = Depends(get_db)):
    d = db.query(Deal).filter(Deal.id == id).first()
    if not d: raise HTTPException(404, "Deal not found")
    db.delete(d); db.commit()
    return {"success": True}

@router.patch("/{id}/stage", response_model=DealOut)
def update_stage(id: int, data: DealStageUpdate, db: Session = Depends(get_db)):
    d = db.query(Deal).filter(Deal.id == id).first()
    if not d: raise HTTPException(404, "Deal not found")
    d.stage = data.stage
    d.updated_at = datetime.utcnow()
    db.commit(); db.refresh(d)
    return _enrich(d)