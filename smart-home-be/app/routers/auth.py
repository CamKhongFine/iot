"""
Authentication router.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from app.dependencies import DatabaseSession, CurrentUser
from app.services.user_service import UserService
from app.schemas.auth import LoginRequest, TokenResponse
from app.schemas.user import UserCreate, UserResponse
from app.core.security import create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserCreate,
    db: DatabaseSession
):
    """
    Register a new user.
    
    - **email**: Valid email address
    - **username**: Unique username (3-100 characters)
    - **password**: Password (minimum 8 characters)
    - **full_name**: Optional full name
    """
    service = UserService(db)
    user = await service.create_user(user_data)
    return user


@router.post("/login", response_model=TokenResponse)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: DatabaseSession = Depends()
):
    """
    Login with email and password to get access token.
    
    - **username**: Email address (OAuth2 spec uses 'username' field)
    - **password**: User password
    
    Returns JWT access token for authentication.
    """
    service = UserService(db)
    
    # Authenticate user (form_data.username contains email)
    user = await service.authenticate(form_data.username, form_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return TokenResponse(access_token=access_token)


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: CurrentUser):
    """
    Get current authenticated user information.
    
    Requires authentication token.
    """
    return current_user
