from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_dashboard_stats():
    r = client.get("/api/dashboard/stats")
    assert r.status_code == 200
    data = r.json()
    assert "total_contacts" in data
    assert "pipeline_value" in data
    assert "upcoming_tasks" in data