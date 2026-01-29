/**
 * Format Utility Functions
 * Centralized formatting logic for consistent display across components
 */

/**
 * Format number as Vietnamese currency (VND)
 */
export const formatPrice = (price: number, locale = 'vi-VN'): string => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'VND',
    }).format(price);
};

/**
 * Format number with locale-specific separators
 */
export const formatNumber = (num: number, locale = 'vi-VN'): string => {
    return new Intl.NumberFormat(locale).format(num);
};

/**
 * Format number with suffix (K, M, B)
 */
export const formatCompactNumber = (num: number): string => {
    if (num >= 1_000_000_000) {
        return `${(num / 1_000_000_000).toFixed(1)}B`;
    }
    if (num >= 1_000_000) {
        return `${(num / 1_000_000).toFixed(1)}M`;
    }
    if (num >= 1_000) {
        return `${(num / 1_000).toFixed(1)}K`;
    }
    return num.toString();
};
