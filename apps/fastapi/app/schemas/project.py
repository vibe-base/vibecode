from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class FileSchema(BaseModel):
    name: str
    content: str
    language: Optional[str] = None

class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    language: Optional[str] = None

class ProjectCreate(ProjectBase):
    files: Optional[List[FileSchema]] = Field(default_factory=list)

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    language: Optional[str] = None
    members: Optional[List[str]] = None
    files: Optional[List[FileSchema]] = None

class ContainerConfig(BaseModel):
    image: Optional[str] = None
    port: Optional[int] = None
    command: Optional[List[str]] = None
    args: Optional[List[str]] = None
    env_vars: Optional[List[Dict[str, str]]] = None
    cpu_limit: Optional[str] = None
    memory_limit: Optional[str] = None
    storage_size: Optional[str] = None

class KubernetesResourceInfo(BaseModel):
    deployment_name: Optional[str] = None
    service_name: Optional[str] = None
    pvc_name: Optional[str] = None
    container_running: Optional[bool] = False
    container_status: Optional[str] = None
    container_created_at: Optional[datetime] = None
    container_last_started_at: Optional[datetime] = None
    container_image: Optional[str] = None
    container_port: Optional[str] = None
    k8s_resources: Optional[Dict[str, Any]] = None

class Project(ProjectBase):
    id: str
    owner_id: str
    members: List[str]
    created_at: datetime
    updated_at: Optional[datetime] = None
    files: Optional[List[Dict[str, Any]]] = None
    status: Optional[str] = None
    tags: Optional[List[str]] = None

    # Kubernetes resource information
    deployment_name: Optional[str] = None
    service_name: Optional[str] = None
    pvc_name: Optional[str] = None
    container_running: Optional[bool] = False
    container_status: Optional[str] = None
    container_created_at: Optional[datetime] = None
    container_last_started_at: Optional[datetime] = None
    container_image: Optional[str] = None
    container_port: Optional[str] = None
    k8s_resources: Optional[Dict[str, Any]] = None

    class Config:
        orm_mode = True

class ContainerAction(BaseModel):
    action: str = Field(..., description="Action to perform: 'start', 'stop', 'restart', 'logs'")
    tail_lines: Optional[int] = Field(100, description="Number of log lines to return when action is 'logs'")

class ContainerActionResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None
    logs: Optional[str] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now())
