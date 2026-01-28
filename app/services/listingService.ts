/**
 * Listing Service
 * Handles API calls for bike listing operations
 * Supports mock mode for development when backend is not ready
 */

import { Listing, ListingsResponse } from '../types/listing';
import { PAGINATION } from '../constants/pagination';
import { MOCK_LISTINGS } from '../mocks';

// Check if we should use mock API (for development)
const USE_MOCK_API = process.env.NEXT_PUBLIC_MOCK_API === 'true';

/**
 * Fetch listings for home page
 * @param page - Page number (1-indexed)
 * @param pageSize - Number of items per page (default: 12)
 * @returns Promise with listings and pagination info
 */
export async function getHomeListings(
    page: number = 1,
    pageSize: number = 12
): Promise<ListingsResponse> {
    if (USE_MOCK_API) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Calculate pagination
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const items = MOCK_LISTINGS.slice(startIndex, endIndex);

        return {
            items,
            pagination: {
                page,
                pageSize,
                total: MOCK_LISTINGS.length,
            },
        };
    }

    // Real API call
    try {
        const response = await fetch(
            `/backend/api/home/listings?page=${page}&pageSize=${pageSize}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch listings: ${response.statusText}`);
        }

        const data: ListingsResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching home listings:', error);
        throw error;
    }
}
