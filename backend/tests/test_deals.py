from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_list_deals():
    r = client.get("/api/deals")
    assert r.status_code == 200

def test_create_deal_bad_contact():
    r = client.post("/api/deals", json={"title": "X", "stage": "Prospecting", "contact_id": 99999})
    assert r.status_code == 400