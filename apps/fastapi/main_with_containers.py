from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
from datetime import datetime
import os

# Create FastAPI app
app = FastAPI(
    title="VibeCode API",
    description="API for VibeCode application",
    version="0.1.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Mock user for development
MOCK_USER = {
    "id": "mock-user-id",
    "username": "mockuser",
    "email": "mock@example.com",
    "full_name": "Mock User",
    "avatar_url": "https://via.placeholder.com/150",
    "provider": "mock"
}

# Mock projects data
MOCK_PROJECTS = [
    {
        "id": "mock-project-1",
        "name": "Mock Project 1",
        "description": "This is a mock project for development",
        "language": "Python",
        "owner_id": MOCK_USER["id"],
        "members": [MOCK_USER["id"]],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "id": "mock-project-2",
        "name": "Mock Project 2",
        "description": "Another mock project for development",
        "language": "JavaScript",
        "owner_id": MOCK_USER["id"],
        "members": [MOCK_USER["id"]],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
]

# Mock container data
MOCK_CONTAINERS = {}

# Projects API endpoints
@app.get("/api/projects")
async def list_projects():
    """Get all projects without authentication"""
    print("GET /api/projects - No auth required")
    return MOCK_PROJECTS

@app.post("/api/projects", status_code=status.HTTP_201_CREATED)
async def create_project(project: dict):
    """Create a new project without authentication"""
    print("POST /api/projects - No auth required")
    new_project = {
        "id": f"mock-project-{uuid.uuid4()}",
        "name": project.get("name", "New Project"),
        "description": project.get("description", "A new project"),
        "language": project.get("language", "Unknown"),
        "owner_id": MOCK_USER["id"],
        "members": [MOCK_USER["id"]],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    MOCK_PROJECTS.append(new_project)
    return new_project

@app.get("/api/projects/{project_id}")
async def get_project(project_id: str):
    """Get a specific project without authentication"""
    print(f"GET /api/projects/{project_id} - No auth required")
    mock_project = next((p for p in MOCK_PROJECTS if p["id"] == project_id), None)
    if mock_project:
        return mock_project
    else:
        raise HTTPException(status_code=404, detail="Project not found")

@app.put("/api/projects/{project_id}")
async def update_project(project_id: str, project_update: dict):
    """Update a project without authentication"""
    print(f"PUT /api/projects/{project_id} - No auth required")
    mock_project = next((p for p in MOCK_PROJECTS if p["id"] == project_id), None)
    if mock_project:
        for field, value in project_update.items():
            if field in mock_project:
                mock_project[field] = value
        
        mock_project["updated_at"] = datetime.utcnow()
        return mock_project
    else:
        raise HTTPException(status_code=404, detail="Project not found")

@app.delete("/api/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(project_id: str):
    """Delete a project without authentication"""
    print(f"DELETE /api/projects/{project_id} - No auth required")
    mock_project = next((p for p in MOCK_PROJECTS if p["id"] == project_id), None)
    if mock_project:
        MOCK_PROJECTS.remove(mock_project)
        return None
    else:
        raise HTTPException(status_code=404, detail="Project not found")

# Health check endpoint
@app.get("/api/fastapi/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

# Container API endpoints
@app.post("/api/containers/{project_id}/create")
async def create_container_resources(project_id: str):
    """Create container resources for a project"""
    print(f"POST /api/containers/{project_id}/create - Creating container resources")
    # Create mock container resources
    container_resources = {
        "exists": True,
        "status": "Running",
        "running": True,
        "deployment": {
            "name": f"deployment-{project_id}",
            "available_replicas": 1,
            "total_replicas": 1
        },
        "service": {
            "name": f"service-{project_id}",
            "cluster_ip": "10.42.0.123",
            "ports": [{"port": 8080, "target_port": 8080}]
        },
        "pvc": {
            "name": f"pvc-{project_id}",
            "status": "Bound",
            "capacity": "1Gi"
        },
        "pods": [
            {
                "name": f"pod-{project_id}-xyz123",
                "status": "Running",
                "ready": True,
                "restart_count": 0,
                "age": "1h"
            }
        ]
    }
    
    # Store container resources
    MOCK_CONTAINERS[project_id] = container_resources
    
    return {
        "success": True,
        "message": f"Created container resources for project {project_id}",
        "data": container_resources,
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/api/containers/{project_id}/status")
async def get_container_status(project_id: str):
    """Get the status of a project container"""
    print(f"GET /api/containers/{project_id}/status - Getting container status")
    # Check if container exists
    if project_id in MOCK_CONTAINERS:
        return {
            "success": True,
            "message": f"Retrieved status for project {project_id}",
            "data": MOCK_CONTAINERS[project_id],
            "timestamp": datetime.utcnow().isoformat()
        }
    else:
        return {
            "success": True,
            "message": f"No container resources exist for project {project_id}",
            "data": {
                "exists": False,
                "status": "Not Created",
                "running": False
            },
            "timestamp": datetime.utcnow().isoformat()
        }

@app.post("/api/containers/{project_id}/action")
async def container_action(project_id: str, action: dict):
    """Perform an action on a project container"""
    action_type = action.get("action", "")
    print(f"POST /api/containers/{project_id}/action - Action: {action_type}")
    
    # Check if container exists
    if action_type == "create":
        return await create_container_resources(project_id)
    
    if project_id not in MOCK_CONTAINERS and action_type != "create":
        return {
            "success": False,
            "message": f"Container resources don't exist for project {project_id}",
            "timestamp": datetime.utcnow().isoformat()
        }
    
    if action_type == "start":
        MOCK_CONTAINERS[project_id]["running"] = True
        MOCK_CONTAINERS[project_id]["status"] = "Running"
        return {
            "success": True,
            "message": f"Container for project {project_id} started",
            "data": MOCK_CONTAINERS[project_id],
            "timestamp": datetime.utcnow().isoformat()
        }
    
    elif action_type == "stop":
        MOCK_CONTAINERS[project_id]["running"] = False
        MOCK_CONTAINERS[project_id]["status"] = "Stopped"
        return {
            "success": True,
            "message": f"Container for project {project_id} stopped",
            "data": MOCK_CONTAINERS[project_id],
            "timestamp": datetime.utcnow().isoformat()
        }
    
    elif action_type == "restart":
        MOCK_CONTAINERS[project_id]["running"] = True
        MOCK_CONTAINERS[project_id]["status"] = "Running"
        return {
            "success": True,
            "message": f"Container for project {project_id} restarted",
            "data": MOCK_CONTAINERS[project_id],
            "timestamp": datetime.utcnow().isoformat()
        }
    
    elif action_type == "logs":
        return {
            "success": True,
            "message": f"Retrieved logs for project {project_id}",
            "logs": "Hello from a container!\nThis is a mock log message.",
            "timestamp": datetime.utcnow().isoformat()
        }
    
    elif action_type == "status":
        return {
            "success": True,
            "message": f"Retrieved status for project {project_id}",
            "data": MOCK_CONTAINERS[project_id],
            "timestamp": datetime.utcnow().isoformat()
        }
    
    elif action_type == "delete":
        if project_id in MOCK_CONTAINERS:
            del MOCK_CONTAINERS[project_id]
        return {
            "success": True,
            "message": f"Deleted container resources for project {project_id}",
            "timestamp": datetime.utcnow().isoformat()
        }
    
    else:
        return {
            "success": False,
            "message": f"Invalid action: {action_type}. Valid actions are: create, start, stop, restart, logs, status, delete",
            "timestamp": datetime.utcnow().isoformat()
        }
