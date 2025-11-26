import { useUser, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import type { Brand, AdAsset, AdAnalysis } from "@/lib/types";
import Link from "next/link";

export default function DashboardPage() {
  const { isSignedIn, isLoaded, user } = useUser();
  const router = useRouter();

  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [assets, setAssets] = useState<AdAsset[]>([]);
  const [analyses, setAnalyses] = useState<AdAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AdAnalysis | null>(
    null
  );

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
      return;
    }

    if (isSignedIn) {
      api
        .getBrands()
        .then((data) => {
          setBrands(data);
          if (data.length > 0) {
            setSelectedBrand(data[0]);
          }
        })
        .catch((err) => console.error("Failed to fetch brands:", err))
        .finally(() => setLoading(false));
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (!selectedBrand) return;

    Promise.all([
      api.getAssets(selectedBrand.id),
      api.getAnalyses(selectedBrand.id),
    ])
      .then(([assetsData, analysesData]) => {
        setAssets(assetsData);
        setAnalyses(analysesData);
      })
      .catch((err) => console.error("Failed to fetch data:", err));
  }, [selectedBrand]);

  const refreshData = () => {
    if (!selectedBrand) return;
    Promise.all([
      api.getAssets(selectedBrand.id),
      api.getAnalyses(selectedBrand.id),
    ])
      .then(([assetsData, analysesData]) => {
        setAssets(assetsData);
        setAnalyses(analysesData);
      })
      .catch((err) => console.error("Failed to fetch data:", err));
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (brands.length === 0) {
    router.push("/onboarding");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary-600">Legitreach-Ad</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user?.firstName || user?.emailAddresses[0]?.emailAddress}
            </span>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Brand Selector */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Brand:</label>
            <select
              value={selectedBrand?.id || ""}
              onChange={(e) => {
                const brand = brands.find((b) => b.id === e.target.value);
                if (brand) setSelectedBrand(brand);
              }}
              className="input max-w-xs"
            >
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.brand_name}
                </option>
              ))}
            </select>
            <Link
              href="/onboarding"
              className="text-sm text-primary-600 hover:underline"
            >
              + Add Brand
            </Link>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn-primary"
          >
            Upload Ad Creative
          </button>
        </div>

        {/* Brand Summary Card */}
        {selectedBrand && (
          <div className="card mb-8">
            <h2 className="text-lg font-semibold mb-4">Brand Context</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Industry:</span>{" "}
                <span className="font-medium">{selectedBrand.industry}</span>
              </div>
              <div>
                <span className="text-gray-500">Voice:</span>{" "}
                <span className="font-medium">
                  {selectedBrand.tone_of_voice || "Not specified"}
                </span>
              </div>
              <div className="md:col-span-2">
                <span className="text-gray-500">Target Audience:</span>{" "}
                <span className="font-medium">
                  {selectedBrand.target_audience}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Recent Analyses */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Recent Analyses</h2>
          {analyses.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No analyses yet. Upload an ad creative to get started!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Asset
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Funnel Stage
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Overall Score
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {analyses.map((analysis) => (
                    <tr
                      key={analysis.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <span className="text-sm font-medium">
                          {assets.find((a) => a.id === analysis.ad_asset_id)
                            ?.name || "Unknown"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            analysis.funnel_stage === "TOF"
                              ? "bg-blue-100 text-blue-800"
                              : analysis.funnel_stage === "MOF"
                              ? "bg-yellow-100 text-yellow-800"
                              : analysis.funnel_stage === "BOF"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {analysis.funnel_stage || "Pending"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm">
                          {analysis.overall_score
                            ? `${Math.round(analysis.overall_score * 100)}%`
                            : "-"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            analysis.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : analysis.status === "processing"
                              ? "bg-yellow-100 text-yellow-800"
                              : analysis.status === "failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {analysis.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => {
                            setSelectedAnalysis(analysis);
                            setShowAnalysisModal(true);
                          }}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && selectedBrand && (
        <UploadModal
          brandId={selectedBrand.id}
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => {
            setShowUploadModal(false);
            refreshData();
          }}
        />
      )}

      {/* Analysis Details Modal */}
      {showAnalysisModal && selectedAnalysis && (
        <AnalysisModal
          analysis={selectedAnalysis}
          onClose={() => {
            setShowAnalysisModal(false);
            setSelectedAnalysis(null);
          }}
        />
      )}
    </div>
  );
}

// Upload Modal Component
function UploadModal({
  brandId,
  onClose,
  onSuccess,
}: {
  brandId: number;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState("");
  const [assetType, setAssetType] = useState<"image" | "video" | "text">(
    "text"
  );
  const [textContent, setTextContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create asset
      const asset = await api.createAsset({
        brand_id: brandId,
        title: name,
        ad_text: textContent,
      });

      // Start analysis
      setAnalyzing(true);
      await api.createAnalysis(asset.id);

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload asset");
    } finally {
      setLoading(false);
      setAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Upload Ad Creative</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Asset Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                placeholder="e.g., Facebook Ad - Summer Sale"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Asset Type
              </label>
              <select
                value={assetType}
                onChange={(e) =>
                  setAssetType(e.target.value as "image" | "video" | "text")
                }
                className="input"
              >
                <option value="text">Text/Copy</option>
                <option value="image">Image (coming soon)</option>
                <option value="video">Video (coming soon)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ad Copy / Text Content *
              </label>
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                className="input min-h-[200px]"
                placeholder="Paste your ad copy here..."
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading || !name || !textContent}
              >
                {analyzing
                  ? "Analyzing..."
                  : loading
                  ? "Uploading..."
                  : "Upload & Analyze"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Analysis Modal Component
function AnalysisModal({
  analysis,
  onClose,
}: {
  analysis: AdAnalysis;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Analysis Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Overview */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary-600">
                {analysis.overall_score
                  ? `${Math.round(analysis.overall_score * 100)}%`
                  : "-"}
              </div>
              <div className="text-sm text-gray-500">Overall Score</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary-600">
                {analysis.funnel_stage || "-"}
              </div>
              <div className="text-sm text-gray-500">Funnel Stage</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary-600">
                {analysis.confidence_score
                  ? `${Math.round(analysis.confidence_score * 100)}%`
                  : "-"}
              </div>
              <div className="text-sm text-gray-500">Confidence</div>
            </div>
          </div>

          {/* Component Scores */}
          {analysis.component_scores &&
            analysis.component_scores.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Component Scores</h3>
                <div className="space-y-3">
                  {analysis.component_scores.map((score) => (
                    <div key={score.id} className="flex items-center gap-4">
                      <div className="w-32 text-sm font-medium">
                        {score.component_id}
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-primary-600 h-2.5 rounded-full"
                          style={{ width: `${score.score * 100}%` }}
                        />
                      </div>
                      <div className="w-12 text-sm text-right">
                        {Math.round(score.score * 100)}%
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          score.detected
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {score.detected ? "Present" : "Missing"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Recommendations */}
          {analysis.recommendations && analysis.recommendations.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Recommendations</h3>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <svg
                      className="w-5 h-5 text-primary-600 shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Platform Recommendations */}
          {analysis.platform_recommendations &&
            Object.keys(analysis.platform_recommendations).length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">
                  Platform Suitability
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(analysis.platform_recommendations).map(
                    ([platform, score]) => (
                      <span
                        key={platform}
                        className={`px-3 py-1 rounded-full text-sm ${
                          (score as number) >= 0.7
                            ? "bg-green-100 text-green-800"
                            : (score as number) >= 0.4
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {platform}: {Math.round((score as number) * 100)}%
                      </span>
                    )
                  )}
                </div>
              </div>
            )}

          <div className="flex justify-end pt-4 border-t">
            <button onClick={onClose} className="btn-primary">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
