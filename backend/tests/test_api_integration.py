import json
import os

import requests

BASE_URL = os.getenv("TEST_BASE_URL", "http://localhost:8000")
ROUTES = json.loads('''[
  {
    "method": "GET",
    "path": "/api/health",
    "request_path": "/api/health",
    "auth_required": false,
    "success_status": 200,
    "sample_body": null,
    "response_keys": [
      "status"
    ],
    "expects_json": true
  }
]''')


def _auth_headers(route):
    if route.get("auth_required"):
        token = os.getenv("TEST_AUTH_TOKEN", "test-token")
        return {"Authorization": f"Bearer {token}"}
    return {}


def _payload(route):
    payload = route.get("sample_body")
    return payload if isinstance(payload, dict) else None


def test_route_contracts():
    for route in ROUTES:
        method = route["method"]
        request_path = route.get("request_path") or route["path"]
        url = f"{BASE_URL}{request_path}"
        response = requests.request(
            method,
            url,
            headers=_auth_headers(route),
            json=_payload(route),
            timeout=20,
        )
        assert response.status_code == route["success_status"], (
            f"{method} {route['path']} expected {route['success_status']}, got {response.status_code}"
        )

        if route.get("expects_json"):
            body = response.json()
            keys = route.get("response_keys", [])
            if keys and isinstance(body, dict):
                for key in keys:
                    assert key in body, f"missing key '{key}' in {method} {route['path']}"
