/**
 * FeaturedBikeCard Component
 * Simplified card for Home page "Xe Đạp Đang Hot" section and Listing Grid
 * 
 * Displays:
 * - Image
 * - Title
 * - Price
 * - Action: Purchase button (S-50 integration)
 * 
 * Handles its own navigation to avoid nesting button inside Link
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { HomeBike } from '../types/listing';
import { formatPrice } from '../utils/format';

interface FeaturedBikeCardProps {
    bike: HomeBike;
    className?: string;
}

export default function FeaturedBikeCard({ bike, className = '' }: FeaturedBikeCardProps) {
    const router = useRouter();

    // Navigate to listing detail when card is clicked
    const handleCardClick = () => {
        router.push(`/listings/${bike.listingId}`);
    };

    // Navigate to purchase request when button is clicked
    const handlePurchase = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click
        router.push(`/purchase-request?listingId=${bike.listingId}`);
    };

    return (
        <div
            onClick={handleCardClick}
            className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col h-full ${className}`}
        >
            {/* Image Container */}
            <div className="relative w-full h-56 bg-gray-200 overflow-hidden">
                <img
                    src={bike.imageUrl}
                    alt={bike.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=300&fit=crop';
                    }}
                />
            </div>

            {/* Card Content */}
            <div className="p-4 flex flex-col flex-grow">
                {/* Title */}
                <h3 className="text-base font-semibold text-gray-800 line-clamp-2 mb-3 min-h-[3rem]">
                    {bike.title}
                </h3>

                {/* Price & Action */}
                <div className="mt-auto flex items-center justify-between">
                    <div className="text-xl font-bold text-brand-primary">
                        {formatPrice(bike.price)}
                    </div>

                    <button
                        onClick={handlePurchase}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors z-10 relative shadow-sm"
                    >
                        Đặt mua
                    </button>
                </div>
            </div>
        </div>
    );
}
