/* eslint-disable @typescript-eslint/no-explicit-any */

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
    productId?: number;
    title: string;               // Matches backend
    price: number;               // Matches backend
    imageUrl: string;            // Matches backend
    locationCity: string | null; // Matches backend
    viewCount?: number;          // Optional popularity metric
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
    bikeTypes?: string[];
    brands?: string[];
    conditions?: string[];
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
    productId?: number;
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
    productStatus?: string;         // Product availability: AVAILABLE, RESERVED, SOLD

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

    // `brand` might sometimes be skipped or named differently depending on product variants.
    const required = ['listingId', 'title', 'price'];
    for (const field of required) {
        if (data[field] === undefined) {
            throw new Error(`Invalid listing data: missing field '${field}'`);
        }
    }

    // Type validations
    if (typeof data.listingId !== 'number') {
        throw new Error('Invalid listing data: listingId must be number');
    }

    const parsedPrice = typeof data.price === 'number' ? data.price : Number(data.price);
    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
        throw new Error('Invalid listing data: price must be non-negative number');
    }

    const normalizeCondition = (condition: unknown): 'new' | 'used' | undefined => {
        if (typeof condition !== 'string' || condition.trim().length === 0) {
            return undefined;
        }

        const normalized = condition.trim().toUpperCase();
        if (normalized.includes('NEW')) {
            return 'new';
        }
        return 'used';
    };

    if (data.status) {
        const validStatuses: ListingStatus[] = [
            'DRAFT', 'PENDING', 'REVIEWING', 'NEED_MORE_INFO',
            'APPROVED', 'REJECTED', 'HELD', 'SOLD'
        ];
        if (!validStatuses.includes(data.status)) {
            // Log but don't strictly throw if status is misaligned from API to prevent blank page
            console.warn(`Unexpected API listing status: ${data.status}`);
        }
    }

    const normalizeImageValue = (img: any): string => {
        if (typeof img === 'string') return img;
        if (img && typeof img === 'object') {
            return img.imageUrl || img.url || img.imagePath || '';
        }
        return '';
    };

    // Handle images field from multiple backend formats
    let images: string[] = [];
    if (Array.isArray(data.images)) {
        images = data.images.map(normalizeImageValue);
    } else if (Array.isArray(data.imageUrls)) {
        images = data.imageUrls.map(normalizeImageValue);
    } else if (data.imageUrl) {
        images = [data.imageUrl];
    }

    images = images.filter((img) => typeof img === 'string' && img.trim().length > 0);

    const productId = Number(data.productId);

    return {
        ...data,
        productId: Number.isFinite(productId) && productId > 0 ? productId : undefined,
        price: parsedPrice,
        images,
        condition: normalizeCondition(data.condition),
        // Fallback fields missing in some backend responses:
        viewsCount: typeof data.viewsCount === 'number' ? data.viewsCount :
            (typeof data.viewCount === 'number' ? data.viewCount : 0),
        brand: data.brand || 'Unknown Brand',
        status: data.status || 'APPROVED' // Default to APPROVED for public view if API omits it for some reason
    } as ListingDetail;
}

