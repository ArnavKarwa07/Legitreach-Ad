# Legitreach-Ad Product Documentation

## Overview

**Legitreach-Ad** is an AI-powered Ad/Creative Analysis System that evaluates marketing creatives against proven offer components. It helps marketers understand what their creative is, where it should be used, and what components are missing.

The system is built with a **FastAPI + LangGraph** backend and a **Next.js + TypeScript** frontend, using **Clerk** for authentication and **SQLite** for data persistence.

---

## Product Architecture

### Backend Structure
- **Framework**: FastAPI (Python)
- **AI Pipeline**: LangGraph workflow for multi-stage analysis
- **Database**: SQLite with SQLAlchemy ORM
- **Authentication**: Clerk user ID verification
- **Key Files**:
  - `backend/app/main.py` - API entry point
  - `backend/app/langgraph/graph.py` - Analysis workflow
  - `backend/app/langgraph/components.py` - Component definitions
  - `backend/app/models.py` - Database models
  - `backend/app/schemas.py` - Pydantic schemas

### Frontend Structure
- **Framework**: Next.js with TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Key Pages**:
  - `frontend/pages/index.tsx` - Landing page
  - `frontend/pages/dashboard.tsx` - Main user dashboard
  - `frontend/pages/demo.tsx` - Interactive demo
  - `frontend/pages/onboarding.tsx` - Brand setup
  - `frontend/lib/types.ts` - TypeScript type definitions
  - `frontend/lib/api.ts` - API client

---

## The Theory: 40 Offer Components (COMP1-COMP40)

The system is based on a comprehensive framework of **40 offer components** that make up effective marketing messaging. Currently, the system implements **COMP1-COMP10** with plans to extend to all 40.

### Implemented Components (COMP1-COMP10)

#### **Offer Inputs (COMP1-COMP5)**
These define the core value of the offer:

| Component | Name | Description |
|-----------|------|-------------|
| **COMP1** | Dream Outcome | Ultimate customer transformation (e.g., "Transform Your Body") |
| **COMP2** | Proof/Believability | Testimonials, numbers, credentials (e.g., "50,000+ users") |
| **COMP3** | Time to Benefit | Speed of results (e.g., "See results in 12 weeks") |
| **COMP4** | Effort Reduction | Ease of use (e.g., "No gym required") |
| **COMP5** | Bonus Value | Additional value items (e.g., "FREE meal plans worth $97") |

#### **VOC Inputs (COMP6-COMP10)**
Based on real customer psychology:

| Component | Name | Description |
|-----------|------|-------------|
| **COMP6** | Customer Pains | Specific frustrations (e.g., "No time to workout") |
| **COMP7** | Customer Desires | Emotional/functional wants (e.g., "Want to feel confident") |
| **COMP8** | Customer Objections | Reasons they hesitate (e.g., "Too expensive", "Too complicated") |
| **COMP9** | Customer Words | Real user phrases and slang |
| **COMP10** | Identity Cues | How customers see themselves (e.g., "busy professional") |

### Future Components (COMP11-COMP40)

The framework extends to include:
- **Reality Inputs (COMP11-COMP19)**: Human truth, mechanism, behavioral insights, micro-stories
- **Persuasion Inputs (COMP20-COMP26)**: Curiosity, tension, social proof, before/after, risk reversal
- **Creative Intelligence (COMP27-COMP30)**: Creative angle, message layers, brand voice
- **Context Inputs (COMP31-COMP34)**: Awareness level, funnel stage, channel, format
- **Output Rules (COMP35-COMP40)**: One idea per line, real details, customer voice, emotion

For the complete framework, see the `README.md` starting at line 135.

---

## How It Works: The LangGraph Analysis Pipeline

The analysis uses a **5-node LangGraph workflow** defined in `backend/app/langgraph/graph.py`:

### **Node 1: Prepare Context**
`prepare_context_node` (line 90)
- Combines brand context (from `Brand` model) with ad content
- Formats information into structured prompt context
- Includes brand voice, target audience, customer pains/desires/objections

### **Node 2: Component Evaluation**
`component_evaluation_node` (line 140)
- Evaluates each of COMP1-COMP10 against the ad creative
- For each component:
  - **is_present**: Boolean (detected or not)
  - **score**: 0-10 scale
  - **analysis**: What the ad conveys for this component
  - **what_is_conveyed**: Specific extracted content
  - **suggested_improvements**: How to improve
- Uses Claude Sonnet 4.5 via LangChain

### **Node 3: Funnel Classification**
`funnel_classification_node` (line 240)
- Classifies creative as **TOF** (Top of Funnel), **MOF** (Middle), or **BOF** (Bottom)
- Provides confidence score (0-1 scale)
- Based on component presence and messaging depth:
  - **TOF**: Awareness/curiosity (COMP1, COMP6-7)
  - **MOF**: Education/proof (COMP2, COMP13)
  - **BOF**: Direct offer/conversion (COMP1-5, COMP8, COMP26)

### **Node 4: Platform Recommendation**
`platform_recommendation_node` (line 342)
- Recommends 3-5 platforms based on creative characteristics
- Each platform gets:
  - **score**: 0-100
  - **reason**: Why it's suitable
- Considers: Instagram, Facebook, LinkedIn, Twitter/X, TikTok, YouTube, Email, Google Ads, Pinterest

### **Node 5: Final Assembly**
`final_assembler_node` (line 443)
- Calculates overall score (average of component scores, capped at 100)
- Generates executive **summary** (2-3 sentences)
- Provides **recommendations** (3-5 bullet points as newline-separated string)

---

## The User Flow

### 1. **Onboarding** (`frontend/pages/onboarding.tsx`)
- User signs up via Clerk (Google/email)
- 3-step brand context form:
  1. Brand basics (name, industry, target audience)
  2. Product description (main offer, price point, positioning)
  3. Customer insights (pains, desires, objections)
- Creates `Brand` record via `POST /api/brands/onboard`

### 2. **Dashboard** (`frontend/pages/dashboard.tsx`)
- View brand summary card
- Upload ad assets (text/image) via modal
  - Creates `AdAsset` record via `POST /api/ad-assets`
- View list of past analyses
- Click "Analyze" to run analysis on an asset

### 3. **Analysis Execution**
- Frontend calls `POST /api/ad-analyses/run` with `ad_asset_id`
- Backend:
  1. Fetches `AdAsset` and `Brand` from database
  2. Runs LangGraph workflow
  3. Saves `AdAnalysis` and `OfferComponentScore` records
  4. Returns full analysis response

### 4. **Analysis Modal** (`frontend/pages/dashboard.tsx` line 445)
Displays:
- **Overview Metrics**: Overall score (%), funnel stage, confidence (%)
- **Summary**: Executive summary from LLM
- **Component Scores**: Each COMP1-COMP10 with:
  - Present/Missing badge
  - Score out of 10
  - What's conveyed
  - Analysis
  - Suggested improvements (if any)
  - Visual progress bar (green ≥8, blue ≥5, amber <5)
- **Recommendations**: Newline-separated bullet points in styled card
- **Platform Recommendations**: Each platform with score and reason

---

## The Demo

The `frontend/pages/demo.tsx` provides a **no-login interactive experience** with mock data:

### Mock Brand: FitFlow Pro
- **Industry**: Health & Fitness
- **Target Audience**: Busy professionals aged 25-45
- **Product**: AI-powered fitness coaching app
- **Brand Voice**: Motivational, empowering, results-focused

### 3 Demo Assets
1. **Facebook Ad - Transform Your Body** (TOF, 82% score)
   - Strong on COMP1 (Dream Outcome), COMP2 (Proof), COMP4 (Effort Reduction)
   - Missing COMP5 (Bonus), weak on COMP6 (Pains)
   
2. **Instagram Story - Quick Win** (TOF, 65% score)
   - Strong on COMP4 (Effort Reduction), COMP6 (Pains)
   - Missing COMP1 (Dream Outcome), COMP2 (Proof)

3. **Email - Limited Offer** (BOF, 91% score)
   - Excellent on all components (COMP1-5, COMP8)
   - Includes specific case study, urgency, bonus value

### Demo Features
- Fully functional UI without backend
- Click any analysis to view modal with detailed breakdown
- CTA buttons to sign up for real account
- Sticky demo banner at top

---

## Understanding the Report

When viewing an analysis (in `AnalysisModal` line 445), here's how to interpret it:

### **Overall Score**
- 0-100% calculated as average of component scores (0-10) × 10
- Capped at 100 in `final_assembler_node` line 472
- **Green (80%+)**: Strong creative
- **Blue (60-79%)**: Good creative with improvements needed
- **Amber (<60%)**: Weak creative, major revisions recommended

### **Funnel Stage**
- **TOF (Top of Funnel)**: Awareness/curiosity-driven, light on specifics
- **MOF (Middle of Funnel)**: Educational, mechanism-focused, proof-heavy
- **BOF (Bottom of Funnel)**: Direct offer, clear CTA, objection handling

### **Confidence Score**
- 0-100% how certain the AI is about funnel classification
- Based on component presence patterns and messaging depth

### **Component Breakdown**
Each component shows:
- ✓ **Present** / ✗ **Missing** badge
- **Score** (0-10 with visual bar):
  - **Green (8-10)**: Excellent
  - **Blue (5-7.9)**: Good
  - **Amber (<5)**: Weak/Absent
- **What's Conveyed**: Specific text/elements detected
- **Analysis**: How well it addresses the component
- **Suggestions**: Improvement recommendations (amber warning box)

### **Platform Recommendations**
- Sorted by score (highest first)
- **Green (70%+)**: Highly recommended
- **Amber (50-69%)**: Suitable with adjustments
- **Gray (<50%)**: Not ideal for this creative
- **Reason**: Why this platform fits (audience, format, messaging style)

---

## Key API Endpoints

From `backend/README.md` line 56:

### Brands
- `POST /api/brands/onboard` - Create/update brand (requires `X-Clerk-User-Id` header)
- `GET /api/brands/me` - Get current user's brand
- `GET /api/brands/{brand_id}` - Get specific brand

### Ad Assets
- `POST /api/ad-assets` - Create new ad asset (multipart/form-data)
- `GET /api/ad-assets/{asset_id}` - Get specific asset
- `GET /api/ad-assets?brand_id=X` - List assets for a brand

### Ad Analyses
- `POST /api/ad-analyses/run` - Run analysis on an ad asset
- `GET /api/ad-analyses?brand_id=X` - List analyses for a brand
- `GET /api/ad-analyses/{id}` - Get full analysis with component scores

---

## Data Models

### **Brand** (`backend/app/models.py` line 70)
Stores brand context for personalized analysis:
- Basic info: name, industry, niche, target_audience
- Voice: tone_of_voice, main_goals
- Offer: main_offer, price_point, positioning
- Customer insights: pains, desires, objections, dream_outcome, proof_points

### **AdAsset** (`backend/app/models.py`)
Represents uploaded creative:
- title, asset_type (image/video/text/mixed)
- original_text (user input), extracted_text (OCR if image)
- file_path (for uploaded files)

### **AdAnalysis** (`backend/app/models.py` line 139)
Analysis results:
- overall_score (0-100 float)
- funnel_stage (TOF/MOF/BOF), funnel_confidence (0-1 float)
- platform_recommendations_json (array of platform objects)
- summary (string), recommendations (newline-separated string)
- Relationship to `OfferComponentScore`

### **OfferComponentScore** (`backend/app/schemas.py` line 163)
Individual component evaluation:
- component_key (COMP1-COMP10), component_name
- is_present (boolean), score (0-10 float)
- analysis, what_is_conveyed, suggested_improvements

---

## Technology Stack

### Backend
- **Python 3.11+**
- **FastAPI** - Modern async web framework
- **LangChain** - LLM integration framework
- **LangGraph** - Multi-agent workflow orchestration
- **Claude Sonnet 4.5** - LLM via Anthropic API
- **SQLAlchemy** - ORM for database operations
- **SQLite** - Lightweight file-based database
- **Python-Multipart** - File upload handling

### Frontend
- **Next.js 14** - React framework with SSR
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first styling
- **Clerk** - Authentication provider
- **Axios** - HTTP client for API calls

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Uvicorn** - ASGI server for FastAPI

---

## Setup & Deployment

### Quick Start

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp sample.env .env
# Edit .env with your ANTHROPIC_API_KEY
uvicorn app.main:app --reload
```

#### Frontend
```bash
cd frontend
npm install
cp sample.env .env.local
# Edit .env.local with your Clerk keys
npm run dev
```

### Environment Variables

**Backend** (`backend/sample.env`):
- `ANTHROPIC_API_KEY` - Claude API key
- `DATABASE_URL` - SQLite connection string
- `CLERK_PUBLISHABLE_KEY` - Clerk public key (for JWKS verification)

**Frontend** (`frontend/sample.env`):
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `CLERK_SECRET_KEY` - Clerk secret key
- `NEXT_PUBLIC_API_BASE_URL` - Backend API URL (http://localhost:8000)

---

## Future Enhancements

### Planned Features
1. **Extend to all 40 components** (COMP11-COMP40)
   - Reality inputs (mechanism, micro-stories, behavioral insights)
   - Persuasion layers (curiosity, tension, before/after)
   - Creative intelligence (angle, message layers, brand voice)
   - Context inputs (awareness level, channel, format)
   - Output rules (style guidelines)

2. **Visual Creative Analysis**
   - OCR for text extraction from images
   - Image composition analysis
   - Brand consistency checking

3. **Competitive Benchmarking**
   - Compare against industry averages
   - Track performance over time

4. **A/B Test Recommendations**
   - Suggest variant ideas based on gaps
   - Predict performance of variants

5. **Export & Collaboration**
   - PDF report generation
   - Team sharing features
   - Integrations (Slack, email)

### Technical Debt
- Add caching for LLM responses
- Implement rate limiting
- Add database migrations (Alembic)
- Improve error handling and logging
- Add unit/integration tests
- Switch to production-ready database (PostgreSQL)

---

## Key Insights & Design Decisions

### Why LangGraph?
- **Multi-stage pipeline**: Each node handles a specific analysis aspect
- **State management**: Passes context between nodes efficiently
- **Extensibility**: Easy to add new evaluation nodes (COMP11-40)
- **Debugging**: Clear separation of concerns for troubleshooting

### Why 0-10 Component Scores?
- More granular than binary (present/absent)
- Aligns with human intuition (like school grades)
- Easy to aggregate into overall score (average × 10 = percentage)

### Why String Recommendations?
- Initially considered array, but string with newlines is simpler
- Frontend can split by `\n` if needed
- LLM naturally generates bullet points as text
- See `AdAnalysis.recommendations` line 94

### Why Brand Context First?
- Analysis quality depends heavily on knowing the brand
- Allows personalization (tone, audience, positioning)
- Enables deeper insights than generic template analysis
- See `prepare_context_node` line 90

---

## Resources & References

- **Main README**: `README.md`
- **Backend README**: `backend/README.md`
- **Frontend README**: `frontend/README.md`
- **Component Definitions**: `backend/app/langgraph/components.py`
- **Type Definitions**: `frontend/lib/types.ts`
- **Live Demo**: http://localhost:3000/demo (when running locally)

---

This documentation consolidates the product explanation, theoretical framework, demo walkthrough, and report interpretation into a single reference. For implementation details, refer to the linked source files.
