"""
Device service for business logic.
"""

from typing import Optional
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.device_repository import DeviceRepository
from app.repositories.room_repository import RoomRepository
from app.schemas.device import DeviceCreate, DeviceUpdate, DeviceResponse


class DeviceService:
    """Service for device business logic"""
    
    def __init__(self, db: AsyncSession):
        self.repository = DeviceRepository(db)
        self.room_repository = RoomRepository(db)
    
    async def create_device(self, device_data: DeviceCreate, room_id: int) -> DeviceResponse:
        """
        Create/link a device to a room.
        
        Raises:
            HTTPException: If room not found, room already has device, or ThingsBoard ID already used
        """
        # Verify room exists
        room = await self.room_repository.get_by_id(room_id)
        if not room:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Room not found"
            )
        
        # Check if room already has a device (one-to-one)
        existing_device = await self.repository.get_by_room(room_id)
        if existing_device:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Room already has a device"
            )
        
        # Check if ThingsBoard device ID is already used
        existing_tb_device = await self.repository.get_by_thingsboard_id(device_data.device_id)
        if existing_tb_device:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="ThingsBoard device ID already linked to another room"
            )
        
        device = await self.repository.create(device_data, room_id)
        return DeviceResponse.model_validate(device)
    
    async def get_device(self, device_id: int) -> DeviceResponse:
        """
        Get device by ID.
        
        Raises:
            HTTPException: If device not found
        """
        device = await self.repository.get_by_id(device_id)
        if not device:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Device not found"
            )
        
        return DeviceResponse.model_validate(device)
    
    async def get_room_device(self, room_id: int) -> Optional[DeviceResponse]:
        """
        Get device for a room.
        
        Returns:
            Device if found, None otherwise
        """
        device = await self.repository.get_by_room(room_id)
        if not device:
            return None
        
        return DeviceResponse.model_validate(device)
    
    async def update_device(self, device_id: int, device_data: DeviceUpdate) -> DeviceResponse:
        """
        Update device.
        
        Raises:
            HTTPException: If device not found
        """
        device = await self.repository.update(device_id, device_data)
        if not device:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Device not found"
            )
        
        return DeviceResponse.model_validate(device)
    
    async def delete_device(self, device_id: int) -> None:
        """
        Delete/unlink device.
        
        Raises:
            HTTPException: If device not found
        """
        deleted = await self.repository.delete(device_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Device not found"
            )
