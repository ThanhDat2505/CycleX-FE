// app/listing-status/page.tsx
"use client";

import React from "react";

const ListingStatusPage: React.FC = () => {
  // Move Date calls outside to avoid impure function warnings
  const sevenDaysAgo = new Date(Date.now() - 86400000 * 7).toISOString();
  const fiveDaysAgo = new Date(Date.now() - 86400000 * 5).toISOString();
  const threeDaysAgo = new Date(Date.now() - 86400000 * 3).toISOString();
  const thirtyDaysAgo = new Date(Date.now() - 86400000 * 30).toISOString();
  const now = new Date().toISOString();

  // Mock data
  const userListings = [
    {
      id: 1,
      brand: "Giant",
      model: "Escape 3",
      status: "ACTIVE",
      price: 8500000,
      views: 120,
      createdDate: sevenDaysAgo,
    },
    {
      id: 2,
      brand: "Trek",
      model: "FX 2",
      status: "ACTIVE",
      price: 12000000,
      views: 85,
      createdDate: fiveDaysAgo,
    },
    {
      id: 3,
      brand: "Specialized",
      model: "Sirrus X",
      status: "PENDING",
      price: 15500000,
      views: 45,
      createdDate: threeDaysAgo,
    },
    {
      id: 4,
      brand: "Cannondale",
      model: "Quick 4",
      status: "SOLD",
      price: 9800000,
      views: 200,
      createdDate: thirtyDaysAgo,
    },
    {
      id: 5,
      brand: "Scott",
      model: "Speedster 40",
      status: "DRAFT",
      price: 18000000,
      views: 0,
      createdDate: now,
    },
  ];

  const stats = {
    active: userListings.filter((l) => l.status === "ACTIVE").length,
    pending: userListings.filter((l) => l.status === "PENDING").length,
    sold: userListings.filter((l) => l.status === "SOLD").length,
    draft: userListings.filter((l) => l.status === "DRAFT").length,
  };

  const statusColors: Record<string, { bg: string; text: string }> = {
    ACTIVE: { bg: "bg-green-100", text: "text-green-800" },
    PENDING: { bg: "bg-yellow-100", text: "text-yellow-800" },
    SOLD: { bg: "bg-red-100", text: "text-red-800" },
    DRAFT: { bg: "bg-gray-100", text: "text-gray-800" },
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Listing Status</h1>
      <p className="text-gray-600 mb-8">
        Track the status of all your listings
      </p>

      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <p className="text-gray-600 text-sm font-semibold mb-2">Active</p>
          <p className="text-3xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <p className="text-gray-600 text-sm font-semibold mb-2">Pending</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <p className="text-gray-600 text-sm font-semibold mb-2">Sold</p>
          <p className="text-3xl font-bold text-red-600">{stats.sold}</p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <p className="text-gray-600 text-sm font-semibold mb-2">Draft</p>
          <p className="text-3xl font-bold text-gray-600">{stats.draft}</p>
        </div>
      </div>

      {/* Listings Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-6 py-4 font-semibold text-gray-700">
                  Bike Name
                </th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">
                  Price
                </th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">
                  Views
                </th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">
                  Listed
                </th>
              </tr>
            </thead>
            <tbody>
              {userListings.map((listing) => {
                const colors = statusColors[listing.status];

                return (
                  <tr
                    key={listing.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {listing.brand} {listing.model}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      ${listing.price}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${colors.bg} ${colors.text}`}
                      >
                        {listing.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {listing.views}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(listing.createdDate).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListingStatusPage;
