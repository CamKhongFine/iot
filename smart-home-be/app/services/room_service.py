"""
Room service for business logic.
"""

from typing import List
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.room_repository import RoomRepository
from app.repositories.home_repository import HomeRepository
from app.schemas.room import RoomCreate, RoomUpdate, RoomResponse


class RoomService:
    """Service for room business logic"""
    
    def __init__(self, db: AsyncSession):
        self.repository = RoomRepository(db)
        self.home_repository = HomeRepository(db)
    
    async def create_room(self, room_data: RoomCreate, home_id: int) -> RoomResponse:
        """
        Create a new room.
        
        Raises:
            HTTPException: If home not found
        """
        # Verify home exists
        home = await self.home_repository.get_by_id(home_id)
        if not home:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Home not found"
            )
        
        room = await self.repository.create(room_data, home_id)
        return RoomResponse.model_validate(room)
    
    async def get_room(self, room_id: int) -> RoomResponse:
        """
        Get room by ID.
        
        Raises:
            HTTPException: If room not found
        """
        room = await self.repository.get_by_id(room_id)
        if not room:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Room not found"
            )
        
        return RoomResponse.model_validate(room)
    
    async def list_home_rooms(self, home_id: int, skip: int = 0, limit: int = 100) -> List[RoomResponse]:
        """List rooms in a home"""
        rooms = await self.repository.list_by_home(home_id, skip, limit)
        return [RoomResponse.model_validate(room) for room in rooms]
    
    async def update_room(self, room_id: int, room_data: RoomUpdate) -> RoomResponse:
        """
        Update room.
        
        Raises:
            HTTPException: If room not found
        """
        room = await self.repository.update(room_id, room_data)
        if not room:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Room not found"
            )
        
        return RoomResponse.model_validate(room)
    
    async def delete_room(self, room_id: int) -> None:
        """
        Delete room.
        
        Raises:
            HTTPException: If room not found
        """
        deleted = await self.repository.delete(room_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Room not found"
            )
    
    async def verify_home_ownership(self, room_id: int, user_id: int) -> None:
        """
        Verify that a user owns the home that contains this room.
        
        Raises:
            HTTPException: If room not found or user doesn't own the home
        """
        room = await self.repository.get_by_id(room_id)
        if not room:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Room not found"
            )
        
        home = await self.home_repository.get_by_id(room.home_id)
        if not home or home.owner_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to access this room"
            )
