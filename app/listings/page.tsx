/**
 * S-31 - Listing List (Search Results Page)
 * 
 * Displays search results with filters, pagination, and sorting
 * 
 * Business Rules:
 * - BR-S30-01: Keyword search only matches title (not brand/model)
 * - BR-S30-02: Supports filters: price range, bike type, brand, condition
 * - BR-S30-04: Page-based pagination
 * - BR-S30-05: Sorting: newest, price ↑/↓, most viewed
 * - BR-S31-01: Only shows APPROVED listings (backend responsibility)
 * - BR-S31-03: Empty state when no results
 */

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SearchFilters from './components/SearchFilters';
import ListingGrid from './components/ListingGrid';
import Pagination from './components/Pagination';
import { searchListings } from '../services/listingService';
import { HomeBike, SearchFilters as SearchFiltersType, SortOption, PaginationInfo } from '../types/listing';
import { SORT_OPTIONS, DEFAULT_PAGE_SIZE, DEFAULT_PAGE, MESSAGES } from '../constants';

// Force dynamic rendering to avoid prerender errors with useSearchParams
export const dynamic = 'force-dynamic';

export default function ListingsPage() {
    return (
        <Suspense fallback={<ListingsPageSkeleton />}>
            <ListingsContent />
        </Suspense>
    );
}

function ListingsPageSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
                    <div className="flex gap-8">
                        <div className="w-1/4 space-y-4">
                            <div className="h-32 bg-gray-200 rounded"></div>
                            <div className="h-32 bg-gray-200 rounded"></div>
                        </div>
                        <div className="w-3/4">
                            <div className="grid grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="h-64 bg-gray-200 rounded"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function ListingsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // State
    const [listings, setListings] = useState<HomeBike[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo>({
        page: DEFAULT_PAGE,
        pageSize: DEFAULT_PAGE_SIZE,
        total: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter state from URL (what's actually applied)
    const [filters, setFilters] = useState<SearchFiltersType>({});
    // Local filter state (what user is currently selecting)
    const [localFilters, setLocalFilters] = useState<SearchFiltersType>({});
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);

    /**
     * URL Sync Strategy:
     * 
     * We maintain TWO separate filter states to provide optimal UX:
     * 
     * 1. `filters` - Applied filters (synced with URL, triggers API calls)
     *    - Updated when URL params change (e.g., from Header search, back/forward navigation)
     *    - Used for actual API requests to fetch listings
     * 
     * 2. `localFilters` - Working filters (UI state, not yet applied)
     *    - Allows users to make multiple selections without triggering re-renders
     *    - Only commits to `filters` when user clicks "Apply"
     *    - Prevents flickering/loss of selections during typing/clicking
     * 
     * Why this pattern?
     * - Without it: Each checkbox click → URL update → re-render → lost selections
     * - With it: User can configure all filters → click Apply once → clean UX
     * 
     * Sync flow:
     * URL changes → Update both `filters` AND `localFilters` → Keep UI in sync
     */
    useEffect(() => {
        const keyword = searchParams.get('keyword') || undefined;
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const bikeTypes = searchParams.getAll('bikeType');
        const brands = searchParams.getAll('brand');
        const conditions = searchParams.getAll('condition') as ('new' | 'used')[];
        const page = searchParams.get('page');
        const sort = searchParams.get('sortBy') as SortOption;

        const filtersFromURL: SearchFiltersType = {
            keyword,
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
            bikeTypes: bikeTypes.length > 0 ? bikeTypes : undefined,
            brands: brands.length > 0 ? brands : undefined,
            conditions: conditions.length > 0 ? conditions : undefined,
        };

        setFilters(filtersFromURL);
        setLocalFilters(filtersFromURL); // Sync local state when URL changes

        setSortBy(sort || 'newest');
        setCurrentPage(page ? Number(page) : DEFAULT_PAGE);
    }, [searchParams]);

    // Fetch listings when applied filters/sort/page change
    useEffect(() => {
        fetchListings();
    }, [filters, sortBy, currentPage]);

    const fetchListings = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await searchListings(
                filters.keyword,
                {
                    minPrice: filters.minPrice,
                    maxPrice: filters.maxPrice,
                    bikeTypes: filters.bikeTypes,
                    brands: filters.brands,
                    conditions: filters.conditions,
                },
                currentPage,
                DEFAULT_PAGE_SIZE,
                sortBy
            );

            setListings(response.items);
            setPagination(response.pagination);
        } catch (err) {
            console.error('Error fetching listings:', err);
            setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    // Update URL when filters change
    const updateURL = (newFilters: SearchFiltersType, newSort: SortOption, newPage: number) => {
        const params = new URLSearchParams();

        if (newFilters.keyword) params.append('keyword', newFilters.keyword);
        if (newFilters.minPrice) params.append('minPrice', newFilters.minPrice.toString());
        if (newFilters.maxPrice) params.append('maxPrice', newFilters.maxPrice.toString());
        if (newFilters.bikeTypes) newFilters.bikeTypes.forEach(t => params.append('bikeType', t));
        if (newFilters.brands) newFilters.brands.forEach(b => params.append('brand', b));
        if (newFilters.conditions) newFilters.conditions.forEach(c => params.append('condition', c));
        if (newPage !== DEFAULT_PAGE) params.append('page', newPage.toString());
        if (newSort !== 'newest') params.append('sortBy', newSort);

        router.push(`/listings?${params.toString()}`, { scroll: false });
    };

    const handleFiltersChange = (newFilters: SearchFiltersType) => {
        setLocalFilters(newFilters);
    };

    const handleApplyFilters = () => {
        setFilters(localFilters); // Commit local filters to actual filters
        updateURL(localFilters, sortBy, 1); // Reset to page 1 when applying filters
    };

    const handleClearFilters = () => {
        const clearedFilters: SearchFiltersType = {
            keyword: filters.keyword, // Keep keyword
        };
        setLocalFilters(clearedFilters);
        setFilters(clearedFilters);
        updateURL(clearedFilters, sortBy, 1);
    };

    const handleSortChange = (newSort: SortOption) => {
        setSortBy(newSort);
        updateURL(filters, newSort, 1); // Reset to page 1 when changing sort
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        updateURL(filters, sortBy, newPage);
    };

    const totalPages = Math.ceil(pagination.total / pagination.pageSize);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <main className="flex-grow container mx-auto px-4 py-8">
                {/* Page Title */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        {filters.keyword ? `${MESSAGES.PAGE_TITLE_SEARCH_RESULTS}: "${filters.keyword}"` : MESSAGES.PAGE_TITLE_ALL_PRODUCTS}
                    </h1>
                    {!isLoading && (
                        <p className="text-gray-600 mt-2">
                            {pagination.total} {MESSAGES.PRODUCTS_COUNT}
                        </p>
                    )}
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <aside className="lg:w-1/4">
                        <SearchFilters
                            filters={localFilters}
                            onFiltersChange={handleFiltersChange}
                            onApply={handleApplyFilters}
                            onClear={handleClearFilters}
                        />
                    </aside>

                    {/* Main Content */}
                    <div className="lg:w-3/4">
                        {/* Sort Dropdown */}
                        <div className="flex justify-between items-center mb-6">
                            <div className="text-gray-700">
                                {!isLoading && pagination.total > 0 && (
                                    <span>
                                        {MESSAGES.SHOWING_RESULTS} {(currentPage - 1) * pagination.pageSize + 1} -{' '}
                                        {Math.min(currentPage * pagination.pageSize, pagination.total)} / {pagination.total}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <label htmlFor="sort" className="text-gray-700 font-medium">
                                    {MESSAGES.SORT_LABEL}
                                </label>
                                <select
                                    id="sort"
                                    value={sortBy}
                                    onChange={(e) => handleSortChange(e.target.value as SortOption)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                >
                                    {SORT_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Error State */}
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                                <p>{error}</p>
                                <button
                                    onClick={fetchListings}
                                    className="mt-2 text-sm underline hover:no-underline"
                                >
                                    {MESSAGES.ERROR_RETRY}
                                </button>
                            </div>
                        )}

                        {/* Listings Grid */}
                        <ListingGrid listings={listings} isLoading={isLoading} />

                        {/* Pagination */}
                        {!isLoading && totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}


