"""
Offer Component Definitions (COMP1 → COMP40)

This module defines all 40 offer components from the README.
For the initial implementation, we focus on COMP1-COMP10.

Each component includes:
- Key (COMP1, COMP2, etc.)
- Name
- Description
- Extraction questions (for brand context)
- Evaluation criteria (for ad analysis)
"""
from typing import TypedDict


class OfferComponent(TypedDict):
    """Type definition for an offer component."""
    key: str
    name: str
    description: str
    questions: list[str]
    evaluation_criteria: str


# =============================================================================
# OFFER INPUTS (COMP1-COMP5) - Core value of the offer
# =============================================================================

COMP1_DREAM_OUTCOME: OfferComponent = {
    "key": "COMP1",
    "name": "Dream Outcome",
    "description": "What the customer ultimately wants (the final transformation).",
    "questions": [
        "What is the perfect end-result your user dreams of achieving?",
        "How would users describe success in their own words?",
        "If everything worked ideally, what would their 'after state' look like?"
    ],
    "evaluation_criteria": """
    Evaluate if the ad clearly communicates the ultimate transformation/result the customer will achieve.
    Look for: clear end-state description, aspirational language, emotional connection to the outcome.
    Score higher if the dream outcome is specific, relatable, and emotionally compelling.
    """
}

COMP2_PROOF: OfferComponent = {
    "key": "COMP2",
    "name": "Proof / Believability",
    "description": "Testimonials, numbers, screenshots, credentials, case studies.",
    "questions": [
        "What existing proof do you have (numbers, screenshots, testimonials)?",
        "What internal metrics validate the product's performance?",
        "What authority or certifications increase credibility?"
    ],
    "evaluation_criteria": """
    Evaluate if the ad includes credible proof elements: testimonials, statistics, case studies, 
    credentials, before/after evidence, or social proof. Score higher for specific, verifiable claims 
    rather than vague assertions. Look for numbers, names, timeframes, and measurable outcomes.
    """
}

COMP3_TIME_TO_BENEFIT: OfferComponent = {
    "key": "COMP3",
    "name": "Time to Benefit",
    "description": "How fast the user gets their first meaningful result.",
    "questions": [
        "How long before users typically experience their first win?",
        "What is the average time to full transformation?",
        "What steps reduce time-to-value?"
    ],
    "evaluation_criteria": """
    Evaluate if the ad communicates speed of results or time-to-benefit.
    Look for: specific timeframes, quick-win promises, urgency around speed.
    Score higher if the timeframe is specific, believable, and compelling.
    """
}

COMP4_EFFORT_REDUCTION: OfferComponent = {
    "key": "COMP4",
    "name": "Effort Reduction",
    "description": "How easy you make things for the customer.",
    "questions": [
        "What do users currently find hard?",
        "What steps does your product simplify or automate?",
        "How much time/effort is eliminated?"
    ],
    "evaluation_criteria": """
    Evaluate if the ad emphasizes ease-of-use, simplicity, or reduced effort.
    Look for: 'easy', 'simple', 'automated', 'done-for-you', elimination of pain points.
    Score higher if specific effort savings are quantified or demonstrated.
    """
}

COMP5_BONUS_VALUE: OfferComponent = {
    "key": "COMP5",
    "name": "Bonus Value",
    "description": "Additional items that increase perceived value.",
    "questions": [
        "What bonuses accelerate results?",
        "Which bonuses remove user friction?",
        "What 'extras' do users gladly pay for separately?"
    ],
    "evaluation_criteria": """
    Evaluate if the ad includes bonus offers, additional value, or extras beyond the main offer.
    Look for: free additions, bundled services, exclusive access, limited-time extras.
    Score higher if bonuses are clearly valuable and enhance the main offer.
    """
}

# =============================================================================
# VOC INPUTS (COMP6-COMP10) - Customer psychology
# =============================================================================

COMP6_CUSTOMER_PAINS: OfferComponent = {
    "key": "COMP6",
    "name": "Customer Pains",
    "description": "Frustrations, struggles, reasons things aren't working. Specific, emotionally rooted frustrations.",
    "questions": [
        "What issues do users complain about the most?",
        "What emotions (overwhelm, pressure, confusion) appear regularly?",
        "What does this pain cost the user?"
    ],
    "evaluation_criteria": """
    Evaluate if the ad addresses specific customer pain points.
    Look for: problem identification, frustration acknowledgment, empathy with struggles.
    Score higher if pains are specific, emotionally charged, and consequential.
    A strong pain point: happens frequently, triggers emotion, has measurable cost.
    """
}

COMP7_CUSTOMER_DESIRES: OfferComponent = {
    "key": "COMP7",
    "name": "Customer Desires",
    "description": "Emotional and functional wants.",
    "questions": [
        "What emotional outcome do users crave the most?",
        "What functional outcome do they want faster/easier?",
        "What identity shift do they aspire to?"
    ],
    "evaluation_criteria": """
    Evaluate if the ad speaks to customer desires (emotional and functional).
    Look for: aspirational messaging, identity transformation, desired outcomes.
    Score higher if desires are specific and resonate emotionally.
    """
}

COMP8_CUSTOMER_OBJECTIONS: OfferComponent = {
    "key": "COMP8",
    "name": "Customer Objections",
    "description": "Reasons they hesitate or don't buy.",
    "questions": [
        "What doubts keep users from purchasing?",
        "What misconceptions exist around the product?",
        "Which objections appear in sales conversations?"
    ],
    "evaluation_criteria": """
    Evaluate if the ad preemptively addresses or overcomes common objections.
    Look for: reassurance, risk mitigation, addressing concerns, guarantees.
    Score higher if objections are directly acknowledged and countered.
    """
}

COMP9_CUSTOMER_WORDS: OfferComponent = {
    "key": "COMP9",
    "name": "Customer Words",
    "description": "Real user phrases, slang, and vocabulary.",
    "questions": [
        "What phrases appear repeatedly in reviews or chats?",
        "What slang or metaphors do users use?",
        "What exact words do people use to describe the problem?"
    ],
    "evaluation_criteria": """
    Evaluate if the ad uses authentic customer language and voice.
    Look for: conversational tone, relatable phrases, industry/niche terminology.
    Score higher if the language feels natural and matches target audience speech patterns.
    """
}

COMP10_IDENTITY_CUES: OfferComponent = {
    "key": "COMP10",
    "name": "Identity Cues",
    "description": "How customers see themselves (roles, traits, tribe labels).",
    "questions": [
        "How do users describe themselves?",
        "What group/tribe labels matter to them?",
        "What traits define their decision-making?"
    ],
    "evaluation_criteria": """
    Evaluate if the ad speaks to the customer's identity or self-image.
    Look for: role labels (entrepreneur, creative, busy parent), tribe identification, aspirational identity.
    Score higher if the ad makes the reader feel 'this is for me'.
    """
}

# =============================================================================
# ALL COMPONENTS (for easy access)
# =============================================================================

# First 10 components (implemented in v1)
OFFER_COMPONENTS_V1: list[OfferComponent] = [
    COMP1_DREAM_OUTCOME,
    COMP2_PROOF,
    COMP3_TIME_TO_BENEFIT,
    COMP4_EFFORT_REDUCTION,
    COMP5_BONUS_VALUE,
    COMP6_CUSTOMER_PAINS,
    COMP7_CUSTOMER_DESIRES,
    COMP8_CUSTOMER_OBJECTIONS,
    COMP9_CUSTOMER_WORDS,
    COMP10_IDENTITY_CUES,
]

# Map for quick lookup
COMPONENT_MAP: dict[str, OfferComponent] = {
    comp["key"]: comp for comp in OFFER_COMPONENTS_V1
}


def get_component(key: str) -> OfferComponent | None:
    """Get a component by its key."""
    return COMPONENT_MAP.get(key)


def get_all_component_keys() -> list[str]:
    """Get all component keys."""
    return [comp["key"] for comp in OFFER_COMPONENTS_V1]


def get_components_prompt_context() -> str:
    """
    Generate a formatted string of all components for LLM prompts.
    """
    lines = []
    for comp in OFFER_COMPONENTS_V1:
        lines.append(f"""
{comp['key']} — {comp['name']}
Description: {comp['description']}
Evaluation Criteria: {comp['evaluation_criteria'].strip()}
""")
    return "\n".join(lines)
