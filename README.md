# Legitreach-Ad

An AI-powered Ad/Creative Analysis System that evaluates marketing creatives against proven offer components.

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- npm or yarn

### Backend (Python + FastAPI + LangGraph)

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# or: source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Copy environment file and configure
copy .env.example .env  # Windows
# or: cp .env.example .env  # Linux/Mac
# Edit .env and add your GOOGLE_API_KEY

# Run the server
python -m uvicorn app.main:app --reload --port 8000
```

The API will be available at http://localhost:8000. API docs at http://localhost:8000/docs.

### Frontend (Next.js + TypeScript + Clerk)

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file and configure
copy .env.example .env.local  # Windows
# or: cp .env.example .env.local  # Linux/Mac
# Edit .env.local and add your Clerk keys

# Run the development server
npm run dev
```

The frontend will be available at http://localhost:3000.

### Environment Variables

#### Backend (.env)

```
GOOGLE_API_KEY=your_google_ai_studio_key
DATABASE_URL=sqlite+aiosqlite:///./legitreach.db
DEBUG=true
```

#### Frontend (.env.local)

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📁 Project Structure

```
Legitreach-Ad/
├── backend/
│   ├── app/
│   │   ├── langgraph/       # LangGraph workflow & components
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Business logic
│   │   ├── models.py        # SQLAlchemy models
│   │   ├── schemas.py       # Pydantic schemas
│   │   └── main.py          # FastAPI app
│   └── requirements.txt
│
├── frontend/
│   ├── pages/               # Next.js pages
│   ├── lib/                 # Types & API client
│   ├── styles/              # CSS styles
│   └── package.json
│
└── README.md
```

## 🔧 Features

- **Component Extraction**: Analyzes creatives against 10 offer components (COMP1-COMP10)
- **Funnel Classification**: Predicts funnel stage (TOF, MOF, BOF) with confidence scoring
- **Platform Recommendations**: Suggests best platforms for the creative
- **Interactive Dashboard**: Upload, analyze, and view detailed reports

---

# Product 1 – Creative Profiler & Funnel Mapper

**What your creative is, where it should be, what else you need.**

**Input:**

- Creative asset- Including text, Length agnostic, Inputs can range from ads from all platforms to creative content.

**Core functions:**

1. **Component Extraction**

   - Detect presence/absence of key components: Analysis Engine- what the creative conveys for each offer component/ What is being conveyed.
     - Offer components - 1 to 10

1. **Coverage & Gap Scoring**
   - Give each component:
     - Binary: present/absent.
     - Quality score (0–1 or 0–10).
     - Component coverage vector for the creative.
1. **Funnel Stage Classification**
   - Predict funnel stage: TOF, MOF, BOF
   - Confidence/ Persuation score.
1. **Recommendations**
   - “This is a mid-funnel consideration creative at 0.68 confidence.”
   - “Missing: strong Proof, clear Mechanism, specific CTA.”

**Output:**

- Structured report:
  - What the creative is (funnel, archetype).
  - Where it should be used.
  - What components are missing or weak.

---

To DEVELOP

“CREATIVE SCORING DASHBOARD”

- SCOPE CLARITY - BARE MINIMUM.

INPUT- “brand context, input creative, 2 3 yes no questions”

EMBEDDINGS- (COMPONENT→ WORDS)

---

1. Onboarding- Sign Up - Google login, Meta ads.
2. What do you sell? Who do u sell it to? Where- which platform?
3. Then UPLOAD— INPUT, IMAGE - Basic Analysis- Very simple for this product.
4. GENERATE REPORT - BACKEND
5. OUTPUT- It is interactive

SECTION 0 — COMPONENT DEFINITIONS (COMP1 → COMP40)
A complete reference table so your team always knows what each component means.
(Includes 3 questions per component for client/product team extraction.)

OFFER INPUTS (COMP1–COMP5)
These define the core value of the offer.

COMP1 — Dream Outcome
What the customer ultimately wants (the final transformation).
Ask the client:
What is the perfect end-result your user dreams of achieving?

How would users describe success in their own words?

If everything worked ideally, what would their “after state” look like?

COMP2 — Proof / Believability
Testimonials, numbers, screenshots, credentials, case studies.
Ask the client:
What existing proof do you have (numbers, screenshots, testimonials)?

What internal metrics validate the product’s performance?

What authority or certifications increase credibility?

COMP3 — Time to Benefit
How fast the user gets their first meaningful result.
Ask the client:
How long before users typically experience their first win?

What is the average time to full transformation?

What steps reduce time-to-value?

COMP4 — Effort Reduction
How easy you make things for the customer.
Ask the client:
What do users currently find hard?

What steps does your product simplify or automate?

How much time/effort is eliminated?

COMP5 — Bonus Value
Additional items that increase perceived value.
Ask the client:
What bonuses accelerate results?

Which bonuses remove user friction?

What “extras” do users gladly pay for separately?

VOC INPUTS (COMP6–COMP10)
Based on real customer psychology.

COMP6 — Customer Pains (Product-Specific Common Pain Points)
Frustrations, struggles, reasons things aren’t working.
Improved Pain Point Definition
A pain point is a specific, emotionally rooted frustration that:
Happens at a clear moment

Causes anxiety or inconvenience

Has real cost (effort, time, identity, money)

Ask the client:
What issues do users complain about the most?

What emotions (overwhelm, pressure, confusion) appear regularly?

What does this pain cost the user?

COMP7 — Customer Desires
Emotional and functional wants.
Ask the client:
What emotional outcome do users crave the most?

What functional outcome do they want faster/easier?

What identity shift do they aspire to?

COMP8 — Customer Objections
Reasons they hesitate or don’t buy.
Ask the client:
What doubts keep users from purchasing?

What misconceptions exist around the product?

Which objections appear in sales conversations?

COMP9 — Customer Words
Real user phrases.
Ask the client:
What phrases appear repeatedly in reviews or chats?

What slang or metaphors do users use?

What exact words do people use to describe the problem?

COMP10 — Identity Cues (Exact Target Audience)
How they see themselves (MBTI, OCEAN, roles).
Ask the client:
How do users describe themselves?

What group/tribe labels matter to them?

What traits define their decision-making?

REALITY INPUTS (COMP11–COMP19)
Grounding truth, story, and behavioral insight.

COMP11 — Human Truth
Universal emotional truth behind buyer behavior.
Ask the client:
What universal emotion drives users in this category?

What fears/desires shape behavior?

What truth always applies?

COMP12 — Misunderstood Problem
The real problem behind the surface-level complaint.
Ask the client:
What problem do users think they have?

What deeper problem do they actually have?

What do they consistently misdiagnose?

COMP13 — Mechanism (1 Sentence)
The core reason the product works.
Ask the client:
What makes your solution truly work?

What simple one-line mechanism explains your product?

What’s the unique element others don’t have?

COMP14 — Behavioral Insight
Patterns behind how people behave.
Ask the client:
What repeated behaviors have you observed?

What mistakes do users make before your product?

What psychological pattern exists?

COMP15 — Micro-story
A short anecdote that demonstrates value.
Ask the client:
Give one 1–2 sentence customer story.

What moment best shows the product’s impact?

What relatable scenario can communicate transformation?

COMP16 — Real Number / Evidence
Stats, metrics, measurable outcomes.
Ask the client:
What numbers best show improvement?

What measurable outcomes can you share?

What percentage/time/cost changes matter most?

COMP17 — Honest Limitation (Who shouldn’t buy)
Transparency builds trust.
Ask the client:
Who is NOT a good fit?

When will the product fail?

What expectations should you set?

COMP18 — When-To-Use Moment (Best When)
Where the product works best.
Ask the client:
When should users ideally use this?

What scenario amplifies results?

What “trigger moment” creates urgency?

COMP19 — Why-Now Logic
Why this matters right now.
Ask the client:
Why is “now” the best time to buy?

What changed in the market?

What happens if they wait?

PERSUASION INPUTS (COMP20–COMP26)
Story, emotion, copywriting structure.
COMP20 — Curiosity Trigger
The hook that stops the scroll.
COMP21 — Tension / Contrast
Old way vs. new way, myth vs. truth.
COMP22 — Social Proof Angle
Showing others using or loving it.
COMP23 — Specificity Detail
Names, numbers, details that build credibility.
COMP24 — Before → After
Transformation model.
COMP25 — Problem → Agitate → Outcome
Classic storytelling flow.
COMP26 — Risk Reversal
Guarantee or promise proving they won’t lose.

CREATIVE INTELLIGENCE INPUTS (COMP27–COMP30)
COMP27 — Creative Angle (Optional)
Ask the client:
What POV resonates best?

What story angle matches brand identity?

What angle is proven to convert?

COMP28 — Message Layers (3–5)
Ask the client:
What 3–5 ideas MUST be communicated?

What order best guides understanding?

What message is mandatory?

COMP29 — Subtext Intention
Ask the client:
What emotion should messaging imply?

What should the reader feel underneath the words?

What psychological shift should happen?

COMP30 — Brand POV / Voice
Ask the client:
What tone aligns with your brand?

What adjectives describe your brand?

What tone builds the most trust?

CONTEXT INPUTS (COMP31–COMP34)
COMP31 — Awareness Level
Ask the client:
How aware is your target user of the problem?

Do they know solutions exist?

Do they know YOU?

COMP32 — Funnel Stage
Ask the client:
Where do prospects drop off most?

What stage is most profitable?

What stage lacks content currently?

COMP33 — Channel
Ask the client:
What channels do you use regularly?

Which have the highest conversion?

Which channels does your audience prefer?

COMP34 — Creative Format
Ask the client:
What content formats work best?

What formats do channels require?

What formats do customers consume most?

.

OUTPUT RULES (COMP35–COMP40)
COMP35 — One Idea Per Line
Clear, simple statements.
COMP36 — One Real Detail Required
Proof grounding each message.
COMP37 — Customer Voice Line Required
Use real customer phrasing.
COMP38 — Emotional Beat Required
Emotion must be present.
COMP39 — No Hype / No Vague Claims
No empty superlatives.

SECTION 1 — HOW TO ASSEMBLE AN OFFER
This is the full internal offer-assembly method based on COMP1–COMP40.

STEP 1 — Map Inputs (COMP1–COMP19)
Use brand, product, and customer data to populate:
Dream outcome

Proof

Pains

Desires

Mechanism

Objections

Micro-stories

Real numbers

Urgency triggers

Without these, the offer will be weak.

STEP 2 — Create the Offer Core (COMP1–COMP5, COMP13)
The “offer core” =
Dream Outcome + Mechanism + Proof + Time + Effort Reduction + Bonuses
This becomes your primary:
Sales headline

Website hero

Email CTA

Ad hook → script

STEP 3 — Add Persuasion Layers (COMP20–COMP26)
These add emotional depth:
Curiosity

Tension

Before/After

POA (Problem → Agitate → Outcome)

Social proof

Risk reversal

This transforms the offer from “interesting” to “desirable.”

STEP 4 — Add Creative Direction (COMP27–COMP30)
Here you decide:
Voice

Tone

Angle

Narrative

Subtext

So the offer feels aligned with the brand.

STEP 5 — Funnel + Awareness Mapping (COMP31–COMP34)
Before generating any content, determine:
What awareness stage the reader is in

Where they are in the funnel

What channel you’ll communicate through

What creative format is required

The message ALWAYS changes depending on these.

STEP 6 — Generate Using Output Rules (COMP35–COMP40)
Follow execution rules:
One idea per line

One real detail

One customer phrase

One emotion

No hype

3–5 variants

This ensures consistently high-quality content.

SECTION 2 — WHAT COMPONENTS MAKE UP WEBSITE, EMAILS, ADS & FUNNEL STEPS
Below is the complete mapping of COMP → deliverables.

A) WEBSITE MESSAGING
Homepage Hero Uses:
COMP1 — Dream Outcome

COMP2 — Proof

COMP3 — Time to Benefit

COMP6–7 — Pains & Desires

COMP9 — Customer Words

COMP13 — Mechanism

COMP16 — Real Numbers

COMP27–30 — Creative Direction

COMP35–36 — Output Rules

Purpose:
Immediately communicate transformation + trust.

Benefits Section
Uses COMP1, COMP4, COMP5, COMP7
Social Proof Section
Uses COMP2, COMP16, COMP22, COMP9
Why-It-Works Section
Uses COMP11, COMP12, COMP13, COMP14
Offer Section
Uses COMP1–5, COMP24, COMP26
FAQ / Objections
Uses COMP8, COMP17

B) PRODUCT PAGE (PDP)
Uses COMP1–COMP26 + output rules because this page’s only purpose is conversion.

C) COLD ADS (Static & Video)
Use:
COMP20 — Curiosity Hook

COMP6–7 — Pain/Desire

COMP13 — Light Mechanism Hint

COMP24 — Transformation

COMP16 — Real Detail

COMP35 — One idea per line

D) RETARGETING ADS
Use:
COMP2 — Proof

COMP8 — Objections

COMP17 — Honest limitation

COMP26 — Risk reversal

COMP19 — Why-now logic

E) EMAIL WARM OUTREACH
Email 1 — Pattern Interrupt
COMP20, COMP6, COMP11
Email 2 — Problem Clarification
COMP6, COMP12, COMP15
Email 3 — Solution / Mechanism
COMP13, COMP2, COMP23
Email 4 — Offer Reveal
COMP1, COMP5, COMP26
Email 5 — Objection Handling
COMP8, COMP16, COMP17

SECTION 3 — WHAT THE READER NEEDS AT EACH AWARENESS & FUNNEL STAGE
Use this to decide what message to show at what time.

AWARENESS STAGES

1. Unaware
   Needs:
   Curiosity

Identity reflection

Emotional insight

Story

No product talk.

2. Problem Aware
   Needs:
   Pain articulation

Empathy

Validation

No product yet.

3. Solution Aware
   Needs:
   Mechanism

Education

Differentiation

4. Product Aware
   Needs:
   Social proof

Value breakdown

Objection removal

Risk reversal

5. Most Aware
   Needs:
   Offer

Bonuses

Scarcity

Strong CTA

FUNNEL STAGES
TOF — Top of Funnel
Give:
Curiosity

Pain/desire

Human truth

Emotional activation

MOF — Middle of Funnel
Give:
Mechanism

Proof

Story

Differentiation

Objection handling

BOF — Bottom of Funnel
Give:
Clear offer

Bonuses

Risk reversal

Scarcity

Social proof

Direct CTA

SECTION — DEFINING PAIN POINTS (Improved & Expanded)
For internal team + client/product discovery

What Are Pain Points?
Pain points are specific, emotionally rooted frustrations or negative experiences your customer repeatedly faces while trying to achieve a desired outcome.
A properly defined pain point must be:

1. Specific (Not Generic)
   It describes a real moment in the customer’s workflow or life.
   Weak: “Users struggle with editing.”
   Strong: “Users spend 3–4 hours editing one video because tools glitch and frames desync.”

2. Emotionally Charged
   It includes the feeling attached to the problem — frustration, overwhelm, anxiety, embarrassment, fear of failure, etc.
   Weak: “Uploading takes time.”
   Strong: “Users feel anxious waiting 45 minutes for a single video upload while their deadlines pile up.”

3. Consequential
   It describes what the pain costs the customer:
   Time

Money

Identity/pride

Lost opportunities

Delayed results

Stress or mental load

Weak: “Hard to track sales.”
Strong: “Users lose track of revenue data and feel embarrassed presenting inaccurate numbers to their teams.”

4. Tied to Behavior
   It explains how the pain affects decisions or actions.
   Weak: “People dislike complexity.”
   Strong: “Users avoid opening the analytics dashboard because it overwhelms them, causing inconsistent tracking.”

Types of Pain Points

1. Functional Pain Points
   Concrete problems in tasks or workflows.
   Examples:
   Slow tools

Missing features

Broken processes

Confusion during setup

2. Emotional Pain Points
   How users feel because of the problem.
   Examples:
   “I’m not good enough.”

“This stresses me out.”

“I’m falling behind.”

3. Consequential Pain Points
   What the problem costs the user.
   Examples:
   Missed revenue

Lost time

Damaged confidence

Reputation risk

Pain Point Extraction Questions (Ask the Client/Product Team)
Use these every time you gather VOC or conduct onboarding.

1. What recurring tasks or moments consistently frustrate your users?
   Look for:
   Repeated complaints

Negative emotional reactions

Areas where people hesitate or get stuck

2. What emotions appear most frequently in user feedback?
   Common emotional tags:
   “I feel overwhelmed”

“I’m confused”

“This feels slow and stressful”

“I hate how long this takes”

3. What does the pain cost the user if left unresolved?
   Probe deeper:
   Time lost?

Money lost?

Missed opportunities?

Damaged self-esteem or trust?

Reputation or performance risks?

How to Tell If a Pain Point Is Strong Enough
A good pain point should meet ALL 3 criteria:
✔ It happens frequently
✔ It triggers emotion
✔ It has a measurable cost
If ANY of these three are missing → it’s not strong enough.

Examples of Well-Defined Pain Points
Weak Pain:
“Users don’t like complicated tools.”
Strong Pain:
“Users feel overwhelmed by 14-step setup flows and often abandon the process halfway, causing them to never experience the value of the product.”

Weak Pain:
“Emails take long to write.”
Strong Pain:
“Users spend 45–60 minutes rewriting cold emails because they fear sounding unprofessional or robotic, making the entire outreach feel draining.”

Weak Pain:
“Managing inventory is difficult.”
Strong Pain:
“Store owners often sell out of popular items without realizing it, losing thousands per month while feeling stressed and embarrassed in front of customers.”

Pain Points in the Context of COMP Mapping
COMP6 — Customer Pains comes from:
Reviews

Support tickets

Reddit threads

Sales calls

Support chats

Interview notes

COMP7 — Desires are the flip side of pain points.
Pain = what they want to avoid.
Desire = what they want instead.
COMP8 — Objections often originate from pain points.
Example:
Pain → “It takes too long”
Objection → “Will your product save me time?”

Pain Point Formula (Use Internally)
To produce deep pain points, use this internal template:
[User] feels [negative emotion] because [specific moment/task] which causes [consequence].
Examples:
“Creators feel overwhelmed because editing takes hours, causing them to post inconsistently and lose momentum.”

“Founders feel frustrated because analytics dashboards confuse them, leading to bad decision-making.”

“Students feel anxious because they can’t organize their tasks, making them miss deadlines.”

Pain Points Are the Foundation of:
Ads

Emails

Websites

Landing pages

UGC scripts

Hooks

Product positioning

Offer creation

Content angles

Creative direction

Everything starts from understanding pain.
