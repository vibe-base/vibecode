from pydantic import BaseModel
from typing import Optional
import os
from dotenv import load_dotenv
import pathlib

# Load environment variables from .env file
dotenv_path = pathlib.Path(__file__).parent.parent.parent / ".env"
load_dotenv(dotenv_path=dotenv_path)

# Print the path to the .env file
print(f"Loading .env file from: {dotenv_path}")

# Print the environment variables
print(f"GITHUB_CLIENT_ID from env: {os.getenv('GITHUB_CLIENT_ID')}")
print(f"GITHUB_REDIRECT_URI from env: {os.getenv('GITHUB_REDIRECT_URI')}")

class Settings(BaseModel):
    # Server settings
    SERVER_HOST: str = os.getenv("SERVER_HOST", "0.0.0.0")
    SERVER_PORT: int = int(os.getenv("SERVER_PORT", "8000"))

    # GitHub OAuth settings
    # These values are hardcoded for testing
    GITHUB_CLIENT_ID: str = "Iv23liWkm8qUlFlLAXKe"  # Your actual GitHub client ID
    GITHUB_CLIENT_SECRET: str = "your_github_client_secret"  # Your actual GitHub client secret
    GITHUB_REDIRECT_URI: str = "http://localhost:3000/github-callback"

    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your_secret_key_for_jwt_tokens")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))


settings = Settings()
