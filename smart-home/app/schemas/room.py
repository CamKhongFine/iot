"""
Pydantic schemas for Room model.
"""

from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class RoomBase(BaseModel):
    """Base room schema"""
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=500)


class RoomCreate(RoomBase):
    """Schema for creating a room"""
    pass


class RoomUpdate(BaseModel):
    """Schema for updating a room (all fields optional)"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=500)


class RoomResponse(RoomBase):
    """Schema for room response"""
    id: int
    home_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)
