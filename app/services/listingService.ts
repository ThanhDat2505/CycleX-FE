/**
 * Listing Service
 * Handles API calls for bike listing operations
 * Supports mock mode for development when backend is not ready
 */

import { Listing, ListingsResponse } from '../types/listing';
import { PAGINATION } from '../constants/pagination';
import { BIKE_CATEGORIES } from '../constants/categories';

// Check if we should use mock API (for development)
const USE_MOCK_API = process.env.NEXT_PUBLIC_MOCK_API === 'true';

/**
 * Generate mock listing data for development
 */
function generateMockListings(count: number = 20): Listing[] {
    const brands = ['Giant', 'Trek', 'Specialized', 'Cannondale', 'Scott', 'Merida'];
    const models = ['Escape 3', 'FX 2', 'Sirrus', 'Quick', 'Speedster', 'Scultura'];
    const categories = BIKE_CATEGORIES.map(c => c.name);
    const locations = ['Hà Nội', 'TP.HCM', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ'];

    return Array.from({ length: count }, (_, index) => {
        const price = Math.floor(Math.random() * 15000000) + 5000000; // 5M - 20M VND
        const hasDiscount = index % 3 === 0; // Every 3rd item has discount
        const discountPercentage = hasDiscount ? Math.floor(Math.random() * 30) + 10 : undefined; // 10-40% off
        const originalPrice = hasDiscount ? Math.floor(price / (1 - (discountPercentage || 0) / 100)) : undefined;

        return {
            listing_id: index + 1,
            title: `${brands[index % brands.length]} ${models[index % models.length]} ${2020 + (index % 4)}`,
            brand: brands[index % brands.length],
            model: models[index % models.length],
            price: price,
            thumbnail_url: `https://images.unsplash.com/photo-${1485965120184 + index}?w=400&h=300&fit=crop`, // Bike images
            views_count: Math.floor(Math.random() * 500) + 10,

            // New fields for redesigned cards
            category: categories[index % categories.length],
            condition: index % 2 === 0 ? 'new' : 'used',
            location: locations[index % locations.length],
            year: 2020 + (index % 4),
            is_featured: index % 4 === 0, // Every 4th item is featured
            discount_percentage: discountPercentage,
            original_price: originalPrice,
        };
    });
}

// Mock data storage
const MOCK_LISTINGS = generateMockListings(24);

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
