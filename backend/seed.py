from database import SessionLocal, engine, Base
from models import Contact, Deal, Task, Activity
from datetime import datetime, timedelta

Base.metadata.create_all(bind=engine)
db = SessionLocal()

if db.query(Contact).count() == 0:
    contacts = [
        Contact(first_name="Marcus", last_name="Chen", email="marcus@vertexlabs.com", phone="+1-555-0101", company="Vertex Labs", title="CTO"),
        Contact(first_name="Sarah", last_name="Johnson", email="sarah@brightside.co", phone="+1-555-0102", company="Brightside Co.", title="VP Sales"),
        Contact(first_name="James", last_name="Rivera", email="james@helixsys.com", phone="+1-555-0103", company="Helix Systems", title="Director of Ops"),
        Contact(first_name="Emily", last_name="Park", email="emily@orbitmedia.com", phone="+1-555-0104", company="Orbit Media", title="CEO"),
        Contact(first_name="David", last_name="Kim", email="david@novatech.io", phone="+1-555-0105", company="NovaTech", title="Product Manager"),
    ]
    db.add_all(contacts); db.commit()
    for c in contacts: db.refresh(c)

    deals = [
        Deal(title="Enterprise Rollout", value=64000, stage="Proposal", contact_id=contacts[0].id, expected_close_date=(datetime.utcnow() + timedelta(days=30)).date()),
        Deal(title="Annual Renewal", value=28500, stage="Negotiation", contact_id=contacts[1].id, expected_close_date=(datetime.utcnow() + timedelta(days=14)).date()),
        Deal(title="Platform Upgrade", value=41200, stage="Closing", contact_id=contacts[2].id, expected_close_date=(datetime.utcnow() + timedelta(days=7)).date()),
        Deal(title="Pilot Program", value=12800, stage="Qualified", contact_id=contacts[3].id),
        Deal(title="Cloud Migration", value=95000, stage="Prospecting", contact_id=contacts[4].id),
    ]
    db.add_all(deals); db.commit()

    tasks = [
        Task(title="Call Marcus at Vertex Labs", priority="High", status="Pending", due_date=datetime.utcnow() + timedelta(hours=2), contact_id=contacts[0].id),
        Task(title="Send proposal to Brightside Co.", priority="High", status="Pending", due_date=datetime.utcnow() + timedelta(hours=4), contact_id=contacts[1].id),
        Task(title="Demo with Helix Systems", priority="Medium", status="Pending", due_date=datetime.utcnow() + timedelta(hours=6), contact_id=contacts[2].id),
        Task(title="Review contract — Orbit Media", priority="Medium", status="Pending", due_date=datetime.utcnow() + timedelta(days=1), contact_id=contacts[3].id),
        Task(title="Follow up with NovaTech", priority="Low", status="Pending", due_date=datetime.utcnow() + timedelta(days=3), contact_id=contacts[4].id),
    ]
    db.add_all(tasks); db.commit()

    activities = [
        Activity(type="call", description="Initial discovery call with Marcus", contact_id=contacts[0].id),
        Activity(type="email", description="Sent pricing deck to Sarah", contact_id=contacts[1].id),
        Activity(type="meeting", description="Product demo with Helix team", contact_id=contacts[2].id),
    ]
    db.add_all(activities); db.commit()

db.close()
print("Seed complete.")