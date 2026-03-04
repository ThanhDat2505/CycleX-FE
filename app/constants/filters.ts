/**
 * Filter Constants
 * Defines available filter options for S-31 Listing Results page
 * Based on BR-S30-02: Supported filters
 */

import { BIKE_CATEGORIES } from './categories';

/**
 * Available bike brands for filter
 */
export const BIKE_BRANDS = [
    'Giant',
    'Trek',
    'Specialized',
    'Cannondale',
    'Scott',
    'Merida',
    'Bianchi',
    'Cervélo',
] as const;

export type BikeBrand = typeof BIKE_BRANDS[number];

/**
 * Bike types extracted from categories
 */
export const BIKE_TYPES = BIKE_CATEGORIES.map(c => c.name);

/**
 * Condition options
 */
export const CONDITION_OPTIONS = [
    { value: 'new', label: 'Như mới' },
    { value: 'used', label: 'Đã sử dụng' },
] as const;

/**
 * Sort options for search results (BR-S30-05)
 */
export const SORT_OPTIONS = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'priceAsc', label: 'Giá thấp đến cao' },
    { value: 'priceDesc', label: 'Giá cao đến thấp' },
    { value: 'mostViewed', label: 'Xem nhiều nhất' },
] as const;

/**
 * Default pagination values
 */
export const DEFAULT_PAGE_SIZE = 12;
export const DEFAULT_PAGE = 1;
