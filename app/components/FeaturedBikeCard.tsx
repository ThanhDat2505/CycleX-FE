/**
 * FeaturedBikeCard Component
 * Simplified card for Home page "Xe Đạp Đang Hot" section
 * 
 * Displays ONLY:
 * - Image
 * - Title
 * - Price
 * 
 * NO badges, NO metadata (location, year, category, etc.)
 */

'use client';

import React from 'react';
import { HomeBike } from '../types/listing';
import { formatPrice } from '../utils/format';

interface FeaturedBikeCardProps {
    bike: HomeBike;
    onClick?: () => void;
}

export default function FeaturedBikeCard({ bike, onClick }: FeaturedBikeCardProps) {
    return (
        <div
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
            onClick={onClick}
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
            <div className="p-4">
                {/* Title */}
                <h3 className="text-base font-semibold text-gray-800 line-clamp-2 mb-3 min-h-[3rem]">
                    {bike.title}
                </h3>

                {/* Price */}
                <div className="text-xl font-bold text-brand-primary">
                    {formatPrice(bike.price)}
                </div>
            </div>
        </div>
    );
}
