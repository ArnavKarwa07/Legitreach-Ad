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
  const [loadingAnalysisDetails, setLoadingAnalysisDetails] = useState(false);

  const handleViewAnalysis = async (analysis: AdAnalysis) => {
    setLoadingAnalysisDetails(true);
    setShowAnalysisModal(true);
    setSelectedAnalysis(analysis); // Show summary first
    
    try {
      // Fetch full analysis with all details
      const fullAnalysis = await api.getAnalysis(analysis.id);
      setSelectedAnalysis(fullAnalysis);
    } catch (err) {
      console.error("Failed to fetch analysis details:", err);
    } finally {
      setLoadingAnalysisDetails(false);
    }
  };

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
                      Date
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
                            ?.title || "Untitled Ad"}
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
                            ? `${Math.round(analysis.overall_score)}%`
                            : "-"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs text-gray-500">
                          {new Date(analysis.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleViewAnalysis(analysis)}
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
          loading={loadingAnalysisDetails}
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

// Generate text report for download
function generateTextReport(analysis: AdAnalysis): string {
  const separator = "=".repeat(80);
  const subSeparator = "-".repeat(80);
  
  let report = `${separator}\n`;
  report += `AD CREATIVE ANALYSIS REPORT\n`;
  report += `Generated: ${new Date().toLocaleString()}\n`;
  report += `Analysis ID: ${analysis.id}\n`;
  report += `${separator}\n\n`;

  // Overview Section
  report += `OVERVIEW\n${subSeparator}\n`;
  report += `Overall Score:      ${analysis.overall_score ? Math.round(analysis.overall_score) : 'N/A'}%\n`;
  report += `Funnel Stage:       ${analysis.funnel_stage || 'N/A'}\n`;
  report += `Stage Confidence:   ${analysis.funnel_confidence ? Math.round(analysis.funnel_confidence * 100) : 'N/A'}%\n`;
  report += `Analysis Date:      ${new Date(analysis.created_at).toLocaleString()}\n\n`;

  // Summary Section
  if (analysis.summary) {
    report += `EXECUTIVE SUMMARY\n${subSeparator}\n`;
    report += `${analysis.summary}\n\n`;
  }

  // Component Scores Section
  if (analysis.component_scores && analysis.component_scores.length > 0) {
    report += `COMPONENT ANALYSIS (10 Offer Components)\n${separator}\n\n`;
    
    analysis.component_scores.forEach((comp, index) => {
      report += `${index + 1}. ${comp.component_key}: ${comp.component_name}\n`;
      report += `   Score: ${comp.score.toFixed(1)}/10 | Status: ${comp.is_present ? '✓ Present' : '✗ Missing'}\n`;
      report += `   ${subSeparator}\n`;
      
      if (comp.what_is_conveyed) {
        report += `   What's Conveyed:\n`;
        report += `   ${comp.what_is_conveyed}\n\n`;
      }
      
      if (comp.analysis) {
        report += `   Analysis:\n`;
        report += `   ${comp.analysis}\n\n`;
      }
      
      if (comp.suggested_improvements) {
        report += `   💡 Suggested Improvements:\n`;
        report += `   ${comp.suggested_improvements}\n\n`;
      }
      
      report += `\n`;
    });
  }

  // Recommendations Section
  if (analysis.recommendations) {
    report += `KEY RECOMMENDATIONS\n${separator}\n`;
    report += `${analysis.recommendations}\n\n`;
  }

  // Platform Recommendations Section
  if (analysis.platform_recommendations && analysis.platform_recommendations.length > 0) {
    report += `PLATFORM RECOMMENDATIONS\n${separator}\n\n`;
    
    analysis.platform_recommendations.forEach((plat, index) => {
      report += `${index + 1}. ${plat.platform.toUpperCase()}\n`;
      report += `   Suitability Score: ${Math.round(plat.score)}/100\n`;
      report += `   Reasoning: ${plat.reason}\n\n`;
    });
  }

  report += `${separator}\n`;
  report += `End of Report\n`;
  report += `${separator}\n`;

  return report;
}

// Analysis Modal Component
function AnalysisModal({
  analysis,
  loading,
  onClose,
}: {
  analysis: AdAnalysis;
  loading?: boolean;
  onClose: () => void;
}) {
  const downloadReport = () => {
    const report = generateTextReport(analysis);
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis-report-${analysis.id}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full my-8 overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-primary-600 px-8 py-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mt-32 -mr-32"></div>
          <div className="relative flex items-start justify-between">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                  ANALYSIS REPORT
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">Ad Analysis Details</h2>
              <p className="text-blue-100 text-sm">Detailed component breakdown and recommendations</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={downloadReport}
                className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-2 transition-all"
                title="Download Report"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-2 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="p-8 max-h-[calc(90vh-8rem)] overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mb-4"></div>
              <p className="text-gray-600 font-medium">Loading detailed analysis...</p>
            </div>
          ) : (
            <>
              {/* Overview Metrics */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-600 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all">
              <div className="text-5xl font-bold text-white mb-2">
                {analysis.overall_score ? `${Math.round(analysis.overall_score)}%` : "-"}
              </div>
              <div className="text-sm font-semibold text-blue-100 uppercase tracking-wide">Overall Score</div>
            </div>
            <div className="bg-green-600 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all">
              <div className="text-5xl font-bold text-white mb-2">
                {analysis.funnel_stage || "-"}
              </div>
              <div className="text-sm font-semibold text-green-100 uppercase tracking-wide">Funnel Stage</div>
            </div>
            <div className="bg-purple-600 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all">
              <div className="text-5xl font-bold text-white mb-2">
                {analysis.funnel_confidence ? `${Math.round(analysis.funnel_confidence * 100)}%` : "-"}
              </div>
              <div className="text-sm font-semibold text-purple-100 uppercase tracking-wide">Confidence</div>
            </div>
          </div>

          {/* Summary */}
          {analysis.summary && (
            <div className="mb-8 p-6 bg-blue-50 rounded-xl border-2 border-blue-200 shadow-sm">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wide mb-2">
                    Analysis Summary
                  </h3>
                  <p className="text-blue-800 leading-relaxed">{analysis.summary}</p>
                </div>
              </div>
            </div>
          )}

          {/* Component Scores */}
          {analysis.component_scores && analysis.component_scores.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Component Analysis</h3>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {analysis.component_scores.map((comp) => (
                  <div
                    key={comp.id}
                    className="group p-5 bg-white border-2 border-gray-200 rounded-xl hover:border-primary-300 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h4 className="font-bold text-gray-900 text-lg">
                            {comp.component_name}
                          </h4>
                          <span
                            className={`text-xs px-3 py-1 rounded-full font-semibold shadow-sm ${
                              comp.is_present
                                ? "bg-green-500 text-white"
                                : "bg-gray-400 text-white"
                            }`}
                          >
                            {comp.is_present ? "✓ Present" : "✗ Missing"}
                          </span>
                        </div>
                        {comp.what_is_conveyed && (
                          <p className="text-sm text-gray-700 leading-relaxed mb-3">
                            <strong className="text-gray-900">What's Conveyed:</strong> {comp.what_is_conveyed}
                          </p>
                        )}
                        {comp.analysis && (
                          <p className="text-sm text-gray-700 leading-relaxed mb-3">
                            <strong className="text-gray-900">Analysis:</strong> {comp.analysis}
                          </p>
                        )}
                        {comp.suggested_improvements && (
                          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg mt-3">
                            <div className="flex items-start gap-2">
                              <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <div className="text-sm text-amber-900">
                                <strong className="font-semibold">Suggestion:</strong> {comp.suggested_improvements}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="ml-6 text-center">
                        <div className="text-4xl font-bold text-primary-600">
                          {comp.score.toFixed(1)}
                        </div>
                        <div className="text-xs text-gray-500 font-semibold mt-1">/ 10</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          comp.score >= 8
                            ? "bg-green-600"
                            : comp.score >= 5
                            ? "bg-blue-600"
                            : "bg-red-600"
                        }`}
                        style={{ width: `${(comp.score / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {analysis.recommendations && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Key Recommendations</h3>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                <pre className="text-sm text-amber-900 whitespace-pre-wrap font-sans leading-relaxed">
                  {analysis.recommendations}
                </pre>
              </div>
            </div>
          )}

          {/* Platform Recommendations */}
          {analysis.platform_recommendations && analysis.platform_recommendations.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Platform Recommendations</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.platform_recommendations.map((plat, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-linear-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg ${
                          plat.score >= 70
                            ? "bg-green-500"
                            : plat.score >= 50
                            ? "bg-yellow-500"
                            : "bg-gray-500"
                        }`}
                      >
                        {Math.round(plat.score)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 capitalize text-lg mb-1">
                          {plat.platform}
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">{plat.reason}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t-2 border-gray-200">
            <button onClick={onClose} className="btn-primary px-8 py-3 text-base">
              Close
            </button>
          </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
