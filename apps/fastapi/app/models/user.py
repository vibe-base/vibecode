from pydantic import BaseModel
from typing import Optional


class Token(BaseModel):
    access_token: str
    token_type: str


class User(BaseModel):
    username: str
    email: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    disabled: Optional[bool] = None


class UserInDB(User):
    github_id: str
