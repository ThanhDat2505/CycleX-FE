/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Listing Service
 * Handles API calls for bike listing operations
 * Supports mock mode for development when backend is not ready
 */

import { Listing, HomeBike, PaginationInfo, ListingDetail, validateListingDetail } from '../types/listing';
import { PAGINATION } from '../constants/pagination';
import { MOCK_LISTINGS } from '../mocks';
import { apiCallGET, apiCallPOST } from '../utils/apiHelpers';
import {
    validateResponse,
    validateArray,
    validateNumber,
    validateObject,
    validateString,
    validatePositiveNumber
} from '../utils/apiValidation';


// Check if we should use mock API (for development)
const USE_MOCK_API = process.env.NEXT_PUBLIC_MOCK_API === 'true';

type PublicListingApiResponse = {
    items?: unknown;
    pagination?: {
        page?: unknown;
        pageSize?: unknown;
        total?: unknown;
    };
    content?: unknown;
    number?: unknown;
    size?: unknown;
    totalElements?: unknown;
};

function toSafeNumber(value: unknown): number | null {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
    }
    if (typeof value === 'string' && value.trim() !== '') {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
}

function resolvePublicImageUrl(rawPath: unknown): string {
    if (typeof rawPath !== 'string') {
        return '';
    }

    const path = rawPath.trim();
    if (path.length === 0) {
        return '';
    }

    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    if (path.startsWith('/uploads/')) {
        return `/backend${path}`;
    }

    if (path.startsWith('/')) {
        return path;
    }

    return `/${path}`;
}

function normalizeImageUrl(images: unknown, imageUrl: unknown, imageUrls?: unknown): string {
    if (typeof imageUrl === 'string' && imageUrl.trim().length > 0) {
        return resolvePublicImageUrl(imageUrl);
    }

    const candidates: unknown[] = [];
    if (Array.isArray(images)) {
        candidates.push(...images);
    }
    if (Array.isArray(imageUrls)) {
        candidates.push(...imageUrls);
    }

    if (candidates.length === 0) {
        return '';
    }

    const first = candidates[0] as unknown;
    if (typeof first === 'string') {
        return resolvePublicImageUrl(first);
    }

    if (first && typeof first === 'object') {
        const firstObj = first as Record<string, unknown>;
        if (typeof firstObj.imageUrl === 'string') {
            return resolvePublicImageUrl(firstObj.imageUrl);
        }
        if (typeof firstObj.url === 'string') {
            return resolvePublicImageUrl(firstObj.url);
        }
        if (typeof firstObj.imagePath === 'string') {
            return resolvePublicImageUrl(firstObj.imagePath);
        }
    }

    return '';
}

function normalizeHomeBike(item: unknown): HomeBike | null {
    if (!item || typeof item !== 'object') {
        return null;
    }

    const source = item as Record<string, unknown>;
    const listingId = toSafeNumber(source.listingId ?? source.id ?? source.listing_id);
    const productId = toSafeNumber(source.productId ?? source.product_id);
    const price = toSafeNumber(source.price);
    const title = typeof source.title === 'string' ? source.title.trim() : '';

    if (listingId === null || price === null || title.length === 0) {
        return null;
    }

    const viewCount = toSafeNumber(source.viewCount ?? source.viewsCount);

    return {
        listingId,
        productId: productId ?? undefined,
        title,
        price,
        imageUrl: normalizeImageUrl(source.images, source.imageUrl, source.imageUrls),
        locationCity: typeof source.locationCity === 'string'
            ? source.locationCity
            : (typeof source.pickupAddress === 'string' ? source.pickupAddress : null),
        viewCount: viewCount ?? undefined,
    };
}

function sortPublicListings(items: HomeBike[], sortBy: 'newest' | 'priceAsc' | 'priceDesc' | 'mostViewed'): HomeBike[] {
    const sorted = [...items];

    switch (sortBy) {
        case 'priceAsc':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'priceDesc':
            sorted.sort((a, b) => b.price - a.price);
            break;
        case 'mostViewed':
            sorted.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
            break;
        case 'newest':
        default:
            sorted.sort((a, b) => b.listingId - a.listingId);
            break;
    }

    return sorted;
}

function normalizePublicListingResponse(
    data: unknown,
    requestedPage: number,
    requestedPageSize: number,
    sortBy: 'newest' | 'priceAsc' | 'priceDesc' | 'mostViewed'
): { items: HomeBike[]; pagination: PaginationInfo } {
    validateResponse(data, 'search response');

    const payload = data as PublicListingApiResponse;

    let rawItems: unknown[] = [];
    let pageIndex = Math.max(requestedPage - 1, 0);
    let pageSize = requestedPageSize;
    let total = 0;

    if (Array.isArray(payload.items)) {
        rawItems = payload.items;
        pageIndex = toSafeNumber(payload.pagination?.page) ?? pageIndex;
        pageSize = toSafeNumber(payload.pagination?.pageSize) ?? pageSize;
        total = toSafeNumber(payload.pagination?.total) ?? rawItems.length;
    } else if (Array.isArray(payload.content)) {
        rawItems = payload.content;
        pageIndex = toSafeNumber(payload.number) ?? pageIndex;
        pageSize = toSafeNumber(payload.size) ?? pageSize;
        total = toSafeNumber(payload.totalElements) ?? rawItems.length;
    } else if (Array.isArray(data)) {
        rawItems = data;
        total = rawItems.length;
    } else {
        throw new Error('Invalid response: expected items/content array');
    }

    const normalizedItems = sortPublicListings(
        rawItems
            .map(normalizeHomeBike)
            .filter((item): item is HomeBike => item !== null),
        sortBy
    );

    return {
        items: normalizedItems,
        pagination: {
            page: pageIndex + 1,
            pageSize,
            total,
        },
    };
}

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

    // ✅ VALIDATION: Ensure bikes is an array and each bike has required fields
    validateResponse(bikes, 'featured bikes');
    validateArray(bikes, 'featured bikes');

    bikes.forEach((bike, index) => {
        const ctx = `featuredBikes[${index}]`;
        validateNumber(bike.listingId, `${ctx}.listingId`);
        validateString(bike.title, `${ctx}.title`);
        validateNumber(bike.price, `${ctx}.price`);
    });

    // Map imageUrl from images[] if backend returns array format
    return bikes.map((bike: any) => ({
        ...bike,
        imageUrl: normalizeImageUrl(bike.images, bike.imageUrl, bike.imageUrls),
    }));
}

/**
 * Fetch ALL listings for listings page (browse/search)
 * Uses /api/bikelistings - Returns 10 items per page
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
        const params = new URLSearchParams();
        params.append('status', 'APPROVED');
        params.append('page', (Math.max(page, 1) - 1).toString());
        params.append('size', '10');

        const data = await apiCallGET<unknown>(`/bikelistings?${params.toString()}`);
        return normalizePublicListingResponse(data, page, 10, 'newest').items;
    } catch (error: any) {
        console.error('Lỗi API GetAllListings:', error);
        return [];
    }
}

/**
 * Search listings by keyword (PUBLIC/BUYER VIEW)
 * Endpoint: GET /api/bikelistings
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
        conditions?: string[];
    },
    page: number = 1,
    pageSize: number = 12,
    sortBy: 'newest' | 'priceAsc' | 'priceDesc' | 'mostViewed' = 'newest'
): Promise<{ items: HomeBike[]; pagination: PaginationInfo }> {


    // Mock data for development
    if (USE_MOCK_API) {

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
        if (keyword) params.append('title', keyword);
        if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
        if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
        if (filters?.bikeTypes) filters.bikeTypes.forEach(t => params.append('bikeType', t));
        if (filters?.brands) filters.brands.forEach(b => params.append('brand', b));
        if (filters?.conditions) filters.conditions.forEach(c => params.append('condition', c));
        params.append('status', 'APPROVED');
        params.append('page', (page > 0 ? page - 1 : 0).toString());
        params.append('size', pageSize.toString());
        params.append('sortBy', sortBy);

        const data = await apiCallGET<unknown>(
            `/bikelistings?${params.toString()}`
        );

        return normalizePublicListingResponse(data, page, pageSize, sortBy);
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


    if (USE_MOCK_API) {

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

    try {
        const data = await apiCallPOST<{ items: HomeBike[]; pagination: PaginationInfo }>(
            '/seller/listings/search',
            requestBody
        );

        // ✅ VALIDATION: Strict check of seller search response
        validateResponse(data, 'seller search response');
        validateArray(data.items, 'sellerItems');
        validateObject(data.pagination, 'pagination');
        validateNumber(data.pagination.total, 'pagination.total');

        data.items.forEach((item, index) => {
            const ctx = `sellerItems[${index}]`;
            validateNumber(item.listingId, `${ctx}.listingId`);
            validateString(item.title, `${ctx}.title`);
            validateNumber(item.price, `${ctx}.price`);
        });

        return data;
    } catch (error: any) {
        console.error('Lỗi API Search Seller Listings:', error);

        if (error.response?.status === 400) {
            console.warn('[API Warning] Bộ lọc tìm kiếm cửa hàng không hợp lệ.');
        }

        return { items: [], pagination: { page, pageSize, total: 0 } };
    }
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

    // Real API: GET /api/bikelistings/{listingId}
    try {
        const data = await apiCallGET<ListingDetail>(`/bikelistings/${listingId}`);
        validateObject(data, 'listingDetailResponse');

        try {
            const validated = validateListingDetail(data);
            return {
                ...validated,
                images: (validated.images || []).map(resolvePublicImageUrl).filter((img) => img.length > 0),
            };
        } catch (validationErr) {
            console.error('Data structure validation failed:', validationErr);
            throw new Error('API returns corrupted listing structure');
        }
    } catch (error: any) {
        console.error('Error fetching listing detail:', error);
        if (error.response?.status === 404) {
            throw new Error('Không tìm thấy xe đạp này trên hệ thống.');
        }
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

    try {
        // Real API: POST /api/seller/listings/detail
        const data = await apiCallPOST<ListingDetail>('/seller/listings/detail', { sellerId, listingId });
        const validated = validateListingDetail(data);

        return validated;
    } catch (error: any) {
        console.error('Lỗi API Get Seller Listing Detail:', error);

        if (error.response?.status === 404) {
            throw new Error('Không tìm thấy tin đăng của bạn trên hệ thống.');
        } else if (error.response?.status === 403) {
            throw new Error('Bạn không có quyền xem tin đăng này.');
        }

        throw error;
    }
}


