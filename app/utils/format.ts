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

/**
 * Normalize phone number to Vietnamese format (0xxxxxxxxx)
 * Handles +84, 84 prefixes
 */
export const normalizePhoneNumber = (phone: string): string => {
    if (!phone) return '';

    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '');

    // Replace 84 prefix with 0 if it exists
    if (cleaned.startsWith('84')) {
        cleaned = '0' + cleaned.slice(2);
    }

    // Ensure it starts with 0 if it's not empty without 84
    if (cleaned.length > 0 && !cleaned.startsWith('0')) {
        // This is a heuristic, if it's 9 digits, assume it's missing 0
        if (cleaned.length === 9) {
            cleaned = '0' + cleaned;
        }
    }

    return cleaned;
};

/**
 * Format date to Vietnamese format (dd/MM/yyyy HH:mm)
 */
export const formatDate = (dateString: string | Date): string => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};
