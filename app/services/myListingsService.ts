// Service layer for My Listings (S-11)
// API endpoints will be provided by backend team

import {
    validateResponse,
    validateArray,
    validateNumber,
    validateString,
    validateEnum,
    validatePositiveNumber
} from '../utils/apiValidation';
import { apiCallPOST } from '../utils/apiHelpers';
import { ITEMS_PER_PAGE, API_DELAY_MS, VALID_LISTING_STATUSES, type ListingStatus } from '../constants';
import { MOCK_MY_LISTINGS, type MyListing } from '../mocks';

// Check if we should use mock API
const USE_MOCK_API = process.env.NEXT_PUBLIC_MOCK_API === 'true';

// Re-export Listing type from mocks for backward compatibility
export type Listing = MyListing;

export interface GetMyListingsParams {
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
}

// Mock data now imported from @/app/mocks/myListings.ts
// Re-export for backward compatibility with existing code
export const mockListings = MOCK_MY_LISTINGS;

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
    const { page = 1, pageSize = 10, status, sortBy = 'recent' } = params;

    // ⚠️ MOCK IMPLEMENTATION - REPLACE WITH API CALL
    // TODO: Replace this entire block with:
    // 
    // const response = await apiCallGET<GetMyListingsResponse>(
    //   '/seller/listings',
    //   params
    // );
    // 
    // ✅ IMPORTANT: Validate response after API call
    // validateResponse(response);
    // validateArray(response.listings, 'listings');
    // validateNumber(response.totalItems, 'totalItems');
    // validateNumber(response.totalPages, 'totalPages');
    // validateNumber(response.currentPage, 'currentPage');
    // 
    // // Validate each listing has required fields
    // response.listings.forEach((listing, index) => {
    //   const context = `Listing ${index}`;
    //   validateNumber(listing.id, `${context}.id`);
    //   validateString(listing.brand, `${context}.brand`);
    //   validateString(listing.model, `${context}.model`);
    //   validateEnum(listing.status, VALID_LISTING_STATUSES, `${context}.status`);
    //   validatePositiveNumber(listing.price, `${context}.price`);
    //   validateString(listing.createdDate, `${context}.createdDate`);
    //   validateString(listing.updatedDate, `${context}.updatedDate`);
    // });
    // 
    // return response;

    // Client-side filtering (server will do this)
    let filtered = [...MOCK_MY_LISTINGS]; // Use spread to avoid mutating original

    if (status) {
        filtered = filtered.filter(l => l.status.toLowerCase() === status.toLowerCase());
    }

    // Client-side sorting (server will do this)
    if (sortBy === 'views') {
        filtered.sort((a, b) => b.views - a.views);
    } else if (sortBy === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
    } else {
        filtered.sort((a, b) =>
            new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime()
        );
    }

    // Client-side pagination (server will do this)
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedListings = filtered.slice(startIndex, endIndex);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, API_DELAY_MS));

    return {
        listings: paginatedListings,
        totalItems,
        totalPages,
        currentPage: page,
    };
    // ⚠️ END MOCK IMPLEMENTATION
}

/**
 * Create a new listing and submit for approval
 * Endpoint: POST /api/seller/listings (saveDraft: false)
 * 
 * @param payload - Listing data
 * @returns Promise<Listing> - Created listing with PENDING status
 */
export async function createListing(payload: CreateListingPayload): Promise<Listing> {
    console.log('🚀 Creating listing with payload:', payload);

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

    // Real API: POST /api/seller/listings with saveDraft: false
    const requestBody = { ...payload, saveDraft: false };
    const response = await apiCallPOST<Listing>('/seller/listings', requestBody);

    validateResponse(response, 'createListing response');
    console.log('✅ Listing created and submitted for approval');
    return response;
}

/**
 * Save listing as draft (not submitted for approval)
 * Endpoint: POST /api/seller/listings (saveDraft: true)
 * 
 * @param payload - Listing data
 * @returns Promise<Listing> - Created listing with DRAFT status
 */
export async function saveDraft(payload: CreateListingPayload): Promise<Listing> {
    console.log('💾 Saving draft with payload:', payload);

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

    // Real API: POST /api/seller/listings with saveDraft: true
    const requestBody = { ...payload, saveDraft: true };
    const response = await apiCallPOST<Listing>('/seller/listings', requestBody);

    validateResponse(response, 'saveDraft response');
    console.log('✅ Listing saved as draft');
    return response;
}

/**
 * Preview a listing before submitting
 * Endpoint: POST /api/seller/listings/preview
 * 
 * @param sellerId - Seller ID
 * @param listingId - Listing ID to preview
 * @returns Promise<Listing> - Preview data
 */
export async function previewListing(sellerId: number, listingId: number): Promise<Listing> {
    console.log(`🔍 Previewing listing ${listingId} for seller ${sellerId}`);

    if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, API_DELAY_MS));

        // Find in mock listings
        const listing = mockListings.find(l => l.id === listingId);
        if (!listing) {
            throw new Error(`Listing ${listingId} not found`);
        }

        return listing;
    }

    const response = await apiCallPOST<Listing>('/seller/listings/preview', { sellerId, listingId });
    validateResponse(response, 'previewListing response');
    console.log('✅ Preview data fetched');
    return response;
}

/**
 * Submit a DRAFT listing for approval (DRAFT → PENDING)
 * Endpoint: POST /api/seller/listings/{id}/submit
 * 
 * @param sellerId - Seller ID
 * @param listingId - Listing ID to submit
 * @returns Promise<Listing> - Updated listing with PENDING status
 */
export async function submitListing(sellerId: number, listingId: number): Promise<Listing> {
    console.log(`📤 Submitting listing ${listingId} for approval`);

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

    const response = await apiCallPOST<Listing>(`/seller/listings/${listingId}/submit`, { sellerId, listingId });
    validateResponse(response, 'submitListing response');
    console.log('✅ Listing submitted for approval');
    return response;
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
 * Endpoint: POST /api/seller/drafts
 * 
 * @param params - Query parameters
 * @returns Promise<GetDraftsResponse> - Paginated draft listings
 */
export async function getDrafts(params: GetDraftsParams): Promise<GetDraftsResponse> {
    const { sellerId, sort = 'newest', page = 0, pageSize = 10 } = params;
    console.log(`📋 Fetching drafts for seller ${sellerId}, page ${page}`);

    if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, API_DELAY_MS));

        // Filter drafts from mock listings
        const drafts = mockListings.filter(l => l.status === 'DRAFT');

        // Sort
        const sorted = [...drafts].sort((a, b) => {
            if (sort === 'newest') {
                return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
            }
            return new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
        });

        // Paginate
        const start = page * pageSize;
        const items = sorted.slice(start, start + pageSize);

        return {
            items,
            pagination: {
                totalItems: drafts.length,
                totalPages: Math.ceil(drafts.length / pageSize),
                currentPage: page,
                pageSize,
            },
        };
    }

    const response = await apiCallPOST<GetDraftsResponse>('/seller/drafts', {
        sellerId,
        sort,
        page,
        pageSize,
    });
    validateResponse(response, 'getDrafts response');
    console.log(`✅ Fetched ${response.items.length} drafts`);
    return response;
}
