from datetime import timedelta
from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.user import UserCreate, User, Token, UserLogin
from app.models.user import UserModel
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.config import settings

router = APIRouter()


@router.post("/register", response_model=User, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserCreate):
    """
    Register a new user.
    """
    # Check if username already exists
    existing_user = await UserModel.get_by_username(user_in.username)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Check if email already exists
    existing_email = await UserModel.get_by_email(user_in.email)
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user
    user_data = {
        "username": user_in.username,
        "email": user_in.email,
        "full_name": user_in.full_name,
        "hashed_password": get_password_hash(user_in.password)
    }
    
    created_user = await UserModel.create(user_data)
    
    return User(
        id=created_user["_id"],
        username=created_user["username"],
        email=created_user["email"],
        full_name=created_user.get("full_name"),
        is_active=created_user["is_active"],
        created_at=created_user["created_at"]
    )


@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Login and get access token.
    """
    # Get user
    user = await UserModel.get_by_username(form_data.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify password
    if not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is active
    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]},
        expires_delta=access_token_expires
    )
    
    return Token(access_token=access_token, token_type="bearer")


@router.post("/login/json", response_model=Token)
async def login_json(user_in: UserLogin):
    """
    Login with JSON payload (alternative to form data).
    """
    # Get user
    user = await UserModel.get_by_username(user_in.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify password
    if not verify_password(user_in.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is active
    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]},
        expires_delta=access_token_expires
    )
    
    return Token(access_token=access_token, token_type="bearer")
