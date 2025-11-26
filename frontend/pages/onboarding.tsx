import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import type { BrandCreate } from "@/lib/types";

export default function OnboardingPage() {
  const { isSignedIn, isLoaded, user } = useUser();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<BrandCreate>({
    name: "",
    industry: "",
    target_audience: "",
    brand_voice: "",
    product_description: "",
  });

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      await api.createBrand(formData);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create brand");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const industries = [
    "E-commerce",
    "SaaS",
    "Healthcare",
    "Finance",
    "Education",
    "Real Estate",
    "Travel",
    "Food & Beverage",
    "Fashion",
    "Technology",
    "Other",
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user?.firstName || "there"}!
          </h1>
          <p className="text-gray-600 mt-2">
            Let&apos;s set up your brand context for better analysis.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  s <= step
                    ? "bg-primary-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`w-16 h-1 ${
                    s < step ? "bg-primary-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="card">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Brand Basics</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input"
                    placeholder="e.g., Acme Inc."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Industry *
                  </label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="input"
                    required
                  >
                    <option value="">Select an industry</option>
                    {industries.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Target Audience */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Target Audience</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Who is your target audience? *
                  </label>
                  <textarea
                    name="target_audience"
                    value={formData.target_audience}
                    onChange={handleChange}
                    className="input min-h-[120px]"
                    placeholder="e.g., Small business owners aged 30-50 looking to scale their online presence..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand Voice / Tone
                  </label>
                  <input
                    type="text"
                    name="brand_voice"
                    value={formData.brand_voice || ""}
                    onChange={handleChange}
                    className="input"
                    placeholder="e.g., Professional, friendly, authoritative"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Product Description */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Product/Service</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Describe your product or service *
                  </label>
                  <textarea
                    name="product_description"
                    value={formData.product_description}
                    onChange={handleChange}
                    className="input min-h-[150px]"
                    placeholder="e.g., We provide an AI-powered marketing automation platform that helps businesses create, schedule, and analyze their social media content..."
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="btn-secondary"
                disabled={loading}
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                onClick={handleNext}
                className="btn-primary"
                disabled={
                  (step === 1 && (!formData.name || !formData.industry)) ||
                  (step === 2 && !formData.target_audience)
                }
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="btn-primary"
                disabled={loading || !formData.product_description}
              >
                {loading ? "Creating..." : "Complete Setup"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
