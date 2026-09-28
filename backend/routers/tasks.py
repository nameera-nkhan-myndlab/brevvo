from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Task
from schemas import TaskCreate, TaskOut
from datetime import datetime

router = APIRouter(prefix="/api/tasks", tags=["tasks"])

@router.get("", response_model=list[TaskOut])
def list_tasks(db: Session = Depends(get_db)):
    return db.query(Task).order_by(Task.created_at.desc()).all()

@router.post("", response_model=TaskOut, status_code=201)
def create_task(data: TaskCreate, db: Session = Depends(get_db)):
    t = Task(**data.model_dump())
    db.add(t); db.commit(); db.refresh(t)
    return t

@router.get("/{id}", response_model=TaskOut)
def get_task(id: int, db: Session = Depends(get_db)):
    t = db.query(Task).filter(Task.id == id).first()
    if not t: raise HTTPException(404, "Task not found")
    return t

@router.put("/{id}", response_model=TaskOut)
def update_task(id: int, data: TaskCreate, db: Session = Depends(get_db)):
    t = db.query(Task).filter(Task.id == id).first()
    if not t: raise HTTPException(404, "Task not found")
    for k, v in data.model_dump().items(): setattr(t, k, v)
    t.updated_at = datetime.utcnow()
    db.commit(); db.refresh(t)
    return t

@router.delete("/{id}")
def delete_task(id: int, db: Session = Depends(get_db)):
    t = db.query(Task).filter(Task.id == id).first()
    if not t: raise HTTPException(404, "Task not found")
    db.delete(t); db.commit()
    return {"success": True}