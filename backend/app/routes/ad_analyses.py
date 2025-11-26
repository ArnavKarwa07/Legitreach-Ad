"""
Ad Analysis routes for running and retrieving analyses.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.db import get_db
from app.auth import get_current_user
from app.models import User, Brand, AdAsset, AdAnalysis
from app.schemas import (
    AdAnalysisRunRequest,
    AdAnalysisResponse,
    AdAnalysisSummary,
    AdAnalysisListResponse,
    OfferComponentScoreResponse,
    PlatformRecommendation,
)
from app.services.analysis import AnalysisService


router = APIRouter(prefix="/api/ad-analyses", tags=["ad-analyses"])


@router.post("/run", response_model=AdAnalysisResponse)
async def run_analysis(
    request: AdAnalysisRunRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Run analysis on an ad asset.
    
    This endpoint:
    1. Fetches the ad asset and brand context
    2. Runs the LangGraph analysis workflow
    3. Persists results to database
    4. Returns the complete analysis
    """
    # Verify asset belongs to user
    result = await db.execute(
        select(AdAsset)
        .join(Brand)
        .where(
            AdAsset.id == request.ad_asset_id,
            Brand.user_id == current_user.id
        )
    )
    asset = result.scalar_one_or_none()
    
    if not asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ad asset not found"
        )
    
    # Run analysis
    service = AnalysisService(db)
    
    try:
        analysis = await service.run_analysis(request.ad_asset_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis failed: {str(e)}"
        )
    
    # Fetch complete analysis with component scores
    analysis = await service.get_analysis(analysis.id)
    
    # Build response
    return _build_analysis_response(analysis)


@router.get("", response_model=AdAnalysisListResponse)
async def list_analyses(
    brand_id: int = Query(..., description="Brand ID to filter by"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    List analyses for a brand.
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
    
    # Get analyses
    service = AnalysisService(db)
    analyses, total = await service.list_analyses_for_brand(brand_id, limit, offset)
    
    # Build summaries
    summaries = [
        AdAnalysisSummary(
            id=a.id,
            ad_asset_id=a.ad_asset_id,
            brand_id=a.brand_id,
            overall_score=a.overall_score,
            funnel_stage=a.funnel_stage,
            ad_title=a.ad_asset.title if a.ad_asset else None,
            created_at=a.created_at,
        )
        for a in analyses
    ]
    
    return AdAnalysisListResponse(analyses=summaries, total=total)


@router.get("/{analysis_id}", response_model=AdAnalysisResponse)
async def get_analysis(
    analysis_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Get a specific analysis by ID with full details.
    """
    # Fetch analysis with components
    result = await db.execute(
        select(AdAnalysis)
        .options(selectinload(AdAnalysis.component_scores))
        .join(Brand)
        .where(
            AdAnalysis.id == analysis_id,
            Brand.user_id == current_user.id
        )
    )
    analysis = result.scalar_one_or_none()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    return _build_analysis_response(analysis)


def _build_analysis_response(analysis: AdAnalysis) -> AdAnalysisResponse:
    """
    Build AdAnalysisResponse from database model.
    """
    # Parse platform recommendations from JSON
    platform_recs = []
    if analysis.platform_recommendations_json:
        for p in analysis.platform_recommendations_json:
            platform_recs.append(PlatformRecommendation(
                platform=p.get("platform", ""),
                score=p.get("score", 0),
                reason=p.get("reason", ""),
            ))
    
    # Build component scores
    component_scores = [
        OfferComponentScoreResponse(
            id=c.id,
            component_key=c.component_key,
            component_name=c.component_name,
            is_present=bool(c.is_present),
            score=c.score,
            analysis=c.analysis,
            what_is_conveyed=c.what_is_conveyed,
            suggested_improvements=c.suggested_improvements,
        )
        for c in analysis.component_scores
    ]
    
    # Sort by component key
    component_scores.sort(key=lambda x: x.component_key)
    
    return AdAnalysisResponse(
        id=analysis.id,
        ad_asset_id=analysis.ad_asset_id,
        brand_id=analysis.brand_id,
        overall_score=analysis.overall_score,
        funnel_stage=analysis.funnel_stage,
        funnel_confidence=analysis.funnel_confidence,
        platform_recommendations=platform_recs,
        summary=analysis.summary,
        recommendations=analysis.recommendations,
        component_scores=component_scores,
        created_at=analysis.created_at,
        updated_at=analysis.updated_at,
    )
