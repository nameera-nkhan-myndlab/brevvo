import os
import re
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import contacts, deals, tasks, activities, dashboard

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Brevvo CRM")

exact_origins = [o.strip() for o in os.getenv("CORS_ALLOWED_ORIGINS", "").split(",") if o.strip()]
preview_domain = os.getenv("PREVIEW_DOMAIN", "")
origin_patterns = [r"http://(localhost|127\.0\.0\.1):\d+"]
if preview_domain and preview_domain != "localhost":
    origin_patterns.append(rf"https://[a-z0-9-]+\.{re.escape(preview_domain)}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=exact_origins,
    allow_origin_regex="|".join(f"({p})" for p in origin_patterns),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(contacts.router)
app.include_router(deals.router)
app.include_router(tasks.router)
app.include_router(activities.router)
app.include_router(dashboard.router)

@app.get("/api/health")
def health():
    return {"status": "ok"}