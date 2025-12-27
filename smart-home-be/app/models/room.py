"""
Room model representing a room within a home.

Each room has exactly one IoT device (ESP32).
"""

from datetime import datetime
from sqlalchemy import String, Integer, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class Room(Base):
    """
    Room entity.
    
    Represents a room within a home. Each room has exactly one
    IoT device (ESP32) for controlling lights and monitoring conditions.
    """
    __tablename__ = "rooms"
    
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(String(500), nullable=True)
    
    # Foreign key to home
    home_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("homes.id", ondelete="CASCADE"),
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
    home: Mapped["Home"] = relationship("Home", back_populates="rooms")
    device: Mapped["Device"] = relationship(
        "Device",
        back_populates="room",
        uselist=False,  # One-to-one relationship
        cascade="all, delete-orphan"
    )
    
    def __repr__(self) -> str:
        return f"<Room(id={self.id}, name={self.name}, home_id={self.home_id})>"
