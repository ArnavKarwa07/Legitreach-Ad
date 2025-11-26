"""
LangGraph workflow for Ad/Creative Analysis.

This module implements the core analysis pipeline using LangGraph:
1. Prepare context (brand + ad content)
2. Evaluate each offer component (COMP1-COMP10)
3. Recommend platforms based on analysis
4. Assemble final output

Uses Google AI Studio (Gemini) for LLM calls.
"""
import json
from typing import TypedDict, Annotated, Any
from operator import add

from langgraph.graph import StateGraph, END
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage

from app.config import get_settings
from app.langgraph.components import (
    OFFER_COMPONENTS_V1,
    get_components_prompt_context,
)

settings = get_settings()


# =============================================================================
# STATE DEFINITION
# =============================================================================

class AnalysisState(TypedDict):
    """
    State object passed through the LangGraph workflow.
    
    Contains all data needed for analysis and accumulates results.
    """
    # Input data
    brand_context: dict[str, Any]
    ad_text: str
    ad_asset_id: int
    brand_id: int
    
    # Prepared context (from prepare_context_node)
    prepared_prompt_context: str
    
    # Component evaluation results
    component_evaluations: list[dict]
    
    # Platform recommendations
    platform_recommendations: list[dict]
    
    # Funnel classification
    funnel_stage: str
    funnel_confidence: float
    
    # Final outputs
    overall_score: float
    summary: str
    recommendations: str
    
    # Error tracking
    errors: list[str]


# =============================================================================
# LLM INITIALIZATION
# =============================================================================

def get_llm():
    """Initialize the Google Gemini LLM."""
    return ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",
        google_api_key=settings.google_api_key,
        temperature=0.3,
        convert_system_message_to_human=True,
    )


# =============================================================================
# NODE: PREPARE CONTEXT
# =============================================================================

def prepare_context_node(state: AnalysisState) -> dict:
    """
    Prepare the context for analysis by combining brand info and ad content.
    
    This node formats all available information into a structured prompt context
    that subsequent nodes can use for evaluation.
    """
    brand = state["brand_context"]
    ad_text = state["ad_text"]
    
    # Build brand context summary
    brand_summary = f"""
=== BRAND CONTEXT ===
Brand Name: {brand.get('brand_name', 'Unknown')}
Industry: {brand.get('industry', 'Not specified')}
Niche: {brand.get('niche', 'Not specified')}
Target Audience: {brand.get('target_audience', 'Not specified')}

Main Offer: {brand.get('main_offer', 'Not specified')}
Price Point: {brand.get('price_point', 'Not specified')}
Positioning: {brand.get('positioning', 'Not specified')}

Tone of Voice: {brand.get('tone_of_voice', 'Not specified')}
Main Goals: {brand.get('main_goals', 'Not specified')}

Dream Outcome (from brand): {brand.get('dream_outcome', 'Not specified')}
Proof Points (from brand): {brand.get('proof_points', 'Not specified')}

Customer Pains (known): {brand.get('customer_pains', 'Not specified')}
Customer Desires (known): {brand.get('customer_desires', 'Not specified')}
Customer Objections (known): {brand.get('customer_objections', 'Not specified')}
"""

    # Build the full context
    prepared_context = f"""
{brand_summary}

=== AD/CREATIVE CONTENT TO ANALYZE ===
{ad_text}

=== OFFER COMPONENTS TO EVALUATE ===
{get_components_prompt_context()}
"""
    
    return {
        "prepared_prompt_context": prepared_context,
        "errors": [],
    }


# =============================================================================
# NODE: COMPONENT EVALUATION
# =============================================================================

COMPONENT_EVAL_SYSTEM_PROMPT = """You are an expert ad/creative analyst specializing in direct response marketing and offer optimization.

Your task is to evaluate an ad/creative against specific offer components. For each component, you must:
1. Determine if the component is PRESENT or ABSENT in the ad
2. Score the component's quality from 0-10 (0 = absent/terrible, 10 = excellent)
3. Explain what the ad conveys for this component
4. Provide specific improvement suggestions

Be objective, specific, and constructive in your analysis.

IMPORTANT: Return your analysis as valid JSON only, no markdown formatting."""

COMPONENT_EVAL_USER_PROMPT = """Analyze the following ad/creative against the 10 offer components.

{context}

For each component (COMP1 through COMP10), evaluate the ad and return a JSON array with this exact structure:

{{
  "components": [
    {{
      "key": "COMP1",
      "name": "Dream Outcome",
      "is_present": true/false,
      "score": 0-10,
      "what_is_conveyed": "What the ad communicates for this component",
      "analysis": "Detailed analysis of how well this component is executed",
      "suggested_improvements": "Specific suggestions to improve this component"
    }},
    ... (repeat for all 10 components)
  ]
}}

Analyze thoroughly and return ONLY the JSON object, no additional text."""


def component_evaluation_node(state: AnalysisState) -> dict:
    """
    Evaluate the ad against all 10 offer components.
    
    Uses LLM to analyze each component and generate scores + analysis.
    """
    llm = get_llm()
    context = state["prepared_prompt_context"]
    
    try:
        messages = [
            SystemMessage(content=COMPONENT_EVAL_SYSTEM_PROMPT),
            HumanMessage(content=COMPONENT_EVAL_USER_PROMPT.format(context=context))
        ]
        
        response = llm.invoke(messages)
        response_text = response.content.strip()
        
        # Clean up response (remove markdown code blocks if present)
        if response_text.startswith("```"):
            response_text = response_text.split("```")[1]
            if response_text.startswith("json"):
                response_text = response_text[4:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        
        result = json.loads(response_text.strip())
        components = result.get("components", [])
        
        return {
            "component_evaluations": components,
            "errors": [],
        }
        
    except json.JSONDecodeError as e:
        return {
            "component_evaluations": [],
            "errors": [f"Failed to parse component evaluation response: {str(e)}"],
        }
    except Exception as e:
        return {
            "component_evaluations": [],
            "errors": [f"Component evaluation failed: {str(e)}"],
        }


# =============================================================================
# NODE: FUNNEL CLASSIFICATION
# =============================================================================

FUNNEL_SYSTEM_PROMPT = """You are an expert at classifying marketing content by funnel stage.

Funnel stages:
- TOF (Top of Funnel): Awareness stage - curiosity-driven, problem-aware content, no hard sell
- MOF (Middle of Funnel): Consideration stage - solution-aware, mechanism explanation, differentiation
- BOF (Bottom of Funnel): Decision stage - product-aware, strong CTA, offers, urgency, social proof

Analyze the ad content and brand context to determine the most appropriate funnel stage.

IMPORTANT: Return your analysis as valid JSON only, no markdown formatting."""

FUNNEL_USER_PROMPT = """Based on the following ad/creative and brand context, classify the funnel stage:

{context}

Return a JSON object with:
{{
  "funnel_stage": "TOF" or "MOF" or "BOF",
  "confidence": 0.0-1.0,
  "reasoning": "Brief explanation of why this stage was chosen"
}}

Return ONLY the JSON object, no additional text."""


def funnel_classification_node(state: AnalysisState) -> dict:
    """
    Classify the ad by funnel stage (TOF, MOF, BOF).
    """
    llm = get_llm()
    context = state["prepared_prompt_context"]
    
    try:
        messages = [
            SystemMessage(content=FUNNEL_SYSTEM_PROMPT),
            HumanMessage(content=FUNNEL_USER_PROMPT.format(context=context))
        ]
        
        response = llm.invoke(messages)
        response_text = response.content.strip()
        
        # Clean up response
        if response_text.startswith("```"):
            response_text = response_text.split("```")[1]
            if response_text.startswith("json"):
                response_text = response_text[4:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        
        result = json.loads(response_text.strip())
        
        return {
            "funnel_stage": result.get("funnel_stage", "MOF"),
            "funnel_confidence": result.get("confidence", 0.5),
            "errors": [],
        }
        
    except Exception as e:
        return {
            "funnel_stage": "MOF",
            "funnel_confidence": 0.5,
            "errors": [f"Funnel classification failed: {str(e)}"],
        }


# =============================================================================
# NODE: PLATFORM RECOMMENDATION
# =============================================================================

PLATFORM_SYSTEM_PROMPT = """You are an expert media buyer and platform strategist.

Given an ad/creative analysis, recommend the best platforms for running this ad.

Consider:
- Ad format compatibility (text-heavy vs visual)
- Audience demographics per platform
- Funnel stage alignment
- Component strengths and weaknesses
- Brand positioning and goals

Platforms to consider: Instagram, Facebook, LinkedIn, Twitter/X, TikTok, YouTube, Email, Google Ads, Pinterest

IMPORTANT: Return your analysis as valid JSON only, no markdown formatting."""

PLATFORM_USER_PROMPT = """Based on the following ad analysis and brand context, recommend platforms:

{context}

Component Scores Summary:
{component_summary}

Funnel Stage: {funnel_stage}

Return a JSON object with:
{{
  "platforms": [
    {{
      "platform": "platform_name",
      "score": 0-100,
      "reason": "Why this platform is recommended"
    }},
    ...
  ]
}}

Recommend 3-5 platforms, sorted by score descending.
Return ONLY the JSON object, no additional text."""


def platform_recommendation_node(state: AnalysisState) -> dict:
    """
    Recommend platforms based on ad analysis and brand context.
    """
    llm = get_llm()
    context = state["prepared_prompt_context"]
    components = state.get("component_evaluations", [])
    funnel_stage = state.get("funnel_stage", "MOF")
    
    # Build component summary
    component_summary = "\n".join([
        f"- {c.get('key', 'N/A')} ({c.get('name', 'N/A')}): Score {c.get('score', 0)}/10 - {'Present' if c.get('is_present') else 'Absent'}"
        for c in components
    ])
    
    try:
        messages = [
            SystemMessage(content=PLATFORM_SYSTEM_PROMPT),
            HumanMessage(content=PLATFORM_USER_PROMPT.format(
                context=context,
                component_summary=component_summary,
                funnel_stage=funnel_stage
            ))
        ]
        
        response = llm.invoke(messages)
        response_text = response.content.strip()
        
        # Clean up response
        if response_text.startswith("```"):
            response_text = response_text.split("```")[1]
            if response_text.startswith("json"):
                response_text = response_text[4:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        
        result = json.loads(response_text.strip())
        platforms = result.get("platforms", [])
        
        return {
            "platform_recommendations": platforms,
            "errors": [],
        }
        
    except Exception as e:
        return {
            "platform_recommendations": [],
            "errors": [f"Platform recommendation failed: {str(e)}"],
        }


# =============================================================================
# NODE: FINAL ASSEMBLER
# =============================================================================

SUMMARY_SYSTEM_PROMPT = """You are an expert ad analyst providing executive summaries.

Based on component evaluations, funnel classification, and platform recommendations,
create a concise summary and actionable recommendations.

IMPORTANT: Return your analysis as valid JSON only, no markdown formatting."""

SUMMARY_USER_PROMPT = """Create a summary and recommendations based on this analysis:

Component Evaluations:
{component_details}

Funnel Stage: {funnel_stage} (Confidence: {funnel_confidence})

Platform Recommendations:
{platform_details}

Return a JSON object with:
{{
  "summary": "2-3 sentence executive summary of the ad's effectiveness",
  "recommendations": "3-5 bullet points of key improvements (as a single string with newlines)"
}}

Return ONLY the JSON object, no additional text."""


def final_assembler_node(state: AnalysisState) -> dict:
    """
    Assemble final outputs: overall score, summary, and recommendations.
    """
    llm = get_llm()
    components = state.get("component_evaluations", [])
    funnel_stage = state.get("funnel_stage", "MOF")
    funnel_confidence = state.get("funnel_confidence", 0.5)
    platforms = state.get("platform_recommendations", [])
    
    # Calculate overall score (average of component scores)
    if components:
        scores = [c.get("score", 0) for c in components]
        overall_score = sum(scores) / len(scores)
    else:
        overall_score = 0.0
    
    # Build details for summary
    component_details = "\n".join([
        f"- {c.get('key')}: {c.get('name')} - Score: {c.get('score')}/10\n  Analysis: {c.get('analysis', 'N/A')}"
        for c in components
    ])
    
    platform_details = "\n".join([
        f"- {p.get('platform')}: Score {p.get('score')}/100 - {p.get('reason', 'N/A')}"
        for p in platforms
    ])
    
    try:
        messages = [
            SystemMessage(content=SUMMARY_SYSTEM_PROMPT),
            HumanMessage(content=SUMMARY_USER_PROMPT.format(
                component_details=component_details,
                funnel_stage=funnel_stage,
                funnel_confidence=funnel_confidence,
                platform_details=platform_details
            ))
        ]
        
        response = llm.invoke(messages)
        response_text = response.content.strip()
        
        # Clean up response
        if response_text.startswith("```"):
            response_text = response_text.split("```")[1]
            if response_text.startswith("json"):
                response_text = response_text[4:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        
        result = json.loads(response_text.strip())
        
        return {
            "overall_score": round(overall_score, 2),
            "summary": result.get("summary", "Analysis complete."),
            "recommendations": result.get("recommendations", "No specific recommendations."),
            "errors": [],
        }
        
    except Exception as e:
        return {
            "overall_score": round(overall_score, 2),
            "summary": f"Analysis completed with {len(components)} components evaluated.",
            "recommendations": "Review component scores for specific improvement areas.",
            "errors": [f"Summary generation failed: {str(e)}"],
        }


# =============================================================================
# GRAPH DEFINITION
# =============================================================================

def create_analysis_graph() -> StateGraph:
    """
    Create the LangGraph workflow for ad analysis.
    
    Flow:
    prepare_context -> component_evaluation -> funnel_classification -> platform_recommendation -> final_assembler -> END
    """
    # Initialize the graph with our state type
    workflow = StateGraph(AnalysisState)
    
    # Add nodes
    workflow.add_node("prepare_context", prepare_context_node)
    workflow.add_node("component_evaluation", component_evaluation_node)
    workflow.add_node("funnel_classification", funnel_classification_node)
    workflow.add_node("platform_recommendation", platform_recommendation_node)
    workflow.add_node("final_assembler", final_assembler_node)
    
    # Define edges (linear flow for now)
    workflow.set_entry_point("prepare_context")
    workflow.add_edge("prepare_context", "component_evaluation")
    workflow.add_edge("component_evaluation", "funnel_classification")
    workflow.add_edge("funnel_classification", "platform_recommendation")
    workflow.add_edge("platform_recommendation", "final_assembler")
    workflow.add_edge("final_assembler", END)
    
    return workflow


def compile_analysis_graph():
    """Compile the analysis graph for execution."""
    workflow = create_analysis_graph()
    return workflow.compile()


# Compiled graph instance (singleton)
_compiled_graph = None


def get_analysis_graph():
    """Get the compiled analysis graph (lazy initialization)."""
    global _compiled_graph
    if _compiled_graph is None:
        _compiled_graph = compile_analysis_graph()
    return _compiled_graph
