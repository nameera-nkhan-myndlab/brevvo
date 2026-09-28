from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date

class ContactCreate(BaseModel):
    first_name: str
    last_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    title: Optional[str] = None
    notes: Optional[str] = None

class ContactOut(BaseModel):
    id: int; first_name: str; last_name: str; email: Optional[str]; phone: Optional[str]; company: Optional[str]; title: Optional[str]; notes: Optional[str]; created_at: datetime; updated_at: datetime
    class Config: from_attributes = True

class DealCreate(BaseModel):
    title: str; value: Optional[float] = 0; stage: str = "Prospecting"; contact_id: int; expected_close_date: Optional[date] = None; notes: Optional[str] = None

class DealStageUpdate(BaseModel):
    stage: str

class DealOut(BaseModel):
    id: int; title: str; value: Optional[float]; stage: str; contact_id: int; expected_close_date: Optional[date]; notes: Optional[str]; created_at: datetime; updated_at: datetime; contact_name: Optional[str] = None
    class Config: from_attributes = True

class TaskCreate(BaseModel):
    title: str; description: Optional[str] = None; due_date: Optional[datetime] = None; priority: str = "Medium"; status: str = "Pending"; contact_id: Optional[int] = None; deal_id: Optional[int] = None

class TaskOut(BaseModel):
    id: int; title: str; description: Optional[str]; due_date: Optional[datetime]; priority: str; status: str; contact_id: Optional[int]; deal_id: Optional[int]; created_at: datetime; updated_at: datetime
    class Config: from_attributes = True

class ActivityCreate(BaseModel):
    type: str; description: Optional[str] = None; contact_id: Optional[int] = None; deal_id: Optional[int] = None; task_id: Optional[int] = None

class ActivityOut(BaseModel):
    id: int; type: str; description: Optional[str]; contact_id: Optional[int]; deal_id: Optional[int]; task_id: Optional[int]; created_at: datetime
    class Config: from_attributes = True