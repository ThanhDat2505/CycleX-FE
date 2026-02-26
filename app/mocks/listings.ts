/**
 * Mock Data - Listings
 * Full bike listing data for pagination/search features
 * Used when NEXT_PUBLIC_MOCK_API=true
 */

import { Listing, ListingDetail, ListingStatus } from '../types/listing';
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
            listingId: index + 1,                  // Changed from listing_id
            title: `${brands[index % brands.length]} ${models[index % models.length]} ${2020 + (index % 4)}`,
            price: price,
            imageUrl: `https://images.unsplash.com/photo-${1485965120184 + index}?w=400&h=300&fit=crop`, // Changed from thumbnail_url
            locationCity: locations[index % locations.length], // Changed from location

            // Optional fields
            brand: brands[index % brands.length],
            model: models[index % models.length],
            viewsCount: Math.floor(Math.random() * 500) + 10, // Changed from views_count
            category: categories[index % categories.length],
            condition: index % 2 === 0 ? 'new' : 'used',
            year: 2020 + (index % 4),
            isFeatured: index % 4 === 0,           // Changed from is_featured
            discountPercentage: discountPercentage, // Changed from discount_percentage
            originalPrice: originalPrice,          // Changed from original_price
        };
    });
}

/**
 * Pre-generated mock listings (50 items for pagination testing)
 * Used by listingService for consistent data across requests
 */
export const MOCK_LISTINGS = generateMockListings(50);

/**
 * Mock listing details for S-32 Detail Page testing
 * Auto-generated for all MOCK_LISTINGS + manual test cases
 */
function generateMockListingDetails(): ListingDetail[] {
    const brands = ['Giant', 'Trek', 'Specialized', 'Cannondale', 'Scott', 'Merida'];
    const models = ['Escape 3', 'FX 2', 'Sirrus', 'Quick CX', 'Speedster', 'Scultura'];
    const bikeTypes = ['Xe Đạp Địa Hình', 'Xe Đạp Hybrid', 'Xe Đạp Đua', 'Xe Đạp Thành Phố'];
    const locations = ['Hà Nội', 'TP.HCM', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ', null]; // null for testing
    const imagePool = [
        'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1559527022-f2d223ea2a4c?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1505705694394-019926e44cfc?w=800&h=600&fit=crop',
    ];

    const descriptions = [
        'Xe đạp cao cấp trong tình trạng tốt. Thích hợp cho cả đường phố và địa hình nhẹ. Frame nhôm cao cấp, phanh đĩa thủy lực.',
        'Xe đạp hybrid hiệu suất cao với bộ truyền động Shimano, phù hợp cho việc di chuyển hàng ngày và tập luyện.',
        'Xe đạp thể thao chuyên nghiệp, thiết kế aerodynamic, trọng lượng nhẹ, tốc độ cao.',
        null, // Test null description
    ];

    // Generate 50 normal listings
    const generated = Array.from({ length: 50 }, (_, index): ListingDetail => {
        const id = index + 1;
        const brand = brands[index % brands.length];
        const model = models[index % models.length];
        const price = Math.floor(Math.random() * 15000000) + 5000000;
        const numImages = Math.floor(Math.random() * 4) + 1; // 1-4 images
        const images = Array.from({ length: numImages }, (_, i) =>
            imagePool[(index + i) % imagePool.length]
        );

        return {
            listingId: id,
            title: `${brand} ${model} ${2020 + (index % 4)}`,
            description: descriptions[index % descriptions.length],
            price,
            brand,
            model,
            bikeType: index % 5 === 0 ? null : bikeTypes[index % bikeTypes.length], // 20% null
            condition: index % 2 === 0 ? 'new' : 'used',
            images,
            locationCity: locations[index % locations.length],
            viewsCount: Math.floor(Math.random() * 500) + 10,
            status: 'APPROVED',

            // Inspection info (50% chance)
            ...(index % 2 === 0 && {
                inspectionStatus: index % 3 === 0 ? 'PASSED' : 'PENDING',
                inspectionDate: `2024-01-${String(index % 28 + 1).padStart(2, '0')}`,
                inspectionNotes: index % 3 === 0 ? 'Xe trong tình trạng tốt, tất cả bộ phận hoạt động bình thường' : undefined,
            }),

            sellerId: 100 + (index % 10),
            sellerName: `Người bán ${index % 10 + 1}`,
        };
    });

    // Add special test cases
    const testCases: ListingDetail[] = [
        // ID 999: DRAFT status (for testing BR-S32-01 validation)
        {
            listingId: 999,
            title: 'Test Listing - DRAFT',
            description: 'This should NOT be accessible',
            price: 10000000,
            brand: 'Test Brand',
            bikeType: 'Test Type',
            condition: 'new',
            images: ['https://via.placeholder.com/800x600'],
            locationCity: 'Test City',
            viewsCount: 0,
            status: 'DRAFT',
        },
        // ID 998: SOLD status (for testing BR-S32-01 validation)
        {
            listingId: 998,
            title: 'Test Listing - SOLD',
            description: 'This should NOT be accessible',
            price: 10000000,
            brand: 'Test Brand',
            bikeType: 'Test Type',
            condition: 'new',
            images: ['https://via.placeholder.com/800x600'],
            locationCity: 'Test City',
            viewsCount: 100,
            status: 'SOLD',
        },
    ];

    return [...generated, ...testCases];
}

export const MOCK_LISTING_DETAILS: ListingDetail[] = generateMockListingDetails();
