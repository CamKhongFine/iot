"""
Pydantic schemas for Home model.
"""

from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class HomeBase(BaseModel):
    """Base home schema"""
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=500)
    address: Optional[str] = Field(None, max_length=500)


class HomeCreate(HomeBase):
    """Schema for creating a home"""
    pass


class HomeUpdate(BaseModel):
    """Schema for updating a home (all fields optional)"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=500)
    address: Optional[str] = Field(None, max_length=500)


class HomeResponse(HomeBase):
    """Schema for home response"""
    id: int
    owner_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)
