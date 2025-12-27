"""
Database initialization script.
Creates all tables defined in SQLAlchemy models.

Run with: python init_db.py
"""

import asyncio
from app.core.database import engine, Base
from app.models.user import User
from app.models.home import Home
from app.models.room import Room
from app.models.device import Device


async def init_db():
    """Create all database tables."""
    print("Creating database tables...")
    
    async with engine.begin() as conn:
        # Drop all tables (use with caution!)
        # await conn.run_sync(Base.metadata.drop_all)
        
        # Create all tables
        await conn.run_sync(Base.metadata.create_all)
    
    print("✅ Database tables created successfully!")
    print("\nCreated tables:")
    print("  - users")
    print("  - homes")
    print("  - rooms")
    print("  - devices")


if __name__ == "__main__":
    asyncio.run(init_db())
