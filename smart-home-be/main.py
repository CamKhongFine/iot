"""
Smart Home API - Main Entry Point

Run with: python main.py

This imports the complete FastAPI application from app.main
which includes all routers and configurations.
"""

from app.main import app
from app.core.config import get_settings

settings = get_settings()

if __name__ == "__main__":
    import uvicorn
    
    print(f"Starting {settings.app_name} v{settings.app_version}")
    print(f"Server: http://{settings.host}:{settings.port}")
    print(f"API Docs: http://localhost:{settings.port}/docs")
    print(f"Database: {settings.database_url.split('@')[1] if '@' in settings.database_url else 'Not configured'}")
    print("\nAvailable endpoints:")
    print("  - /auth/* - Authentication (login, register)")
    print("  - /users/* - User management")
    print("  - /homes/* - Home management")
    print("  - /rooms/* - Room management")
    print("  - /devices/* - Device management")
    print("\nPress CTRL+C to stop\n")
    
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug
    )
