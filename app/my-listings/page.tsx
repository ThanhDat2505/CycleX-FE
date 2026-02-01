// app/my-listings/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from "@/app/hooks/useAuth";
import { useMyListings } from "@/app/hooks/useMyListings";
import { formatPrice } from '../utils/format';
import { ErrorBanner } from "@/app/components/ErrorBanner";
import { MyListingCard } from "./components/MyListingCard";
import Pagination from '../listings/components/Pagination';
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
          {listings.map((listing) => (
            <MyListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}

      {/* BR-S11-F01: Pagination Controls */}
      {totalItems > 0 && totalPages > 1 && (
        <div className="mt-8">
          {/* Page Info */}
          <div className="text-sm text-gray-600 text-center mb-4">
            Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} listings
          </div>

          {/* Pagination Component */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
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
