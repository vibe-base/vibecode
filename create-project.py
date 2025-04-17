import requests
import json
import time

# Get a token
print("Getting a token...")
token_response = requests.post("https://0192.ai/api/fastapi/auth/token")
if token_response.status_code == 200:
    token_data = token_response.json()
    token = token_data["access_token"]
    print(f"Got token: {token}")
else:
    # Use a hardcoded token
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im1vY2stdXNlci1pZCIsInVzZXJuYW1lIjoibW9ja191c2VyIiwiZW1haWwiOiJtb2NrQGV4YW1wbGUuY29tIiwiZnVsbF9uYW1lIjoiTW9jayBVc2VyIiwicHJvdmlkZXIiOiJtb2NrIn0.8J7ySQkLN6KuSEUzD7tHpQmEzWrs2d6SFbxuFxrCLQ4"
    print(f"Using hardcoded token: {token}")

# Create a project
print("\nCreating a project...")
project_data = {
    "name": f"Test Project {int(time.time())}",
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
    "https://0192.ai/api/projects",
    headers=headers,
    data=json.dumps(project_data)
)

print(f"Response status: {response.status_code}")
print(f"Response body: {response.text}")

# Get all projects
print("\nGetting all projects...")
response = requests.get(
    "https://0192.ai/api/projects",
    headers=headers
)

print(f"Response status: {response.status_code}")
print(f"Response body: {response.text}")
