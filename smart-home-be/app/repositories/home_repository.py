"""
Home repository for database operations.
"""

from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.home import Home
from app.schemas.home import HomeCreate, HomeUpdate


class HomeRepository:
    """Repository for Home model database operations"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create(self, home_data: HomeCreate, owner_id: int) -> Home:
        """
        Create a new home.
        
        Args:
            home_data: Home creation data
            owner_id: Owner user ID
            
        Returns:
            Created home
        """
        db_home = Home(
            name=home_data.name,
            description=home_data.description,
            address=home_data.address,
            owner_id=owner_id
        )
        
        self.db.add(db_home)
        await self.db.flush()
        await self.db.refresh(db_home)
        
        return db_home
    
    async def get_by_id(self, home_id: int) -> Optional[Home]:
        """Get home by ID"""
        result = await self.db.execute(
            select(Home).where(Home.id == home_id)
        )
        return result.scalar_one_or_none()
    
    async def list_by_owner(self, owner_id: int, skip: int = 0, limit: int = 100) -> List[Home]:
        """List homes owned by a user"""
        result = await self.db.execute(
            select(Home)
            .where(Home.owner_id == owner_id)
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())
    
    async def update(self, home_id: int, home_data: HomeUpdate) -> Optional[Home]:
        """
        Update home.
        
        Returns:
            Updated home or None if not found
        """
        home = await self.get_by_id(home_id)
        if not home:
            return None
        
        # Update fields if provided
        if home_data.name is not None:
            home.name = home_data.name
        if home_data.description is not None:
            home.description = home_data.description
        if home_data.address is not None:
            home.address = home_data.address
        
        await self.db.flush()
        await self.db.refresh(home)
        
        return home
    
    async def delete(self, home_id: int) -> bool:
        """
        Delete home.
        
        Returns:
            True if deleted, False if not found
        """
        home = await self.get_by_id(home_id)
        if not home:
            return False
        
        await self.db.delete(home)
        await self.db.flush()
        
        return True
