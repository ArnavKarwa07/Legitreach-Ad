/**
 * TypeScript types for the Legitreach-Ad API.
 */

export type AdAssetType = "image" | "video" | "text" | "mixed";
export type FunnelStage = "TOF" | "MOF" | "BOF";
export type AnalysisStatus = "pending" | "processing" | "completed" | "failed";

export interface User {
  id: number;
  clerk_user_id: string;
  email: string | null;
  created_at: string;
  updated_at: string;
}

export interface BrandCreate {
  brand_name: string;
  industry?: string;
  niche?: string;
  target_audience?: string;
  main_offer?: string;
  price_point?: string;
  positioning?: string;
  tone_of_voice?: string;
  main_goals?: string;
  dream_outcome?: string;
  proof_points?: string;
  customer_pains?: string;
  customer_desires?: string;
  customer_objections?: string;
  additional_context?: Record<string, any>;
}

export interface Brand {
  id: number;
  user_id: number;
  brand_name: string;
  industry: string | null;
  niche: string | null;
  target_audience: string | null;
  main_offer: string | null;
  price_point: string | null;
  positioning: string | null;
  tone_of_voice: string | null;
  main_goals: string | null;
  dream_outcome: string | null;
  proof_points: string | null;
  customer_pains: string | null;
  customer_desires: string | null;
  customer_objections: string | null;
  raw_brand_context_json: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface AdAssetCreate {
  brand_id: number;
  title?: string;
  ad_text?: string;
  file?: File;
}

export interface AdAsset {
  id: number;
  brand_id: number;
  title: string | null;
  asset_type: AdAssetType;
  original_text: string | null;
  extracted_text: string | null;
  file_path: string | null;
  created_at: string;
  updated_at: string;
}

export interface OfferComponentScore {
  id: string;
  analysis_id: string;
  component_id: string;
  component_name: string;
  detected: boolean;
  score: number;
  explanation: string | null;
  suggestions: string | null;
}

export interface AdAnalysis {
  id: string;
  ad_asset_id: string;
  brand_id: string;
  status: AnalysisStatus;
  overall_score: number | null;
  funnel_stage: FunnelStage | null;
  confidence_score: number | null;
  platform_recommendations: Record<string, number> | null;
  summary: string | null;
  recommendations: string[];
  component_scores: OfferComponentScore[];
  created_at: string;
  updated_at: string;
}

export const COMPONENT_DEFINITIONS: Record<
  string,
  { name: string; description: string }
> = {
  COMP1: {
    name: "Dream Outcome",
    description:
      "What the customer ultimately wants (the final transformation)",
  },
  COMP2: {
    name: "Proof / Believability",
    description:
      "Testimonials, numbers, screenshots, credentials, case studies",
  },
  COMP3: {
    name: "Time to Benefit",
    description: "How fast the user gets their first meaningful result",
  },
  COMP4: {
    name: "Effort Reduction",
    description: "How easy you make things for the customer",
  },
  COMP5: {
    name: "Bonus Value",
    description: "Additional items that increase perceived value",
  },
  COMP6: {
    name: "Customer Pains",
    description: "Frustrations, struggles, reasons things aren't working",
  },
  COMP7: {
    name: "Customer Desires",
    description: "Emotional and functional wants",
  },
  COMP8: {
    name: "Customer Objections",
    description: "Reasons they hesitate or don't buy",
  },
  COMP9: {
    name: "Customer Words",
    description: "Real user phrases, slang, and vocabulary",
  },
  COMP10: {
    name: "Identity Cues",
    description: "How customers see themselves (roles, traits, tribe labels)",
  },
};
