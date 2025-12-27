"""
Device model representing an IoT device (ESP32).

Maps to a ThingsBoard device ID for telemetry and RPC control.
"""

from datetime import datetime
from sqlalchemy import String, Integer, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class Device(Base):
    """
    IoT Device entity (ESP32).
    
    Maps a room to a ThingsBoard device. The device_id is the
    ThingsBoard device UUID used for telemetry and RPC calls.
    
    IMPORTANT: This model does NOT store telemetry data.
    Telemetry is stored in ThingsBoard and retrieved via API.
    """
    __tablename__ = "devices"
    
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    
    # ThingsBoard device ID (UUID)
    device_id: Mapped[str] = mapped_column(
        String(36),
        unique=True,
        index=True,
        nullable=False,
        comment="ThingsBoard device UUID"
    )
    
    # Device type (e.g., "ESP32", "ESP8266")
    device_type: Mapped[str] = mapped_column(String(50), default="ESP32", nullable=False)
    
    # Device status
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    
    # Foreign key to room (one-to-one)
    room_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("rooms.id", ondelete="CASCADE"),
        unique=True,  # Ensures one device per room
        nullable=False,
        index=True
    )
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=True
    )
    
    # Relationships
    room: Mapped["Room"] = relationship("Room", back_populates="device")
    
    def __repr__(self) -> str:
        return f"<Device(id={self.id}, name={self.name}, device_id={self.device_id})>"
