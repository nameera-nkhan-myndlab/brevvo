from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Contact
from schemas import ContactCreate, ContactOut
from datetime import datetime

router = APIRouter(prefix="/api/contacts", tags=["contacts"])

@router.get("", response_model=list[ContactOut])
def list_contacts(db: Session = Depends(get_db)):
    return db.query(Contact).order_by(Contact.created_at.desc()).all()

@router.post("", response_model=ContactOut, status_code=201)
def create_contact(data: ContactCreate, db: Session = Depends(get_db)):
    c = Contact(**data.model_dump())
    db.add(c); db.commit(); db.refresh(c)
    return c

@router.get("/{id}", response_model=ContactOut)
def get_contact(id: int, db: Session = Depends(get_db)):
    c = db.query(Contact).filter(Contact.id == id).first()
    if not c: raise HTTPException(404, "Contact not found")
    return c

@router.put("/{id}", response_model=ContactOut)
def update_contact(id: int, data: ContactCreate, db: Session = Depends(get_db)):
    c = db.query(Contact).filter(Contact.id == id).first()
    if not c: raise HTTPException(404, "Contact not found")
    for k, v in data.model_dump().items(): setattr(c, k, v)
    c.updated_at = datetime.utcnow()
    db.commit(); db.refresh(c)
    return c

@router.delete("/{id}")
def delete_contact(id: int, db: Session = Depends(get_db)):
    c = db.query(Contact).filter(Contact.id == id).first()
    if not c: raise HTTPException(404, "Contact not found")
    db.delete(c); db.commit()
    return {"success": True}