# Legitreach-Ad Backend

FastAPI + LangGraph backend for the Ad/Creative Analysis System.

## Features

- **Brand Onboarding**: Collect and store brand context for personalized analysis
- **Ad Asset Management**: Upload and manage ad creatives (text/image)
- **LangGraph Analysis Pipeline**: AI-powered analysis against 10 offer components
- **Platform Recommendations**: Smart platform matching based on ad characteristics
- **SQLite Database**: Lightweight, file-based persistence

## Setup

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

Copy `.env` and update values if needed:

```bash
# .env is already created with your Google API key
```

### 4. Run the Server

```bash
# Development mode with auto-reload
python -m uvicorn app.main:app --reload --port 8000

# Or using the main module
python -m app.main
```

The server will start at `http://localhost:8000`.

## API Documentation

Once running, visit:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

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

## LangGraph Workflow

The analysis pipeline consists of these nodes:

1. **prepare_context_node**: Combines brand context + ad content
2. **component_evaluation_node**: Evaluates against COMP1-COMP10
3. **funnel_classification_node**: Classifies as TOF/MOF/BOF
4. **platform_recommendation_node**: Recommends platforms
5. **final_assembler_node**: Generates summary and recommendations

## Offer Components (COMP1-COMP10)

| Key    | Name                | Description                        |
| ------ | ------------------- | ---------------------------------- |
| COMP1  | Dream Outcome       | Ultimate customer transformation   |
| COMP2  | Proof/Believability | Testimonials, numbers, credentials |
| COMP3  | Time to Benefit     | Speed of results                   |
| COMP4  | Effort Reduction    | Ease of use                        |
| COMP5  | Bonus Value         | Additional value items             |
| COMP6  | Customer Pains      | Frustrations and struggles         |
| COMP7  | Customer Desires    | Emotional/functional wants         |
| COMP8  | Customer Objections | Reasons they hesitate              |
| COMP9  | Customer Words      | Real user phrases                  |
| COMP10 | Identity Cues       | Customer self-image                |

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app entrypoint
│   ├── config.py            # Settings management
│   ├── db.py                # Database engine & session
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── auth.py              # Auth dependencies
│   ├── langgraph/
│   │   ├── __init__.py
│   │   ├── graph.py         # LangGraph workflow
│   │   └── components.py    # Component definitions
│   ├── services/
│   │   ├── __init__.py
│   │   └── analysis.py      # Analysis service
│   └── routes/
│       ├── __init__.py
│       ├── brands.py        # Brand endpoints
│       ├── ad_assets.py     # Asset endpoints
│       └── ad_analyses.py   # Analysis endpoints
├── uploads/                  # Uploaded files directory
├── requirements.txt
└── .env
```

## Extending to All 40 Components

To add more components (COMP11-COMP40):

1. Add definitions to `app/langgraph/components.py`
2. Update `OFFER_COMPONENTS_V1` list
3. The analysis pipeline will automatically include them
