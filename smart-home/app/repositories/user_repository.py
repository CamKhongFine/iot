"""
User repository for database operations.
"""

from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate


class UserRepository:
    """Repository for User model database operations"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create(self, user_data: UserCreate, hashed_password: str) -> User:
        """
        Create a new user.
        
        Args:
            user_data: User creation data
            hashed_password: Pre-hashed password
            
        Returns:
            Created user
        """
        db_user = User(
            email=user_data.email,
            username=user_data.username,
            full_name=user_data.full_name,
            hashed_password=hashed_password
        )
        
        self.db.add(db_user)
        await self.db.flush()
        await self.db.refresh(db_user)
        
        return db_user
    
    async def get_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID"""
        result = await self.db.execute(
            select(User).where(User.id == user_id)
        )
        return result.scalar_one_or_none()
    
    async def get_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        result = await self.db.execute(
            select(User).where(User.email == email)
        )
        return result.scalar_one_or_none()
    
    async def get_by_username(self, username: str) -> Optional[User]:
        """Get user by username"""
        result = await self.db.execute(
            select(User).where(User.username == username)
        )
        return result.scalar_one_or_none()
    
    async def list(self, skip: int = 0, limit: int = 100) -> List[User]:
        """List users with pagination"""
        result = await self.db.execute(
            select(User).offset(skip).limit(limit)
        )
        return list(result.scalars().all())
    
    async def update(self, user_id: int, user_data: UserUpdate, hashed_password: Optional[str] = None) -> Optional[User]:
        """
        Update user.
        
        Args:
            user_id: User ID
            user_data: Update data
            hashed_password: Optional new hashed password
            
        Returns:
            Updated user or None if not found
        """
        user = await self.get_by_id(user_id)
        if not user:
            return None
        
        # Update fields if provided
        if user_data.email is not None:
            user.email = user_data.email
        if user_data.username is not None:
            user.username = user_data.username
        if user_data.full_name is not None:
            user.full_name = user_data.full_name
        if hashed_password is not None:
            user.hashed_password = hashed_password
        
        await self.db.flush()
        await self.db.refresh(user)
        
        return user
    
    async def delete(self, user_id: int) -> bool:
        """
        Delete user.
        
        Returns:
            True if deleted, False if not found
        """
        user = await self.get_by_id(user_id)
        if not user:
            return False
        
        await self.db.delete(user)
        await self.db.flush()
        
        return True
