"""
Unit tests for the Smart Home API

This is a placeholder for pytest tests.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_read_root():
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()
    assert response.json()["message"] == "Welcome to Smart Home API"


def test_health_check():
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


# TODO: Add more tests for users and items endpoints
# def test_create_user():
#     response = client.post(
#         "/users/",
#         json={
#             "email": "test@example.com",
#             "username": "testuser",
#             "password": "testpassword123"
#         }
#     )
#     assert response.status_code == 201
