/**
 * Mock Data - Listings
 * Full bike listing data for pagination/search features
 * Used when NEXT_PUBLIC_MOCK_API=true
 */

import { Listing } from '../types/listing';
import { BIKE_CATEGORIES } from '../constants/categories';

/**
 * Generate mock listing data for development
 * @param count - Number of listings to generate (default: 24)
 */
export function generateMockListings(count: number = 24): Listing[] {
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
            thumbnail_url: `https://images.unsplash.com/photo-${1485965120184 + index}?w=400&h=300&fit=crop`,
            views_count: Math.floor(Math.random() * 500) + 10,

            // Additional fields for redesigned cards
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

/**
 * Pre-generated mock listings (24 items)
 * Used by listingService for consistent data across requests
 */
export const MOCK_LISTINGS = generateMockListings(24);
