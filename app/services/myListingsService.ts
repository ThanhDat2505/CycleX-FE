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

export interface Listing {
    id: number;
    brand: string;
    model: string;
    type: string;
    condition: string;
    price: number;
    location: string;
    status: ListingStatus;
    rejectionReason?: string;
    shipping: boolean;
    views: number;
    inquiries: number;
    createdDate: string;
    updatedDate: string;
}

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

    const mockListings: Listing[] = [
        {
            id: 1,
            brand: "Giant",
            model: "Escape 3",
            type: "Road Bike",
            condition: "Used",
            price: 8500000,
            location: "Hà Nội",
            status: "APPROVE",
            shipping: true,
            views: 120,
            inquiries: 2,
            createdDate: new Date(Date.now() - 86400000 * 7).toISOString(),
            updatedDate: new Date(Date.now() - 86400000).toISOString(),
        },
        {
            id: 2,
            brand: "Trek",
            model: "FX 2",
            type: "Mountain Bike",
            condition: "New",
            price: 12000000,
            location: "Hồ Chí Minh",
            status: "APPROVE",
            shipping: false,
            views: 85,
            inquiries: 1,
            createdDate: new Date(Date.now() - 86400000 * 5).toISOString(),
            updatedDate: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
        {
            id: 3,
            brand: "Specialized",
            model: "Sirrus X",
            type: "Hybrid Bike",
            condition: "Used",
            price: 15500000,
            location: "Đà Nẵng",
            status: "PENDING",
            shipping: true,
            views: 45,
            inquiries: 0,
            createdDate: new Date(Date.now() - 86400000 * 3).toISOString(),
            updatedDate: new Date().toISOString(),
        },
        {
            id: 4,
            brand: "Cannondale",
            model: "Trail 5",
            type: "Mountain Bike",
            condition: "Used",
            price: 9500000,
            location: "Hà Nội",
            status: "REJECT",
            rejectionReason: "Images are blurry and bike condition is unclear. Please provide clearer photos showing frame details and components.",
            shipping: true,
            views: 12,
            inquiries: 0,
            createdDate: new Date(Date.now() - 86400000 * 2).toISOString(),
            updatedDate: new Date(Date.now() - 86400000).toISOString(),
        },
        {
            id: 5,
            brand: "Merida",
            model: "Scultura 400",
            type: "Road Bike",
            condition: "New",
            price: 18000000,
            location: "Đà Nẵng",
            status: "DRAFT",
            shipping: true,
            views: 0,
            inquiries: 0,
            createdDate: new Date().toISOString(),
            updatedDate: new Date().toISOString(),
        },
    ];

    // Client-side filtering (server will do this)
    let filtered = mockListings;
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
