from pydantic_settings import BaseSettings, SettingsConfigDict
import os

class Settings(BaseSettings):
    # API settings
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "VibeCode API"
    
    # Server settings
    SERVER_HOST: str = "0.0.0.0"
    SERVER_PORT: str = "8000"
    
    # Security settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # GitHub OAuth settings
    GITHUB_CLIENT_ID: str = os.getenv("GITHUB_CLIENT_ID", "")
    GITHUB_CLIENT_SECRET: str = os.getenv("GITHUB_CLIENT_SECRET", "")
    GITHUB_REDIRECT_URI: str = "http://localhost:3000/github-callback"
    
    # Database settings
    POSTGRES_SERVER: str = os.getenv("POSTGRES_SERVER", "vibecode-new-db")
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "vibecode")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "vibecode")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "vibecode")
    DATABASE_URL: str = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_SERVER}/{POSTGRES_DB}"

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra="allow")

settings = Settings()
