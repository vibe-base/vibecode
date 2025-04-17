from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    language: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    language: Optional[str] = None
    members: Optional[List[str]] = None

class Project(ProjectBase):
    id: str
    owner_id: str
    members: List[str]
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True
