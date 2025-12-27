"""
User router.
"""

from fastapi import APIRouter, status

from app.dependencies import DatabaseSession, CurrentUser
from app.services.user_service import UserService
from app.schemas.user import UserUpdate, UserResponse

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserResponse)
async def get_my_profile(current_user: CurrentUser):
    """
    Get current user profile.
    
    Requires authentication.
    """
    return current_user


@router.put("/me", response_model=UserResponse)
async def update_my_profile(
    user_data: UserUpdate,
    current_user: CurrentUser,
    db: DatabaseSession
):
    """
    Update current user profile.
    
    - **email**: New email (must be unique)
    - **username**: New username (must be unique)
    - **full_name**: New full name
    - **password**: New password (minimum 8 characters)
    
    All fields are optional.
    """
    service = UserService(db)
    user = await service.update_user(current_user.id, user_data)
    return user


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_my_account(
    current_user: CurrentUser,
    db: DatabaseSession
):
    """
    Delete current user account.
    
    This action is irreversible and will delete all associated homes, rooms, and devices.
    """
    service = UserService(db)
    await service.delete_user(current_user.id)
