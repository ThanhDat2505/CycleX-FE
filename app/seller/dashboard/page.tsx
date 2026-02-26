// app/seller/dashboard/page.tsx
"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { useDashboard } from "@/app/hooks/useDashboard";
import { type TopListing } from "@/app/services/dashboardService";
import { MetricCard } from "@/app/components/MetricCard";
import { ErrorBanner } from "@/app/components/ErrorBanner";
import { useToast } from "@/app/contexts/ToastContext";
import { formatPrice } from "../../utils/format";
import { TOP_LISTINGS_LIMIT } from "../../constants";

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const { addToast } = useToast();
  const { isLoggedIn, isLoading: authLoading, user } = useAuth(); // Get user data

  // Load dashboard data using custom hook - Moved up to fix hook ordering
  const { stats, topListings, loading: dashboardLoading, error, retry } = useDashboard(!authLoading && isLoggedIn);


  // ✅ AUTH PROTECTION: Redirect to login if not authenticated
  // BR-S10: Restrict access to BUYER and SELLER only
  useEffect(() => {
    if (!authLoading) {
      if (!isLoggedIn) {
        router.push('/login?returnUrl=/seller/dashboard');
      } else if (user && ['ADMIN', 'SHIPPER', 'INSPECTOR'].includes(user.role)) {
        router.push('/'); // Redirect restricted roles to Home
      }
    }
  }, [isLoggedIn, authLoading, router, user]);

  // Show loading while checking auth
  if (authLoading) {
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

  // Load dashboard data using custom hook


  // Destructure stats for backward compatibility with existing JSX
  const {
    activeListings,
    pendingListings,
    rejectedListings,
    totalTransactions,
    totalViews,
    newInquiries
  } = stats;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-8">
      <div className="max-w-7xl mx-auto animate-fade-in-up">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-gray-600 mt-2 text-lg">
            Welcome back, <span className="font-semibold">{user?.fullName || 'User'}</span>. Here&apos;s your selling overview.
          </p>
        </div>

        {/* Error Banner */}
        {error && <ErrorBanner message={error} onRetry={retry} />}

        {/* Show loading skeleton for dashboard data */}
        {dashboardLoading ? (
          <div className="animate-pulse">
            {/* Skeleton Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded w-32"></div>
                </div>
              ))}
            </div>
            {/* Skeleton Top Listings */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-4 border border-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                      <div className="h-3 bg-gray-100 rounded w-24"></div>
                    </div>
                    <div className="h-5 bg-gray-200 rounded w-20"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                label="Active Listings"
                value={activeListings}
                icon="📋"
                change="↑ 2 from last month"
                href="/seller/my-listings?status=active"
                isPositive={true}
              />
              {/* BR-S10-F01: PENDING listings */}
              <MetricCard
                label="Pending Listings"
                value={pendingListings}
                icon="⏳"
                change="Waiting for approval"
                href="/seller/my-listings?status=pending"
              />
              {/* BR-S10-F01: REJECTED listings */}
              <MetricCard
                label="Rejected Listings"
                value={rejectedListings}
                icon="❌"
                change="Need attention"
                href="/seller/my-listings?status=rejected"
              />
              {/* BR-S10-F02: Transactions count */}
              <MetricCard
                label="Transactions"
                value={totalTransactions}
                icon="💰"
                change="View not available yet"
              />
            </div>

            {/* Recent Activity & Quick Actions Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Recent Activity */}
              <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                  Recent Activity
                </h2>
                <div className="space-y-4">
                  <div className="pb-4 border-b border-gray-50 last:border-0">
                    <p className="text-sm text-gray-500 mb-1">Today</p>
                    <p className="font-semibold text-gray-900">💬 New inquiry on Trek Domane</p>
                    <p className="text-sm text-gray-600">Customer asked about shipping costs</p>
                  </div>
                  <div className="pb-4 border-b border-gray-50 last:border-0">
                    <p className="text-sm text-gray-500 mb-1">Yesterday</p>
                    <p className="font-semibold text-gray-900">👁️ Listing viewed 25 times</p>
                    <p className="text-sm text-gray-600">Specialized Tarmac SL7 getting attention</p>
                  </div>
                  <div className="pb-4 border-b border-gray-50 last:border-0">
                    <p className="text-sm text-gray-500 mb-1">2 days ago</p>
                    <p className="font-semibold text-gray-900">✅ New sale completed</p>
                    <p className="text-sm text-gray-600">Trek Domane AL 3 - $1,200</p>
                  </div>
                  <div className="pb-4 border-b border-gray-50 last:border-0">
                    <p className="text-sm text-gray-500 mb-1">3 days ago</p>
                    <p className="font-semibold text-gray-900">⭐ 5-star review received</p>
                    <p className="text-sm text-gray-600">From verified buyer</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-fit sticky top-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="w-2 h-6 bg-orange-500 rounded-full"></span>
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  <Link
                    href="/seller/create-listing"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#FF8A00] text-white rounded-lg font-bold hover:bg-[#FF7A00] hover:shadow-lg hover:-translate-y-0.5 transition-all text-center"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Listing
                  </Link>
                  <Link
                    href="/seller/transactions/pending"
                    className="flex items-center justify-between px-4 py-3 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition-all border border-blue-100"
                  >
                    <span>Check Requests</span>
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                  </Link>
                  <Link
                    href="/seller/my-listings"
                    className="block px-4 py-3 bg-gray-50 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-all text-center border border-gray-100"
                  >
                    View Listings
                  </Link>
                  <Link
                    href="/seller/draft-listings"
                    className="block px-4 py-3 bg-gray-50 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-all text-center border border-gray-100"
                  >
                    Draft Listings
                  </Link>
                </div>
              </div>
            </div>

            {/* Top Performing Listings */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-green-500 rounded-full"></span>
                Top Performing Listings
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">
                        Bike Name
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">
                        Price
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">
                        Views
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">
                        Inquiries
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {topListings.slice(0, TOP_LISTINGS_LIMIT).map((listing: TopListing) => {
                      return (
                        <tr
                          key={listing.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3 font-medium text-gray-900">
                            {listing.brand} {listing.model}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {formatPrice(listing.price)}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {listing.views}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {listing.inquiries}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${listing.status === "ACTIVE"
                                ? "bg-green-100 text-green-800"
                                : listing.status === "PENDING"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                                }`}
                            >
                              {listing.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
