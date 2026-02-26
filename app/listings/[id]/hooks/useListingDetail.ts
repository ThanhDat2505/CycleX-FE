'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { getListingDetail } from '@/app/services/listingService';
import { ListingDetail } from '@/app/types/listing';
import { MESSAGES } from '@/app/constants';

interface UseListingDetailReturn {
    listing: ListingDetail | null;
    isLoading: boolean;
    error: string | null;
    isAuthLoading: boolean;
    userRole: string | undefined;
    retryFetch: () => void;
}

/**
 * Custom hook for S-32 Listing Detail page logic:
 * - Data fetching with AbortController (MEM-01)
 * - Auth guard for SHIPPER role
 * - Error differentiation (not found, not available, generic)
 * - BR-S32-01: Frontend validation of APPROVED status
 */
export function useListingDetail(listingId: number): UseListingDetailReturn {
    const router = useRouter();
    const { user, isLoading: isAuthLoading } = useAuth();

    const [listing, setListing] = useState<ListingDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    // Redirect SHIPPER role
    useEffect(() => {
        if (!isAuthLoading && user?.role === 'SHIPPER') {
            router.replace('/shipper');
        }
    }, [user, isAuthLoading, router]);

    // Fetch listing detail with AbortController (MEM-01)
    useEffect(() => {
        if (user?.role === 'SHIPPER') return;

        if (isNaN(listingId)) {
            setError(MESSAGES.DETAIL_NOT_FOUND);
            setIsLoading(false);
            return;
        }

        const abortController = new AbortController();

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const data = await getListingDetail(listingId);

                if (abortController.signal.aborted) return;

                // BR-S32-01: Frontend validation — never fully trust BE
                if (data.status !== 'APPROVED') {
                    setError(MESSAGES.DETAIL_NOT_AVAILABLE);
                    setIsLoading(false);
                    return;
                }

                setListing(data);
                setError(null);
            } catch (err) {
                if (abortController.signal.aborted) return;

                const message = err instanceof Error ? err.message : MESSAGES.DETAIL_NOT_FOUND;

                if (message.includes('not found')) {
                    setError(MESSAGES.DETAIL_NOT_FOUND);
                } else if (message.includes('not available')) {
                    setError(MESSAGES.DETAIL_NOT_AVAILABLE);
                } else {
                    setError(MESSAGES.ERROR_LOADING_LISTINGS);
                }
            } finally {
                if (!abortController.signal.aborted) {
                    setIsLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            abortController.abort();
        };
    }, [listingId, retryCount, user?.role]);

    const retryFetch = useCallback(() => {
        setRetryCount(prev => prev + 1);
    }, []);

    return {
        listing,
        isLoading,
        error,
        isAuthLoading,
        userRole: user?.role,
        retryFetch,
    };
}
