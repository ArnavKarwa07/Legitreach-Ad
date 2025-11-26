"""
SQLAlchemy models for the Legitreach-Ad system.

Models:
- User: Clerk-authenticated users
- Brand: Brand context and onboarding data
- AdAsset: Uploaded ad creatives (image/text)
- AdAnalysis: Overall analysis results
- OfferComponentScore: Per-component scores (COMP1-COMP10+)
"""
from datetime import datetime
from enum import Enum as PyEnum
from typing import Optional
import json

from sqlalchemy import (
    Column, String, Integer, Float, Text, DateTime, 
    ForeignKey, Enum, Index, JSON
)
from sqlalchemy.orm import relationship, Mapped, mapped_column

from app.db import Base


class AdAssetType(str, PyEnum):
    """Types of ad assets that can be uploaded."""
    IMAGE = "image"
    VIDEO = "video"
    TEXT = "text"
    MIXED = "mixed"


class User(Base):
    """
    User model linked to Clerk authentication.
    Each user can have multiple brands.
    """
    __tablename__ = "users"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    clerk_user_id: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    brands: Mapped[list["Brand"]] = relationship("Brand", back_populates="user", cascade="all, delete-orphan")


class Brand(Base):
    """
    Brand context collected during onboarding.
    
    Stores both structured fields for quick access and a raw JSON blob
    for full onboarding answers that can be extended.
    """
    __tablename__ = "brands"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # Core brand fields (structured for quick access)
    brand_name: Mapped[str] = mapped_column(String(255), nullable=False)
    industry: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    niche: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    target_audience: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Offer/Product details
    main_offer: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    price_point: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    positioning: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Brand voice and goals
    tone_of_voice: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    main_goals: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # e.g., "lead_gen,direct_sales"
    
    # Dream outcome and proof (from COMP1, COMP2)
    dream_outcome: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    proof_points: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Customer insights (from COMP6-COMP10)
    customer_pains: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    customer_desires: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    customer_objections: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Full onboarding data as JSON (extensible)
    raw_brand_context_json: Mapped[Optional[str]] = mapped_column(JSON, nullable=True)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="brands")
    ad_assets: Mapped[list["AdAsset"]] = relationship("AdAsset", back_populates="brand", cascade="all, delete-orphan")
    ad_analyses: Mapped[list["AdAnalysis"]] = relationship("AdAnalysis", back_populates="brand", cascade="all, delete-orphan")
    
    # Indices
    __table_args__ = (
        Index("ix_brands_user_id", "user_id"),
    )


class AdAsset(Base):
    """
    Uploaded ad creative (image, video, text, or mixed).
    
    Stores the raw content and metadata for analysis.
    """
    __tablename__ = "ad_assets"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    brand_id: Mapped[int] = mapped_column(Integer, ForeignKey("brands.id", ondelete="CASCADE"), nullable=False)
    
    # Asset metadata
    title: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    asset_type: Mapped[str] = mapped_column(String(50), nullable=False, default=AdAssetType.TEXT.value)
    
    # Content
    original_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # Ad copy text
    extracted_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # OCR extracted text from image
    file_path: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)  # Path to uploaded file
    storage_key: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)  # Cloud storage key (future)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    brand: Mapped["Brand"] = relationship("Brand", back_populates="ad_assets")
    analyses: Mapped[list["AdAnalysis"]] = relationship("AdAnalysis", back_populates="ad_asset", cascade="all, delete-orphan")
    
    # Indices
    __table_args__ = (
        Index("ix_ad_assets_brand_id", "brand_id"),
    )


class AdAnalysis(Base):
    """
    Overall analysis result for an ad asset.
    
    Contains:
    - Overall score
    - Platform recommendations with reasoning
    - Raw LLM output for debugging
    """
    __tablename__ = "ad_analyses"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    ad_asset_id: Mapped[int] = mapped_column(Integer, ForeignKey("ad_assets.id", ondelete="CASCADE"), nullable=False)
    brand_id: Mapped[int] = mapped_column(Integer, ForeignKey("brands.id", ondelete="CASCADE"), nullable=False)
    
    # Analysis results
    overall_score: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    
    # Funnel stage classification (TOF, MOF, BOF)
    funnel_stage: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    funnel_confidence: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    
    # Platform recommendations as JSON
    # Format: [{"platform": "instagram", "score": 85, "reason": "..."}]
    platform_recommendations_json: Mapped[Optional[str]] = mapped_column(JSON, nullable=True)
    
    # Summary and recommendations
    summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    recommendations: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Raw LLM output for debugging
    raw_llm_output_json: Mapped[Optional[str]] = mapped_column(JSON, nullable=True)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    ad_asset: Mapped["AdAsset"] = relationship("AdAsset", back_populates="analyses")
    brand: Mapped["Brand"] = relationship("Brand", back_populates="ad_analyses")
    component_scores: Mapped[list["OfferComponentScore"]] = relationship(
        "OfferComponentScore", back_populates="ad_analysis", cascade="all, delete-orphan"
    )
    
    # Indices
    __table_args__ = (
        Index("ix_ad_analyses_ad_asset_id", "ad_asset_id"),
        Index("ix_ad_analyses_brand_id", "brand_id"),
    )


class OfferComponentScore(Base):
    """
    Per-component score and analysis.
    
    Evaluates the ad against each of the offer components (COMP1-COMP10 for now).
    Each component has:
    - Binary presence (present/absent)
    - Quality score (0-10)
    - Detailed analysis
    - Suggested improvements
    """
    __tablename__ = "offer_component_scores"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    ad_analysis_id: Mapped[int] = mapped_column(Integer, ForeignKey("ad_analyses.id", ondelete="CASCADE"), nullable=False)
    
    # Component identification
    component_key: Mapped[str] = mapped_column(String(20), nullable=False)  # e.g., "COMP1", "COMP2"
    component_name: Mapped[str] = mapped_column(String(255), nullable=False)  # e.g., "Dream Outcome"
    
    # Scoring
    is_present: Mapped[bool] = mapped_column(Integer, nullable=False, default=0)  # SQLite bool
    score: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)  # 0-10 scale
    
    # Analysis
    analysis: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    what_is_conveyed: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # What the creative conveys for this component
    suggested_improvements: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    # Relationships
    ad_analysis: Mapped["AdAnalysis"] = relationship("AdAnalysis", back_populates="component_scores")
    
    # Indices
    __table_args__ = (
        Index("ix_offer_component_scores_analysis_id", "ad_analysis_id"),
        Index("ix_offer_component_scores_component_key", "component_key"),
    )
