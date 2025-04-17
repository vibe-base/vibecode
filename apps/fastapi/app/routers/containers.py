from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from datetime import datetime, timezone
import uuid

from app.core.database import get_db
from app.models.project import Project as ProjectDB
from app.schemas.project import ContainerAction, ContainerActionResponse, ContainerConfig
from app.core.kubernetes import KubernetesClient

router = APIRouter(prefix="/api/containers", tags=["containers"])

@router.post("/{project_id}/action", response_model=ContainerActionResponse)
async def container_action(
    project_id: str,
    action: ContainerAction,
    db: Session = Depends(get_db)
):
    """Perform an action on a project container"""
    # Check if project exists
    project = db.query(ProjectDB).filter(ProjectDB.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    try:
        if action.action == "start":
            # Start the container
            if not project.deployment_name:
                # Container resources don't exist yet, create them
                return await create_container_resources(project_id, db)

            # Start existing container
            result = KubernetesClient.start_container(project_id)

            # Update project in database
            project.container_running = True
            project.container_status = "Running"
            project.container_last_started_at = datetime.now(timezone.utc)
            db.commit()

            return ContainerActionResponse(
                success=True,
                message=f"Container for project {project_id} started",
                data=result
            )

        elif action.action == "stop":
            # Stop the container
            if not project.deployment_name:
                raise HTTPException(
                    status_code=400,
                    detail="Container resources don't exist for this project"
                )

            result = KubernetesClient.stop_container(project_id)

            # Update project in database
            project.container_running = False
            project.container_status = "Stopped"
            db.commit()

            return ContainerActionResponse(
                success=True,
                message=f"Container for project {project_id} stopped",
                data=result
            )

        elif action.action == "restart":
            # Restart the container
            if not project.deployment_name:
                # Container resources don't exist yet, create them
                return await create_container_resources(project_id, db)

            # Stop then start
            KubernetesClient.stop_container(project_id)
            result = KubernetesClient.start_container(project_id)

            # Update project in database
            project.container_running = True
            project.container_status = "Running"
            project.container_last_started_at = datetime.now(timezone.utc)
            db.commit()

            return ContainerActionResponse(
                success=True,
                message=f"Container for project {project_id} restarted",
                data=result
            )

        elif action.action == "logs":
            # Get container logs
            if not project.deployment_name:
                raise HTTPException(
                    status_code=400,
                    detail="Container resources don't exist for this project"
                )

            logs = KubernetesClient.get_pod_logs(project_id, action.tail_lines)

            return ContainerActionResponse(
                success=True,
                message=f"Retrieved logs for project {project_id}",
                logs=logs
            )

        elif action.action == "status":
            # Get container status
            if not project.deployment_name:
                return ContainerActionResponse(
                    success=True,
                    message=f"No container resources exist for project {project_id}",
                    data={"exists": False, "status": "Not Created"}
                )

            resources = KubernetesClient.get_project_resources(project_id)

            # Update project status based on resources
            if resources["deployment"] and resources["pods"]:
                pods = resources["pods"]
                if isinstance(pods, list) and len(pods) > 0:
                    pod = pods[0]
                    running = pod["status"] == "Running" and pod["ready"]
                    project.container_running = running
                    project.container_status = pod["status"]
                    db.commit()

            return ContainerActionResponse(
                success=True,
                message=f"Retrieved status for project {project_id}",
                data=resources
            )

        elif action.action == "delete":
            # Delete container resources
            if not project.deployment_name:
                return ContainerActionResponse(
                    success=True,
                    message=f"No container resources exist for project {project_id}",
                    data={"exists": False}
                )

            result = KubernetesClient.delete_project_resources(project_id)

            # Update project in database
            project.deployment_name = None
            project.service_name = None
            project.pvc_name = None
            project.container_running = False
            project.container_status = "Deleted"
            project.k8s_resources = None
            db.commit()

            return ContainerActionResponse(
                success=True,
                message=f"Deleted container resources for project {project_id}",
                data=result
            )

        else:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid action: {action.action}. Valid actions are: start, stop, restart, logs, status, delete"
            )

    except Exception as e:
        return ContainerActionResponse(
            success=False,
            message=f"Error performing action {action.action} on container: {str(e)}"
        )

@router.post("/{project_id}/create", response_model=ContainerActionResponse)
async def create_container_resources(
    project_id: str,
    db: Session = Depends(get_db),
    config: ContainerConfig = None
):
    """Create container resources for a project"""
    # Check if project exists
    project = db.query(ProjectDB).filter(ProjectDB.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    try:
        # Create PVC
        pvc_result = KubernetesClient.create_pvc(
            project_id,
            storage_size=config.storage_size if config and config.storage_size else "1Gi"
        )

        # Create ConfigMap for files
        files = project.files if project.files else []
        configmap_result = KubernetesClient.create_configmap_for_files(project_id, files)

        # Determine container image based on project language
        container_image = config.image if config and config.image else "python:3.9-slim"
        if not config or not config.image:
            if project.language and project.language.lower() == "javascript":
                container_image = "node:14-alpine"
            elif project.language and project.language.lower() == "python":
                container_image = "python:3.9-slim"
            elif project.language and project.language.lower() == "go":
                container_image = "golang:1.17-alpine"
            elif project.language and project.language.lower() == "java":
                container_image = "openjdk:11-jdk-slim"

        # Determine container port
        container_port = config.port if config and config.port else 8000

        # Determine container command
        command = None
        if config and config.command:
            command = config.command
        else:
            if project.language and project.language.lower() == "javascript":
                command = ["node", "index.js"]
            elif project.language and project.language.lower() == "python":
                command = ["python", "main.py"]
            elif project.language and project.language.lower() == "go":
                command = ["go", "run", "main.go"]
            elif project.language and project.language.lower() == "java":
                command = ["java", "-jar", "app.jar"]

        # Create Deployment
        deployment_result = KubernetesClient.create_deployment(
            project_id,
            pvc_name=pvc_result["name"],
            configmap_name=configmap_result["name"],
            container_image=container_image,
            container_port=container_port,
            command=command,
            args=config.args if config and config.args else None,
            env_vars=config.env_vars if config and config.env_vars else None,
            cpu_limit=config.cpu_limit if config and config.cpu_limit else "500m",
            memory_limit=config.memory_limit if config and config.memory_limit else "512Mi"
        )

        # Create Service
        service_result = KubernetesClient.create_service(
            project_id,
            container_port=container_port
        )

        # Update project in database
        project.deployment_name = deployment_result["name"]
        project.service_name = service_result["name"]
        project.pvc_name = pvc_result["name"]
        project.container_running = True
        project.container_status = "Creating"
        project.container_created_at = datetime.now(timezone.utc)
        project.container_last_started_at = datetime.now(timezone.utc)
        project.container_image = container_image
        project.container_port = str(container_port)
        project.k8s_resources = {
            "deployment": deployment_result,
            "service": service_result,
            "pvc": pvc_result,
            "configmap": configmap_result
        }
        db.commit()

        return ContainerActionResponse(
            success=True,
            message=f"Created container resources for project {project_id}",
            data={
                "deployment": deployment_result,
                "service": service_result,
                "pvc": pvc_result,
                "configmap": configmap_result
            }
        )

    except Exception as e:
        return ContainerActionResponse(
            success=False,
            message=f"Error creating container resources: {str(e)}"
        )

@router.get("/{project_id}/status", response_model=ContainerActionResponse)
async def get_container_status(
    project_id: str,
    db: Session = Depends(get_db)
):
    """Get the status of a project container"""
    # Check if project exists
    project = db.query(ProjectDB).filter(ProjectDB.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    try:
        # Check if container resources exist
        if not project.deployment_name:
            return ContainerActionResponse(
                success=True,
                message=f"No container resources exist for project {project_id}",
                data={
                    "exists": False,
                    "status": "Not Created",
                    "running": False
                }
            )

        # Get container resources status
        resources = KubernetesClient.get_project_resources(project_id)

        # Update project status based on resources
        if resources["deployment"] and resources["pods"]:
            pods = resources["pods"]
            if isinstance(pods, list) and len(pods) > 0:
                pod = pods[0]
                running = pod["status"] == "Running" and pod["ready"]
                project.container_running = running
                project.container_status = pod["status"]
                db.commit()

        return ContainerActionResponse(
            success=True,
            message=f"Retrieved status for project {project_id}",
            data=resources
        )
    except Exception as e:
        # Log the error but return a fallback response
        print(f"Error getting container status: {str(e)}")
        return ContainerActionResponse(
            success=False,
            message=f"Error getting container status: {str(e)}",
            data={
                "exists": project.deployment_name is not None,
                "status": project.container_status or "Unknown",
                "running": project.container_running or False,
                "error": str(e)
            }
        )
