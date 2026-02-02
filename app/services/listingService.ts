/**
 * Listing Service
 * Handles API calls for bike listing operations
 * Supports mock mode for development when backend is not ready
 */

import { Listing, HomeBike, PaginationInfo, ListingDetail, validateListingDetail } from '../types/listing';
import { PAGINATION } from '../constants/pagination';
import { MOCK_LISTINGS } from '../mocks';
import { apiCallGET, apiCallPOST } from '../utils/apiHelpers';

// Check if we should use mock API (for development)
const USE_MOCK_API = process.env.NEXT_PUBLIC_MOCK_API === 'true';

/**
 * Fetch FEATURED bikes for home page "Xe Đạp Đang Hot" section
 * Uses /api/home - Returns top bikes sorted by viewCount DESC
 * Response includes viewCount field
 * 
 * @returns Promise with array of featured bikes (HomeBike with viewCount)
 */
export async function getFeaturedBikes(): Promise<HomeBike[]> {
    if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const featured = [...MOCK_LISTINGS]
            .sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0))
            .slice(0, 10)
            .map(listing => ({
                listingId: listing.listingId,
                title: listing.title,
                price: listing.price,
                imageUrl: listing.imageUrl,
                locationCity: listing.locationCity,
                viewCount: listing.viewsCount,
            }));
        return featured;
    }

    const bikes = await apiCallGET<HomeBike[]>('/home');
    console.log(`✅ Fetched ${bikes.length} featured bikes from /api/home`);
    return bikes;
}

/**
 * Fetch ALL listings for listings page (browse/search)
 * Uses /api/listings/pagination - Returns 10 items per page
 * Response does NOT include viewCount field
 * 
 * @param page - Page number (currently not supported by backend)
 * @returns Promise with array of all bikes (HomeBike without viewCount)
 */
export async function getAllListings(page: number = 1): Promise<HomeBike[]> {
    if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const pageSize = 10;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return MOCK_LISTINGS.slice(startIndex, endIndex);
    }

    const bikes = await apiCallGET<HomeBike[]>('/listings/pagination');
    console.log(`✅ Fetched ${bikes.length} listings from /api/listings/pagination`);
    return bikes;
}

/**
 * Search listings by keyword (PUBLIC/BUYER VIEW)
 * Endpoint: GET /api/listings/search
 * 
 * Use this for: Browse page, Home search - returns products (APPROVED only)
 * 
 * BR-S30-01: Keyword search ONLY matches `title` field
 * BR-S30-02: Supports filters: price range, bike type, brand, condition
 * BR-S30-04: Supports page-based pagination
 * BR-S30-05: Supports sorting: newest, price ↑/↓, most viewed
 * 
 * @param keyword - Search keyword
 * @param filters - Filter options
 * @param page - Page number (1-indexed)
 * @param pageSize - Items per page
 * @param sortBy - Sort option
 * @returns Promise<SearchResponse> - Paginated products (HomeBike format)
 */
export async function searchListings(
    keyword?: string,
    filters?: {
        minPrice?: number;
        maxPrice?: number;
        bikeTypes?: string[];
        brands?: string[];
        conditions?: ('new' | 'used')[];
    },
    page: number = 1,
    pageSize: number = 12,
    sortBy: 'newest' | 'priceAsc' | 'priceDesc' | 'mostViewed' = 'newest'
): Promise<{ items: HomeBike[]; pagination: PaginationInfo }> {
    console.log('🔍 Searching listings:', { keyword, filters, page, pageSize, sortBy });

    // Mock data for development
    if (USE_MOCK_API) {
        console.log('📦 Using MOCK search data');
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

        let results = MOCK_LISTINGS;

        // ✅ BR-S30-01: Keyword matching ONLY on title field
        if (keyword && keyword.trim().length > 0) {
            const keywordLower = keyword.toLowerCase();
            results = results.filter(listing =>
                listing.title.toLowerCase().includes(keywordLower)
                // ❌ NOT matching brand/model/description
            );
        }

        // Filter by price range
        if (filters?.minPrice !== undefined) {
            results = results.filter(listing => listing.price >= filters.minPrice!);
        }
        if (filters?.maxPrice !== undefined) {
            results = results.filter(listing => listing.price <= filters.maxPrice!);
        }

        // Filter by bike types
        if (filters?.bikeTypes && filters.bikeTypes.length > 0) {
            results = results.filter(listing =>
                listing.category && filters.bikeTypes!.includes(listing.category)
            );
        }

        // Filter by brands
        if (filters?.brands && filters.brands.length > 0) {
            results = results.filter(listing =>
                listing.brand && filters.brands!.includes(listing.brand) // Add null check
            );
        }

        // Filter by conditions (OR logic: show if listing matches ANY selected condition)
        if (filters?.conditions && filters.conditions.length > 0) {
            results = results.filter(listing =>
                filters.conditions!.includes(listing.condition as 'new' | 'used')
            );
        }

        switch (sortBy) {
            case 'newest':
                // Assume higher listingId = newer (mock data)
                results.sort((a, b) => b.listingId - a.listingId);
                break;
            case 'priceAsc':
                results.sort((a, b) => a.price - b.price);
                break;
            case 'priceDesc':
                results.sort((a, b) => b.price - a.price);
                break;
            case 'mostViewed':
                results.sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0)); // Add null check
                break;
        }

        // Pagination
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedItems = results.slice(startIndex, endIndex);

        // Convert Listing to HomeBike format (already camelCase)
        const homeBikes: HomeBike[] = paginatedItems.map(listing => ({
            listingId: listing.listingId,
            title: listing.title,
            price: listing.price,
            imageUrl: listing.imageUrl,
            locationCity: listing.locationCity,
        }));

        console.log(`✅ Search complete: ${results.length} total results, page ${page}/${Math.ceil(results.length / pageSize)}`);

        return {
            items: homeBikes,
            pagination: {
                page,
                pageSize,
                total: results.length,
            },
        };
    }

    // Real API call (when backend is ready)
    try {
        // Build query string
        const params = new URLSearchParams();
        if (keyword) params.append('keyword', keyword);
        if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
        if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
        if (filters?.bikeTypes) filters.bikeTypes.forEach(t => params.append('bikeType', t));
        if (filters?.brands) filters.brands.forEach(b => params.append('brand', b));
        if (filters?.conditions) filters.conditions.forEach(c => params.append('condition', c));
        params.append('page', page.toString());
        params.append('pageSize', pageSize.toString());
        params.append('sortBy', sortBy);

        const response = await fetch(
            `/backend/api/listings/search?${params.toString()}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to search listings: ${response.statusText}`);
        }

        const data = await response.json();

        // ✅ VALIDATION: Check response
        if (!data) {
            throw new Error('Invalid response from server: data is null or undefined');
        }

        if (!data.items || !Array.isArray(data.items)) {
            throw new Error('Invalid response format: expected items array');
        }

        if (!data.pagination) {
            throw new Error('Invalid response format: missing pagination info');
        }

        console.log(`✅ Search successful: ${data.items.length} results on page ${page}`);
        return data;
    } catch (error) {
        console.error('Error searching listings:', error);
        throw error;
    }
}

/**
 * Search seller's own listings (SELLER VIEW)
 * Endpoint: POST /api/seller/listings/search
 * 
 * Use this for: My Listings page search - returns seller's listings (all statuses)
 * Requires authentication
 * 
 * @param sellerId - Seller's user ID (required)
 * @param keyword - Search keyword (title)
 * @param filters - Filter options including status, price, brand
 * @param page - Page number (0-indexed per API spec)
 * @param pageSize - Items per page
 * @returns Promise<SearchResponse> - Paginated seller listings
 */
export async function searchSellerListings(
    sellerId: number,
    keyword?: string,
    filters?: {
        status?: string;      // DRAFT, PENDING, APPROVED, REJECTED, etc.
        minPrice?: number;
        maxPrice?: number;
        brand?: string;
        title?: string;
    },
    page: number = 0,
    pageSize: number = 10
): Promise<{ items: HomeBike[]; pagination: PaginationInfo }> {
    console.log('🔍 Searching seller listings:', { sellerId, keyword, filters, page, pageSize });

    if (USE_MOCK_API) {
        console.log('📦 Using MOCK seller search data');
        await new Promise(resolve => setTimeout(resolve, 500));

        let results = [...MOCK_LISTINGS];

        // Keyword search on title
        if (keyword && keyword.trim().length > 0) {
            const keywordLower = keyword.toLowerCase();
            results = results.filter(listing =>
                listing.title.toLowerCase().includes(keywordLower)
            );
        }

        // Filter by price
        if (filters?.minPrice !== undefined) {
            results = results.filter(listing => listing.price >= filters.minPrice!);
        }
        if (filters?.maxPrice !== undefined) {
            results = results.filter(listing => listing.price <= filters.maxPrice!);
        }

        // Pagination
        const startIndex = page * pageSize;
        const paginatedItems = results.slice(startIndex, startIndex + pageSize);

        const homeBikes: HomeBike[] = paginatedItems.map(listing => ({
            listingId: listing.listingId,
            title: listing.title,
            price: listing.price,
            imageUrl: listing.imageUrl,
            locationCity: listing.locationCity,
        }));

        return {
            items: homeBikes,
            pagination: { page, pageSize, total: results.length },
        };
    }

    // Real API: POST /api/seller/listings/search
    const requestBody: Record<string, unknown> = {
        sellerId,
        page,
        pageSize,
    };

    // Add optional filters
    if (keyword) requestBody.title = keyword;
    if (filters?.status) requestBody.status = filters.status;
    if (filters?.title) requestBody.title = filters.title;
    if (filters?.brand) requestBody.brand = filters.brand;
    if (filters?.minPrice) requestBody.minPrice = filters.minPrice;
    if (filters?.maxPrice) requestBody.maxPrice = filters.maxPrice;

    const data = await apiCallPOST<{ items: HomeBike[]; pagination: PaginationInfo }>(
        '/seller/listings/search',
        requestBody
    );

    if (!data.items || !Array.isArray(data.items)) {
        throw new Error('Invalid response format from seller search');
    }

    console.log(`✅ Seller search successful: ${data.items.length} results`);
    return data;
}

/**
 * Get detailed information for a single listing (PUBLIC VIEW)
 * Endpoint: GET /api/listings/{id}
 * 
 * Use this for: Home page → click hot products, Browse listings → view detail
 *
 * Business Rules:
 * - BR-S32-01: Only APPROVED listings are accessible to Guest/Buyer
 * - BR-S32-04: Backend auto-increments views_count on GET
 * 
 * @param listingId - ID of the listing to fetch
 * @returns Promise<ListingDetail> - Full listing details
 * @throws Error if listing not found or not APPROVED
 */
export async function getListingDetail(listingId: number): Promise<ListingDetail> {
    if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, 500));

        const { MOCK_LISTING_DETAILS } = await import('../mocks/listings');
        const listing = MOCK_LISTING_DETAILS.find(l => l.listingId === listingId);

        if (!listing) {
            throw new Error('Listing not found');
        }

        // BR-S32-01: Only APPROVED listings for public
        if (listing.status !== 'APPROVED') {
            throw new Error(`Listing not available: status is ${listing.status}`);
        }

        return validateListingDetail(listing);
    }

    // Real API: GET /api/listings/{id}
    try {
        const response = await fetch(`/backend/api/listings/${listingId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.status === 404) {
            throw new Error('Listing not found');
        }

        if (!response.ok) {
            throw new Error(`Failed to fetch listing: ${response.statusText}`);
        }

        const data = await response.json();
        const validated = validateListingDetail(data);
        console.log(`✅ Fetched public listing detail: ID ${listingId}`);

        return validated;
    } catch (error) {
        console.error('Error fetching listing detail:', error);
        throw error;
    }
}

/**
 * Get detailed information for seller's own listing (SELLER VIEW)
 * Endpoint: POST /api/seller/listings/detail
 * 
 * Use this for: My Listings page → seller clicks their own listing
 * Requires authentication (seller must be logged in)
 *
 * @param sellerId - Seller's user ID (required)
 * @param listingId - ID of the listing
 * @returns Promise<ListingDetail> - Full listing details including all statuses
 * @throws Error if listing not found or not owned by seller
 */
export async function getSellerListingDetail(sellerId: number, listingId: number): Promise<ListingDetail> {
    if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, 500));

        const { MOCK_LISTING_DETAILS } = await import('../mocks/listings');
        const listing = MOCK_LISTING_DETAILS.find(l => l.listingId === listingId);

        if (!listing) {
            throw new Error('Listing not found');
        }

        // Seller can view their own listing regardless of status
        return validateListingDetail(listing);
    }

    // Real API: POST /api/seller/listings/detail
    const data = await apiCallPOST<ListingDetail>('/seller/listings/detail', { sellerId, listingId });
    const validated = validateListingDetail(data);
    console.log(`✅ Fetched seller listing detail: ID ${listingId}`);
    return validated;
}

