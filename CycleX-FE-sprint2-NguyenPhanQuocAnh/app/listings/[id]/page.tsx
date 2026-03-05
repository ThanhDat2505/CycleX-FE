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

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { MESSAGES } from '../../constants';
import { useListingDetail } from './hooks/useListingDetail';
import ListingDetailView from './components/ListingDetailView';

interface ListingDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

/** Style constants */
const STYLES = {
    container: 'max-w-7xl mx-auto px-4 py-6',
    backLink: 'mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors',
    // Skeleton
    skeletonWrapper: 'max-w-7xl mx-auto px-4 py-8',
    skeletonInner: 'animate-pulse',
    skeletonBackBtn: 'h-8 bg-gray-200 rounded w-32 mb-8',
    skeletonGrid: 'grid grid-cols-1 lg:grid-cols-2 gap-8',
    skeletonImage: 'aspect-[4/3] bg-gray-200 rounded-lg',
    skeletonInfoGroup: 'space-y-4',
    skeletonTitle: 'h-8 bg-gray-200 rounded',
    skeletonPrice: 'h-6 bg-gray-200 rounded w-1/3',
    skeletonDesc: 'h-4 bg-gray-200 rounded w-2/3',
    // Error
    errorWrapper: 'max-w-7xl mx-auto px-4 py-12 text-center',
    errorIcon: 'text-6xl mb-4',
    errorTitle: 'text-2xl font-semibold text-gray-800 mb-4',
    errorLink: 'mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block',
} as const;

export default function ListingDetailPage({ params }: ListingDetailPageProps) {
    const resolvedParams = use(params);
    const listingId = parseInt(resolvedParams.id);

    const {
        listing,
        isLoading,
        error,
        isAuthLoading,
        userRole,
    } = useListingDetail(listingId);

    // Block SHIPPER from viewing
    if (userRole === 'SHIPPER') return null;

    // Loading state
    if (isLoading || isAuthLoading) {
        return (
            <div className={STYLES.skeletonWrapper}>
                <div className={STYLES.skeletonInner}>
                    <div className={STYLES.skeletonBackBtn} />
                    <div className={STYLES.skeletonGrid}>
                        <div className={STYLES.skeletonImage} />
                        <div className={STYLES.skeletonInfoGroup}>
                            <div className={STYLES.skeletonTitle} />
                            <div className={STYLES.skeletonPrice} />
                            <div className={STYLES.skeletonDesc} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !listing) {
        return (
            <div className={STYLES.errorWrapper}>
                <div className={STYLES.errorIcon}>😞</div>
                <h1 className={STYLES.errorTitle}>
                    {error || MESSAGES.DETAIL_NOT_FOUND}
                </h1>
                <Link href="/listings" className={STYLES.errorLink}>
                    {MESSAGES.DETAIL_BACK_TO_LISTINGS}
                </Link>
            </div>
        );
    }

    // Success state
    return (
        <div className={STYLES.container}>
            {/* Back button */}
            <Link href="/listings" className={STYLES.backLink}>
                <ArrowLeft size={20} />
                {MESSAGES.DETAIL_BACK_TO_LISTINGS}
            </Link>

            {/* Main content */}
            <ListingDetailView listing={listing} userRole={userRole} />
        </div>
    );
}
