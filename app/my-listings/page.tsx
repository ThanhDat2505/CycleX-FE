// app/my-listings/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from 'next/navigation';

const ListingsPage: React.FC = () => {
  const searchParams = useSearchParams();

  // Move Date calls outside to avoid impure function warnings
  const sevenDaysAgo = new Date(Date.now() - 86400000 * 7).toISOString();
  const yesterday = new Date(Date.now() - 86400000).toISOString();
  const fiveDaysAgo = new Date(Date.now() - 86400000 * 5).toISOString();
  const twoDaysAgo = new Date(Date.now() - 86400000 * 2).toISOString();
  const threeDaysAgo = new Date(Date.now() - 86400000 * 3).toISOString();
  const now = new Date().toISOString();

  // Mock data
  const mockListings = [
    {
      id: 1,
      brand: "Giant",
      model: "Escape 3",
      type: "Road Bike",
      condition: "Used",
      price: 8500000,
      location: "Hà Nội",
      status: "ACTIVE",
      shipping: true,
      views: 120,
      inquiries: 2,
      createdDate: sevenDaysAgo,
      updatedDate: yesterday,
    },
    {
      id: 2,
      brand: "Trek",
      model: "FX 2",
      type: "Mountain Bike",
      condition: "New",
      price: 12000000,
      location: "Hồ Chí Minh",
      status: "ACTIVE",
      shipping: false,
      views: 85,
      inquiries: 1,
      createdDate: fiveDaysAgo,
      updatedDate: twoDaysAgo,
    },
    {
      id: 3,
      brand: "Specialized",
      model: "Sirrus X",
      type: "Hybrid Bike",
      condition: "Used",
      price: 15500000,
      location: "Đà Nẵng",
      status: "PENDING",
      shipping: true,
      views: 45,
      inquiries: 0,
      createdDate: threeDaysAgo,
      updatedDate: now,
    },
  ];

  // Initialize filter from URL params
  const initialStatus = searchParams.get('status') || '';
  const [filterStatus, setFilterStatus] = useState(initialStatus);
  const [sortBy, setSortBy] = useState("recent");

  // Filter listings
  let filteredListings = mockListings;
  if (filterStatus) {
    filteredListings = filteredListings.filter(
      (l) => l.status.toLowerCase() === filterStatus.toLowerCase(),
    );
  }

  // Sort listings
  if (sortBy === "views") {
    filteredListings.sort((a, b) => b.views - a.views);
  } else if (sortBy === "price-high") {
    filteredListings.sort((a, b) => b.price - a.price);
  } else if (sortBy === "price-low") {
    filteredListings.sort((a, b) => a.price - b.price);
  } else {
    // Default: recent
    filteredListings.sort(
      (a, b) =>
        new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime(),
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">My Listings</h1>
          <p className="text-gray-600 mt-2">Manage all your bike listings</p>
        </div>
        <Link
          href="/create-listing"
          className="px-6 py-3 bg-[#FF8A00] text-white rounded-lg font-semibold hover:bg-[#FF7A00] transition"
        >
          Create New Listing
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-8 flex-wrap">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">
            Sort by:
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
          >
            <option value="recent">Most Recent</option>
            <option value="views">Most Views</option>
            <option value="price-high">Price (High to Low)</option>
            <option value="price-low">Price (Low to High)</option>
          </select>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing) => {
          return (
            <div
              key={listing.id}
              className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition"
            >
              {/* Image */}
              <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
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
                <span
                  className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${listing.status === "ACTIVE"
                    ? "bg-green-100 text-green-800"
                    : listing.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : listing.status === "SOLD"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                >
                  {listing.status}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-2">
                  {listing.brand} {listing.model}
                </h3>
                <div className="text-sm text-gray-600 mb-3">
                  <span>{listing.type}</span> • <span>{listing.condition}</span>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-[#FF8A00]">
                    ${listing.price}
                  </span>
                  <span className="text-xs text-gray-500">
                    {listing.location}
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4 text-center text-sm">
                  <div>
                    <div className="font-bold text-gray-900">
                      {listing.views}
                    </div>
                    <div className="text-gray-500 text-xs">Views</div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">
                      {listing.inquiries}
                    </div>
                    <div className="text-gray-500 text-xs">Inquiries</div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">
                      {listing.shipping ? "✓" : "—"}
                    </div>
                    <div className="text-gray-500 text-xs">Shipping</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    href={`/edit-listing/${listing.id}`}
                    className="flex-1 px-3 py-2 bg-[#FF8A00] text-white rounded text-sm font-medium hover:bg-[#FF7A00] transition text-center"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/listing/${listing.id}`}
                    className="flex-1 px-3 py-2 border border-gray-300 text-gray-900 rounded text-sm font-medium hover:bg-gray-50 transition text-center"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredListings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No listings found</p>
        </div>
      )}
    </div>
  );
};

export default ListingsPage;
