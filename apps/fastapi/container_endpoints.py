from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any, List, Optional
from datetime import datetime
import uuid

# Create a router for container endpoints
router = APIRouter(prefix="/api/containers", tags=["containers"])

# Mock container data
MOCK_CONTAINERS = {}

class ContainerActionResponse:
    def __init__(self, success: bool, message: str, data: Optional[Dict[str, Any]] = None, logs: Optional[str] = None):
        self.success = success
        self.message = message
        self.data = data
        self.logs = logs
        self.timestamp = datetime.utcnow().isoformat()

@router.post("/{project_id}/create")
async def create_container_resources(project_id: str):
    """Create container resources for a project"""
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

@router.get("/{project_id}/status")
async def get_container_status(project_id: str):
    """Get the status of a project container"""
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

@router.post("/{project_id}/action")
async def container_action(project_id: str, action: dict):
    """Perform an action on a project container"""
    action_type = action.get("action", "")
    
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
