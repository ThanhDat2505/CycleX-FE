/**
 * ListingGrid Component
 * Displays search results in a responsive grid
 * Reuses FeaturedBikeCard for consistency
 */

'use client';

import Link from 'next/link';
import React from 'react';
import { HomeBike } from '../../types/listing';
import FeaturedBikeCard from '../../components/FeaturedBikeCard';
import { MESSAGES } from '../../constants';

interface ListingGridProps {
    listings: HomeBike[];
    isLoading: boolean;
}

export default function ListingGrid({ listings, isLoading }: ListingGridProps) {

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(12)].map((_, i) => (
                    <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse" />
                ))}
            </div>
        );
    }

    if (listings.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                    {MESSAGES.EMPTY_STATE_TITLE}
                </h3>
                <p className="text-gray-600 mb-4">
                    {MESSAGES.EMPTY_STATE_SUGGESTION}
                </p>
            </div>
        );
    }

    return (
        <div>
            {/* Result Count */}
            <div className="mb-4 text-gray-700">
                Tìm thấy <span className="font-semibold">{listings.length}</span> kết quả
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                    <Link
                        key={listing.listingId}
                        href={`/listings/${listing.listingId}`}
                    >
                        <FeaturedBikeCard bike={listing} />
                    </Link>
                ))}
            </div>
        </div>
    );
}
