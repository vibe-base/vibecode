from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.project import Project
from app.models.user import User
from datetime import datetime

router = APIRouter(prefix="/api/test", tags=["test"])

@router.post("/create-project")
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
