from typing import Optional
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """
    Application settings and configuration.
    Uses environment variables with .env file support.
    """
    
    # ==========================================
    # Application Settings
    # ==========================================
    app_name: str = "Smart Home API"
    app_version: str = "1.0.0"
    debug: bool = True
    
    # ==========================================
    # Server Settings
    # ==========================================
    host: str = "0.0.0.0"
    port: int = 8000
    
    # ==========================================
    # Database Settings (PostgreSQL)
    # ==========================================
    # Connection to the smarthome_backend database
    # Created automatically by init-db.sql in docker-compose
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5433/smarthome_backend"
    
    # ==========================================
    # JWT Authentication (Web Users)
    # ==========================================
    secret_key: str = "your-secret-key-change-this-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # ==========================================
    # CORS Settings
    # ==========================================
    cors_origins: list[str] = ["http://localhost:3000", "http://localhost:8080"]
    
    # ==========================================
    # ThingsBoard Integration Settings
    # ==========================================
    thingsboard_url: str = "http://localhost:8080"
    thingsboard_username: str = "tenant@thingsboard.org"
    thingsboard_password: str = "tenant"
    
    # HTTP client configuration
    thingsboard_timeout: int = 30  # seconds
    thingsboard_max_retries: int = 3
    thingsboard_retry_delay: float = 1.0  # seconds
    
    # Token refresh margin (refresh if token expires within this time)
    thingsboard_token_refresh_margin: int = 300  # 5 minutes in seconds
    
    class Config:
        env_file = ".env"
        case_sensitive = False
        # Allow list types to be parsed from comma-separated strings
        env_prefix = ""


@lru_cache()
def get_settings() -> Settings:
    """
    Get cached settings instance.
    This ensures settings are loaded only once and reused.
    """
    return Settings()
