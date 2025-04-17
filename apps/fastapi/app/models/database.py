from sqlalchemy import Column, String, DateTime, ForeignKey, Table, ARRAY
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

# Project model has been moved to project.py