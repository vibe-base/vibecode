from sqlalchemy import create_engine
from app.core.database import Base
from app.core.config import settings
from app.models.project import Project

def init_db():
    # Create tables
    engine = create_engine(settings.DATABASE_URL)
    Base.metadata.create_all(bind=engine)
    
    # Add initial data if needed
    from sqlalchemy.orm import Session
    from datetime import datetime
    
    db = Session(engine)
    
    # Check if we already have projects
    if not db.query(Project).first():
        # Add initial projects
        initial_projects = [
            Project(
                id="project-1",
                name="Project 1",
                description="This is a project",
                language="Python",
                owner_id="user-123",
                files=[
                    {
                        "name": "main.py",
                        "content": "print('Hello, World!')",
                        "language": "python"
                    }
                ]
            ),
            Project(
                id="project-2",
                name="Project 2",
                description="Another project",
                language="JavaScript",
                owner_id="user-123",
                files=[
                    {
                        "name": "index.js",
                        "content": "console.log('Hello, World!');",
                        "language": "javascript"
                    }
                ]
            )
        ]
        
        for project in initial_projects:
            db.add(project)
        
        db.commit()
    
    db.close() 