/**
 * Pagination Constants
 * Centralized pagination configuration
 */

export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 12,
    SCROLL_OFFSET: 100,
    SCROLL_DELAY: 100,
} as const;

/**
 * Items per page for paginated lists
 * Used in My Listings, Dashboard, etc.
 */
export const ITEMS_PER_PAGE = 12;

/**
 * Mock API delay for development
 */
export const API_DELAY_MS = 800;

/**
 * Valid listing statuses for filtering
 */
export const VALID_LISTING_STATUSES = ['DRAFT', 'PENDING', 'APPROVE', 'REJECT'] as const;
export type ListingStatus = typeof VALID_LISTING_STATUSES[number];
