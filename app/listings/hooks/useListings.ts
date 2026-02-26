'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { searchListings } from '@/app/services/listingService';
import { HomeBike, SearchFilters, SortOption, PaginationInfo } from '@/app/types/listing';
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE } from '@/app/constants';

interface UseListingsReturn {
    listings: HomeBike[];
    pagination: PaginationInfo;
    isLoading: boolean;
    error: string | null;
    filters: SearchFilters;
    localFilters: SearchFilters;
    sortBy: SortOption;
    currentPage: number;
    totalPages: number;
    isAuthLoading: boolean;
    userRole: string | undefined;
    handleFiltersChange: (newFilters: SearchFilters) => void;
    handleApplyFilters: () => void;
    handleClearFilters: () => void;
    handleRemoveFilter: (key: keyof SearchFilters, value?: string) => void;
    handleSortChange: (newSort: SortOption) => void;
    handlePageChange: (newPage: number) => void;
    retryFetch: () => void;
}

/**
 * Custom hook that encapsulates all S-31 Listings logic:
 * - URL sync (dual filter state: local + applied)
 * - Data fetching with AbortController for race condition prevention
 * - Filter/sort/pagination handlers
 * - Auth guard for SHIPPER role
 */
export function useListings(): UseListingsReturn {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, isLoading: isAuthLoading } = useAuth();

    // Data state
    const [listings, setListings] = useState<HomeBike[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo>({
        page: DEFAULT_PAGE,
        pageSize: DEFAULT_PAGE_SIZE,
        total: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter state: `filters` = applied (synced with URL), `localFilters` = working (UI)
    const [filters, setFilters] = useState<SearchFilters>({});
    const [localFilters, setLocalFilters] = useState<SearchFilters>({});
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);

    // Sync state from URL params
    useEffect(() => {
        const keyword = searchParams.get('keyword') || undefined;
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const bikeTypes = searchParams.getAll('bikeType');
        const brands = searchParams.getAll('brand');
        const conditions = searchParams.getAll('condition') as ('new' | 'used')[];
        const page = searchParams.get('page');
        const sort = searchParams.get('sortBy') as SortOption;

        const filtersFromURL: SearchFilters = {
            keyword,
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
            bikeTypes: bikeTypes.length > 0 ? bikeTypes : undefined,
            brands: brands.length > 0 ? brands : undefined,
            conditions: conditions.length > 0 ? conditions : undefined,
        };

        setFilters(filtersFromURL);
        setLocalFilters(filtersFromURL);
        setSortBy(sort || 'newest');
        setCurrentPage(page ? Number(page) : DEFAULT_PAGE);
    }, [searchParams]);

    // Redirect restricted roles away from listings page
    useEffect(() => {
        if (!isAuthLoading && user?.role === 'SHIPPER') {
            router.replace('/shipper');
        }
        if (!isAuthLoading && user?.role === 'SELLER') {
            router.replace('/seller/dashboard');
        }
    }, [user, isAuthLoading, router]);

    // Fetch listings with AbortController to prevent race conditions (MEM-01)
    useEffect(() => {
        const abortController = new AbortController();

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await searchListings(
                    filters.keyword,
                    {
                        minPrice: filters.minPrice,
                        maxPrice: filters.maxPrice,
                        bikeTypes: filters.bikeTypes,
                        brands: filters.brands,
                        conditions: filters.conditions,
                    },
                    currentPage,
                    DEFAULT_PAGE_SIZE,
                    sortBy
                );

                // Only update state if this request wasn't aborted
                if (!abortController.signal.aborted) {
                    setListings(response.items);
                    setPagination(response.pagination);
                }
            } catch (err) {
                if (!abortController.signal.aborted) {
                    setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại.');
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
    }, [filters, sortBy, currentPage]);

    // URL update helper
    const updateURL = useCallback((newFilters: SearchFilters, newSort: SortOption, newPage: number) => {
        const params = new URLSearchParams();

        if (newFilters.keyword) params.append('keyword', newFilters.keyword);
        if (newFilters.minPrice) params.append('minPrice', newFilters.minPrice.toString());
        if (newFilters.maxPrice) params.append('maxPrice', newFilters.maxPrice.toString());
        if (newFilters.bikeTypes) newFilters.bikeTypes.forEach(t => params.append('bikeType', t));
        if (newFilters.brands) newFilters.brands.forEach(b => params.append('brand', b));
        if (newFilters.conditions) newFilters.conditions.forEach(c => params.append('condition', c));
        if (newPage !== DEFAULT_PAGE) params.append('page', newPage.toString());
        if (newSort !== 'newest') params.append('sortBy', newSort);

        router.push(`/listings?${params.toString()}`, { scroll: false });
    }, [router]);

    // Handlers (PERF-01: all wrapped in useCallback)
    const handleFiltersChange = useCallback((newFilters: SearchFilters) => {
        setLocalFilters(newFilters);
    }, []);

    const handleApplyFilters = useCallback(() => {
        setFilters(localFilters);
        updateURL(localFilters, sortBy, DEFAULT_PAGE);
    }, [localFilters, sortBy, updateURL]);

    const handleClearFilters = useCallback(() => {
        const clearedFilters: SearchFilters = {
            keyword: filters.keyword,
        };
        setLocalFilters(clearedFilters);
        setFilters(clearedFilters);
        updateURL(clearedFilters, sortBy, DEFAULT_PAGE);
    }, [filters.keyword, sortBy, updateURL]);

    const handleSortChange = useCallback((newSort: SortOption) => {
        setSortBy(newSort);
        updateURL(filters, newSort, DEFAULT_PAGE);
    }, [filters, updateURL]);

    const handleRemoveFilter = useCallback((key: keyof SearchFilters, value?: string) => {
        const newFilters = { ...filters };

        if (key === 'minPrice' || key === 'maxPrice') {
            delete newFilters.minPrice;
            delete newFilters.maxPrice;
        } else if (key === 'bikeTypes' && value) {
            newFilters.bikeTypes = newFilters.bikeTypes?.filter(t => t !== value);
            if (newFilters.bikeTypes?.length === 0) delete newFilters.bikeTypes;
        } else if (key === 'brands' && value) {
            newFilters.brands = newFilters.brands?.filter(b => b !== value);
            if (newFilters.brands?.length === 0) delete newFilters.brands;
        } else if (key === 'conditions' && value) {
            newFilters.conditions = newFilters.conditions?.filter(c => c !== value);
            if (newFilters.conditions?.length === 0) delete newFilters.conditions;
        }

        setFilters(newFilters);
        setLocalFilters(newFilters);
        updateURL(newFilters, sortBy, DEFAULT_PAGE);
    }, [filters, sortBy, updateURL]);

    const handlePageChange = useCallback((newPage: number) => {
        setCurrentPage(newPage);
        updateURL(filters, sortBy, newPage);
    }, [filters, sortBy, updateURL]);

    const retryFetch = useCallback(() => {
        setError(null);
        setIsLoading(true);
        // Trigger re-fetch by updating a dependency — simplest: reset currentPage
        setCurrentPage(prev => prev);
    }, []);

    const totalPages = Math.ceil(pagination.total / pagination.pageSize);

    return {
        listings,
        pagination,
        isLoading,
        error,
        filters,
        localFilters,
        sortBy,
        currentPage,
        totalPages,
        isAuthLoading,
        userRole: user?.role,
        handleFiltersChange,
        handleApplyFilters,
        handleClearFilters,
        handleRemoveFilter,
        handleSortChange,
        handlePageChange,
        retryFetch,
    };
}
