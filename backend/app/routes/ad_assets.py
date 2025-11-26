"""
Ad Asset routes for upload and management.
"""
import os
import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db import get_db
from app.auth import get_current_user
from app.models import User, Brand, AdAsset, AdAssetType
from app.schemas import AdAssetResponse


router = APIRouter(prefix="/api/ad-assets", tags=["ad-assets"])

# Directory for uploaded files
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("", response_model=AdAssetResponse)
async def create_ad_asset(
    brand_id: int = Form(...),
    title: Optional[str] = Form(None),
    ad_text: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Create a new ad asset.
    
    Accepts:
    - brand_id: The brand this ad belongs to
    - title: Optional label for the ad
    - ad_text: Ad copy text (for text-based ads)
    - file: Optional image/creative file
    
    At least one of ad_text or file must be provided.
    """
    # Verify brand belongs to user
    result = await db.execute(
        select(Brand).where(
            Brand.id == brand_id,
            Brand.user_id == current_user.id
        )
    )
    brand = result.scalar_one_or_none()
    
    if not brand:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand not found"
        )
    
    # Validate that we have some content
    if not ad_text and not file:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Must provide either ad_text or file"
        )
    
    # Determine asset type
    if file and ad_text:
        asset_type = AdAssetType.MIXED.value
    elif file:
        asset_type = AdAssetType.IMAGE.value
    else:
        asset_type = AdAssetType.TEXT.value
    
    # Handle file upload
    file_path = None
    if file:
        # Generate unique filename
        ext = os.path.splitext(file.filename)[1] if file.filename else ".bin"
        unique_name = f"{uuid.uuid4()}{ext}"
        file_path = os.path.join(UPLOAD_DIR, unique_name)
        
        # Save file
        content = await file.read()
        with open(file_path, "wb") as f:
            f.write(content)
    
    # Create ad asset
    asset = AdAsset(
        brand_id=brand_id,
        title=title or f"Ad {uuid.uuid4().hex[:8]}",
        asset_type=asset_type,
        original_text=ad_text,
        file_path=file_path,
    )
    
    db.add(asset)
    await db.commit()
    await db.refresh(asset)
    
    return asset


@router.get("/{asset_id}", response_model=AdAssetResponse)
async def get_ad_asset(
    asset_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Get a specific ad asset by ID.
    """
    result = await db.execute(
        select(AdAsset)
        .join(Brand)
        .where(
            AdAsset.id == asset_id,
            Brand.user_id == current_user.id
        )
    )
    asset = result.scalar_one_or_none()
    
    if not asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ad asset not found"
        )
    
    return asset


@router.get("", response_model=list[AdAssetResponse])
async def list_ad_assets(
    brand_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    List all ad assets for a brand.
    """
    # Verify brand belongs to user
    result = await db.execute(
        select(Brand).where(
            Brand.id == brand_id,
            Brand.user_id == current_user.id
        )
    )
    brand = result.scalar_one_or_none()
    
    if not brand:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand not found"
        )
    
    # Get assets
    result = await db.execute(
        select(AdAsset)
        .where(AdAsset.brand_id == brand_id)
        .order_by(AdAsset.created_at.desc())
    )
    assets = result.scalars().all()
    
    return list(assets)
