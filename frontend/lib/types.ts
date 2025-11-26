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
  name: string;
  industry: string;
  target_audience: string;
  brand_voice?: string;
  product_description: string;
}

export interface Brand {
  id: string;
  user_id: string;
  name: string;
  industry: string;
  target_audience: string;
  brand_voice: string | null;
  product_description: string;
  created_at: string;
  updated_at: string;
}

export interface AdAssetCreate {
  brand_id: string;
  name: string;
  asset_type: AdAssetType;
  text_content?: string;
  file_url?: string;
}

export interface AdAsset {
  id: string;
  brand_id: string;
  name: string;
  asset_type: AdAssetType;
  text_content: string | null;
  file_url: string | null;
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
