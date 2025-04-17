from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from datetime import datetime, timezone

from app.core.database import get_db
from app.models.project import Project as ProjectDB
from app.schemas.project import ContainerActionResponse

router = APIRouter(prefix="/api/test-containers", tags=["test-containers"])

@router.get("/status/{project_id}", response_model=ContainerActionResponse)
async def test_container_status(
    project_id: str,
    db: Session = Depends(get_db)
):
    """Test endpoint for container status"""
    # Check if project exists
    project = db.query(ProjectDB).filter(ProjectDB.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Return mock container status
    return ContainerActionResponse(
        success=True,
        message=f"Test container status for project {project_id}",
        data={
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
    )
