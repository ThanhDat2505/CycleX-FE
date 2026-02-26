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

import React, { Suspense } from 'react';
import SearchFilters from './components/SearchFilters';
import ListingGrid from './components/ListingGrid';
import Pagination from './components/Pagination';
import { ActiveFilters } from './components/ActiveFilters';
import { useListings } from './hooks/useListings';
import { SORT_OPTIONS, MESSAGES } from '../constants';

// Force dynamic rendering to avoid prerender errors with useSearchParams
export const dynamic = 'force-dynamic';

/** Style constants */
const STYLES = {
    page: 'min-h-screen bg-gray-50 flex flex-col',
    main: 'flex-grow container mx-auto px-4 py-8',
    titleSection: 'mb-8',
    title: 'text-3xl font-bold text-gray-800',
    subtitle: 'text-gray-600 mt-2',
    contentLayout: 'flex flex-col lg:flex-row gap-8',
    sidebar: 'lg:w-1/4',
    mainContent: 'lg:w-3/4',
    sortBar: 'flex justify-between items-center mb-6',
    sortInfo: 'text-gray-700',
    sortControls: 'flex items-center gap-2',
    sortLabel: 'text-gray-700 font-medium',
    sortSelect: 'px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary',
    errorBanner: 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6',
    retryButton: 'mt-2 text-sm underline hover:no-underline',
} as const;

/** Skeleton styles */
const SKELETON_STYLES = {
    page: 'min-h-screen bg-gray-50 flex flex-col',
    main: 'flex-grow container mx-auto px-4 py-8',
    wrapper: 'animate-pulse',
    titleBar: 'h-8 bg-gray-200 rounded w-64 mb-8',
    layout: 'flex gap-8',
    sidebar: 'w-1/4 space-y-4',
    sidebarBlock: 'h-32 bg-gray-200 rounded',
    grid: 'w-3/4',
    gridInner: 'grid grid-cols-3 gap-6',
    gridItem: 'h-64 bg-gray-200 rounded',
} as const;

const SKELETON_ITEM_COUNT = 6;

export default function ListingsPage() {
    return (
        <Suspense fallback={<ListingsPageSkeleton />}>
            <ListingsContent />
        </Suspense>
    );
}

function ListingsPageSkeleton() {
    return (
        <div className={SKELETON_STYLES.page}>
            <main className={SKELETON_STYLES.main}>
                <div className={SKELETON_STYLES.wrapper}>
                    <div className={SKELETON_STYLES.titleBar} />
                    <div className={SKELETON_STYLES.layout}>
                        <div className={SKELETON_STYLES.sidebar}>
                            <div className={SKELETON_STYLES.sidebarBlock} />
                            <div className={SKELETON_STYLES.sidebarBlock} />
                        </div>
                        <div className={SKELETON_STYLES.grid}>
                            <div className={SKELETON_STYLES.gridInner}>
                                {[...Array(SKELETON_ITEM_COUNT)].map((_, i) => (
                                    <div key={i} className={SKELETON_STYLES.gridItem} />
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
    const {
        listings,
        pagination,
        isLoading,
        error,
        filters,
        localFilters,
        sortBy,
        currentPage,
        totalPages,
        isAuthLoading,
        userRole,
        handleFiltersChange,
        handleApplyFilters,
        handleClearFilters,
        handleRemoveFilter,
        handleSortChange,
        handlePageChange,
        retryFetch,
    } = useListings();

    if (isAuthLoading) {
        return <ListingsPageSkeleton />;
    }

    if (userRole === 'SHIPPER' || userRole === 'SELLER') {
        return null;
    }

    return (
        <div className={STYLES.page}>
            <main className={STYLES.main}>
                {/* Page Title */}
                <div className={STYLES.titleSection}>
                    <h1 className={STYLES.title}>
                        {filters.keyword
                            ? `${MESSAGES.PAGE_TITLE_SEARCH_RESULTS}: "${filters.keyword}"`
                            : MESSAGES.PAGE_TITLE_ALL_PRODUCTS}
                    </h1>
                    {!isLoading && (
                        <p className={STYLES.subtitle}>
                            {pagination.total} {MESSAGES.PRODUCTS_COUNT}
                        </p>
                    )}
                </div>

                <div className={STYLES.contentLayout}>
                    {/* Filters Sidebar */}
                    <aside className={STYLES.sidebar}>
                        <SearchFilters
                            filters={localFilters}
                            onFiltersChange={handleFiltersChange}
                            onApply={handleApplyFilters}
                            onClear={handleClearFilters}
                        />
                    </aside>

                    {/* Main Content */}
                    <div className={STYLES.mainContent}>
                        {/* Active Filter Chips */}
                        <ActiveFilters
                            filters={filters}
                            onRemoveFilter={handleRemoveFilter}
                            onClearAll={handleClearFilters}
                        />

                        {/* Sort Dropdown */}
                        <div className={STYLES.sortBar}>
                            <div className={STYLES.sortInfo}>
                                {!isLoading && pagination.total > 0 && (
                                    <span>
                                        {MESSAGES.SHOWING_RESULTS} {(currentPage - 1) * pagination.pageSize + 1} -{' '}
                                        {Math.min(currentPage * pagination.pageSize, pagination.total)} / {pagination.total}
                                    </span>
                                )}
                            </div>
                            <div className={STYLES.sortControls}>
                                <label htmlFor="sort" className={STYLES.sortLabel}>
                                    {MESSAGES.SORT_LABEL}
                                </label>
                                <select
                                    id="sort"
                                    value={sortBy}
                                    onChange={(e) => handleSortChange(e.target.value as import('../types/listing').SortOption)}
                                    className={STYLES.sortSelect}
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
                            <div className={STYLES.errorBanner}>
                                <p>{error}</p>
                                <button onClick={retryFetch} className={STYLES.retryButton}>
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
