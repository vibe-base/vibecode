#!/usr/bin/env python3
import time
import uuid
import json

# Create a script to be executed in the FastAPI pod
script = """
from app.models.user import User
from app.models.project import Project
from app.core.database import SessionLocal
from datetime import datetime
import uuid

# Create a database session
db = SessionLocal()

try:
    # Create a mock user
    mock_user = User(
        id="mock-user-id",
        username="mock_user",
        email="mock@example.com",
        full_name="Mock User",
        avatar_url="",
        provider="mock",
        is_active=True
    )
    
    # Check if the mock user already exists
    existing_user = db.query(User).filter(User.id == mock_user.id).first()
    if not existing_user:
        db.add(mock_user)
        db.commit()
        db.refresh(mock_user)
        user = mock_user
    else:
        user = existing_user
    
    # Create new project
    project_id = f"project-{uuid.uuid4()}"
    new_project = Project(
        id=project_id,
        name=f"Test Project {datetime.now().timestamp()}",
        description="A test project created directly in the database",
        language="Python",
        owner_id=user.id,
        files=[{
            "name": "main.py",
            "content": "print('Hello, World!')",
            "language": "python"
        }],
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    
    # Add to database
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    
    print(f"Project created successfully with ID: {project_id}")
    
    # Get all projects
    projects = db.query(Project).all()
    print(f"Total projects: {len(projects)}")
    for project in projects:
        print(f"- {project.id}: {project.name}")
    
except Exception as e:
    db.rollback()
    print(f"Error: {e}")
finally:
    db.close()
"""

# Save the script to a file
with open("db_script.py", "w") as f:
    f.write(script)

print("Script created. Now run the following commands:")
print("1. Copy the script to the FastAPI pod:")
print("   kubectl cp db_script.py vibecode/$(kubectl get pods -n vibecode -l app=fastapi -o name | head -n 1 | cut -d/ -f2):/tmp/db_script.py")
print("2. Execute the script in the pod:")
print("   kubectl exec -n vibecode $(kubectl get pods -n vibecode -l app=fastapi -o name | head -n 1) -- python /tmp/db_script.py")
