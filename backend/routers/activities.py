from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Activity
from schemas import ActivityCreate, ActivityOut

router = APIRouter(prefix="/api/activities", tags=["activities"])

@router.get("", response_model=list[ActivityOut])
def list_activities(contact_id: int = None, deal_id: int = None, db: Session = Depends(get_db)):
    q = db.query(Activity)
    if contact_id: q = q.filter(Activity.contact_id == contact_id)
    if deal_id: q = q.filter(Activity.deal_id == deal_id)
    return q.order_by(Activity.created_at.desc()).all()

@router.post("", response_model=ActivityOut, status_code=201)
def create_activity(data: ActivityCreate, db: Session = Depends(get_db)):
    a = Activity(**data.model_dump())
    db.add(a); db.commit(); db.refresh(a)
    return a