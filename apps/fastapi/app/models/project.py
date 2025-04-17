from sqlalchemy import Column, String, DateTime, ForeignKey, Table, ARRAY, JSON, Boolean
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

    # Kubernetes resource information
    deployment_name = Column(String)  # Name of the Kubernetes deployment
    service_name = Column(String)     # Name of the Kubernetes service
    pvc_name = Column(String)         # Name of the Persistent Volume Claim
    container_running = Column(Boolean, default=False)  # Whether the container is running
    container_status = Column(String)  # Status of the container (e.g., "Running", "Pending", "Failed")
    container_created_at = Column(DateTime)  # When the container was created
    container_last_started_at = Column(DateTime)  # When the container was last started
    container_image = Column(String)  # The container image being used
    container_port = Column(String)   # The port the container is exposing
    k8s_resources = Column(JSON, default={})  # Additional Kubernetes resource information as JSON
