import requests
import json

# Create a mock token
token_response = requests.post("http://localhost:8000/api/fastapi/auth/token")
print("Token response:", token_response.status_code)
if token_response.status_code == 200:
    token_data = token_response.json()
    token = token_data["access_token"]
    print("Got token:", token)
else:
    # Use a hardcoded token for testing
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im1vY2stdXNlci1pZCIsInVzZXJuYW1lIjoibW9ja191c2VyIiwiZW1haWwiOiJtb2NrQGV4YW1wbGUuY29tIiwiZnVsbF9uYW1lIjoiTW9jayBVc2VyIiwicHJvdmlkZXIiOiJtb2NrIn0.8J7ySQkLN6KuSEUzD7tHpQmEzWrs2d6SFbxuFxrCLQ4"
    print("Using hardcoded token")

# Create a project
project_data = {
    "name": "Test Project",
    "description": "A test project created via API",
    "language": "Python",
    "files": [
        {
            "name": "main.py",
            "content": "print('Hello, World!')",
            "language": "python"
        }
    ]
}

headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {token}"
}

response = requests.post(
    "http://localhost:8000/api/projects",
    headers=headers,
    data=json.dumps(project_data)
)

print("Response status:", response.status_code)
print("Response body:", response.text)
