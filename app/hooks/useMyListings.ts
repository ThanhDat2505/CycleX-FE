/**
 * Custom hook for My Listings (S-11) data management
 * Separates data fetching logic from UI component
 */

import { useState, useEffect } from 'react';
import { getMyListings, type Listing, type GetMyListingsParams } from '../services/myListingsService';

interface UseMyListingsReturn {
    listings: Listing[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
    retry: () => void;
}

/**
 * Hook to load and manage listings data with pagination and filtering
 * Handles loading state, error handling, and retry logic
 */
export function useMyListings(params: GetMyListingsParams): UseMyListingsReturn {
    const [listings, setListings] = useState<Listing[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(params.page || 1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        const loadListings = async () => {
            setLoading(true);
            setError(null); // Clear previous errors

            try {
                const response = await getMyListings(params);
                setListings(response.listings);
                setTotalItems(response.totalItems);
                setTotalPages(response.totalPages);
                setCurrentPage(response.currentPage);
            } catch (err) {
                console.error('Failed to load listings:', err);
                setError('Unable to load listings. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        loadListings();
    }, [params.page, params.status, params.sortBy, retryCount]); // Reload when params or retry changes

    const retry = () => {
        setRetryCount(prev => prev + 1);
    };

    return {
        listings,
        totalItems,
        totalPages,
        currentPage,
        loading,
        error,
        retry,
    };
}
