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
 * API Endpoint: GET /api/seller/{sellerId}/dashboard/stats
 */
export async function getDashboardData(sellerId: number): Promise<DashboardData> {
    // ✅ REAL API: GET /api/seller/{sellerId}/dashboard/stats
    // BE returns flat: { approvedCount, pendingCount, rejectedCount, totalListings, totalViews }
    const raw = await apiCallGET<{
        approvedCount: number;
        pendingCount: number;
        rejectedCount: number;
        totalListings: number;
        totalViews: number;
    }>(`/seller/${sellerId}/dashboard/stats`);

    // Map BE response to FE DashboardData shape
    const result: DashboardData = {
        stats: {
            activeListings: raw.approvedCount ?? 0,
            pendingListings: raw.pendingCount ?? 0,
            rejectedListings: raw.rejectedCount ?? 0,
            totalTransactions: raw.totalListings ?? 0,
            totalViews: raw.totalViews ?? 0,
            newInquiries: 0, // BE doesn't return this yet
        },
        topListings: [], // BE doesn't return top listings yet
    };

    return result;
}
