"""
Device repository for database operations.
"""

from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.device import Device
from app.schemas.device import DeviceCreate, DeviceUpdate


class DeviceRepository:
    """Repository for Device model database operations"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create(self, device_data: DeviceCreate, room_id: int) -> Device:
        """
        Create/link a new device.
        
        Args:
            device_data: Device creation data
            room_id: Room ID
            
        Returns:
            Created device
        """
        db_device = Device(
            name=device_data.name,
            device_id=device_data.device_id,
            device_type=device_data.device_type,
            room_id=room_id
        )
        
        self.db.add(db_device)
        await self.db.flush()
        await self.db.refresh(db_device)
        
        return db_device
    
    async def get_by_id(self, device_id: int) -> Optional[Device]:
        """Get device by internal ID"""
        result = await self.db.execute(
            select(Device).where(Device.id == device_id)
        )
        return result.scalar_one_or_none()
    
    async def get_by_room(self, room_id: int) -> Optional[Device]:
        """Get device by room ID (one-to-one relationship)"""
        result = await self.db.execute(
            select(Device).where(Device.room_id == room_id)
        )
        return result.scalar_one_or_none()
    
    async def get_by_thingsboard_id(self, tb_device_id: str) -> Optional[Device]:
        """Get device by ThingsBoard device ID"""
        result = await self.db.execute(
            select(Device).where(Device.device_id == tb_device_id)
        )
        return result.scalar_one_or_none()
    
    async def update(self, device_id: int, device_data: DeviceUpdate) -> Optional[Device]:
        """
        Update device.
        
        Returns:
            Updated device or None if not found
        """
        device = await self.get_by_id(device_id)
        if not device:
            return None
        
        # Update fields if provided
        if device_data.name is not None:
            device.name = device_data.name
        if device_data.device_type is not None:
            device.device_type = device_data.device_type
        if device_data.is_active is not None:
            device.is_active = device_data.is_active
        
        await self.db.flush()
        await self.db.refresh(device)
        
        return device
    
    async def delete(self, device_id: int) -> bool:
        """
        Delete/unlink device.
        
        Returns:
            True if deleted, False if not found
        """
        device = await self.get_by_id(device_id)
        if not device:
            return False
        
        await self.db.delete(device)
        await self.db.flush()
        
        return True
