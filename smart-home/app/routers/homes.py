"""
Home router.
"""

from typing import List
from fastapi import APIRouter, status

from app.dependencies import DatabaseSession, CurrentUser
from app.services.home_service import HomeService
from app.schemas.home import HomeCreate, HomeUpdate, HomeResponse

router = APIRouter(prefix="/homes", tags=["Homes"])


@router.post("", response_model=HomeResponse, status_code=status.HTTP_201_CREATED)
async def create_home(
    home_data: HomeCreate,
    current_user: CurrentUser,
    db: DatabaseSession
):
    """
    Create a new home.
    
    - **name**: Home name (required)
    - **description**: Optional description
    - **address**: Optional address
    
    The authenticated user becomes the owner.
    """
    service = HomeService(db)
    home = await service.create_home(home_data, current_user.id)
    return home


@router.get("", response_model=List[HomeResponse])
async def list_my_homes(
    current_user: CurrentUser,
    db: DatabaseSession,
    skip: int = 0,
    limit: int = 100
):
    """
    List all homes owned by the current user.
    
    - **skip**: Number of records to skip (pagination)
    - **limit**: Maximum number of records to return
    """
    service = HomeService(db)
    homes = await service.list_user_homes(current_user.id, skip, limit)
    return homes


@router.get("/{home_id}", response_model=HomeResponse)
async def get_home(
    home_id: int,
    current_user: CurrentUser,
    db: DatabaseSession
):
    """
    Get a specific home by ID.
    
    User must be the owner of the home.
    """
    service = HomeService(db)
    
    # Verify ownership
    await service.verify_ownership(home_id, current_user.id)
    
    home = await service.get_home(home_id)
    return home


@router.put("/{home_id}", response_model=HomeResponse)
async def update_home(
    home_id: int,
    home_data: HomeUpdate,
    current_user: CurrentUser,
    db: DatabaseSession
):
    """
    Update a home.
    
    User must be the owner of the home.
    All fields are optional.
    """
    service = HomeService(db)
    
    # Verify ownership
    await service.verify_ownership(home_id, current_user.id)
    
    home = await service.update_home(home_id, home_data)
    return home


@router.delete("/{home_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_home(
    home_id: int,
    current_user: CurrentUser,
    db: DatabaseSession
):
    """
    Delete a home.
    
    User must be the owner of the home.
    This will also delete all rooms and devices in the home.
    """
    service = HomeService(db)
    
    # Verify ownership
    await service.verify_ownership(home_id, current_user.id)
    
    await service.delete_home(home_id)
