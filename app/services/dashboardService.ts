// Service layer for Dashboard (S-10)
// API endpoint: GET /api/seller/dashboard/stats

import {
    validateResponse,
    validateArray,
    validateObject,
    validateNumber,
    validateString,
    validatePositiveNumber
} from '../utils/apiValidation';
import { apiCallGET } from '../utils/apiHelpers';
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
 * API Endpoint: GET /api/seller/dashboard
 * Authentication: Required (authToken in headers)
 *
 * Response Format (SellerDashboardResponse):
 * {
 *   "stats": {
 *     "activeListings": number,       // Count of APPROVED listings
 *     "pendingListings": number,      // Count of PENDING/REVIEWING listings
 *     "rejectedListings": number,     // Count of REJECTED listings
 *     "totalTransactions": number,    // Total completed sales
 *     "totalViews": number,           // Sum of all views across listings
 *     "newInquiries": number          // Count of unread inquiries (if exists)
 *   },
 *   "topListings": [
 *     {
 *       "id": number,                 // listingId
 *       "brand": string,              // Bike brand
 *       "model": string,              // Bike model
 *       "price": number,              // Price in VND
 *       "views": number,              // View count for this listing
 *       "inquiries": number,          // Inquiry count for this listing
 *       "status": "ACTIVE" | "PENDING" | "REJECTED" | ...
 *     }
 *   ]
 * }
 *
 * Replace with API call:
 * const authToken = localStorage.getItem('authToken');
 * const response = await fetch('/backend/api/seller/dashboard', {
 *     method: 'GET',
 *     headers: {
 *         'Content-Type': 'application/json',
 *         'Authorization': `Bearer ${authToken}`
 *     }
 * });
 * const data = await response.json();
 * return data;
 */
export async function getDashboardData(): Promise<DashboardData> {
    const USE_MOCK_API = process.env.NEXT_PUBLIC_MOCK_API === 'true';

    if (USE_MOCK_API) {
        // ⚠️ MOCK IMPLEMENTATION - For development only
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
    }

    // ✅ REAL API: GET /api/seller/dashboard/stats
    const data = await apiCallGET<DashboardData>('/seller/dashboard/stats');

    // ✅ VALIDATION: Validate response structure
    validateResponse(data);
    validateObject(data.stats, 'stats');
    validateNumber(data.stats.activeListings, 'stats.activeListings');
    validateNumber(data.stats.pendingListings, 'stats.pendingListings');
    validateNumber(data.stats.rejectedListings, 'stats.rejectedListings');
    validateNumber(data.stats.totalTransactions, 'stats.totalTransactions');
    validateNumber(data.stats.totalViews, 'stats.totalViews');
    validateNumber(data.stats.newInquiries, 'stats.newInquiries');
    validateArray(data.topListings, 'topListings');

    // Validate each listing
    data.topListings.forEach((listing, index) => {
        const context = `topListings[${index}]`;
        validateNumber(listing.id, `${context}.id`);
        validateString(listing.brand, `${context}.brand`);
        validateString(listing.model, `${context}.model`);
        validatePositiveNumber(listing.price, `${context}.price`);
        validateNumber(listing.views, `${context}.views`);
        validateNumber(listing.inquiries, `${context}.inquiries`);
        validateString(listing.status, `${context}.status`);
    });


    return data;
}
