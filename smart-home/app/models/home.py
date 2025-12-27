"""
Home model representing a physical home/house.

A home is owned by a user and contains multiple rooms.
"""

from datetime import datetime
from sqlalchemy import String, Integer, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class Home(Base):
    """
    Home entity.
    
    Represents a physical home/house that contains multiple rooms.
    Each home is owned by one user but can have multiple members.
    """
    __tablename__ = "homes"
    
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(String(500), nullable=True)
    address: Mapped[str] = mapped_column(String(500), nullable=True)
    
    # Foreign key to owner
    owner_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
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
    owner: Mapped["User"] = relationship("User", back_populates="owned_homes")
    rooms: Mapped[list["Room"]] = relationship(
        "Room",
        back_populates="home",
        cascade="all, delete-orphan"
    )
    
    def __repr__(self) -> str:
        return f"<Home(id={self.id}, name={self.name}, owner_id={self.owner_id})>"
