"""
Room router.
"""

from typing import List
from fastapi import APIRouter, status

from app.dependencies import DatabaseSession, CurrentUser
from app.services.room_service import RoomService
from app.services.home_service import HomeService
from app.schemas.room import RoomCreate, RoomUpdate, RoomResponse

router = APIRouter(tags=["Rooms"])


@router.post("/homes/{home_id}/rooms", response_model=RoomResponse, status_code=status.HTTP_201_CREATED)
async def create_room(
    home_id: int,
    room_data: RoomCreate,
    current_user: CurrentUser,
    db: DatabaseSession
):
    """
    Create a new room in a home.
    
    - **name**: Room name (required)
    - **description**: Optional description
    
    User must own the home.
    """
    # Verify home ownership
    home_service = HomeService(db)
    await home_service.verify_ownership(home_id, current_user.id)
    
    # Create room
    room_service = RoomService(db)
    room = await room_service.create_room(room_data, home_id)
    return room


@router.get("/homes/{home_id}/rooms", response_model=List[RoomResponse])
async def list_home_rooms(
    home_id: int,
    current_user: CurrentUser,
    db: DatabaseSession,
    skip: int = 0,
    limit: int = 100
):
    """
    List all rooms in a home.
    
    User must own the home.
    """
    # Verify home ownership
    home_service = HomeService(db)
    await home_service.verify_ownership(home_id, current_user.id)
    
    # List rooms
    room_service = RoomService(db)
    rooms = await room_service.list_home_rooms(home_id, skip, limit)
    return rooms


@router.get("/rooms/{room_id}", response_model=RoomResponse)
async def get_room(
    room_id: int,
    current_user: CurrentUser,
    db: DatabaseSession
):
    """
    Get a specific room by ID.
    
    User must own the home that contains this room.
    """
    service = RoomService(db)
    
    # Verify home ownership
    await service.verify_home_ownership(room_id, current_user.id)
    
    room = await service.get_room(room_id)
    return room


@router.put("/rooms/{room_id}", response_model=RoomResponse)
async def update_room(
    room_id: int,
    room_data: RoomUpdate,
    current_user: CurrentUser,
    db: DatabaseSession
):
    """
    Update a room.
    
    User must own the home that contains this room.
    All fields are optional.
    """
    service = RoomService(db)
    
    # Verify home ownership
    await service.verify_home_ownership(room_id, current_user.id)
    
    room = await service.update_room(room_id, room_data)
    return room


@router.delete("/rooms/{room_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_room(
    room_id: int,
    current_user: CurrentUser,
    db: DatabaseSession
):
    """
    Delete a room.
    
    User must own the home that contains this room.
    This will also delete the device linked to this room.
    """
    service = RoomService(db)
    
    # Verify home ownership
    await service.verify_home_ownership(room_id, current_user.id)
    
    await service.delete_room(room_id)
