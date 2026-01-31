// app/create-listing/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { Listing } from "@/app/types/listing";

const CreateListingPage: React.FC = () => {
  const router = useRouter();
  const { isLoggedIn, isLoading } = useAuth(); // Removed role check
  const [step, setStep] = useState(1);
  const [mockListings] = useState<Listing[]>([
    {
      listing_id: 1,
      title: "Giant Escape 3 2023",
      brand: "Giant",
      model: "Escape 3",
      price: 8500000,
      thumbnail_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      views_count: 120,
      year: 2023,
      location: "Hà Nội",
      condition: "used",
    },
    {
      listing_id: 2,
      title: "Trek FX 2 2022",
      brand: "Trek",
      model: "FX 2",
      price: 12000000,
      thumbnail_url: "https://images.unsplash.com/photo-1564506592746-5e46b7d35a89?w=400",
      views_count: 85,
      year: 2022,
      location: "Hồ Chí Minh",
      condition: "new",
    },
  ]);
  const [formData, setFormData] = useState({
    listing_id: "",
    price: "",
    location: "",
    description: "",
    shipping: false,
  });

  // ✅ AUTH PROTECTION: Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/login?returnUrl=/create-listing');
    }
    // Note: BUYER can create listings (becomes SELLER on first submit)
  }, [isLoggedIn, isLoading, router]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  // Redirect message if not logged in
  if (!isLoggedIn) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center">
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveDraft = () => {
    alert("Draft saved successfully!");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Listing created successfully!");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Create New Listing</h1>
        <p className="text-gray-600 mt-2">
          Fill in the details about your bike
        </p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-12">
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-full font-bold transition ${s <= step
                ? "bg-[#FF8A00] text-white"
                : "bg-gray-200 text-gray-600"
                }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className={`h-1 flex-1 mx-2 transition ${s < step ? "bg-[#FF8A00]" : "bg-gray-200"
                  }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="flex gap-4 mb-8 text-center text-sm">
        <div className="flex-1">
          <p className="font-semibold text-gray-900">Step 1</p>
          <p className="text-gray-600">Basic Info</p>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900">Step 2</p>
          <p className="text-gray-600">Images</p>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900">Step 3</p>
          <p className="text-gray-600">Preview</p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg p-8 border border-gray-200"
      >
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Basic Information
            </h2>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Bike
              </label>
              <select
                name="listing_id"
                value={formData.listing_id}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
              >
                <option value="">Choose a bike</option>
                {mockListings.map((bike) => (
                  <option key={bike.listing_id} value={bike.listing_id}>
                    {bike.year} {bike.brand} {bike.model}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price (USD)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="e.g., 1200"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., New York, NY"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the condition and features of your bike..."
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="shipping"
                checked={formData.shipping}
                onChange={handleInputChange}
                className="w-5 h-5 rounded border-gray-300 accent-[#FF8A00]"
              />
              <span className="text-gray-700 font-medium">Offer shipping</span>
            </label>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Upload Images
            </h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-gray-900 font-medium mb-2">
                Upload bike photos
              </p>
              <p className="text-gray-600 text-sm">
                Drag and drop or click to select
              </p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Preview</h2>
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <div>
                <p className="text-sm text-gray-600">Bike</p>
                <p className="font-semibold text-gray-900">
                  {formData.listing_id
                    ? mockListings.find(
                      (b: Listing) =>
                        b.listing_id === parseInt(formData.listing_id),
                    )?.brand
                    : "Not selected"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Price</p>
                <p className="font-semibold text-gray-900">
                  ${formData.price || "0"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-semibold text-gray-900">
                  {formData.location || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Shipping</p>
                <p className="font-semibold text-gray-900">
                  {formData.shipping ? "Offered" : "Not offered"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4 mt-8 justify-between">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-6 py-3 border border-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Save as Draft
          </button>

          <div className="flex gap-4">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 border border-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Back
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-6 py-3 bg-[#FF8A00] text-white rounded-lg font-semibold hover:bg-[#FF7A00] transition"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Publish Listing
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateListingPage;
