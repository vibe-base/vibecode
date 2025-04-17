from sqlalchemy import Column, String, DateTime, ForeignKey, Table, ARRAY, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String)
    language = Column(String)
    repository_url = Column(String)
    owner_id = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    members = Column(ARRAY(String), default=[])
    files = Column(JSON, default=[])  # Store files as JSON
    status = Column(String, default="active")
    tags = Column(ARRAY(String), default=[])
