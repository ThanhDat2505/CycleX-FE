/**
 * ListingCard Component - Redesigned for Figma Mockup
 * Displays bike listing with featured badge, category, condition, pricing, etc.
 */

'use client';

import React, { useState } from 'react';
import { Listing } from '../types/listing';
import { formatPrice } from '../utils/format';

interface ListingCardProps {
    listing: Listing;
    onClick?: () => void;
}

export default function ListingCard({ listing, onClick }: ListingCardProps) {
    const [isFavorite, setIsFavorite] = useState(false);

    // Get condition label in Vietnamese
    const getConditionLabel = (condition?: 'new' | 'used'): string => {
        if (condition === 'new') return 'Như mới';
        if (condition === 'used') return 'Đã sử dụng';
        return '';
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow relative group">
            {/* Image Container */}
            <div className="relative w-full h-56 bg-gray-200 overflow-hidden">
                <img
                    src={listing.thumbnail_url}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=300&fit=crop';
                    }}
                />

                {/* Overlay Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {/* Featured Badge */}
                    {listing.is_featured && (
                        <span className="bg-brand-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                            NỔI BẬT
                        </span>
                    )}

                    {/* Discount Badge */}
                    {listing.discount_percentage && listing.discount_percentage > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            -{listing.discount_percentage}%
                        </span>
                    )}
                </div>

                {/* Favorite Heart Icon */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsFavorite(!isFavorite);
                    }}
                    className="absolute top-3 right-3 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-all"
                >
                    <svg
                        className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'fill-none text-gray-600'}`}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            </div>

            {/* Card Content */}
            <div className="p-4" onClick={onClick}>
                {/* Category & Condition */}
                <div className="flex items-center gap-2 mb-2">
                    {listing.category && (
                        <span className="text-brand-primary text-xs font-semibold uppercase">
                            {listing.category}
                        </span>
                    )}
                    {listing.condition && (
                        <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            {getConditionLabel(listing.condition)}
                        </span>
                    )}
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold text-gray-800 line-clamp-2 mb-2">
                    {listing.title}
                </h3>

                {/* Location & Year */}
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                    {listing.location && (
                        <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{listing.location}</span>
                        </div>
                    )}
                    {listing.year && (
                        <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{listing.year}</span>
                        </div>
                    )}
                </div>

                {/* Pricing */}
                <div className="flex items-center gap-2 mb-3">
                    {listing.original_price && listing.original_price > listing.price && (
                        <span className="text-sm text-gray-400 line-through">
                            {formatPrice(listing.original_price)}
                        </span>
                    )}
                    <span className="text-xl font-bold text-brand-primary">
                        {formatPrice(listing.price)}
                    </span>
                </div>

                {/* Detail Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClick?.();
                    }}
                    className="w-full bg-gray-100 hover:bg-brand-primary hover:text-white text-gray-700 font-medium py-2 rounded-lg transition-colors"
                >
                    Chi Tiết
                </button>
            </div>
        </div>
    );
}
