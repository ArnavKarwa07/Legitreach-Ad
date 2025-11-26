"""
Brand routes for onboarding and management.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.db import get_db
from app.auth import get_current_user
from app.models import User, Brand
from app.schemas import BrandOnboardingRequest, BrandResponse, BrandSummary


router = APIRouter(prefix="/api/brands", tags=["brands"])


@router.post("/onboard", response_model=BrandResponse)
async def onboard_brand(
    request: BrandOnboardingRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Onboard a new brand or update existing brand for the current user.
    
    This endpoint:
    - Creates or updates the brand associated with the user
    - Stores both structured fields and raw JSON context
    - Returns the complete brand record
    """
    # Check if user already has a brand
    result = await db.execute(
        select(Brand).where(Brand.user_id == current_user.id)
    )
    existing_brand = result.scalar_one_or_none()
    
    # Build raw context JSON (includes all submitted data)
    raw_context = request.model_dump(exclude_none=True)
    if request.additional_context:
        raw_context.update(request.additional_context)
    
    if existing_brand:
        # Update existing brand
        existing_brand.brand_name = request.brand_name
        existing_brand.industry = request.industry
        existing_brand.niche = request.niche
        existing_brand.target_audience = request.target_audience
        existing_brand.main_offer = request.main_offer
        existing_brand.price_point = request.price_point
        existing_brand.positioning = request.positioning
        existing_brand.tone_of_voice = request.tone_of_voice
        existing_brand.main_goals = request.main_goals
        existing_brand.dream_outcome = request.dream_outcome
        existing_brand.proof_points = request.proof_points
        existing_brand.customer_pains = request.customer_pains
        existing_brand.customer_desires = request.customer_desires
        existing_brand.customer_objections = request.customer_objections
        existing_brand.raw_brand_context_json = raw_context
        
        brand = existing_brand
    else:
        # Create new brand
        brand = Brand(
            user_id=current_user.id,
            brand_name=request.brand_name,
            industry=request.industry,
            niche=request.niche,
            target_audience=request.target_audience,
            main_offer=request.main_offer,
            price_point=request.price_point,
            positioning=request.positioning,
            tone_of_voice=request.tone_of_voice,
            main_goals=request.main_goals,
            dream_outcome=request.dream_outcome,
            proof_points=request.proof_points,
            customer_pains=request.customer_pains,
            customer_desires=request.customer_desires,
            customer_objections=request.customer_objections,
            raw_brand_context_json=raw_context,
        )
        db.add(brand)
    
    await db.commit()
    await db.refresh(brand)
    
    return brand


@router.get("/me", response_model=BrandResponse | None)
async def get_my_brand(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Get the current user's brand.
    
    Returns null if the user hasn't completed onboarding.
    """
    result = await db.execute(
        select(Brand).where(Brand.user_id == current_user.id)
    )
    brand = result.scalar_one_or_none()
    
    return brand


@router.get("/{brand_id}", response_model=BrandResponse)
async def get_brand(
    brand_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Get a specific brand by ID.
    
    Users can only access their own brands.
    """
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
    
    return brand
