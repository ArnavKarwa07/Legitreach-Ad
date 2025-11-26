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

async function getClerkUserId(): Promise<string | null> {
  // Get the Clerk user ID
  if (typeof window !== "undefined") {
    // @ts-expect-error - Clerk is loaded globally
    const clerk = window.Clerk;
    if (clerk && clerk.user) {
      return clerk.user.id;
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
  const userId = await getClerkUserId();

  const headers: HeadersInit = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(userId ? { "X-Clerk-User-Id": userId } : {}),
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
    return apiRequest<Brand>("/api/brands/onboard", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getBrands(): Promise<Brand[]> {
    // Get the current user's brand
    const brand = await apiRequest<Brand>("/api/brands/me");
    return brand ? [brand] : [];
  },

  async getBrand(brandId: string): Promise<Brand> {
    return apiRequest<Brand>(`/api/brands/${brandId}`);
  },

  // Ad Asset API
  async createAsset(data: AdAssetCreate): Promise<AdAsset> {
    const formData = new FormData();
    formData.append("brand_id", data.brand_id.toString());
    if (data.title) formData.append("title", data.title);
    if (data.ad_text) formData.append("ad_text", data.ad_text);
    if (data.file) formData.append("file", data.file);

    return apiRequest<AdAsset>("/api/ad-assets", {
      method: "POST",
      body: formData,
    });
  },

  async getAssets(brandId: number): Promise<AdAsset[]> {
    return apiRequest<AdAsset[]>(`/api/ad-assets?brand_id=${brandId}`);
  },

  async getAsset(assetId: number): Promise<AdAsset> {
    return apiRequest<AdAsset>(`/api/ad-assets/${assetId}`);
  },

  // Ad Analysis API
  async createAnalysis(adAssetId: number): Promise<AdAnalysis> {
    return apiRequest<AdAnalysis>("/api/ad-analyses/run", {
      method: "POST",
      body: JSON.stringify({ ad_asset_id: adAssetId }),
    });
  },

  async getAnalyses(brandId: number): Promise<AdAnalysis[]> {
    const response = await apiRequest<{ analyses: any[]; total: number }>(
      `/api/ad-analyses?brand_id=${brandId}`
    );
    return response.analyses;
  },

  async getAnalysis(analysisId: number): Promise<AdAnalysis> {
    return apiRequest<AdAnalysis>(`/api/ad-analyses/${analysisId}`);
  },
};
