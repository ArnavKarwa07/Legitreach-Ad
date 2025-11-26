"""
Pydantic schemas for request/response validation.

These schemas define the API contract for the Legitreach-Ad system.
"""
from datetime import datetime
from enum import Enum
from typing import Optional, Any
from pydantic import BaseModel, Field


# =============================================================================
# ENUMS
# =============================================================================

class AdAssetType(str, Enum):
    """Types of ad assets."""
    IMAGE = "image"
    VIDEO = "video"
    TEXT = "text"
    MIXED = "mixed"


class FunnelStage(str, Enum):
    """Funnel stage classification."""
    TOF = "TOF"  # Top of Funnel
    MOF = "MOF"  # Middle of Funnel
    BOF = "BOF"  # Bottom of Funnel


# =============================================================================
# USER SCHEMAS
# =============================================================================

class UserBase(BaseModel):
    """Base user schema."""
    clerk_user_id: str
    email: Optional[str] = None


class UserCreate(UserBase):
    """Schema for creating a user."""
    pass


class UserResponse(UserBase):
    """Schema for user responses."""
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# =============================================================================
# BRAND SCHEMAS
# =============================================================================

class BrandOnboardingRequest(BaseModel):
    """
    Schema for brand onboarding request.
    Collects comprehensive brand context for ad analysis.
    """
    # Required
    brand_name: str = Field(..., min_length=1, max_length=255)
    
    # Core brand info
    industry: Optional[str] = Field(None, max_length=255)
    niche: Optional[str] = Field(None, max_length=500)
    target_audience: Optional[str] = Field(None, description="Describe your ideal customer")
    
    # Offer details
    main_offer: Optional[str] = Field(None, description="Your main product/service offering")
    price_point: Optional[str] = Field(None, description="e.g., 'Premium', '$99/mo', 'Free trial'")
    positioning: Optional[str] = Field(None, description="How you want to be perceived in the market")
    
    # Brand voice
    tone_of_voice: Optional[str] = Field(None, description="e.g., 'Professional', 'Friendly', 'Bold'")
    main_goals: Optional[str] = Field(None, description="e.g., 'Lead generation', 'Direct sales', 'Brand awareness'")
    
    # COMP1-2: Dream Outcome & Proof
    dream_outcome: Optional[str] = Field(None, description="The ultimate transformation your customer achieves")
    proof_points: Optional[str] = Field(None, description="Testimonials, numbers, case studies you have")
    
    # COMP6-8: Customer insights
    customer_pains: Optional[str] = Field(None, description="Main frustrations your customers face")
    customer_desires: Optional[str] = Field(None, description="What your customers want emotionally/functionally")
    customer_objections: Optional[str] = Field(None, description="Common reasons people hesitate to buy")
    
    # Raw context for extensibility
    additional_context: Optional[dict[str, Any]] = Field(None, description="Any additional brand context")


class BrandResponse(BaseModel):
    """Schema for brand responses."""
    id: int
    user_id: int
    brand_name: str
    industry: Optional[str] = None
    niche: Optional[str] = None
    target_audience: Optional[str] = None
    main_offer: Optional[str] = None
    price_point: Optional[str] = None
    positioning: Optional[str] = None
    tone_of_voice: Optional[str] = None
    main_goals: Optional[str] = None
    dream_outcome: Optional[str] = None
    proof_points: Optional[str] = None
    customer_pains: Optional[str] = None
    customer_desires: Optional[str] = None
    customer_objections: Optional[str] = None
    raw_brand_context_json: Optional[dict] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class BrandSummary(BaseModel):
    """Brief brand summary for lists."""
    id: int
    brand_name: str
    industry: Optional[str] = None
    niche: Optional[str] = None
    
    class Config:
        from_attributes = True


# =============================================================================
# AD ASSET SCHEMAS
# =============================================================================

class AdAssetCreateRequest(BaseModel):
    """Schema for creating an ad asset."""
    brand_id: int
    title: Optional[str] = Field(None, max_length=255)
    asset_type: AdAssetType = AdAssetType.TEXT
    ad_text: Optional[str] = Field(None, description="Ad copy text content")


class AdAssetResponse(BaseModel):
    """Schema for ad asset responses."""
    id: int
    brand_id: int
    title: Optional[str] = None
    asset_type: str
    original_text: Optional[str] = None
    extracted_text: Optional[str] = None
    file_path: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# =============================================================================
# OFFER COMPONENT SCHEMAS
# =============================================================================

class OfferComponentDefinition(BaseModel):
    """Definition of an offer component (COMP1-COMP40)."""
    key: str  # e.g., "COMP1"
    name: str  # e.g., "Dream Outcome"
    description: str
    questions: list[str]  # Questions to extract this component


class OfferComponentScoreResponse(BaseModel):
    """Schema for component score in analysis results."""
    id: int
    component_key: str
    component_name: str
    is_present: bool
    score: float = Field(..., ge=0, le=10)
    analysis: Optional[str] = None
    what_is_conveyed: Optional[str] = None
    suggested_improvements: Optional[str] = None
    
    class Config:
        from_attributes = True


# =============================================================================
# PLATFORM RECOMMENDATION SCHEMAS
# =============================================================================

class PlatformRecommendation(BaseModel):
    """Single platform recommendation."""
    platform: str  # e.g., "instagram", "facebook", "linkedin"
    score: float = Field(..., ge=0, le=100)
    reason: str


# =============================================================================
# AD ANALYSIS SCHEMAS
# =============================================================================

class AdAnalysisRunRequest(BaseModel):
    """Request to run analysis on an ad asset."""
    ad_asset_id: int


class AdAnalysisResponse(BaseModel):
    """Full analysis response."""
    id: int
    ad_asset_id: int
    brand_id: int
    overall_score: float
    funnel_stage: Optional[str] = None
    funnel_confidence: Optional[float] = None
    platform_recommendations: list[PlatformRecommendation] = []
    summary: Optional[str] = None
    recommendations: Optional[str] = None
    component_scores: list[OfferComponentScoreResponse] = []
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class AdAnalysisSummary(BaseModel):
    """Brief analysis summary for lists."""
    id: int
    ad_asset_id: int
    brand_id: int
    overall_score: float
    funnel_stage: Optional[str] = None
    ad_title: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class AdAnalysisListResponse(BaseModel):
    """Response for list of analyses."""
    analyses: list[AdAnalysisSummary]
    total: int


# =============================================================================
# LANGGRAPH INTERNAL SCHEMAS
# =============================================================================

class ComponentEvaluation(BaseModel):
    """Single component evaluation from LLM."""
    key: str
    name: str
    is_present: bool
    score: float = Field(..., ge=0, le=10)
    analysis: str
    what_is_conveyed: str
    suggested_improvements: str


class AnalysisGraphInput(BaseModel):
    """Input to the LangGraph analysis workflow."""
    brand_context: dict[str, Any]
    ad_text: str
    ad_asset_id: int
    brand_id: int


class AnalysisGraphOutput(BaseModel):
    """Output from the LangGraph analysis workflow."""
    overall_score: float
    funnel_stage: str
    funnel_confidence: float
    components: list[ComponentEvaluation]
    platform_recommendations: list[PlatformRecommendation]
    summary: str
    recommendations: str
