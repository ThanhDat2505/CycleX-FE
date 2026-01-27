/**
 * ===========================================
 * S-01 HOME PAGE (Trang Chủ)
 * ===========================================
 * Route: / (root)
 * File: app/page.tsx (Next.js App Router convention)
 * 
 * Public page displaying approved bike listings with pagination.
 * Business Rules: BR-H01 through BR-H05
 * 
 * Sections included:
 * - Header (navigation, auth)
 * - HeroSection (search, stats)
 * - FeaturesSection (why choose us)
 * - Listings (bike cards with pagination)
 * - CategorySection (browse by category)
 * - Footer (links, contact)
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Listing, PaginationInfo } from './types/listing';
import { getHomeListings } from './services/listingService';
import { scrollToElement } from './utils/scroll';
import { PAGINATION } from './constants/pagination';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import CategorySection from './components/CategorySection';
import Footer from './components/Footer';
import ListingGrid from './components/ListingGrid';
import Pagination from './components/Pagination';
import Badge from './components/ui/Badge';

export default function Home() {
  const router = useRouter();
  const listingsSectionRef = React.useRef<HTMLDivElement>(null);

  // State management
  const [listings, setListings] = useState<Listing[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch listings on mount and when page changes
  useEffect(() => {
    fetchListings(pagination.page);
  }, [pagination.page]);

  /**
   * Fetch listings from API
   * BR-H01: Only APPROVED listings are returned (BE filters)
   * BR-H02: FE does NOT filter client-side
   * BR-H03: FE trusts API data without modification
   */
  const fetchListings = async (page: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getHomeListings(page, PAGINATION.DEFAULT_PAGE_SIZE);
      setListings(response.items);
      setPagination(response.pagination);
    } catch (err) {
      setError('Failed to load listings. Please try again later.');
      console.error('Error fetching listings:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle page change
   */
  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));

    // Scroll to listings section when changing pages for better UX
    scrollToElement(listingsSectionRef.current, {
      offset: PAGINATION.SCROLL_OFFSET,
      delay: PAGINATION.SCROLL_DELAY
    });
  };

  /**
   * Navigate to listing detail page
   * BR-H04: views_count only increments on detail page, not here
   */
  const handleListingClick = (listingId: number) => {
    router.push(`/listing/${listingId}`);
  };

  // Calculate total pages
  const totalPages = Math.ceil(pagination.total / pagination.pageSize);

  return (
    <div className="min-h-screen bg-white">
      {/* Header with auth state */}
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Page Title */}
        <div ref={listingsSectionRef} className="text-center mb-12">
          <Badge icon="🔥" text="Nổi Bật" className="mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Xe Đạp Đang Hot
          </h2>
          <p className="text-gray-600">
            Những chiếc xe đạp được quan tâm nhiều nhất với chất lượng đã được kiểm định
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Listings Grid */}
        {!loading && !error && (
          <>
            <ListingGrid
              listings={listings}
              onListingClick={handleListingClick}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={pagination.page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </main>

      {/* Category Section */}
      <CategorySection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
