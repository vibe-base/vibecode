from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.project import Project
from app.core.init_db import init_db
from app.core.auth import get_current_user, create_access_token
from app.models.user import User
from app.routers import auth, test, projects, containers, test_containers, proxy_test_containers, mock_containers, exact_proxy_containers
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta

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

# Include routers
app.include_router(auth.router)
app.include_router(test.router)
app.include_router(projects.router)
app.include_router(containers.router)
app.include_router(test_containers.router)
app.include_router(proxy_test_containers.router)
app.include_router(mock_containers.router)
app.include_router(exact_proxy_containers.router)

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    init_db()

class File(BaseModel):
    name: str
    content: str
    language: str

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    language: str
    files: List[File] = []

@app.post("/api/projects")
async def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db)
):
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

        # Create new project
        new_project = Project(
            id=f"project-{datetime.now().timestamp()}",
            name=project.name,
            description=project.description,
            language=project.language,
            owner_id=user.id,
            files=[file.dict() for file in project.files],
            created_at=datetime.now(),
            updated_at=datetime.now()
        )

        # Add to database
        db.add(new_project)
        db.commit()
        db.refresh(new_project)

        return new_project
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/projects/create-no-auth")
async def create_project_no_auth(
    project: ProjectCreate,
    db: Session = Depends(get_db)
):
    try:
        # Create a mock user for testing
        mock_user = User(
            id="mock-user-id",
            username="mock_user",
            email="mock@example.com",
            full_name="Mock User",
            avatar_url="",
            provider="mock",
            is_active=True,
            is_admin=True
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
        new_project = Project(
            id=f"project-{datetime.now().timestamp()}",
            name=project.name,
            description=project.description,
            language=project.language,
            owner_id=user.id,
            files=[file.dict() for file in project.files],
            created_at=datetime.now(),
            updated_at=datetime.now()
        )

        # Add to database
        db.add(new_project)
        db.commit()
        db.refresh(new_project)

        return new_project
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/projects/create-test")
async def create_test_project(db: Session = Depends(get_db)):
    """Test endpoint to create a project without authentication"""
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
        new_project = Project(
            id=f"project-{datetime.now().timestamp()}",
            name="Test Project",
            description="A test project created via API",
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

        return new_project
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/fastapi/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/fastapi/projects")
async def get_all_projects(db: Session = Depends(get_db)):
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
        projects = db.query(Project).all()
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
                "created_at": datetime.now(),
                "updated_at": datetime.now()
            },
            {
                "id": "project-2",
                "name": "Project 2",
                "description": "Another project",
                "language": "JavaScript",
                "owner_id": "mock-user-id",
                "created_at": datetime.now(),
                "updated_at": datetime.now()
            }
        ]

@app.post("/api/fastapi/auth/token")
async def get_token():
    # Create a mock token for testing
    token = create_access_token(
        data={
            "id": "mock-user-id",
            "username": "mock_user",
            "email": "mock@example.com",
            "full_name": "Mock User",
            "provider": "mock"
        },
        expires_delta=timedelta(days=7)
    )
    return {"access_token": token, "token_type": "bearer"}

@app.post("/api/fastapi/projects")
async def create_project_no_auth(
    project: ProjectCreate,
    db: Session = Depends(get_db)
):
    """Create a new project without authentication"""
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

        # Create new project
        new_project = Project(
            id=f"project-{datetime.now().timestamp()}",
            name=project.name,
            description=project.description,
            language=project.language,
            owner_id=user.id,
            files=[file.dict() for file in project.files],
            created_at=datetime.now(),
            updated_at=datetime.now()
        )

        # Add to database
        db.add(new_project)
        db.commit()
        db.refresh(new_project)

        return new_project
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/test/create-project")
async def test_create_project(db: Session = Depends(get_db)):
    """Test endpoint to create a project without authentication"""
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
        new_project = Project(
            id=f"project-{datetime.now().timestamp()}",
            name="Test Project",
            description="A test project created via API",
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

        return new_project
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/projects/test")
async def test_projects_endpoint():
    """Test endpoint that doesn't require authentication"""
    return [
        {
            "id": "test-project-1",
            "name": "Test Project 1",
            "description": "This is a test project",
            "created_at": "2023-01-01T00:00:00",
            "updated_at": "2023-01-01T00:00:00",
            "language": "Python"
        },
        {
            "id": "test-project-2",
            "name": "Test Project 2",
            "description": "Another test project",
            "created_at": "2023-01-02T00:00:00",
            "updated_at": "2023-01-02T00:00:00",
            "language": "JavaScript"
        }
    ]

@app.post("/api/projects/test-create")
async def test_create_project_no_auth(db: Session = Depends(get_db)):
    """Test endpoint to create a project without authentication"""
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
        new_project = Project(
            id=f"project-{datetime.now().timestamp()}",
            name="Test Project",
            description="A test project created via API",
            language="Python",
            owner_id=user.id,
            files=[{
                "name": "main.py",
                "content": "print('Hello, World!')",
                "language": "python"
            }],
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )

        # Add to database
        db.add(new_project)
        db.commit()
        db.refresh(new_project)

        return new_project
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/projects")
async def get_projects(
    db: Session = Depends(get_db)
):
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

    # Get all projects for this user
    projects = db.query(Project).filter(Project.owner_id == user.id).all()
    return projects

@app.get("/api/projects/{project_id}")
async def get_project(
    project_id: str,
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    # No authorization check - allow access to any project
    return project
