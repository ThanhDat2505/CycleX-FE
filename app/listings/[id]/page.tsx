/**
 * S-32 Listing Detail Page (Public)
 * Dynamic route: /listings/[id]
 * 
 * Business Rules:
 * - BR-S32-01: Only show APPROVED listings to Guest/Buyer
 * - BR-S32-04: Backend auto-increments view_count
 * - BR-S32-05: Sprint 1 - NO CTAs (Chat, Purchase, etc.)
 * - BR-S32-06: Back navigation to /listings
 */

'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getListingDetail } from '../../services/listingService';
import { ListingDetail } from '../../types/listing';
import { MESSAGES } from '../../constants';
import ListingDetailView from './components/ListingDetailView';

interface ListingDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function ListingDetailPage({ params }: ListingDetailPageProps) {
    const resolvedParams = use(params);
    const router = useRouter();
    const [listing, setListing] = useState<ListingDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const listingId = parseInt(resolvedParams.id);

    useEffect(() => {
        async function fetchListing() {
            if (isNaN(listingId)) {
                setError(MESSAGES.DETAIL_NOT_FOUND);
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const data = await getListingDetail(listingId);

                // BR-S32-01: Frontend validation (even though service also validates)
                // "Không bao giờ tin BE hoàn toàn"
                if (data.status !== 'APPROVED') {
                    setError(MESSAGES.DETAIL_NOT_AVAILABLE);
                    setIsLoading(false);
                    return;
                }

                setListing(data);
                setError(null);
            } catch (err) {
                console.error('Failed to load listing detail:', err);
                const message = err instanceof Error ? err.message : MESSAGES.DETAIL_NOT_FOUND;

                if (message.includes('not found')) {
                    setError(MESSAGES.DETAIL_NOT_FOUND);
                } else if (message.includes('not available')) {
                    setError(MESSAGES.DETAIL_NOT_AVAILABLE);
                } else {
                    setError(MESSAGES.ERROR_LOADING);
                }
            } finally {
                setIsLoading(false);
            }
        }

        fetchListing();
    }, [listingId]);

    // Loading state
    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-32 mb-8"></div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="aspect-w-4 aspect-h-3 bg-gray-200 rounded-lg"></div>
                        <div className="space-y-4">
                            <div className="h-8 bg-gray-200 rounded"></div>
                            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !listing) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12 text-center">
                <div className="text-6xl mb-4">😞</div>
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">
                    {error || MESSAGES.DETAIL_NOT_FOUND}
                </h1>
                <button
                    onClick={() => router.push('/listings')}
                    className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    {MESSAGES.DETAIL_BACK_TO_LISTINGS}
                </button>
            </div>
        );
    }

    // Success state
    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Back button */}
            <button
                onClick={() => router.push('/listings')}
                className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="width" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {MESSAGES.DETAIL_BACK_TO_LISTINGS}
            </button>

            {/* Main content */}
            <ListingDetailView listing={listing} />
        </div>
    );
}
