// app/draft-listings/page.tsx
"use client";

import React from "react";
import Link from "next/link";

const DraftListingsPage: React.FC = () => {
  // Mock data
  const draftListings = [
    {
      id: 1,
      brand: "Giant",
      model: "Escape 3",
      price: 8500000,
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Draft Listings</h1>
      <p className="text-gray-600 mb-8">
        Manage your unsaved and pending listings
      </p>

      {draftListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {draftListings.map((listing) => {
            return (
              <div
                key={listing.id}
                className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition overflow-hidden"
              >
                <div className="h-40 bg-gray-200 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-gray-400"
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
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2">
                    {listing.brand} {listing.model}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">${listing.price}</p>

                  <div className="flex gap-2">
                    <Link
                      href={`/create-listing?draft=${listing.id}`}
                      className="flex-1 px-3 py-2 bg-[#FF8A00] text-white rounded text-sm font-medium hover:bg-[#FF7A00] transition text-center"
                    >
                      Continue
                    </Link>
                    <button className="flex-1 px-3 py-2 border border-red-300 text-red-600 rounded text-sm font-medium hover:bg-red-50 transition">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-600 text-lg mb-4">No draft listings yet</p>
          <Link
            href="/create-listing"
            className="inline-block px-6 py-3 bg-[#FF8A00] text-white rounded-lg font-semibold hover:bg-[#FF7A00] transition"
          >
            Create New Listing
          </Link>
        </div>
      )}
    </div>
  );
};

export default DraftListingsPage;
