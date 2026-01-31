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

/**
 * Search listings by keyword
 * Calls GET /api/listings/search?keyword={keyword}  
 * 
 * @param keyword - Search keyword (minimum 3 characters recommended)
 * @returns Promise<HomeBike[]> - Array of matching bike listings
 */
export async function searchListings(keyword: string): Promise<Listing[]> {
    console.log('🔍 Searching listings with keyword:', keyword);

    // Mock data for development
    if (USE_MOCK_API) {
        console.log('📦 Using MOCK search data');
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

        // Filter mock data by keyword (case-insensitive)
        const filtered = MOCK_LISTINGS.filter(listing =>
            listing.title.toLowerCase().includes(keyword.toLowerCase()) ||
            listing.brand.toLowerCase().includes(keyword.toLowerCase()) ||
            listing.model.toLowerCase().includes(keyword.toLowerCase())
        );
        return filtered;
    }

    // Real API call
    try {
        const response = await fetch(
            `/backend/api/listings/search?keyword=${encodeURIComponent(keyword)}`,
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

        const data: Listing[] = await response.json();

        // ✅ VALIDATION: Check response
        if (!data) {
            throw new Error('Invalid response from server: data is null or undefined');
        }

        if (!Array.isArray(data)) {
            throw new Error('Invalid response format: expected array of listings');
        }

        console.log(`✅ Search successful: ${data.length} results found`);
        return data;
    } catch (error) {
        console.error('Error searching listings:', error);
        throw error;
    }
}

