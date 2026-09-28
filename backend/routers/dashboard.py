from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Contact, Deal, Task

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    total_contacts = db.query(Contact).count()
    total_deals = db.query(Deal).count()
    total_tasks_pending = db.query(Task).filter(Task.status != "Completed").count()
    pipeline_value = sum(d.value or 0 for d in db.query(Deal).all())
    recent = db.query(Contact).order_by(Contact.created_at.desc()).limit(5).all()
    upcoming = db.query(Task).filter(Task.status != "Completed").order_by(Task.due_date.asc()).limit(5).all()
    return {
        "total_contacts": total_contacts,
        "total_deals": total_deals,
        "total_tasks_pending": total_tasks_pending,
        "pipeline_value": pipeline_value,
        "recent_contacts": [{"id": c.id, "first_name": c.first_name, "last_name": c.last_name, "company": c.company} for c in recent],
        "upcoming_tasks": [{"id": t.id, "title": t.title, "due_date": str(t.due_date) if t.due_date else None, "priority": t.priority} for t in upcoming],
    }