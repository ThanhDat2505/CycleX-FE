/**
 * UI Configuration Constants
 * Magic numbers extracted to named constants
 */

export const UI_CONFIG = {
    // Pagination
    MAX_VISIBLE_PAGE_NUMBERS: 7,

    // Filters
    INITIAL_VISIBLE_ITEMS: 5, // Show first 5 items before "Show more"

    // Loading
    SEARCH_DELAY_MS: 500, // Simulated network delay for mock API
} as const;
