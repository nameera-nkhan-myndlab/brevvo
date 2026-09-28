from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_list_tasks():
    r = client.get("/api/tasks")
    assert r.status_code == 200

def test_create_task():
    r = client.post("/api/tasks", json={"title": "Test task", "priority": "High", "status": "Pending"})
    assert r.status_code == 201
    assert r.json()["title"] == "Test task"

def test_create_task_missing():
    r = client.post("/api/tasks", json={})
    assert r.status_code == 422