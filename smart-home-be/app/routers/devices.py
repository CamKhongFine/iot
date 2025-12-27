"""
Device router.
"""

from typing import Optional
from fastapi import APIRouter, status

from app.dependencies import DatabaseSession, CurrentUser
from app.services.device_service import DeviceService
from app.services.room_service import RoomService
from app.schemas.device import DeviceCreate, DeviceUpdate, DeviceResponse

router = APIRouter(tags=["Devices"])


@router.post("/rooms/{room_id}/device", response_model=DeviceResponse, status_code=status.HTTP_201_CREATED)
async def link_device_to_room(
    room_id: int,
    device_data: DeviceCreate,
    current_user: CurrentUser,
    db: DatabaseSession
):
    """
    Link a ThingsBoard device to a room.
    
    - **name**: Device name
    - **device_id**: ThingsBoard device UUID (36 characters)
    - **device_type**: Device type (default: "ESP32")
    
    User must own the home that contains this room.
    Each room can only have one device.
    """
    # Verify home ownership
    room_service = RoomService(db)
    await room_service.verify_home_ownership(room_id, current_user.id)
    
    # Link device
    device_service = DeviceService(db)
    device = await device_service.create_device(device_data, room_id)
    return device


@router.get("/rooms/{room_id}/device", response_model=Optional[DeviceResponse])
async def get_room_device(
    room_id: int,
    current_user: CurrentUser,
    db: DatabaseSession
):
    """
    Get the device linked to a room.
    
    User must own the home that contains this room.
    Returns null if no device is linked.
    """
    # Verify home ownership
    room_service = RoomService(db)
    await room_service.verify_home_ownership(room_id, current_user.id)
    
    # Get device
    device_service = DeviceService(db)
    device = await device_service.get_room_device(room_id)
    return device


@router.get("/devices/{device_id}", response_model=DeviceResponse)
async def get_device(
    device_id: int,
    current_user: CurrentUser,
    db: DatabaseSession
):
    """
    Get a specific device by ID.
    
    User must own the home that contains the room with this device.
    """
    device_service = DeviceService(db)
    device = await device_service.get_device(device_id)
    
    # Verify home ownership through room
    room_service = RoomService(db)
    await room_service.verify_home_ownership(device.room_id, current_user.id)
    
    return device


@router.put("/devices/{device_id}", response_model=DeviceResponse)
async def update_device(
    device_id: int,
    device_data: DeviceUpdate,
    current_user: CurrentUser,
    db: DatabaseSession
):
    """
    Update a device.
    
    User must own the home that contains the room with this device.
    All fields are optional.
    """
    device_service = DeviceService(db)
    device = await device_service.get_device(device_id)
    
    # Verify home ownership through room
    room_service = RoomService(db)
    await room_service.verify_home_ownership(device.room_id, current_user.id)
    
    # Update device
    device = await device_service.update_device(device_id, device_data)
    return device


@router.delete("/devices/{device_id}", status_code=status.HTTP_204_NO_CONTENT)
async def unlink_device(
    device_id: int,
    current_user: CurrentUser,
    db: DatabaseSession
):
    """
    Unlink a device from its room.
    
    User must own the home that contains the room with this device.
    """
    device_service = DeviceService(db)
    device = await device_service.get_device(device_id)
    
    # Verify home ownership through room
    room_service = RoomService(db)
    await room_service.verify_home_ownership(device.room_id, current_user.id)
    
    # Delete device
    await device_service.delete_device(device_id)
