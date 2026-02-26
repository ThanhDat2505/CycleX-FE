/**
 * Custom hook for Dashboard (S-10) data management
 * Separates data fetching logic from UI component
 */

import { useState, useEffect } from 'react';
import { getDashboardData, type DashboardStats, type TopListing } from '../services/dashboardService';

interface UseDashboardReturn {
    stats: DashboardStats;
    topListings: TopListing[];
    loading: boolean;
    error: string | null;
    retry: () => void;
}

/**
 * Hook to load and manage dashboard data
 * Handles loading state, error handling, and retry logic
 */
export function useDashboard(enabled: boolean = true): UseDashboardReturn {
    const [stats, setStats] = useState<DashboardStats>({
        activeListings: 0,
        pendingListings: 0,
        rejectedListings: 0,
        totalTransactions: 0,
        totalViews: 0,
        newInquiries: 0,
    });
    const [topListings, setTopListings] = useState<TopListing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        if (!enabled) return;

        const loadDashboard = async () => {
            setLoading(true);
            setError(null); // Clear previous errors

            try {
                const data = await getDashboardData();
                setStats(data.stats);
                setTopListings(data.topListings);
            } catch (err) {
                console.error('Failed to load dashboard:', err);
                setError('Unable to load dashboard data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, [retryCount, enabled]); // Retry when retryCount changes

    const retry = () => {
        setRetryCount(prev => prev + 1);
    };

    return {
        stats,
        topListings,
        loading,
        error,
        retry,
    };
}
