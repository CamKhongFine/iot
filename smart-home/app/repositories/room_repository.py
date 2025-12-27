"""
Room repository for database operations.
"""

from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.room import Room
from app.schemas.room import RoomCreate, RoomUpdate


class RoomRepository:
    """Repository for Room model database operations"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create(self, room_data: RoomCreate, home_id: int) -> Room:
        """
        Create a new room.
        
        Args:
            room_data: Room creation data
            home_id: Home ID
            
        Returns:
            Created room
        """
        db_room = Room(
            name=room_data.name,
            description=room_data.description,
            home_id=home_id
        )
        
        self.db.add(db_room)
        await self.db.flush()
        await self.db.refresh(db_room)
        
        return db_room
    
    async def get_by_id(self, room_id: int) -> Optional[Room]:
        """Get room by ID"""
        result = await self.db.execute(
            select(Room).where(Room.id == room_id)
        )
        return result.scalar_one_or_none()
    
    async def list_by_home(self, home_id: int, skip: int = 0, limit: int = 100) -> List[Room]:
        """List rooms in a home"""
        result = await self.db.execute(
            select(Room)
            .where(Room.home_id == home_id)
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())
    
    async def update(self, room_id: int, room_data: RoomUpdate) -> Optional[Room]:
        """
        Update room.
        
        Returns:
            Updated room or None if not found
        """
        room = await self.get_by_id(room_id)
        if not room:
            return None
        
        # Update fields if provided
        if room_data.name is not None:
            room.name = room_data.name
        if room_data.description is not None:
            room.description = room_data.description
        
        await self.db.flush()
        await self.db.refresh(room)
        
        return room
    
    async def delete(self, room_id: int) -> bool:
        """
        Delete room.
        
        Returns:
            True if deleted, False if not found
        """
        room = await self.get_by_id(room_id)
        if not room:
            return False
        
        await self.db.delete(room)
        await self.db.flush()
        
        return True
