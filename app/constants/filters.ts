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
 * Bike types for filter UI - value is apiValue sent to BE, label is display name
 */
export const BIKE_TYPES = BIKE_CATEGORIES.map(c => ({
    value: c.apiValue,
    label: c.name,
}));

/** Legacy: array of display names (for backward compat) */
export const BIKE_TYPE_NAMES = BIKE_CATEGORIES.map(c => c.name);

/**
 * Condition options matching BE stored values
 */
export const CONDITION_OPTIONS = [
    { value: 'New', label: 'Mới (New)' },
    { value: 'Like New', label: 'Như mới (Like New)' },
    { value: 'Excellent', label: 'Rất tốt (Excellent)' },
    { value: 'Good', label: 'Tốt (Good)' },
    { value: 'Fair', label: 'Khá (Fair)' },
    { value: 'Used', label: 'Đã sử dụng (Used)' },
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
