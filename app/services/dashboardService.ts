// Service layer for Dashboard (S-10)
// API endpoints will be provided by backend team

import {
    validateResponse,
    validateArray,
    validateObject,
    validateNumber,
    validateString,
    validatePositiveNumber
} from '../utils/apiValidation';
import { API_DELAY_MS, TOP_LISTINGS_LIMIT } from '../constants';

export interface DashboardStats {
    activeListings: number;
    pendingListings: number;
    rejectedListings: number;
    totalTransactions: number;
    totalViews: number;
    newInquiries: number;
}

export interface TopListing {
    id: number;
    brand: string;
    model: string;
    price: number;
    views: number;
    inquiries: number;
    status: string;
}

export interface DashboardData {
    stats: DashboardStats;
    topListings: TopListing[];
}

/**
 * Get seller's dashboard statistics and top performing listings
 * 
 * TODO: Replace mock implementation with actual API call
 * API Endpoint: GET /seller/dashboard
 */
export async function getDashboardData(): Promise<DashboardData> {
    // ⚠️ MOCK IMPLEMENTATION - REPLACE WITH API CALL
    // TODO: Replace this entire block with:
    // 
    // const response = await apiCallGET<DashboardData>(
    //   '/seller/dashboard'
    // );
    // 
    // ✅ IMPORTANT: Validate response after API call
    // validateResponse(response);
    // validateObject(response.stats, 'stats');
    // validateNumber(response.stats.activeListings, 'stats.activeListings');
    // validateNumber(response.stats.pendingListings, 'stats.pendingListings');
    // validateNumber(response.stats.rejectedListings, 'stats.rejectedListings');
    // validateNumber(response.stats.totalTransactions, 'stats.totalTransactions');
    // validateArray(response.topListings, 'topListings');
    // 
    // // Validate each listing
    // response.topListings.forEach((listing, index) => {
    //   const context = `Listing ${index}`;
    //   validateNumber(listing.id, `${context}.id`);
    //   validateString(listing.brand, `${context}.brand`);
    //   validatePositiveNumber(listing.price, `${context}.price`);
    // });
    // 
    // return response;

    // Mock implementation
    const mockListings: TopListing[] = [
        {
            id: 1,
            brand: "Giant",
            model: "Escape 3",
            status: "ACTIVE",
            price: 8500000,
            views: 120,
            inquiries: 2,
        },
        {
            id: 2,
            brand: "Trek",
            model: "FX 2",
            status: "ACTIVE",
            price: 12000000,
            views: 85,
            inquiries: 1,
        },
        {
            id: 3,
            brand: "Specialized",
            model: "Sirrus X",
            status: "PENDING",
            price: 15500000,
            views: 45,
            inquiries: 0,
        },
        {
            id: 4,
            brand: "Cannondale",
            model: "Trail 5",
            status: "REJECTED",
            price: 9500000,
            views: 12,
            inquiries: 0,
        },
    ];

    // Calculate stats from mock data
    const activeListings = mockListings.filter(l => l.status === "ACTIVE").length;
    const pendingListings = mockListings.filter(l => l.status === "PENDING").length;
    const rejectedListings = mockListings.filter(l => l.status === "REJECTED").length;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, API_DELAY_MS));

    return {
        stats: {
            activeListings,
            pendingListings,
            rejectedListings,
            totalTransactions: 5,
            totalViews: 1245,
            newInquiries: 3,
        },
        topListings: mockListings.slice(0, TOP_LISTINGS_LIMIT),
    };
    // ⚠️ END MOCK IMPLEMENTATION
}
