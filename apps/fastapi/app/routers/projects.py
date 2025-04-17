from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid
from datetime import datetime
from app.core.auth import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.models.project import Project as ProjectDB
from app.schemas.project import Project, ProjectCreate, ProjectUpdate

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
    db: Session = Depends(get_db)
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

    # Create new project
    db_project = ProjectDB(
        id=str(uuid.uuid4()),
        owner_id=user.id,
        members=[user.id],
        **project.dict()
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

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
    db: Session = Depends(get_db)
):
    """Delete a project without authentication"""
    db_project = db.query(ProjectDB).filter(ProjectDB.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    # No authorization check - allow deletion of any project

    db.delete(db_project)
    db.commit()
    return None
