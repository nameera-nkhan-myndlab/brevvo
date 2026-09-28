from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_list_contacts():
    r = client.get("/api/contacts")
    assert r.status_code == 200
    assert isinstance(r.json(), list)

def test_create_contact():
    r = client.post("/api/contacts", json={"first_name": "Test", "last_name": "User", "email": "test@example.com"})
    assert r.status_code == 201
    assert r.json()["first_name"] == "Test"

def test_create_contact_missing_field():
    r = client.post("/api/contacts", json={"first_name": "Only"})
    assert r.status_code == 422