/**
 * Mock Data - Home Bikes
 * Simplified bike data for Home page "Xe Đạp Đang Hot" section
 * Used when NEXT_PUBLIC_MOCK_API=true
 */

import { HomeBike } from '../types/listing';

/**
 * Generate mock home bikes data
 * Returns 6 bikes matching /api/home response format
 */
export function generateMockHomeBikes(): HomeBike[] {
    const bikes = [
        { id: 1, title: 'Giant Escape 3 2023', price: 8500000 },
        { id: 4, title: 'Trek FX 2 2022', price: 12000000 },
        { id: 5, title: 'Specialized Sirrus X 2024', price: 15500000 },
        { id: 10, title: 'Cannondale Quick 4 2023', price: 9800000 },
        { id: 18, title: 'Scott Speedster 40 2024', price: 18000000 },
        { id: 20, title: 'Merida Scultura 100 2023', price: 14200000 },
    ];

    return bikes.map((bike, index) => ({
        listingId: bike.id,
        title: bike.title,
        price: bike.price,
        imageUrl: `https://images.unsplash.com/photo-148596512018${bike.id}?w=400&h=300&fit=crop`,
        locationCity: bike.id % 2 === 0 ? 'Hà Nội' : null,
        viewCount: 150 - (index * 10),  // Descending view counts: 150, 140, 130, ...
    }));
}
