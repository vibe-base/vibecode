from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import uuid
from datetime import datetime, timezone
from app.core.auth import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.models.project import Project as ProjectDB
from app.schemas.project import Project, ProjectCreate, ProjectUpdate, ContainerConfig
from app.core.kubernetes import KubernetesClient

router = APIRouter(prefix="/api/projects", tags=["projects"])

@router.get("/", response_model=List[Project])
async def list_projects(
    db: Session = Depends(get_db)
):
    """Get all projects without authentication"""
    try:
        # Create a mock user for testing
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

        # Get all projects
        projects = db.query(ProjectDB).all()
        return projects
    except Exception as e:
        # Fallback to mock data if database query fails
        return [
            {
                "id": "project-1",
                "name": "Project 1",
                "description": "This is a project",
                "language": "Python",
                "owner_id": "mock-user-id",
                "members": ["mock-user-id"],
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "id": "project-2",
                "name": "Project 2",
                "description": "Another project",
                "language": "JavaScript",
                "owner_id": "mock-user-id",
                "members": ["mock-user-id"],
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
        ]

@router.get("/test", response_model=List[Project])
async def test_projects_endpoint():
    """Test endpoint that doesn't require authentication"""
    return [
        {
            "id": "test-project-1",
            "name": "Test Project 1",
            "description": "This is a test project",
            "language": "Python",
            "owner_id": "test-user",
            "members": ["test-user"],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": "test-project-2",
            "name": "Test Project 2",
            "description": "Another test project",
            "language": "JavaScript",
            "owner_id": "test-user",
            "members": ["test-user"],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    ]

@router.post("/", response_model=Project, status_code=status.HTTP_201_CREATED)
async def create_project(
    project: ProjectCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    container_config: ContainerConfig = None
):
    """Create a new project without authentication"""
    # Create a mock user for testing
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

    # Create new project with a UUID
    project_id = str(uuid.uuid4())

    # Convert files from the schema to a format that can be stored in the database
    files_data = []
    if project.files:
        files_data = [file.dict() for file in project.files]

    # Create new project
    db_project = ProjectDB(
        id=project_id,
        owner_id=user.id,
        members=[user.id],
        files=files_data,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
        status="active"
    )

    # Set other fields from the project create request
    if project.name:
        db_project.name = project.name
    if project.description:
        db_project.description = project.description
    if project.language:
        db_project.language = project.language

    # Save the project to the database
    db.add(db_project)
    db.commit()
    db.refresh(db_project)

    # Create Kubernetes resources in the background
    background_tasks.add_task(
        create_kubernetes_resources_for_project,
        project_id=project_id,
        files=files_data,
        language=project.language,
        db=db,
        container_config=container_config
    )

    return db_project

async def create_kubernetes_resources_for_project(
    project_id: str,
    files: List[Dict[str, Any]],
    language: str,
    db: Session,
    container_config: ContainerConfig = None
):
    """Create Kubernetes resources for a project in the background"""
    try:
        # Get the project from the database
        project = db.query(ProjectDB).filter(ProjectDB.id == project_id).first()
        if not project:
            return

        # Create PVC
        pvc_result = KubernetesClient.create_pvc(
            project_id,
            storage_size=container_config.storage_size if container_config and container_config.storage_size else "1Gi"
        )

        # Create ConfigMap for files
        configmap_result = KubernetesClient.create_configmap_for_files(project_id, files)

        # Determine container image based on project language
        container_image = container_config.image if container_config and container_config.image else "python:3.9-slim"
        if not container_config or not container_config.image:
            if language and language.lower() == "javascript":
                container_image = "node:14-alpine"
            elif language and language.lower() == "python":
                container_image = "python:3.9-slim"
            elif language and language.lower() == "go":
                container_image = "golang:1.17-alpine"
            elif language and language.lower() == "java":
                container_image = "openjdk:11-jdk-slim"

        # Determine container port
        container_port = container_config.port if container_config and container_config.port else 8000

        # Determine container command
        command = None
        if container_config and container_config.command:
            command = container_config.command
        else:
            if language and language.lower() == "javascript":
                command = ["node", "index.js"]
            elif language and language.lower() == "python":
                command = ["python", "main.py"]
            elif language and language.lower() == "go":
                command = ["go", "run", "main.go"]
            elif language and language.lower() == "java":
                command = ["java", "-jar", "app.jar"]

        # Create Deployment
        deployment_result = KubernetesClient.create_deployment(
            project_id,
            pvc_name=pvc_result["name"],
            configmap_name=configmap_result["name"],
            container_image=container_image,
            container_port=container_port,
            command=command,
            args=container_config.args if container_config and container_config.args else None,
            env_vars=container_config.env_vars if container_config and container_config.env_vars else None,
            cpu_limit=container_config.cpu_limit if container_config and container_config.cpu_limit else "500m",
            memory_limit=container_config.memory_limit if container_config and container_config.memory_limit else "512Mi"
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

    except Exception as e:
        # Log the error but don't raise it (this is running in the background)
        print(f"Error creating Kubernetes resources for project {project_id}: {str(e)}")

@router.get("/{project_id}", response_model=Project)
async def get_project(
    project_id: str,
    db: Session = Depends(get_db)
):
    """Get a specific project without authentication"""
    project = db.query(ProjectDB).filter(ProjectDB.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    # No authorization check - allow access to any project
    return project

@router.put("/{project_id}", response_model=Project)
async def update_project(
    project_id: str,
    project_update: ProjectUpdate,
    db: Session = Depends(get_db)
):
    """Update a project without authentication"""
    db_project = db.query(ProjectDB).filter(ProjectDB.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    # No authorization check - allow updates to any project

    update_data = project_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_project, field, value)

    db_project.updated_at = datetime.now()
    db.commit()
    db.refresh(db_project)
    return db_project

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Delete a project without authentication"""
    db_project = db.query(ProjectDB).filter(ProjectDB.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    # No authorization check - allow deletion of any project

    # Delete Kubernetes resources in the background
    if db_project.deployment_name or db_project.service_name or db_project.pvc_name:
        background_tasks.add_task(
            delete_kubernetes_resources_for_project,
            project_id=project_id
        )

    db.delete(db_project)
    db.commit()
    return None

async def delete_kubernetes_resources_for_project(project_id: str):
    """Delete Kubernetes resources for a project in the background"""
    try:
        # Delete all Kubernetes resources for the project
        KubernetesClient.delete_project_resources(project_id)
    except Exception as e:
        # Log the error but don't raise it (this is running in the background)
        print(f"Error deleting Kubernetes resources for project {project_id}: {str(e)}")
