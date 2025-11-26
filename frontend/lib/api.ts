/**
 * API client for communicating with the Legitreach-Ad backend.
 */

import type {
  Brand,
  BrandCreate,
  AdAsset,
  AdAssetCreate,
  AdAnalysis,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function getClerkToken(): Promise<string | null> {
  // In client-side, we use Clerk's getToken
  if (typeof window !== "undefined") {
    // @ts-expect-error - Clerk is loaded globally
    const clerk = window.Clerk;
    if (clerk && clerk.session) {
      return clerk.session.getToken();
    }
  }
  return null;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  const token = await getClerkToken();

  const headers: HeadersInit = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  if (!(options.body instanceof FormData)) {
    (headers as Record<string, string>)["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.detail || `Request failed with status ${response.status}`,
      response.status
    );
  }

  return response.json();
}

// Wrapper object for API methods
export const api = {
  // Brand API
  async createBrand(data: BrandCreate): Promise<Brand> {
    return apiRequest<Brand>("/api/brands", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getBrands(): Promise<Brand[]> {
    return apiRequest<Brand[]>("/api/brands");
  },

  async getBrand(brandId: string): Promise<Brand> {
    return apiRequest<Brand>(`/api/brands/${brandId}`);
  },

  // Ad Asset API
  async createAsset(data: AdAssetCreate): Promise<AdAsset> {
    return apiRequest<AdAsset>("/api/assets", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getAssets(brandId: string): Promise<AdAsset[]> {
    return apiRequest<AdAsset[]>(`/api/assets?brand_id=${brandId}`);
  },

  async getAsset(assetId: string): Promise<AdAsset> {
    return apiRequest<AdAsset>(`/api/assets/${assetId}`);
  },

  // Ad Analysis API
  async createAnalysis(adAssetId: string): Promise<AdAnalysis> {
    return apiRequest<AdAnalysis>("/api/analyses", {
      method: "POST",
      body: JSON.stringify({ ad_asset_id: adAssetId }),
    });
  },

  async getAnalyses(brandId: string): Promise<AdAnalysis[]> {
    return apiRequest<AdAnalysis[]>(`/api/analyses?brand_id=${brandId}`);
  },

  async getAnalysis(analysisId: string): Promise<AdAnalysis> {
    return apiRequest<AdAnalysis>(`/api/analyses/${analysisId}`);
  },
};
