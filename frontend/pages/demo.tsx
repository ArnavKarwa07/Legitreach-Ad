import { useState } from "react";
import Link from "next/link";
import type { Brand, AdAsset, AdAnalysis } from "@/lib/types";

// Mock demo data
const DEMO_BRAND: Brand = {
  id: "demo-brand-1",
  user_id: "demo-user",
  name: "FitFlow Pro",
  industry: "Health & Fitness",
  target_audience: "Busy professionals aged 25-45 looking to get in shape",
  brand_voice: "Motivational, empowering, results-focused",
  product_description: "AI-powered fitness coaching app with personalized workout plans",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const DEMO_ASSETS: AdAsset[] = [
  {
    id: "demo-asset-1",
    brand_id: "demo-brand-1",
    name: "Facebook Ad - Transform Your Body",
    asset_type: "text",
    text_content: "🔥 Transform Your Body in Just 12 Weeks! Join 50,000+ busy professionals who achieved their dream physique with FitFlow Pro. Our AI creates personalized workout plans that fit YOUR schedule. No gym required. Start FREE today!",
    file_url: null,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "demo-asset-2",
    brand_id: "demo-brand-1",
    name: "Instagram Story - Quick Win",
    asset_type: "text",
    text_content: "No time to workout? 🤔 FitFlow adapts to YOUR schedule. 15-min workouts that actually work. Try it FREE → link in bio",
    file_url: null,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: "demo-asset-3",
    brand_id: "demo-brand-1",
    name: "Email - Limited Offer",
    asset_type: "text",
    text_content: "Sarah lost 25 lbs in 90 days without giving up her favorite foods. Her secret? FitFlow Pro's AI nutrition coaching. This week only: Get 50% off your first month + FREE meal plans worth $97. Your transformation starts here.",
    file_url: null,
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
];

const DEMO_ANALYSES: AdAnalysis[] = [
  {
    id: "demo-analysis-1",
    ad_asset_id: "demo-asset-1",
    brand_id: "demo-brand-1",
    status: "completed",
    overall_score: 0.82,
    funnel_stage: "TOF",
    confidence_score: 0.88,
    platform_recommendations: {
      "Facebook": 0.92,
      "Instagram": 0.85,
      "TikTok": 0.68,
      "LinkedIn": 0.45,
    },
    summary: "Strong top-of-funnel ad with clear dream outcome and social proof. Emphasizes time efficiency and ease of use.",
    recommendations: [
      "Add specific time-to-benefit (e.g., 'See results in 7 days')",
      "Include a customer pain point to increase relatability",
      "Consider adding bonus value to increase perceived offer strength",
    ],
    component_scores: [
      {
        id: "demo-cs-1",
        analysis_id: "demo-analysis-1",
        component_id: "COMP1",
        component_name: "Dream Outcome",
        detected: true,
        score: 9.0,
        explanation: "Clearly states 'Transform Your Body' as the ultimate goal",
        suggestions: null,
      },
      {
        id: "demo-cs-2",
        analysis_id: "demo-analysis-1",
        component_id: "COMP2",
        component_name: "Proof / Believability",
        detected: true,
        score: 8.5,
        explanation: "Strong social proof with '50,000+ busy professionals'",
        suggestions: "Could add specific success metrics or testimonials",
      },
      {
        id: "demo-cs-3",
        analysis_id: "demo-analysis-1",
        component_id: "COMP3",
        component_name: "Time to Benefit",
        detected: true,
        score: 7.0,
        explanation: "Mentions '12 Weeks' timeframe",
        suggestions: "Could emphasize quicker wins (first week results)",
      },
      {
        id: "demo-cs-4",
        analysis_id: "demo-analysis-1",
        component_id: "COMP4",
        component_name: "Effort Reduction",
        detected: true,
        score: 8.0,
        explanation: "Highlights 'No gym required' and AI personalization",
        suggestions: null,
      },
      {
        id: "demo-cs-5",
        analysis_id: "demo-analysis-1",
        component_id: "COMP5",
        component_name: "Bonus Value",
        detected: false,
        score: 0,
        explanation: "No bonuses mentioned",
        suggestions: "Add free meal plans, workout videos, or coaching calls",
      },
      {
        id: "demo-cs-6",
        analysis_id: "demo-analysis-1",
        component_id: "COMP6",
        component_name: "Customer Pains",
        detected: false,
        score: 2.0,
        explanation: "Implies 'busy' but doesn't explicitly address pain points",
        suggestions: "Address frustrations like 'tired of failed diets' or 'no time for gym'",
      },
      {
        id: "demo-cs-7",
        analysis_id: "demo-analysis-1",
        component_id: "COMP7",
        component_name: "Customer Desires",
        detected: true,
        score: 8.0,
        explanation: "Targets desire for body transformation and convenience",
        suggestions: null,
      },
    ],
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "demo-analysis-2",
    ad_asset_id: "demo-asset-2",
    brand_id: "demo-brand-1",
    status: "completed",
    overall_score: 0.65,
    funnel_stage: "TOF",
    confidence_score: 0.75,
    platform_recommendations: {
      "Instagram": 0.95,
      "TikTok": 0.88,
      "Facebook": 0.62,
      "LinkedIn": 0.35,
    },
    summary: "Concise story-format ad targeting time-constrained audience. Good for platform but lacks depth.",
    recommendations: [
      "Add proof element (user count or testimonial)",
      "Include dream outcome more explicitly",
      "Consider adding urgency or scarcity element",
    ],
    component_scores: [
      {
        id: "demo-cs-8",
        analysis_id: "demo-analysis-2",
        component_id: "COMP1",
        component_name: "Dream Outcome",
        detected: false,
        score: 4.0,
        explanation: "Implies fitness results but doesn't state transformation clearly",
        suggestions: "Add 'Get the body you want' or similar outcome statement",
      },
      {
        id: "demo-cs-9",
        analysis_id: "demo-analysis-2",
        component_id: "COMP4",
        component_name: "Effort Reduction",
        detected: true,
        score: 9.0,
        explanation: "Strong emphasis on '15-min workouts' and schedule flexibility",
        suggestions: null,
      },
      {
        id: "demo-cs-10",
        analysis_id: "demo-analysis-2",
        component_id: "COMP6",
        component_name: "Customer Pains",
        detected: true,
        score: 7.5,
        explanation: "Addresses 'No time to workout' pain point directly",
        suggestions: null,
      },
    ],
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: "demo-analysis-3",
    ad_asset_id: "demo-asset-3",
    brand_id: "demo-brand-1",
    status: "completed",
    overall_score: 0.91,
    funnel_stage: "BOF",
    confidence_score: 0.92,
    platform_recommendations: {
      "Email": 0.98,
      "Facebook": 0.75,
      "Instagram": 0.68,
      "LinkedIn": 0.55,
    },
    summary: "Excellent bottom-of-funnel ad with strong proof, specificity, and offer. Well-suited for warmer audiences.",
    recommendations: [
      "Consider adding urgency with countdown timer",
      "Could include customer objection handling",
      "Test adding more bonus value to sweeten the deal",
    ],
    component_scores: [
      {
        id: "demo-cs-11",
        analysis_id: "demo-analysis-3",
        component_id: "COMP1",
        component_name: "Dream Outcome",
        detected: true,
        score: 8.0,
        explanation: "Implied through Sarah's transformation story",
        suggestions: null,
      },
      {
        id: "demo-cs-12",
        analysis_id: "demo-analysis-3",
        component_id: "COMP2",
        component_name: "Proof / Believability",
        detected: true,
        score: 9.5,
        explanation: "Specific case study: 'Sarah lost 25 lbs in 90 days'",
        suggestions: null,
      },
      {
        id: "demo-cs-13",
        analysis_id: "demo-analysis-3",
        component_id: "COMP3",
        component_name: "Time to Benefit",
        detected: true,
        score: 8.5,
        explanation: "Clear timeline: '90 days'",
        suggestions: null,
      },
      {
        id: "demo-cs-14",
        analysis_id: "demo-analysis-3",
        component_id: "COMP4",
        component_name: "Effort Reduction",
        detected: true,
        score: 9.0,
        explanation: "'without giving up favorite foods' reduces perceived difficulty",
        suggestions: null,
      },
      {
        id: "demo-cs-15",
        analysis_id: "demo-analysis-3",
        component_id: "COMP5",
        component_name: "Bonus Value",
        detected: true,
        score: 9.0,
        explanation: "FREE meal plans worth $97",
        suggestions: null,
      },
      {
        id: "demo-cs-16",
        analysis_id: "demo-analysis-3",
        component_id: "COMP8",
        component_name: "Customer Objections",
        detected: true,
        score: 7.0,
        explanation: "Addresses 'restrictive diet' objection indirectly",
        suggestions: "Could address price/commitment objections more directly",
      },
    ],
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
];

export default function DemoPage() {
  const [selectedBrand] = useState<Brand>(DEMO_BRAND);
  const [assets] = useState<AdAsset[]>(DEMO_ASSETS);
  const [analyses] = useState<AdAnalysis[]>(DEMO_ANALYSES);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AdAnalysis | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Banner */}
      <div className="bg-primary-600 text-white py-4 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 px-3 py-1.5 rounded-full flex items-center gap-2">
              <span className="text-lg">🎯</span>
              <span className="font-semibold text-sm">DEMO MODE</span>
            </div>
            <span className="text-sm opacity-95 hidden sm:block">
              Exploring FitFlow Pro&apos;s ad analysis
            </span>
          </div>
          <Link
            href="/sign-up"
            className="bg-white text-primary-600 px-6 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-all shadow-md hover:shadow-lg"
          >
            Create Free Account →
          </Link>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="text-xl font-bold text-primary-600">
              Legitreach-Ad
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Demo User</span>
            </div>
            <Link href="/sign-in" className="btn-secondary text-sm">
              Sign In
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Brand Summary Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
          <div className="bg-primary-600 px-6 py-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold text-white">
                    {selectedBrand.name}
                  </h2>
                  <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold border border-white/30">
                    DEMO
                  </span>
                </div>
                <p className="text-blue-50 text-lg">{selectedBrand.product_description}</p>
              </div>
            </div>
          </div>
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Industry</div>
                  <div className="font-semibold text-gray-900">{selectedBrand.industry}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Brand Voice</div>
                  <div className="font-semibold text-gray-900">{selectedBrand.brand_voice}</div>
                </div>
              </div>
              <div className="flex items-start gap-3 md:col-span-1">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Target Audience</div>
                  <div className="font-semibold text-gray-900 text-sm leading-tight">{selectedBrand.target_audience}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-1">
              {analyses.length}
            </div>
            <div className="text-sm font-medium text-gray-500">Analyses Completed</div>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-1">
              {Math.round(
                (analyses.reduce((sum, a) => sum + (a.overall_score || 0), 0) /
                  analyses.length) *
                  100
              )}
              %
            </div>
            <div className="text-sm font-medium text-gray-500">Avg. Overall Score</div>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-1">
              {assets.length}
            </div>
            <div className="text-sm font-medium text-gray-500">Ad Creatives</div>
          </div>
        </div>

        {/* Recent Analyses */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 px-6 py-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Ad Analyses</h2>
                <p className="text-sm text-gray-500 mt-1">Click any row to view detailed insights</p>
              </div>
              <div className="hidden md:flex items-center gap-2 text-xs text-gray-500 bg-white px-3 py-2 rounded-lg border border-gray-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Interactive Demo</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-4 px-6 text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Asset Name
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Funnel Stage
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Overall Score
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Top Platform
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {analyses.map((analysis) => {
                  const asset = assets.find((a) => a.id === analysis.ad_asset_id);
                  const topPlatform = analysis.platform_recommendations
                    ? Object.entries(analysis.platform_recommendations).sort(
                        ([, a], [, b]) => b - a
                      )[0]
                    : null;

                  return (
                    <tr
                      key={analysis.id}
                      className="border-b border-gray-100 hover:bg-blue-50/50 cursor-pointer transition-all duration-200 group"
                      onClick={() => {
                        setSelectedAnalysis(analysis);
                        setShowAnalysisModal(true);
                      }}
                    >
                      <td className="py-5 px-6">
                        <div className="font-semibold text-sm text-gray-900 group-hover:text-primary-600 transition-colors">{asset?.name}</div>
                        <div className="text-xs text-gray-500 mt-1.5 line-clamp-1 max-w-md">
                          {asset?.text_content}
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                            analysis.funnel_stage === "TOF"
                              ? "bg-blue-500 text-white"
                              : analysis.funnel_stage === "MOF"
                              ? "bg-amber-500 text-white"
                              : analysis.funnel_stage === "BOF"
                              ? "bg-green-500 text-white"
                              : "bg-gray-500 text-white"
                          }`}
                        >
                          {analysis.funnel_stage}
                        </span>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-gray-200 rounded-full h-2.5 max-w-[120px] overflow-hidden">
                            <div
                              className={`h-2.5 rounded-full transition-all duration-500 ${
                                (analysis.overall_score || 0) >= 0.8
                                  ? "bg-green-600"
                                  : (analysis.overall_score || 0) >= 0.6
                                  ? "bg-blue-600"
                                  : "bg-amber-600"
                              }`}
                              style={{
                                width: `${(analysis.overall_score || 0) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-bold text-gray-900 min-w-[50px]">
                            {Math.round((analysis.overall_score || 0) * 100)}%
                          </span>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        {topPlatform && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900">
                              {topPlatform[0]}
                            </span>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                              {Math.round(topPlatform[1] * 100)}%
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="py-5 px-6">
                        <button className="flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-semibold group-hover:gap-2 transition-all">
                          View Details
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-primary-600 rounded-2xl shadow-2xl overflow-hidden">
          <div className="relative px-6 py-12 sm:px-12">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
            
            <div className="relative text-center">
              <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-white text-sm font-semibold mb-6">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>Free Forever Plan Available</span>
              </div>
              
              <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Analyze Your Own Ads?
              </h3>
              <p className="text-lg text-blue-50 mb-8 max-w-2xl mx-auto leading-relaxed">
                Get instant AI-powered insights on your ad creatives. Understand what&apos;s working, 
                what&apos;s missing, and exactly how to improve your conversion rates.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/sign-up"
                  className="group inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl text-lg"
                >
                  Start Analyzing Free
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 bg-white/10 text-white px-6 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/30"
                >
                  Learn More
                </Link>
              </div>
              
              <div className="mt-8 flex items-center justify-center gap-8 text-white/80 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Setup in 2 minutes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Details Modal */}
      {showAnalysisModal && selectedAnalysis && (
        <AnalysisModal
          analysis={selectedAnalysis}
          asset={assets.find((a) => a.id === selectedAnalysis.ad_asset_id)!}
          onClose={() => {
            setShowAnalysisModal(false);
            setSelectedAnalysis(null);
          }}
        />
      )}
    </div>
  );
}

// Analysis Modal Component
function AnalysisModal({
  analysis,
  asset,
  onClose,
}: {
  analysis: AdAnalysis;
  asset: AdAsset;
  onClose: () => void;
}) {
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
              <h2 className="text-2xl font-bold text-white mb-1">{asset.name}</h2>
              <p className="text-blue-100 text-sm">Detailed component breakdown and recommendations</p>
            </div>
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

        <div className="p-8 max-h-[calc(90vh-8rem)] overflow-y-auto">
          {/* Ad Content */}
          <div className="mb-8 p-5 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="text-sm font-bold text-gray-700 uppercase tracking-wide">Ad Copy</div>
            </div>
            <div className="text-gray-900 leading-relaxed">{asset.text_content}</div>
          </div>

          {/* Overview Metrics */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-600 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all">
              <div className="text-5xl font-bold text-white mb-2">
                {Math.round((analysis.overall_score || 0) * 100)}%
              </div>
              <div className="text-sm font-semibold text-blue-100 uppercase tracking-wide">Overall Score</div>
            </div>
            <div className="bg-green-600 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all">
              <div className="text-5xl font-bold text-white mb-2">
                {analysis.funnel_stage}
              </div>
              <div className="text-sm font-semibold text-green-100 uppercase tracking-wide">Funnel Stage</div>
            </div>
            <div className="bg-purple-600 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all">
              <div className="text-5xl font-bold text-white mb-2">
                {Math.round((analysis.confidence_score || 0) * 100)}%
              </div>
              <div className="text-sm font-semibold text-purple-100 uppercase tracking-wide">Confidence</div>
            </div>
          </div>

          {/* Summary */}
          {analysis.summary && (
            <div className="mb-8 p-6 bg-blue-50 rounded-xl border-2 border-blue-200 shadow-sm">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
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
                {analysis.component_scores.map((score) => (
                  <div
                    key={score.id}
                    className="group p-5 bg-white border-2 border-gray-200 rounded-xl hover:border-primary-300 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h4 className="font-bold text-gray-900 text-lg">
                            {score.component_name}
                          </h4>
                          <span
                            className={`text-xs px-3 py-1 rounded-full font-semibold shadow-sm ${
                              score.detected
                                ? "bg-green-500 text-white"
                                : "bg-gray-400 text-white"
                            }`}
                          >
                            {score.detected ? "✓ Present" : "✗ Missing"}
                          </span>
                        </div>
                        {score.explanation && (
                          <p className="text-sm text-gray-700 leading-relaxed mb-3">
                            {score.explanation}
                          </p>
                        )}
                        {score.suggestions && (
                          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg mt-3">
                            <div className="flex items-start gap-2">
                              <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <div className="text-sm text-amber-900">
                                <strong className="font-semibold">Suggestion:</strong> {score.suggestions}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="ml-6 text-center">
                        <div className="text-4xl font-bold text-primary-600">
                          {score.score.toFixed(1)}
                        </div>
                        <div className="text-xs text-gray-500 font-semibold mt-1">/ 10</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          score.score >= 8
                            ? "bg-green-600"
                            : score.score >= 5
                            ? "bg-blue-600"
                            : "bg-red-600"
                        }`}
                        style={{ width: `${(score.score / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {analysis.recommendations && analysis.recommendations.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Key Recommendations</h3>
              </div>
              <ul className="space-y-3">
                {analysis.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-4 p-4 bg-green-50 rounded-xl border border-green-200 hover:shadow-md transition-all">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-800 leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Platform Recommendations */}
          {analysis.platform_recommendations &&
            Object.keys(analysis.platform_recommendations).length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Platform Suitability</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(analysis.platform_recommendations)
                    .sort(([, a], [, b]) => b - a)
                    .map(([platform, score]) => (
                      <div
                        key={platform}
                        className="relative overflow-hidden rounded-xl p-5 text-center shadow-lg hover:shadow-xl transition-all duration-200"
                        style={{
                          backgroundColor:
                            (score as number) >= 0.7
                              ? "#059669"
                              : (score as number) >= 0.5
                              ? "#d97706"
                              : "#4b5563",
                        }}
                      >
                        <div className="relative z-10">
                          <div className="font-bold text-white text-sm mb-2 uppercase tracking-wide">
                            {platform}
                          </div>
                          <div className="text-4xl font-black text-white">
                            {Math.round((score as number) * 100)}%
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-white/10"></div>
                      </div>
                    ))}
                </div>
              </div>
            )}

          <div className="flex justify-end pt-6 border-t-2 border-gray-200">
            <button onClick={onClose} className="btn-primary px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
              Close Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
