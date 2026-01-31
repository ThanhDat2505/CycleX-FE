/**
 * Application Constants
 * Centralized configuration values and magic numbers
 */

// Pagination
export const ITEMS_PER_PAGE = 10;

// API
export const API_DELAY_MS = 300;

// Listing
export const TOP_LISTINGS_LIMIT = 5;
export const VALID_LISTING_STATUSES = ['DRAFT', 'PENDING', 'REVIEWING', 'APPROVE', 'REJECT'] as const;

// Type for listing status
export type ListingStatus = typeof VALID_LISTING_STATUSES[number];
