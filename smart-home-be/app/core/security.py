"""
Security utilities for authentication and password hashing.
"""

from datetime import datetime, timedelta
from typing import Optional
import hashlib
import bcrypt
from jose import JWTError, jwt
from app.core.config import get_settings

settings = get_settings()


def _prepare_password(password: str) -> bytes:
    """
    Prepare password for bcrypt hashing.
    
    Always hash with SHA256 first to ensure consistent length and avoid
    bcrypt's 72-byte limit. This produces a 64-character hex string.
    
    Args:
        password: Plain text password
        
    Returns:
        SHA256 hash of password as bytes (64 characters, well under 72 bytes)
    """
    # Always hash with SHA256 to ensure consistent length and avoid bcrypt limit
    sha256_hash = hashlib.sha256(password.encode('utf-8')).hexdigest()
    return sha256_hash.encode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against a hash.
    
    Args:
        plain_password: Plain text password
        hashed_password: Hashed password from database
        
    Returns:
        True if password matches, False otherwise
    """
    prepared_password = _prepare_password(plain_password)
    return bcrypt.checkpw(prepared_password, hashed_password.encode('utf-8'))


def get_password_hash(password: str) -> str:
    """
    Hash a password using SHA256 + bcrypt.
    
    First hashes with SHA256 to ensure consistent length and compatibility
    with bcrypt's 72-byte limit, then applies bcrypt for secure storage.
    
    Args:
        password: Plain text password
        
    Returns:
        Hashed password
    """
    prepared_password = _prepare_password(password)
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(prepared_password, salt)
    return hashed.decode('utf-8')


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token.
    
    Args:
        data: Data to encode in token (typically {"sub": user_id})
        expires_delta: Optional custom expiration time
        
    Returns:
        Encoded JWT token
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict]:
    """
    Decode and verify a JWT access token.
    
    Args:
        token: JWT token string
        
    Returns:
        Decoded payload if valid, None otherwise
    """
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        return payload
    except JWTError:
        return None
