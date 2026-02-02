/**
 * Type definitions for Bike Listing objects and API responses
 * Used across S-01 Home, S-32 Detail, and future listing-related screens
 */

/**
 * Represents a single bike listing
 * Maps to BikeListings table in backend
 */
export interface Listing {
    listingId: number;          // Changed from listing_id
    title: string;
    price: number;
    imageUrl: string;           // Changed from thumbnail_url (matches backend)
    locationCity: string | null; // Changed from location (matches backend)

    // Optional fields (missing in current backend)
    brand?: string;
    model?: string;
    viewsCount?: number;        // Changed from views_count
    category?: string;
    condition?: 'new' | 'used';
    year?: number;
    isFeatured?: boolean;       // Changed from is_featured
    discountPercentage?: number; // Changed from discount_percentage
    originalPrice?: number;     // Changed from original_price
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
 */
export interface HomeBike {
    listingId: number;           // Matches backend
    title: string;               // Matches backend
    price: number;               // Matches backend
    imageUrl: string;            // Matches backend
    locationCity: string | null; // Matches backend
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
 * Filter state for S-31 Listing Results page
 * Based on BR-S30-02: Supported filters
 */
export interface SearchFilters {
    keyword?: string;
    minPrice?: number;
    maxPrice?: number;
    bikeTypes?: string[];      // e.g., ["Xe Đạp Địa Hình", "Xe Đạp Đua"]
    brands?: string[];         // e.g., ["Giant", "Trek"]
    conditions?: ('new' | 'used')[];  // Multiple conditions: ["new", "used"]
}

/**
 * Sort options for search results
 * Based on BR-S30-05: Sorting support
 */
export type SortOption = 'newest' | 'priceAsc' | 'priceDesc' | 'mostViewed';

/**
 * Search API response structure
 * Uses HomeBike format (camelCase) as per actual API
 */
export interface SearchResponse {
    items: HomeBike[];
    pagination: PaginationInfo;
}

/**
 * API response structure for home listings endpoint
 * Endpoint: GET /api/home/listings
 */
export interface ListingsResponse {
    items: Listing[];
    pagination: PaginationInfo;
}

/**
 * Listing status values
 * Based on BP1-BP3 business processes
 */
export type ListingStatus =
    | 'DRAFT'          // BP1: Created but not submitted
    | 'PENDING'        // BP1: Submitted, awaiting inspection
    | 'REVIEWING'      // BP2: Under inspector review
    | 'NEED_MORE_INFO' // BP2/BP4: Inspector requested more info
    | 'APPROVED'       // BP2: Approved by inspector → Public can view (BP3)
    | 'REJECTED'       // BP2: Rejected by inspector
    | 'HELD'           // BP5: Reserved by buyer
    | 'SOLD';          // BP6: Transaction completed

/**
 * Inspection status for bike product
 * Part of BR-S32-03: Inspection information display
 */
export type InspectionStatus = 'PASSED' | 'FAILED' | 'PENDING' | null;

/**
 * Full listing detail for S-32 Listing Detail page
 * Endpoint: GET /api/listings/{id}
 * 
 * Business Rules:
 * - BR-S32-01: Only APPROVED listings accessible to Guest/Buyer
 * - BR-S32-02: Returns full bike product data
 * - BR-S32-03: Includes inspection information
 * - BR-S32-04: Backend auto-increments views_count on GET
 */
export interface ListingDetail {
    // Core listing info (camelCase to match backend)
    listingId: number;              // ✅ Backend has
    title: string;                  // ✅ Backend has
    price: number;                  // ✅ Backend has
    description: string | null;     // ✅ Backend has (can be null)

    // Bike specifications
    brand: string;                  // ✅ Backend has
    bikeType: string | null;        // ✅ Backend has (can be null)
    images: string[];               // ✅ Backend has
    locationCity: string | null;    // ✅ Backend has (can be null)
    viewsCount: number;             // ✅ Backend has

    // Optional fields (not in current backend - make optional)
    model?: string;                 // ⚠️ Missing in backend
    condition?: 'new' | 'used';     // ⚠️ Missing in backend
    status?: ListingStatus;         // ⚠️ Missing in backend

    // Inspection info (BR-S32-03) - all optional
    inspectionStatus?: InspectionStatus;
    inspectionDate?: string | null;
    inspectionNotes?: string | null;

    // Seller info (S-33 future) - all optional
    sellerId?: number;
    sellerName?: string;
}

/**
 * Validates API response data for ListingDetail
 * Per user requirement: "Không bao giờ tin BE hoàn toàn"
 * 
 * @throws Error if required fields missing or invalid types
 */
export function validateListingDetail(data: any): ListingDetail {
    // Check required fields exist (only fields backend actually provides)
    if (!data || typeof data !== 'object') {
        throw new Error('Invalid listing data: not an object');
    }

    // Only validate fields that backend actually returns
    const required = ['listingId', 'title', 'price', 'brand', 'viewsCount'];
    for (const field of required) {
        if (data[field] === undefined) {
            throw new Error(`Invalid listing data: missing field '${field}'`);
        }
    }

    // Type validations
    if (typeof data.listingId !== 'number') {
        throw new Error('Invalid listing data: listingId must be number');
    }

    if (typeof data.price !== 'number' || data.price < 0) {
        throw new Error('Invalid listing data: price must be non-negative number');
    }

    // Handle images field: use provided value or default to empty array
    const images = Array.isArray(data.images) ? data.images : [];

    // Optional field validations (only if present)
    if (data.condition && data.condition !== 'new' && data.condition !== 'used') {
        throw new Error('Invalid listing data: condition must be "new" or "used"');
    }

    if (data.status) {
        const validStatuses: ListingStatus[] = [
            'DRAFT', 'PENDING', 'REVIEWING', 'NEED_MORE_INFO',
            'APPROVED', 'REJECTED', 'HELD', 'SOLD'
        ];
        if (!validStatuses.includes(data.status)) {
            throw new Error(`Invalid listing data: status must be one of ${validStatuses.join(', ')}`);
        }
    }

    return {
        ...data,
        images
    } as ListingDetail;
}
