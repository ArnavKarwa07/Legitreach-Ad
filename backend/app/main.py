"""
FastAPI application entrypoint for Legitreach-Ad backend.

This is the main application that:
- Initializes the database
- Sets up CORS middleware
- Registers all API routes
- Provides health check endpoint
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.db import init_db
from app.routes import brands_router, ad_assets_router, ad_analyses_router


settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan handler.
    
    Initializes database on startup.
    """
    # Startup
    await init_db()
    yield
    # Shutdown (cleanup if needed)


# Create FastAPI application
app = FastAPI(
    title="Legitreach-Ad API",
    description="Ad/Creative Analysis System - Evaluates ads against offer components",
    version="1.0.0",
    lifespan=lifespan,
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
app.include_router(brands_router)
app.include_router(ad_assets_router)
app.include_router(ad_analyses_router)


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "legitreach-ad-api"}


@app.get("/")
async def root():
    """Root endpoint with API info."""
    return {
        "name": "Legitreach-Ad API",
        "version": "1.0.0",
        "description": "Ad/Creative Analysis System",
        "docs_url": "/docs",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
    )
