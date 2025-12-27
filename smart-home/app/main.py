"""
Updated main application with ThingsBoard integration and CRUD routers.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import get_settings
from app.integrations.thingsboard_service import get_thingsboard_service

# Import routers
from app.routers import auth, users, homes, rooms, devices

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup and shutdown events.
    """
    # Startup
    print("Starting up Smart Home API...")
    
    # Initialize ThingsBoard service (will authenticate on first use)
    tb_service = get_thingsboard_service()
    print("ThingsBoard service initialized")
    
    yield
    
    # Shutdown
    print("Shutting down Smart Home API...")
    await tb_service.close()
    print("ThingsBoard service closed")


app = FastAPI(
    title=settings.app_name,
    description="Smart Home API with ThingsBoard Integration and Complete CRUD",
    version=settings.app_version,
    debug=settings.debug,
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(homes.router)
app.include_router(rooms.router)
app.include_router(devices.router)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Smart Home API",
        "version": settings.app_version,
        "docs": "/docs",
        "features": [
            "User authentication (JWT)",
            "Home management",
            "Room management",
            "Device management",
            "ThingsBoard integration"
        ]
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "smart-home-api",
        "version": settings.app_version
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug
    )
