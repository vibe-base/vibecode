from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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

@app.get("/api/fastapi/health")
async def health_check():
    return {"status": "ok"}

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

@app.get("/api/projects")
async def list_projects():
    """List all projects"""
    return [
        {
            "id": "project-1",
            "name": "Project 1",
            "description": "This is a project",
            "created_at": "2023-01-01T00:00:00",
            "updated_at": "2023-01-01T00:00:00",
            "language": "Python"
        },
        {
            "id": "project-2",
            "name": "Project 2",
            "description": "Another project",
            "created_at": "2023-01-02T00:00:00",
            "updated_at": "2023-01-02T00:00:00",
            "language": "JavaScript"
        }
    ]
