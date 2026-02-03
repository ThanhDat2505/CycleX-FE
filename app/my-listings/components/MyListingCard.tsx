/**
 * MyListingCard Component
 * Displays a single listing card in My Listings page
 * 
 * Features:
 * - Status badge (Draft/Pending/Active/Rejected)
 * - Listing info (brand, model, type, condition, price, location)
 * - Stats (views, inquiries, shipping)
 * - Action buttons (Edit for DRAFT/PENDING, View always)
 * - Rejection reason display for REJECT status
 */

import React from 'react';
import Link from 'next/link';
import { formatPrice } from '../../utils/format';
import { StatusBadge } from '@/app/components/ui/StatusBadge';

export interface MyListingCardProps {
    listing: {
        id: number;
        brand: string;
        model: string;
        type: string;
        condition: string;
        price: number;
        location: string;
        views: number;
        inquiries: number;
        shipping: boolean;
        status: 'DRAFT' | 'PENDING' | 'APPROVE' | 'REJECT' | 'NEED_MORE_INFO';
        rejectionReason?: string;
    };
}

export function MyListingCard({ listing }: MyListingCardProps) {
    return (
        <div className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition">
            {/* Image */}
            <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
                <div className="absolute top-3 right-3">
                    <StatusBadge status={listing.status} />
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-2">
                    {listing.brand} {listing.model}
                </h3>
                <div className="text-sm text-gray-600 mb-3">
                    <span>{listing.type}</span> • <span>{listing.condition}</span>
                </div>

                <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-[#FF8A00]">
                        {formatPrice(listing.price)}
                    </span>
                    <span className="text-xs text-gray-500">
                        {listing.location}
                    </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4 text-center text-sm">
                    <div>
                        <div className="font-bold text-gray-900">
                            {listing.views}
                        </div>
                        <div className="text-gray-500 text-xs">Views</div>
                    </div>
                    <div>
                        <div className="font-bold text-gray-900">
                            {listing.inquiries}
                        </div>
                        <div className="text-gray-500 text-xs">Inquiries</div>
                    </div>
                    <div>
                        <div className="font-bold text-gray-900">
                            {listing.shipping ? "✓" : "—"}
                        </div>
                        <div className="text-gray-500 text-xs">Shipping</div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    {/* BR-S11-F05: Edit button only for DRAFT and NEED_MORE_INFO status */}
                    {(listing.status === 'DRAFT' || listing.status === 'NEED_MORE_INFO') && (
                        <Link
                            href={`/edit-listing/${listing.id}`}
                            className="flex-1 px-3 py-2 bg-[#FF8A00] text-white rounded text-sm font-medium hover:bg-[#FF7A00] transition text-center"
                        >
                            Edit
                        </Link>
                    )}
                    <Link
                        href={`/listings/${listing.id}`}
                        className="flex-1 px-3 py-2 border border-gray-300 text-gray-900 rounded text-sm font-medium hover:bg-gray-50 transition text-center"
                    >
                        View
                    </Link>
                </div>

                {/* BR-S11-F06: Rejection Reason Display */}
                {listing.status === 'REJECT' && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start gap-2">
                            <span className="text-red-600 font-semibold text-sm">
                                ❌ Rejection Reason:
                            </span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">
                            {listing.rejectionReason ||
                                "Listing bị từ chối, vui lòng liên hệ Inspector để biết thêm chi tiết"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
