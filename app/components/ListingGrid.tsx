/**
 * ListingGrid Component
 * Responsive grid container for displaying listing cards
 * Desktop: 3 columns | Tablet: 2 columns | Mobile: 1 column
 */

import React from 'react';
import { Listing } from '../types/listing';
import ListingCard from './ListingCard';

interface ListingGridProps {
    listings: Listing[];
    onListingClick: (listingId: number) => void;
}

export default function ListingGrid({ listings, onListingClick }: ListingGridProps) {
    if (listings.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No listings available</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
                <ListingCard
                    key={listing.listing_id}
                    listing={listing}
                    onClick={() => onListingClick(listing.listing_id)}
                />
            ))}
        </div>
    );
}
