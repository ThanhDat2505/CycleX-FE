'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { useToast } from '@/app/contexts/ToastContext';
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

/** Parse filters từ URLSearchParams — dùng cho lazy state initialization */
function parseFiltersFromURL(params: ReturnType<typeof useSearchParams>): SearchFilters {
    const keyword = params.get('keyword') || undefined;
    const minPrice = params.get('minPrice');
    const maxPrice = params.get('maxPrice');
    const bikeTypes = params.getAll('bikeType');
    const brands = params.getAll('brand');
    const conditions = params.getAll('condition') as ('new' | 'used')[];
    return {
        keyword,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        bikeTypes: bikeTypes.length > 0 ? bikeTypes : undefined,
        brands: brands.length > 0 ? brands : undefined,
        conditions: conditions.length > 0 ? conditions : undefined,
    };
}

/**
 * Custom hook that encapsulates all S-31 Listings logic:
 * - URL sync (dual filter state: local + applied)
 * - Data fetching with AbortController for race condition prevention
 * - Filter/sort/pagination handlers
 * - Auth guard for SHIPPER role
 *
 * PERF: filters/sortBy/currentPage được khởi tạo trực tiếp từ URL params
 * (lazy initializer) để tránh double-fetch trên mount đầu tiên.
 */
export function useListings(): UseListingsReturn {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, isLoading: isAuthLoading } = useAuth();
    const { addToast } = useToast();

    // Data state
    const [listings, setListings] = useState<HomeBike[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo>({
        page: DEFAULT_PAGE,
        pageSize: DEFAULT_PAGE_SIZE,
        total: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // Counter để trigger re-fetch khi user nhấn Retry
    const [retryCounter, setRetryCounter] = useState(0);

    // Filter state khởi tạo từ URL ngay lúc mount — tránh double-fetch
    const [filters, setFilters] = useState<SearchFilters>(() => parseFiltersFromURL(searchParams));
    const [localFilters, setLocalFilters] = useState<SearchFilters>(() => parseFiltersFromURL(searchParams));
    const [sortBy, setSortBy] = useState<SortOption>(() => (searchParams.get('sortBy') as SortOption) || 'newest');
    const [currentPage, setCurrentPage] = useState<number>(() => {
        const page = searchParams.get('page');
        return page ? Number(page) : DEFAULT_PAGE;
    });

    // Sync state từ URL khi URL thay đổi (user nhấn back/forward hoặc updateURL)
    useEffect(() => {
        const filtersFromURL = parseFiltersFromURL(searchParams);
        const sort = searchParams.get('sortBy') as SortOption;
        const page = searchParams.get('page');

        setFilters(filtersFromURL);
        setLocalFilters(filtersFromURL);
        setSortBy(sort || 'newest');
        setCurrentPage(page ? Number(page) : DEFAULT_PAGE);
    }, [searchParams]);

    // Redirect restricted roles away from listings page
    useEffect(() => {
        if (!isAuthLoading) {
            if (user?.role === 'SHIPPER') {
                router.replace('/shipper');
            } else if (user?.role === 'INSPECTOR') {
                router.replace('/inspector/dashboard');
            } else if (user?.role === 'SELLER') {
                addToast('Bạn không có quyền truy cập trang này', 'error');
                router.replace('/seller/dashboard');
            }
        }
    }, [user, isAuthLoading, router, addToast]);

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
    }, [filters, sortBy, currentPage, retryCounter]);

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
        setRetryCounter(c => c + 1);
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
