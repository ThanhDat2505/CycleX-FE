/**
 * ListingDetailView Component
 * Main layout for S-32 Listing Detail page
 * Displays all listing information with proper null handling
 * 
 * Business Rules:
 * - BR-S32-02: Display full detail data
 * - BR-S32-03: Show inspection info if available
 * - BR-S32-05: NO CTAs in Sprint 1
 */

'use client';

import { ListingDetail } from '../../../types/listing';
import { MESSAGES } from '../../../constants';
import { formatPrice, formatNumber } from '../../../utils/format';
import ImageGallery from './ImageGallery';

interface ListingDetailViewProps {
    listing: ListingDetail;
}

export default function ListingDetailView({ listing }: ListingDetailViewProps) {
    const hasInspection = listing.inspectionStatus || listing.inspectionDate || listing.inspectionNotes;

    return (
        <div className="space-y-8">
            {/* Main Grid: Image + Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Image Gallery */}
                <div>
                    <ImageGallery images={listing.images} alt={listing.title} />
                </div>

                {/* Right: Basic Info */}
                <div className="space-y-6">
                    {/* Title */}
                    <h1 className="text-3xl font-bold text-gray-900">
                        {listing.title}
                    </h1>

                    {/* Price */}
                    <div className="text-4xl font-bold text-blue-600">
                        {formatPrice(listing.price)}
                    </div>

                    {/* Metadata Row */}
                    <div className="flex flex-wrap gap-3 items-center">
                        {/* Condition Badge */}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${listing.condition === 'new'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {listing.condition === 'new'
                                ? MESSAGES.DETAIL_CONDITION_NEW
                                : MESSAGES.DETAIL_CONDITION_USED
                            }
                        </span>

                        {/* Bike Type Badge (if exists) */}
                        {listing.bikeType && (
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                {listing.bikeType}
                            </span>
                        )}

                        {/* View Count */}
                        <span className="flex items-center gap-1 text-gray-600 text-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {formatNumber(listing.viewsCount)} {MESSAGES.DETAIL_VIEWS}
                        </span>

                        {/* Location (if exists) */}
                        {listing.locationCity && (
                            <span className="flex items-center gap-1 text-gray-600 text-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {listing.locationCity}
                            </span>
                        )}
                    </div>

                    {/* Specifications */}
                    <div className="border-t pt-6">
                        <h2 className="text-xl font-semibold mb-4">
                            {MESSAGES.DETAIL_SPECIFICATIONS_TITLE}
                        </h2>
                        <dl className="space-y-3">
                            <div className="flex justify-between">
                                <dt className="text-gray-600">Thương hiệu:</dt>
                                <dd className="font-semibold">{listing.brand}</dd>
                            </div>
                            {listing.model && (
                                <div className="flex justify-between">
                                    <dt className="text-gray-600">Model:</dt>
                                    <dd className="font-semibold">{listing.model}</dd>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <dt className="text-gray-600">Tình trạng:</dt>
                                <dd className="font-semibold">
                                    {listing.condition === 'new'
                                        ? MESSAGES.DETAIL_CONDITION_NEW
                                        : MESSAGES.DETAIL_CONDITION_USED
                                    }
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>

            {/* Description Section */}
            <div className="border-t pt-8">
                <h2 className="text-2xl font-semibold mb-4">
                    {MESSAGES.DETAIL_DESCRIPTION_TITLE}
                </h2>
                <div className="prose max-w-none text-gray-700">
                    {listing.description ? (
                        <p className="whitespace-pre-wrap">{listing.description}</p>
                    ) : (
                        <p className="text-gray-400 italic">{MESSAGES.DETAIL_NO_DESCRIPTION}</p>
                    )}
                </div>
            </div>

            {/* Inspection Section (BR-S32-03: Show if available) */}
            {hasInspection && (
                <div className="border-t pt-8">
                    <h2 className="text-2xl font-semibold mb-4">
                        {MESSAGES.DETAIL_INSPECTION_TITLE}
                    </h2>
                    <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                        {listing.inspectionStatus && (
                            <div className="flex items-start gap-3">
                                <span className="text-gray-600 font-medium min-w-[120px]">
                                    {MESSAGES.DETAIL_INSPECTION_STATUS}:
                                </span>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${listing.inspectionStatus === 'PASSED'
                                    ? 'bg-green-100 text-green-800'
                                    : listing.inspectionStatus === 'FAILED'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {listing.inspectionStatus}
                                </span>
                            </div>
                        )}
                        {listing.inspectionDate && (
                            <div className="flex items-start gap-3">
                                <span className="text-gray-600 font-medium min-w-[120px]">
                                    {MESSAGES.DETAIL_INSPECTION_DATE}:
                                </span>
                                <span className="text-gray-900">
                                    {new Date(listing.inspectionDate).toLocaleDateString('vi-VN')}
                                </span>
                            </div>
                        )}
                        {listing.inspectionNotes && (
                            <div className="flex items-start gap-3">
                                <span className="text-gray-600 font-medium min-w-[120px]">
                                    {MESSAGES.DETAIL_INSPECTION_NOTES}:
                                </span>
                                <span className="text-gray-900 flex-1">
                                    {listing.inspectionNotes}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Seller Info Placeholder (S-33 future) */}
            <div className="border-t pt-8">
                <div className="bg-blue-50 rounded-lg p-6 text-center">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">
                        {MESSAGES.DETAIL_SELLER_INFO_COMING_SOON}
                    </h3>
                    <p className="text-blue-700 text-sm">
                        Thông tin người bán sẽ được hiển thị ở đây trong phiên bản tiếp theo
                    </p>
                </div>
            </div>
        </div>
    );
}
