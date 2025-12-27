"""
Pydantic schemas for Device model.
"""

from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class DeviceBase(BaseModel):
    """Base device schema"""
    name: str = Field(..., min_length=1, max_length=255)
    device_type: str = Field(default="ESP32", max_length=50)


class DeviceCreate(DeviceBase):
    """Schema for creating/linking a device"""
    device_id: str = Field(..., min_length=36, max_length=36, description="ThingsBoard device UUID")


class DeviceUpdate(BaseModel):
    """Schema for updating a device (all fields optional)"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    device_type: Optional[str] = Field(None, max_length=50)
    is_active: Optional[bool] = None


class DeviceResponse(DeviceBase):
    """Schema for device response"""
    id: int
    device_id: str = Field(..., description="ThingsBoard device UUID")
    is_active: bool
    room_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)
