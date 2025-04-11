from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from fastapi.responses import RedirectResponse
import httpx
from datetime import datetime, timedelta
from jose import jwt
from typing import Optional

from app.core.config import settings
from app.models.user import User, UserInDB, Token

router = APIRouter(tags=["auth"])

# In-memory user database for demo purposes
# In a real application, you would use a database
fake_users_db = {}


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


@router.get("/auth/github/login")
async def github_login(request: Request):
    """
    Redirect to GitHub OAuth login page
    """
    # Get the host from the request headers
    host = request.headers.get("host", "localhost:8000")
    scheme = request.headers.get("x-forwarded-proto", "http")
    print(f"Login request from host: {host}, scheme: {scheme}")

    # Print all request headers for debugging
    print("Request headers:")
    for header, value in request.headers.items():
        print(f"  {header}: {value}")

    # Print environment variables
    print(f"GITHUB_CLIENT_ID: {settings.GITHUB_CLIENT_ID}")
    print(f"GITHUB_REDIRECT_URI: {settings.GITHUB_REDIRECT_URI}")

    # For the redirect_uri, use the frontend URL
    frontend_host = host
    if host.startswith('localhost:'):
        # If we're on localhost, use port 3000 for the frontend
        frontend_host = 'localhost:3000'

    # Use the frontend callback URL for GitHub
    redirect_uri = f"{scheme}://{frontend_host}/github-callback"

    print(f"GitHub login with client_id: {settings.GITHUB_CLIENT_ID}")
    print(f"Redirect URI: {redirect_uri}")

    github_auth_url = (
        f"https://github.com/login/oauth/authorize"
        f"?client_id={settings.GITHUB_CLIENT_ID}"
        f"&redirect_uri={redirect_uri}"
        f"&scope=user:email"
    )

    print(f"Redirecting to GitHub: {github_auth_url}")
    return RedirectResponse(url=github_auth_url)


@router.get("/auth/github/exchange")
async def github_exchange(code: str, request: Request):
    """
    Exchange GitHub code for access token and return user data
    This endpoint is called by the frontend directly
    """
    # Get the host from the request headers
    host = request.headers.get("host", "localhost:8000")
    scheme = request.headers.get("x-forwarded-proto", "http")
    print(f"Exchange request from host: {host}, scheme: {scheme}")
    print(f"Code from GitHub: {code}")
    print(f"Request headers: {request.headers}")

    # For testing purposes, we'll return a mock response
    # In a real application, you would exchange the code for a token with GitHub
    print("Returning mock response for testing")

    # Mock user data
    user = UserInDB(
        username="testuser",
        email="test@example.com",
        full_name="Test User",
        github_id="12345",
        avatar_url="https://github.com/identicons/testuser.png",
        disabled=False,
    )

    # Store user in our fake database
    fake_users_db[user.username] = user.model_dump()

    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    jwt_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )

    # Return token and user data
    return {
        "access_token": jwt_token,
        "token_type": "bearer",
        "user": {
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name,
            "avatar_url": user.avatar_url
        }
    }


@router.get("/auth/me", response_model=User)
async def get_current_user(token: str):
    """
    Get current user info from token
    """
    print(f"Received token: {token[:10]}...")

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        print(f"Decoded username: {username}")

        if username is None:
            print("Username is None")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
            )
    except jwt.JWTError as e:
        print(f"JWT Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )

    user = fake_users_db.get(username)
    print(f"User found: {user is not None}")

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    # Create a response with the user data
    response = User(**user)

    return response
