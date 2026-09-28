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


def test_unit_missing_required_field():
    for route in ROUTES:
        body = route.get("sample_body")
        if not isinstance(body, dict) or len(body) < 2:
            continue
        for key in list(body.keys()):
            partial = {k: v for k, v in body.items() if k != key}
            request_path = route.get("request_path") or route["path"]
            url = f"{BASE_URL}{request_path}"
            response = requests.request(
                route["method"], url, json=partial, timeout=20
            )
            assert response.status_code in (400, 422), (
                f"{route['method']} {route['path']} missing '{key}' "
                f"expected 400/422 got {response.status_code}"
            )


def test_unit_auth_rejection():
    for route in ROUTES:
        if not route.get("auth_required"):
            continue
        request_path = route.get("request_path") or route["path"]
        url = f"{BASE_URL}{request_path}"
        response = requests.request(route["method"], url, timeout=20)
        assert response.status_code == 401, (
            f"{route['method']} {route['path']} expected 401 got {response.status_code}"
        )


def test_unit_wrong_method():
    for route in ROUTES:
        wrong = "POST" if route["method"] == "GET" else "GET"
        request_path = route.get("request_path") or route["path"]
        url = f"{BASE_URL}{request_path}"
        response = requests.request(wrong, url, timeout=20)
        assert response.status_code == 405, (
            f"wrong method {wrong} on {route['path']} expected 405 got {response.status_code}"
        )
