// Service layer for My Listings (S-11)
// API endpoints will be provided by backend team

import {
    validateResponse,
    validateArray,
    validateObject,
    validateNumber,
    validateString,
    validateEnum,
    validatePositiveNumber
} from '../utils/apiValidation';
import { apiCallPOST, apiCallPUT, apiCallGET, apiCallPATCH, apiCallDELETE } from '../utils/apiHelpers';
import { ITEMS_PER_PAGE, API_DELAY_MS, VALID_LISTING_STATUSES, type ListingStatus } from '../constants';
import { MOCK_MY_LISTINGS, type MyListing } from '../mocks';

// Check if we should use mock API
const USE_MOCK_API = process.env.NEXT_PUBLIC_MOCK_API === 'true';

// Re-export Listing type from mocks for backward compatibility
export type Listing = MyListing;

export interface GetMyListingsParams {
    sellerId?: number;
    page?: number;
    pageSize?: number;
    status?: string;
    sortBy?: 'recent' | 'views' | 'price-high' | 'price-low';
}

export interface GetMyListingsResponse {
    listings: Listing[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
}

export interface CreateListingPayload {
    sellerId: number;
    title: string;
    description?: string;
    bikeType: string;
    brand: string;
    model: string;
    manufactureYear?: number;
    condition?: string;
    usageTime?: string;
    reasonForSale?: string;
    price: number;
    locationCity: string;
    pickupAddress?: string;
    imageUrls?: string[];
    saveDraft?: boolean;
}

// Mock data now imported from @/app/mocks/myListings.ts
// Re-export for backward compatibility with existing code
export const mockListings = MOCK_MY_LISTINGS;

type ListingApiResponse = Partial<Listing> & {
    listingId?: number;
};

interface SellerListingSearchItemResponse {
    listingId: number;
    title?: string;
    brand: string;
    model: string;
    price: number | string;
    status: string;
    viewsCount?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface SellerListingDetailResponse {
    listingId: number;
    sellerId?: number;
    title?: string;
    description?: string;
    bikeType?: string;
    brand: string;
    model: string;
    manufactureYear?: number;
    condition?: string;
    usageTime?: string;
    reasonForSale?: string;
    price: number | string;
    locationCity?: string;
    pickupAddress?: string;
    status: string;
    viewsCount?: number;
    createdAt?: string;
    updatedAt?: string;
}

interface SellerListingSearchPageResponse {
    content: SellerListingSearchItemResponse[];
    totalElements: number;
    totalPages: number;
    number: number;
}

/**
 * Backend may return `listingId` while FE expects `id`.
 * Normalize once so downstream code can consistently rely on `id`.
 */
function normalizeListingResponse(response: ListingApiResponse, context: string): Listing {
    validateResponse(response, context);

    const normalizedId = typeof response.id === 'number'
        ? response.id
        : response.listingId;

    if (typeof normalizedId !== 'number') {
        throw new Error(`Invalid response: ${context}.id (or listingId) must be a number`);
    }

    return {
        ...response,
        id: normalizedId,
    } as Listing;
}

function mapStatusFromBackend(status: string): ListingStatus {
    const normalized = status.toUpperCase();
    if (normalized === 'APPROVED') return 'APPROVE';
    if (normalized === 'REJECTED') return 'REJECT';
    if (normalized === 'PENDING' || normalized === 'DRAFT') {
        return normalized as ListingStatus;
    }

    // Treat in-review/non-editable statuses as PENDING on My Listings card.
    if (normalized === 'REVIEWING' || normalized === 'WAITING_INSPECTOR_REVIEW' || normalized === 'ARCHIVED') {
        return 'PENDING';
    }

    return 'PENDING';
}

function mapStatusToBackend(status?: string): string | undefined {
    if (!status) return undefined;

    const normalized = status.toUpperCase();
    if (normalized === 'APPROVE' || normalized === 'ACTIVE') return 'APPROVED';
    if (normalized === 'REJECT') return 'REJECTED';
    if (normalized === 'DRAFT' || normalized === 'PENDING') return normalized;

    return undefined;
}

function mapSearchItemToListing(item: SellerListingSearchItemResponse): Listing {
    const parsedPrice = Number(item.price ?? 0);

    return {
        id: item.listingId,
        brand: item.brand,
        model: item.model,
        type: item.title || 'Bike Listing',
        condition: '-',
        price: Number.isFinite(parsedPrice) ? parsedPrice : 0,
        location: '-',
        status: mapStatusFromBackend(item.status),
        shipping: false,
        views: item.viewsCount ?? 0,
        inquiries: 0,
        createdDate: item.createdAt || new Date().toISOString(),
        updatedDate: item.updatedAt || item.createdAt || new Date().toISOString(),
    };
}

async function attachMainImageToListings(sellerId: number, listings: Listing[]): Promise<Listing[]> {
    const resolveImageUrl = (imagePath?: string): string | undefined => {
        if (!imagePath) return undefined;
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
        if (imagePath.startsWith('/public/')) return imagePath;
        if (imagePath.startsWith('/uploads/')) return `/backend${imagePath}`;
        return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    };

    const listingsWithImage = await Promise.all(
        listings.map(async (listing) => {
            try {
                const images = await getListingImages(sellerId, listing.id);
                const sorted = [...images].sort((a, b) => (a.imageOrder ?? 0) - (b.imageOrder ?? 0));
                const mainImageUrl = resolveImageUrl(sorted[0]?.imagePath);
                return mainImageUrl ? ({ ...listing, mainImageUrl } as Listing) : listing;
            } catch {
                // Image loading failure should not block listing cards.
                return listing;
            }
        })
    );

    return listingsWithImage;
}

/**
 * Get seller's listings with pagination and filters
 * 
 * TODO: Replace mock implementation with actual API call
 * API Endpoint: GET /seller/listings
 * Query params: page, pageSize, status, sortBy
 */
export async function getMyListings(
    params: GetMyListingsParams = {}
): Promise<GetMyListingsResponse> {
    const { sellerId, page = 1, pageSize = ITEMS_PER_PAGE, status, sortBy = 'recent' } = params;

    if (!sellerId) {
        throw new Error('Seller ID is required to load listings.');
    }

    const backendStatus = mapStatusToBackend(status);
    const queryObj: Record<string, string> = {
        page: Math.max(page - 1, 0).toString(),
        pageSize: pageSize.toString(),
        sort: sortBy === 'recent' ? 'newest' : 'newest',
    };

    if (backendStatus) {
        queryObj.status = backendStatus;
    }

    const queryStr = new URLSearchParams(queryObj).toString();
    const response = await apiCallGET<SellerListingSearchPageResponse>(
        `/seller/${sellerId}/listings/search?${queryStr}`
    );

    validateResponse(response, 'getMyListings response');
    validateArray(response.content, 'content');
    validateNumber(response.totalElements, 'totalElements');
    validateNumber(response.totalPages, 'totalPages');
    validateNumber(response.number, 'number');

    const mappedListings = response.content.map(mapSearchItemToListing);

    // BE currently sorts by createdAt; keep FE-side sort fallback for current page.
    if (sortBy === 'views') {
        mappedListings.sort((a, b) => b.views - a.views);
    } else if (sortBy === 'price-high') {
        mappedListings.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'price-low') {
        mappedListings.sort((a, b) => a.price - b.price);
    }

    const listingsWithImage = await attachMainImageToListings(sellerId, mappedListings);

    return {
        listings: listingsWithImage,
        totalItems: response.totalElements,
        totalPages: response.totalPages,
        currentPage: response.number + 1,
    };
}

/**
 * Create a new listing and submit for approval
 * Endpoint: POST /api/seller/{sellerId}/listings/create
 * 
 * @param payload - Listing data including sellerId
 * @returns Promise<Listing> - Created listing with PENDING status
 */
export async function createListing(payload: CreateListingPayload): Promise<Listing> {


    if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, API_DELAY_MS));

        const mockResponse: Listing = {
            id: Math.floor(Math.random() * 10000),
            brand: payload.brand,
            model: payload.model,
            type: payload.bikeType,
            condition: payload.condition || 'Used',
            price: payload.price,
            location: payload.locationCity,
            status: 'PENDING' as ListingStatus,
            shipping: false,
            views: 0,
            inquiries: 0,
            createdDate: new Date().toISOString(),
            updatedDate: new Date().toISOString(),
        };

        validateResponse(mockResponse, 'createListing response');
        validateNumber(mockResponse.id, 'id');
        validateEnum(mockResponse.status, VALID_LISTING_STATUSES, 'status');

        mockListings.unshift(mockResponse);
        return mockResponse;
    }

    // Real API: POST /api/seller/{sellerId}/listings/create
    // Strip imageUrls — images are uploaded separately via /images endpoint
    const { sellerId, imageUrls, ...body } = payload;
    const response = await apiCallPOST<ListingApiResponse>(`/seller/${sellerId}/listings/create`, { ...body, sellerId, saveDraft: false });
    const normalizedResponse = normalizeListingResponse(response, 'createListing response');

    validateNumber(normalizedResponse.id, 'id');
    validateString(normalizedResponse.brand, 'brand');
    validateString(normalizedResponse.model, 'model');
    validateEnum(normalizedResponse.status, VALID_LISTING_STATUSES, 'status');


    return normalizedResponse;
}

/**
 * Save listing as draft (not submitted for approval)
 * Endpoint: POST /api/seller/{sellerId}/listings/create (saveDraft: true)
 * 
 * @param payload - Listing data including sellerId
 * @returns Promise<Listing> - Created listing with DRAFT status
 */
export async function saveDraft(payload: CreateListingPayload): Promise<Listing> {


    if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, API_DELAY_MS));

        const mockResponse: Listing = {
            id: Math.floor(Math.random() * 10000),
            brand: payload.brand,
            model: payload.model,
            type: payload.bikeType,
            condition: payload.condition || 'Used',
            price: payload.price,
            location: payload.locationCity,
            status: 'DRAFT' as ListingStatus,
            shipping: false,
            views: 0,
            inquiries: 0,
            createdDate: new Date().toISOString(),
            updatedDate: new Date().toISOString(),
        };

        validateResponse(mockResponse, 'saveDraft response');
        validateNumber(mockResponse.id, 'id');
        validateEnum(mockResponse.status, VALID_LISTING_STATUSES, 'status');

        mockListings.unshift(mockResponse);
        return mockResponse;
    }

    // Real API: POST /api/seller/{sellerId}/listings/create with saveDraft: true
    // Strip imageUrls — images are uploaded separately via /images endpoint
    const { sellerId, imageUrls, ...body } = payload;
    const response = await apiCallPOST<ListingApiResponse>(`/seller/${sellerId}/listings/create`, { ...body, sellerId, saveDraft: true });
    const normalizedResponse = normalizeListingResponse(response, 'saveDraft response');

    validateNumber(normalizedResponse.id, 'id');
    validateString(normalizedResponse.brand, 'brand');
    validateString(normalizedResponse.model, 'model');
    validateEnum(normalizedResponse.status, VALID_LISTING_STATUSES, 'status');


    return normalizedResponse;
}

/**
 * Update an existing listing
 * Endpoint: PATCH /api/seller/{sellerId}/listings/{listingId}
 * 
 * @param sellerId - Seller ID
 * @param listingId - ID of the listing to update
 * @param payload - Updated listing data
 * @returns Promise<Listing> - Updated listing
 */
export async function updateDraft(listingId: number, payload: Partial<CreateListingPayload>): Promise<Listing> {


    if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, API_DELAY_MS));

        // Find and update mock listing
        const existingIndex = mockListings.findIndex(l => l.id === listingId);
        if (existingIndex === -1) {
            throw new Error(`Draft listing ${listingId} not found`);
        }

        const updated: Listing = {
            ...mockListings[existingIndex],
            brand: payload.brand || mockListings[existingIndex].brand,
            model: payload.model || mockListings[existingIndex].model,
            type: payload.bikeType || mockListings[existingIndex].type,
            condition: payload.condition || mockListings[existingIndex].condition,
            price: payload.price ?? mockListings[existingIndex].price,
            location: payload.locationCity || mockListings[existingIndex].location,
            updatedDate: new Date().toISOString(),
        };

        mockListings[existingIndex] = updated;
        return updated;
    }

    // Real API: PATCH /api/seller/{sellerId}/listings/{listingId}
    const { sellerId, ...rest } = payload;
    const sid = sellerId ?? 0;
    const response = await apiCallPATCH<ListingApiResponse>(`/seller/${sid}/listings/${listingId}`, { sellerId: sid, ...rest });
    const normalizedResponse = normalizeListingResponse(response, 'updateDraft response');

    validateNumber(normalizedResponse.id, 'id');


    return normalizedResponse;
}

/**
 * Submit a draft listing for approval (DRAFT → PENDING)
 * Endpoint: POST /api/seller/{sellerId}/drafts/{listingId}/submit
 * 
 * @param listingId - ID of the draft to submit
 * @param sellerId - Seller ID
 * @returns Promise<Listing> - Listing with PENDING status
 */
export async function submitDraft(listingId: number, sellerId?: number): Promise<Listing> {


    if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, API_DELAY_MS));

        // Find and update mock listing status
        const existingIndex = mockListings.findIndex(l => l.id === listingId);
        if (existingIndex === -1) {
            throw new Error(`Draft listing ${listingId} not found`);
        }

        const submitted: Listing = {
            ...mockListings[existingIndex],
            status: 'PENDING' as ListingStatus,
            updatedDate: new Date().toISOString(),
        };

        mockListings[existingIndex] = submitted;

        return submitted;
    }

    // Real API: POST /api/seller/{sellerId}/drafts/{listingId}/submit
    const sid = sellerId ?? 0;
    const response = await apiCallPOST<ListingApiResponse>(`/seller/${sid}/drafts/${listingId}/submit`, {});
    const normalizedResponse = normalizeListingResponse(response, 'submitDraft response');

    validateNumber(normalizedResponse.id, 'id');
    validateEnum(normalizedResponse.status, VALID_LISTING_STATUSES, 'status');


    return normalizedResponse;
}

/**
 * Cancel publish for a listing (expected PENDING/REVIEWING -> DRAFT)
 * Fallback implementation uses seller update endpoint with status=DRAFT.
 */
export async function cancelPublish(listingId: number, sellerId: number): Promise<Listing> {
    const response = await apiCallPATCH<ListingApiResponse>(
        `/seller/${sellerId}/listings/${listingId}/cancel-publish`,
        {}
    );
    const normalizedResponse = normalizeListingResponse(response, 'cancelPublish response');

    validateNumber(normalizedResponse.id, 'id');
    validateEnum(normalizedResponse.status, VALID_LISTING_STATUSES, 'status');

    return normalizedResponse;
}

/**
 * Preview a listing before submitting
 * Endpoint: GET /api/seller/{sellerId}/listings/{listingId}/preview
 * 
 * @param sellerId - Seller ID
 * @param listingId - Listing ID to preview
 * @returns Promise<Listing> - Preview data
 */
export async function previewListing(sellerId: number, listingId: number): Promise<Listing> {


    if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, API_DELAY_MS));

        // Find in mock listings
        const listing = mockListings.find(l => l.id === listingId);
        if (!listing) {
            throw new Error(`Listing ${listingId} not found`);
        }

        return listing;
    }

    // Real API: GET /api/seller/{sellerId}/listings/{listingId}/preview
    const response = await apiCallGET<ListingApiResponse>(`/seller/${sellerId}/listings/${listingId}/preview`);
    const normalizedResponse = normalizeListingResponse(response, 'previewListing response');

    validateNumber(normalizedResponse.id, 'id');
    validateString(normalizedResponse.brand, 'brand');
    validateString(normalizedResponse.model, 'model');


    return normalizedResponse;
}

/**
 * Submit a DRAFT listing for approval (DRAFT → PENDING)
 * Endpoint: POST /api/seller/{sellerId}/drafts/{listingId}/submit
 * 
 * @param sellerId - Seller ID
 * @param listingId - Listing ID to submit
 * @returns Promise<Listing> - Updated listing with PENDING status
 */
export async function submitListing(sellerId: number, listingId: number): Promise<Listing> {


    if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, API_DELAY_MS));

        // Find and update in mock listings
        const listingIndex = mockListings.findIndex(l => l.id === listingId);
        if (listingIndex === -1) {
            throw new Error(`Listing ${listingId} not found`);
        }

        // Update status to PENDING
        mockListings[listingIndex] = {
            ...mockListings[listingIndex],
            status: 'PENDING' as ListingStatus,
            updatedDate: new Date().toISOString(),
        };

        return mockListings[listingIndex];
    }

    // Real API: POST /api/seller/{sellerId}/drafts/{listingId}/submit
    const response = await apiCallPOST<ListingApiResponse>(`/seller/${sellerId}/drafts/${listingId}/submit`, {});
    const normalizedResponse = normalizeListingResponse(response, 'submitListing response');

    validateNumber(normalizedResponse.id, 'id');
    validateEnum(normalizedResponse.status, VALID_LISTING_STATUSES, 'status');


    return normalizedResponse;
}

export interface GetDraftsParams {
    sellerId: number;
    sort?: 'newest' | 'oldest';
    page?: number;
    pageSize?: number;
}

export interface GetDraftsResponse {
    items: Listing[];
    pagination: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        pageSize: number;
    };
}

/**
 * Get all draft listings
 * Endpoint: GET /api/seller/{sellerId}/drafts?page=0&pageSize=10&sort=newest
 * 
 * @param params - Query parameters
 * @returns Promise<GetDraftsResponse> - Paginated draft listings
 */
export async function getDrafts(params: GetDraftsParams): Promise<GetDraftsResponse> {
    const { sellerId, sort = 'newest', page = 0, pageSize = 10 } = params;

    // Real API: GET /api/seller/{sellerId}/drafts
    const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        sort,
    }).toString();
    const response = await apiCallGET<SellerListingSearchPageResponse>(`/seller/${sellerId}/drafts?${queryParams}`);

    validateResponse(response, 'getDrafts response');
    validateArray(response.content, 'content');
    validateNumber(response.totalElements, 'totalElements');
    validateNumber(response.totalPages, 'totalPages');
    validateNumber(response.number, 'number');

    const items = response.content.map(mapSearchItemToListing);

    return {
        items,
        pagination: {
            totalItems: response.totalElements,
            totalPages: response.totalPages,
            currentPage: response.number,
            pageSize,
        },
    };
}

// ========== NEW API ENDPOINTS (from CycleX API Postman) ==========

/**
 * Get seller dashboard stats
 * Endpoint: GET /api/seller/{sellerId}/dashboard/stats
 */
export async function getDashboardStats(sellerId: number): Promise<any> {
    if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, API_DELAY_MS));
        return { totalListings: 5, activeListings: 3, pendingListings: 1, draftListings: 1, totalViews: 120, totalInquiries: 15 };
    }

    return await apiCallGET(`/seller/${sellerId}/dashboard/stats`);
}

/**
 * Get My Listings with search/filter
 * Endpoint: GET /api/seller/{sellerId}/listings/search?page=0&pageSize=20&status=APPROVED
 */
export interface SearchListingsParams {
    sellerId: number;
    page?: number;
    pageSize?: number;
    status?: string;
    title?: string;
    brand?: string;
    model?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
}

export async function searchMyListings(params: SearchListingsParams): Promise<GetMyListingsResponse> {
    const { sellerId, page = 0, pageSize = 20, status, title, brand, model, minPrice, maxPrice, sort } = params;

    const queryObj: Record<string, string> = { page: page.toString(), pageSize: pageSize.toString() };
    const backendStatus = mapStatusToBackend(status);
    if (backendStatus) queryObj.status = backendStatus;
    if (title) queryObj.title = title;
    if (brand) queryObj.brand = brand;
    if (model) queryObj.model = model;
    if (minPrice !== undefined) queryObj.minPrice = minPrice.toString();
    if (maxPrice !== undefined) queryObj.maxPrice = maxPrice.toString();
    if (sort) queryObj.sort = sort;

    const queryStr = new URLSearchParams(queryObj).toString();
    const response = await apiCallGET<SellerListingSearchPageResponse>(`/seller/${sellerId}/listings/search?${queryStr}`);

    validateResponse(response, 'searchMyListings response');
    validateArray(response.content, 'content');
    validateNumber(response.totalElements, 'totalElements');
    validateNumber(response.totalPages, 'totalPages');
    validateNumber(response.number, 'number');

    return {
        listings: response.content.map(mapSearchItemToListing),
        totalItems: response.totalElements,
        totalPages: response.totalPages,
        currentPage: response.number + 1,
    };
}

/**
 * Get listing detail for seller edit/view flow
 * Endpoint: GET /api/seller/{sellerId}/listings/{listingId}/preview
 */
export async function getListingDetail(sellerId: number, listingId: number): Promise<SellerListingDetailResponse> {
    const response = await apiCallGET<SellerListingDetailResponse>(`/seller/${sellerId}/listings/${listingId}/preview`);

    validateResponse(response, 'getListingDetail response');
    validateNumber(response.listingId, 'listingId');
    validateString(response.brand, 'brand');
    validateString(response.model, 'model');
    validateString(response.status, 'status');

    return response;
}

/**
 * Get rejection reason for a listing
 * Endpoint: GET /api/seller/{sellerId}/listings/{listingId}/rejection
 */
export interface RejectionInfo {
    listingId: number;
    reasonCode: string;
    reasonText: string;
    note?: string;
}

export async function getRejectionReason(sellerId: number, listingId: number): Promise<RejectionInfo> {
    if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, API_DELAY_MS));
        return { listingId, reasonCode: 'INVALID_INFO', reasonText: 'Mock rejection reason', note: 'Please update your listing' };
    }

    return await apiCallGET<RejectionInfo>(`/seller/${sellerId}/listings/${listingId}/rejection`);
}

/**
 * Delete a draft listing
 * Endpoint: DELETE /api/seller/{sellerId}/drafts/{draftId}
 */
export async function deleteDraft(sellerId: number, draftId: number): Promise<void> {
    await apiCallDELETE(`/seller/${sellerId}/drafts/${draftId}`);
}

/**
 * Get listing images
 * Endpoint: GET /api/seller/{sellerId}/listings/{listingId}/images
 */
export interface ListingImage {
    id?: number;
    imageId?: number;
    imagePath: string;
    imageOrder: number;
}

export async function getListingImages(sellerId: number, listingId: number): Promise<ListingImage[]> {
    return await apiCallGET<ListingImage[]>(`/seller/${sellerId}/listings/${listingId}/images`);
}

/**
 * Upload a listing image
 * Endpoint: POST /api/seller/{sellerId}/listings/{listingId}/images
 * Body: { imagePath, imageOrder }
 */
export async function uploadListingImage(
    sellerId: number,
    listingId: number,
    imagePath: string,
    _imageOrder?: number
): Promise<ListingImage> {
    if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, API_DELAY_MS));
        return { id: Math.floor(Math.random() * 10000), imagePath, imageOrder: _imageOrder ?? 1 };
    }

    return await apiCallPOST<ListingImage>(`/seller/${sellerId}/listings/${listingId}/images`, { imagePath });
}

/**
 * Delete a listing image
 * Endpoint: DELETE /api/seller/{sellerId}/listings/{listingId}/images/{imageId}
 */
export async function deleteListingImage(sellerId: number, listingId: number, imageId: number): Promise<void> {
    if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, API_DELAY_MS));
        return;
    }

    await apiCallDELETE(`/seller/${sellerId}/listings/${listingId}/images/${imageId}`);
}
