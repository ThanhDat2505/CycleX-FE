// app/my-listings/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from "@/app/hooks/useAuth";
import { useMyListings } from "@/app/hooks/useMyListings";
import { formatPrice } from '../utils/format';
import { ErrorBanner } from "@/app/components/ErrorBanner";
import { ITEMS_PER_PAGE } from "@/app/constants";

const ListingsPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isLoggedIn, isLoading: authLoading } = useAuth();

  // BR-S11: Restrict access to BUYER and SELLER only
  useEffect(() => {
    if (!authLoading) {
      if (!isLoggedIn) {
        router.push('/login?returnUrl=/my-listings');
      } else if (user && ['ADMIN', 'SHIPPER', 'INSPECTOR'].includes(user.role)) {
        router.push('/');
      }
    }
  }, [isLoggedIn, authLoading, router, user]);

  // Initialize filter from URL params with mapping
  const rawStatus = searchParams.get('status');
  const initialStatus = (() => {
    const s = rawStatus?.toLowerCase();
    if (s === 'active') return 'approve';
    if (s === 'rejected') return 'reject';
    return s || '';
  })();

  const [filterStatus, setFilterStatus] = useState(initialStatus);
  const [sortBy, setSortBy] = useState<'recent' | 'views' | 'price-high' | 'price-low'>('recent');

  // BR-S11-F01: Pagination state
  const [page, setPage] = useState(1);

  // Use custom hook for data fetching and state management
  const {
    listings,
    totalItems,
    totalPages,
    loading,
    error,
    retry
  } = useMyListings({
    page,
    pageSize: ITEMS_PER_PAGE,
    status: filterStatus || undefined,
    sortBy
  });

  // Reset to page 1 when filter/sort changes
  useEffect(() => {
    setPage(1);
  }, [filterStatus, sortBy]);

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  if (authLoading) {
    return <div className="p-8 text-center">Loading...</div>;
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
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="approve">Active</option>
            <option value="reject">Rejected</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">
            Sort by:
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'recent' | 'views' | 'price-high' | 'price-low')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
          >
            <option value="recent">Most Recent</option>
            <option value="views">Most Views</option>
            <option value="price-high">Price (High to Low)</option>
            <option value="price-low">Price (Low to High)</option>
          </select>
        </div>
      </div>

      {/* Error Banner */}
      {error && <ErrorBanner message={error} onRetry={retry} />}

      {/* Listings Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8A00]"></div>
          <p className="text-gray-600 mt-4">Loading listings...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => {
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
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${listing.status === "DRAFT"
                      ? "bg-gray-100 text-gray-800"
                      : listing.status === "PENDING" || listing.status === "REVIEWING"
                        ? "bg-yellow-100 text-yellow-800"
                        : listing.status === "APPROVE"
                          ? "bg-green-100 text-green-800"
                          : listing.status === "REJECT"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                  >
                    {listing.status === "APPROVE" ? "ACTIVE" : listing.status}
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
                      {formatPrice(listing.price)}
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
                    {/* BR-S11-F05: Conditional Edit button */}
                    {(listing.status === 'DRAFT' || listing.status === 'PENDING') && (
                      <Link
                        href={`/edit-listing/${listing.id}`}
                        className="flex-1 px-3 py-2 bg-[#FF8A00] text-white rounded text-sm font-medium hover:bg-[#FF7A00] transition text-center"
                      >
                        Edit
                      </Link>
                    )}
                    <Link
                      href={`/listing/${listing.id}`}
                      className="flex-1 px-3 py-2 border border-gray-300 text-gray-900 rounded text-sm font-medium hover:bg-gray-50 transition text-center"
                    >
                      View
                    </Link>
                  </div>

                  {/* BR-S11-F06: Rejection Reason Display */}
                  {listing.status === 'REJECT' && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <span className="text-red-600 font-semibold text-sm">
                          ❌ Rejection Reason:
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">
                        {(listing as any).rejectionReason ||
                          "Listing bị từ chối, vui lòng liên hệ Inspector để biết thêm chi tiết"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* BR-S11-F01: Pagination Controls */}
      {totalItems > 0 && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Page Info */}
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} listings
          </div>

          {/* Page Controls */}
          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${page === pageNum
                    ? 'bg-[#FF8A00] text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {!loading && totalItems === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No listings found</p>
        </div>
      )}
    </div>
  );
};

export default ListingsPage;
