/**
 * Type definitions for Bike Listing objects and API responses
 * Used across S-01 Home, S-32 Detail, and future listing-related screens
 */

/**
 * Represents a single bike listing
 * Maps to BikeListings table in backend
 */
export interface Listing {
    listing_id: number;
    title: string;
    brand: string;
    model: string;
    price: number;
    thumbnail_url: string;
    views_count: number;

    // New fields for redesigned cards
    category?: string;              // e.g., "Xe Đạp Địa Hình"
    condition?: 'new' | 'used';     // "Như mới" or "Đã sử dụng"
    location?: string;              // e.g., "Hà Nội"
    year?: number;                  // e.g., 2023
    is_featured?: boolean;          // Show "NỔI BẬT" badge
    discount_percentage?: number;   // e.g., 15 for 15% off
    original_price?: number;        // Price before discount
}

/**
 * Pagination metadata for listing responses
 */
export interface PaginationInfo {
    page: number;
    pageSize: number;
    total: number;
}

/**
 * Simplified bike data from /api/home endpoint
 * Used for Home page "Xe Đạp Đang Hot" section preview
 * Official API: GET /api/home
 */
export interface HomeBike {
    listingId: number;
    title: string;
    price: number;
    imageUrl: string;
    locationCity: string | null;
    viewCount: number;  // Used to display hot bikes (sorted by view count descending)
}

/**
 * Search parameters for filtering listings
 * Used by search form to navigate to Listing List (S-31)
 */
export interface SearchParams {
    keyword?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    qualifiedOnly?: boolean;
}

/**
 * API response structure for home listings endpoint
 * Endpoint: GET /api/home/listings
 */
export interface ListingsResponse {
    items: Listing[];
    pagination: PaginationInfo;
}
