/**
 * ListingGrid Component
 * Displays search results in a responsive grid
 * Reuses FeaturedBikeCard for consistency
 */

'use client';

import React from 'react';
import { HomeBike } from '../../types/listing';
import FeaturedBikeCard from '../../components/FeaturedBikeCard';
import BikeSkeleton from '../../components/ui/BikeSkeleton';
import { MESSAGES, DEFAULT_PAGE_SIZE } from '../../constants';

interface ListingGridProps {
    listings: HomeBike[];
    isLoading: boolean;
}

/** Style constants */
const STYLES = {
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in',
    skeletonItem: 'animate-pulse',
    emptyWrapper: 'text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100',
    emptyIcon: 'text-7xl mb-6 grayscale opacity-50',
    emptyTitle: 'text-2xl font-bold text-gray-800 mb-3',
    emptySuggestion: 'text-gray-500 max-w-md mx-auto',
    resultCount: 'mb-6 flex items-center gap-2 text-gray-600 bg-gray-100/50 w-fit px-4 py-2 rounded-full text-sm border border-gray-200',
    resultCountBold: 'font-bold text-brand-primary',
} as const;

export default function ListingGrid({ listings, isLoading }: ListingGridProps) {

    if (isLoading) {
        return (
            <div className={STYLES.grid}>
                {[...Array(DEFAULT_PAGE_SIZE)].map((_, i) => (
                    <BikeSkeleton key={`skeleton-${i}`} />
                ))}
            </div>
        );
    }

    if (listings.length === 0) {
        return (
            <div className={STYLES.emptyWrapper}>
                <div className={STYLES.emptyIcon}>🚲</div>
                <h3 className={STYLES.emptyTitle}>
                    {MESSAGES.EMPTY_STATE_TITLE}
                </h3>
                <p className={STYLES.emptySuggestion}>
                    {MESSAGES.EMPTY_STATE_SUGGESTION}
                </p>
            </div>
        );
    }

    return (
        <div>
            {/* Result Count */}
            <div className={STYLES.resultCount}>
                <span>{MESSAGES.SHOWING_RESULTS}</span>
                <span className={STYLES.resultCountBold}>{listings.length}</span>
                <span>{MESSAGES.PRODUCTS_COUNT}</span>  
            </div>

            {/* Grid */}
            <div className={STYLES.grid}>
                {listings.map((listing, index) => (
                    <div
                        key={listing.listingId}
                        className="animate-slide-up"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <FeaturedBikeCard
                            bike={listing}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
