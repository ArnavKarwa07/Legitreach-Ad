"""
Routes module initialization.
"""
from app.routes.brands import router as brands_router
from app.routes.ad_assets import router as ad_assets_router
from app.routes.ad_analyses import router as ad_analyses_router

__all__ = [
    "brands_router",
    "ad_assets_router", 
    "ad_analyses_router",
]
