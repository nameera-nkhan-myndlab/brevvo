from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_list_activities():
    r = client.get("/api/activities")
    assert r.status_code == 200

def test_create_activity():
    r = client.post("/api/activities", json={"type": "call", "description": "Test"})
    assert r.status_code == 201
    assert r.json()["type"] == "call"