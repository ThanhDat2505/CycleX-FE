/**
 * Listing Service
 * Handles API calls for bike listing operations
 * Supports mock mode for development when backend is not ready
 */

import { HomeBike } from '../types/listing';

// Check if we should use mock API (for development)
const USE_MOCK_API = process.env.NEXT_PUBLIC_MOCK_API === 'true';

/**
 * Mock data for development
 * Simulates response from GET /api/home
 */
const MOCK_HOME_BIKES: HomeBike[] = [
    {
        listingId: 1,
        title: 'Xe đạp thể thao Giant ATX 720',
        price: 5000000,
        imageUrl: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=400',
        locationCity: 'Hà Nội',
        viewCount: 150,
    },
    {
        listingId: 2,
        title: 'Xe đạp địa hình Trek Marlin 7',
        price: 12000000,
        imageUrl: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=400',
        locationCity: 'TP Hồ Chí Minh',
        viewCount: 120,
    },
    {
        listingId: 3,
        title: 'Xe đạp đường trường Specialized Allez',
        price: 15000000,
        imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400',
        locationCity: 'Đà Nẵng',
        viewCount: 98,
    },
    {
        listingId: 4,
        title: 'Xe đạp touring Cannondale Quick',
        price: 8500000,
        imageUrl: 'https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=400',
        locationCity: 'Hà Nội',
        viewCount: 85,
    },
    {
        listingId: 5,
        title: 'Xe đạp mini gấp SAVA Z1',
        price: 3500000,
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        locationCity: null,
        viewCount: 76,
    },
    {
        listingId: 6,
        title: 'Xe đạp leo núi Scott Aspect 970',
        price: 18000000,
        imageUrl: 'https://images.unsplash.com/photo-1511994714008-b6fa63a4e8ae?w=400',
        locationCity: 'Hải Phòng',
        viewCount: 65,
    },
];

/**
 * Fetch listings for home page
 * Official API: GET /api/home
 * Returns list of ACTIVE products sorted by view_count (descending)
 * @returns Promise with array of HomeBike
 */
export async function getHomeListings(): Promise<HomeBike[]> {
    if (USE_MOCK_API) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        console.log('📦 Using mock data for home listings');
        return MOCK_HOME_BIKES;
    }

    // Real API call
    try {
        const response = await fetch('/backend/api/home', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            // Try to parse error from backend
            try {
                const error = await response.json();
                throw error;
            } catch (parseError) {
                throw {
                    status: response.status,
                    message: `Failed to fetch home listings: ${response.statusText}`,
                };
            }
        }

        const data: HomeBike[] = await response.json();
        return data;
    } catch (error: any) {
        // Handle network errors (server down, no internet, etc.)
        if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
            throw {
                status: 503,
                message: 'Cannot connect to server. Please check if backend is running or if you have internet connection.',
            };
        }

        // Re-throw other errors
        throw error;
    }
}
