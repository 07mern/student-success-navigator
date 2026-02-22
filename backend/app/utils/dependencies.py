from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.core.security import decode_access_token
from app.models.user import UserModel
from app.schemas.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    """
    Get current authenticated user from JWT token.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
    
    username: str = payload.get("sub")
    if username is None:
        raise credentials_exception
    
    user = await UserModel.get_by_username(username)
    if user is None:
        raise credentials_exception
    
    return User(
        id=user["_id"],
        username=user["username"],
        email=user["email"],
        full_name=user.get("full_name"),
        is_active=user["is_active"],
        created_at=user["created_at"]
    )


async def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """
    Get current active user.
    """
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user
