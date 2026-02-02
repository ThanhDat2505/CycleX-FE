/**
 * Listing Service
 * Handles API calls for bike listing operations
 * Supports mock mode for development when backend is not ready
 */

import { Listing, HomeBike, PaginationInfo, ListingDetail, validateListingDetail } from '../types/listing';
import { PAGINATION } from '../constants/pagination';
import { MOCK_LISTINGS } from '../mocks';

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

    try {
        const response = await fetch('/backend/api/home', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch featured bikes: ${response.statusText}`);
        }
        const bikes: HomeBike[] = await response.json();
        console.log(`✅ Fetched ${bikes.length} featured bikes from /api/home`);
        return bikes;
    } catch (error) {
        console.error('Error fetching featured bikes:', error);
        throw error;
    }
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

    try {
        const response = await fetch('/backend/api/listings/pagination', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch listings: ${response.statusText}`);
        }
        const bikes: HomeBike[] = await response.json();
        console.log(`✅ Fetched ${bikes.length} listings from /api/listings/pagination`);
        return bikes;
    } catch (error) {
        console.error('Error fetching listings:', error);
        throw error;
    }
}

/**
 * Search listings by keyword with filters, pagination, and sorting
 * 
 * BR-S30-01: Keyword search ONLY matches `title` field (not brand/model/description)
 * BR-S30-02: Supports filters: price range, bike type, brand, condition
 * BR-S30-04: Supports page-based pagination
 * BR-S30-05: Supports sorting: newest, price ↑/↓, most viewed
 * 
 * @param keyword - Search keyword (minimum 3 characters recommended)
 * @param filters - Filter options (price, bike type, brand, condition)
 * @param page - Page number (1-indexed, default: 1)
 * @param pageSize - Items per page (default: 12)
 * @param sortBy - Sort option (default: 'newest')
 * @returns Promise<SearchResponse> - Paginated search results with HomeBike format
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
 * Get detailed information for a single listing
 * Endpoint: POST /api/listings/detail
 * Request: { sellerId, listingId }
 * Response: SellerListingResponse (listing details)
 *
 * Business Rules:
 * - BR-S32-01: Only APPROVED listings are accessible to Guest/Buyer
 * - BR-S32-04: Backend auto-increments views_count on GET (FE does nothing)
 * 
 * @param sellerId - ID of the seller/user making the request
 * @param listingId - ID of the listing to fetch
 * @returns Promise<ListingDetail> - Full listing details
 * @throws Error if listing not found, not APPROVED, or validation fails
 */
export async function getListingDetail(sellerId: number, listingId: number): Promise<ListingDetail> {
    if (USE_MOCK_API) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Import mock detail data
        const { MOCK_LISTING_DETAILS } = await import('../mocks/listings');

        // Find listing by ID
        const listing = MOCK_LISTING_DETAILS.find(l => l.listingId === listingId);

        if (!listing) {
            throw new Error('Listing not found');
        }

        // BR-S32-01: Validate status (Frontend validation even though BE should handle)
        if (listing.status !== 'APPROVED') {
            throw new Error(`Listing not available: status is ${listing.status}`);
        }

        // Validate response data
        const validated = validateListingDetail(listing);
        return validated;
    }

    // Real API call to POST /api/listings/detail
    try {
        const response = await fetch(
            `/backend/api/seller/listings/detail`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sellerId,
                    listingId,
                }),
            }
        );

        if (response.status === 404) {
            throw new Error('Listing not found');
        }

        if (!response.ok) {
            throw new Error(`Failed to fetch listing detail: ${response.statusText}`);
        }

        const data = await response.json();

        // BR-S32-01: Frontend validation of status
        // Note: Backend response doesn't include 'status' field - status is implied by the fact
        // that the backend only returns APPROVED listings to public users
        // The mere presence of response data means status is APPROVED

        // Validate complete response structure
        const validated = validateListingDetail(data);
        console.log(`✅ Fetched listing detail: ID ${listingId}`);

        return validated;
    } catch (error) {
        console.error('Error fetching listing detail:', error);
        throw error;
    }
}
