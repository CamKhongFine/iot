"""
Home service for business logic.
"""

from typing import List
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.home_repository import HomeRepository
from app.schemas.home import HomeCreate, HomeUpdate, HomeResponse


class HomeService:
    """Service for home business logic"""
    
    def __init__(self, db: AsyncSession):
        self.repository = HomeRepository(db)
    
    async def create_home(self, home_data: HomeCreate, owner_id: int) -> HomeResponse:
        """Create a new home"""
        home = await self.repository.create(home_data, owner_id)
        return HomeResponse.model_validate(home)
    
    async def get_home(self, home_id: int) -> HomeResponse:
        """
        Get home by ID.
        
        Raises:
            HTTPException: If home not found
        """
        home = await self.repository.get_by_id(home_id)
        if not home:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Home not found"
            )
        
        return HomeResponse.model_validate(home)
    
    async def list_user_homes(self, owner_id: int, skip: int = 0, limit: int = 100) -> List[HomeResponse]:
        """List homes owned by a user"""
        homes = await self.repository.list_by_owner(owner_id, skip, limit)
        return [HomeResponse.model_validate(home) for home in homes]
    
    async def update_home(self, home_id: int, home_data: HomeUpdate) -> HomeResponse:
        """
        Update home.
        
        Raises:
            HTTPException: If home not found
        """
        home = await self.repository.update(home_id, home_data)
        if not home:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Home not found"
            )
        
        return HomeResponse.model_validate(home)
    
    async def delete_home(self, home_id: int) -> None:
        """
        Delete home.
        
        Raises:
            HTTPException: If home not found
        """
        deleted = await self.repository.delete(home_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Home not found"
            )
    
    async def verify_ownership(self, home_id: int, user_id: int) -> None:
        """
        Verify that a user owns a home.
        
        Raises:
            HTTPException: If home not found or user is not the owner
        """
        home = await self.repository.get_by_id(home_id)
        if not home:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Home not found"
            )
        
        if home.owner_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to access this home"
            )
