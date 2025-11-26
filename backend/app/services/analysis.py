"""
Analysis service for running the LangGraph workflow.

Provides a clean interface for:
- Running ad analysis
- Persisting results to database
- Retrieving analysis results
"""
from typing import Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.models import AdAsset, AdAnalysis, OfferComponentScore, Brand
from app.langgraph.graph import get_analysis_graph, AnalysisState
from app.schemas import (
    AnalysisGraphOutput,
    ComponentEvaluation,
    PlatformRecommendation,
)


class AnalysisService:
    """Service for ad/creative analysis operations."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_brand_context(self, brand_id: int) -> dict[str, Any]:
        """
        Fetch brand context from database and format for analysis.
        """
        result = await self.db.execute(
            select(Brand).where(Brand.id == brand_id)
        )
        brand = result.scalar_one_or_none()
        
        if not brand:
            raise ValueError(f"Brand {brand_id} not found")
        
        return {
            "brand_name": brand.brand_name,
            "industry": brand.industry,
            "niche": brand.niche,
            "target_audience": brand.target_audience,
            "main_offer": brand.main_offer,
            "price_point": brand.price_point,
            "positioning": brand.positioning,
            "tone_of_voice": brand.tone_of_voice,
            "main_goals": brand.main_goals,
            "dream_outcome": brand.dream_outcome,
            "proof_points": brand.proof_points,
            "customer_pains": brand.customer_pains,
            "customer_desires": brand.customer_desires,
            "customer_objections": brand.customer_objections,
            "raw_context": brand.raw_brand_context_json or {},
        }
    
    async def get_ad_asset(self, ad_asset_id: int) -> AdAsset:
        """Fetch an ad asset by ID."""
        result = await self.db.execute(
            select(AdAsset).where(AdAsset.id == ad_asset_id)
        )
        asset = result.scalar_one_or_none()
        
        if not asset:
            raise ValueError(f"AdAsset {ad_asset_id} not found")
        
        return asset
    
    async def run_analysis(self, ad_asset_id: int) -> AdAnalysis:
        """
        Run the full analysis workflow on an ad asset.
        
        Steps:
        1. Fetch ad asset and brand context
        2. Run LangGraph workflow
        3. Persist results to database
        4. Return the analysis record
        """
        # 1. Fetch ad asset
        asset = await self.get_ad_asset(ad_asset_id)
        
        # 2. Get brand context
        brand_context = await self.get_brand_context(asset.brand_id)
        
        # 3. Prepare ad text (combine original and extracted)
        ad_text = ""
        if asset.original_text:
            ad_text = asset.original_text
        if asset.extracted_text:
            if ad_text:
                ad_text += "\n\n[Extracted from image:]\n" + asset.extracted_text
            else:
                ad_text = asset.extracted_text
        
        if not ad_text:
            ad_text = "[No text content available for analysis]"
        
        # 4. Build initial state
        initial_state: AnalysisState = {
            "brand_context": brand_context,
            "ad_text": ad_text,
            "ad_asset_id": ad_asset_id,
            "brand_id": asset.brand_id,
            "prepared_prompt_context": "",
            "component_evaluations": [],
            "platform_recommendations": [],
            "funnel_stage": "",
            "funnel_confidence": 0.0,
            "overall_score": 0.0,
            "summary": "",
            "recommendations": "",
            "errors": [],
        }
        
        # 5. Run the graph
        graph = get_analysis_graph()
        final_state = graph.invoke(initial_state)
        
        # 6. Persist results
        analysis = await self._persist_analysis(asset, final_state)
        
        return analysis
    
    async def _persist_analysis(
        self, 
        asset: AdAsset, 
        state: dict[str, Any]
    ) -> AdAnalysis:
        """
        Persist analysis results to database.
        
        Creates:
        - AdAnalysis record
        - OfferComponentScore records for each component
        """
        # Create AdAnalysis record
        platform_recs = state.get("platform_recommendations", [])
        
        analysis = AdAnalysis(
            ad_asset_id=asset.id,
            brand_id=asset.brand_id,
            overall_score=state.get("overall_score", 0.0),
            funnel_stage=state.get("funnel_stage"),
            funnel_confidence=state.get("funnel_confidence"),
            platform_recommendations_json=platform_recs,
            summary=state.get("summary"),
            recommendations=state.get("recommendations"),
            raw_llm_output_json={
                "component_evaluations": state.get("component_evaluations", []),
                "platform_recommendations": platform_recs,
                "errors": state.get("errors", []),
            },
        )
        
        self.db.add(analysis)
        await self.db.flush()  # Get the ID
        
        # Create component score records
        for comp in state.get("component_evaluations", []):
            score = OfferComponentScore(
                ad_analysis_id=analysis.id,
                component_key=comp.get("key", ""),
                component_name=comp.get("name", ""),
                is_present=1 if comp.get("is_present", False) else 0,
                score=comp.get("score", 0.0),
                analysis=comp.get("analysis"),
                what_is_conveyed=comp.get("what_is_conveyed"),
                suggested_improvements=comp.get("suggested_improvements"),
            )
            self.db.add(score)
        
        await self.db.commit()
        await self.db.refresh(analysis)
        
        return analysis
    
    async def get_analysis(self, analysis_id: int) -> AdAnalysis | None:
        """
        Fetch a complete analysis with component scores.
        """
        result = await self.db.execute(
            select(AdAnalysis)
            .options(selectinload(AdAnalysis.component_scores))
            .where(AdAnalysis.id == analysis_id)
        )
        return result.scalar_one_or_none()
    
    async def list_analyses_for_brand(
        self, 
        brand_id: int, 
        limit: int = 50,
        offset: int = 0
    ) -> tuple[list[AdAnalysis], int]:
        """
        List analyses for a brand with pagination.
        
        Returns tuple of (analyses, total_count).
        """
        # Count query
        count_result = await self.db.execute(
            select(AdAnalysis)
            .where(AdAnalysis.brand_id == brand_id)
        )
        total = len(count_result.scalars().all())
        
        # Data query with related ad asset for title
        result = await self.db.execute(
            select(AdAnalysis)
            .options(selectinload(AdAnalysis.ad_asset))
            .where(AdAnalysis.brand_id == brand_id)
            .order_by(AdAnalysis.created_at.desc())
            .limit(limit)
            .offset(offset)
        )
        analyses = result.scalars().all()
        
        return list(analyses), total
