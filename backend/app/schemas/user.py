from pydantic import BaseModel, Field
from typing import Optional


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    username: Optional[str] = None


class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: str
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    username: str
    password: str


class UserInDB(UserBase):
    id: str
    hashed_password: str
    is_active: bool = True
    created_at: str


class User(UserBase):
    id: str
    is_active: bool = True
    created_at: str
    
    class Config:
        from_attributes = True
