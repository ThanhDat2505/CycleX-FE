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
import { ITEMS_PER_PAGE, API_DELAY_MS, VALID_LISTING_STATUSES, type ListingStatus } from '../constants';
import { MOCK_MY_LISTINGS, type MyListing } from '../mocks';

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
    title: string;
    brand: string;
    model: string;
    type: string; // Maps to category
    condition: string;
    year: number;
    price: number;
    location: string;
    description: string;
    shipping: boolean;
    // Images will be handled in S-13, but payload might include URLs later
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
 * Create a new listing
 * 
 * TODO: Replace mock implementation with actual API call
 * API Endpoint: POST /seller/listings
 */
export async function createListing(payload: CreateListingPayload): Promise<Listing> {
    console.log('🚀 Creating listing with payload:', payload);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, API_DELAY_MS));

    // ⚠️ MOCK RESPONSE
    const mockResponse = {
        id: Math.floor(Math.random() * 10000),
        ...payload,
        status: 'PENDING' as ListingStatus, // Default status after creation
        views: 0,
        inquiries: 0,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
    } as Listing;

    // ✅ VALIDATION: Validate mock response to ensure system safety
    validateResponse(mockResponse, 'createListing response');
    validateNumber(mockResponse.id, 'id');
    validateEnum(mockResponse.status, VALID_LISTING_STATUSES, 'status');
    // Ensure payload data is correctly reflected/returned if API returns it
    validateString(mockResponse.brand, 'brand');

    // ⚠️ UPDATE MOCK STORE
    mockListings.unshift(mockResponse); // Add to beginning

    return mockResponse;
}

/**
 * Save listing as draft
 * 
 * TODO: Replace mock implementation with actual API call
 * API Endpoint: POST /seller/listings/draft
 */
export async function saveDraft(payload: CreateListingPayload): Promise<Listing> {
    console.log('💾 Saving draft with payload:', payload);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, API_DELAY_MS));

    // ⚠️ MOCK RESPONSE
    const mockResponse = {
        id: Math.floor(Math.random() * 10000),
        ...payload,
        status: 'DRAFT' as ListingStatus,
        views: 0,
        inquiries: 0,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
    } as Listing;

    // ✅ VALIDATION: Validate response
    validateResponse(mockResponse, 'saveDraft response');
    validateNumber(mockResponse.id, 'id');
    validateEnum(mockResponse.status, VALID_LISTING_STATUSES, 'status');

    // ⚠️ UPDATE MOCK STORE
    mockListings.unshift(mockResponse); // Add to beginning

    return mockResponse;
}
