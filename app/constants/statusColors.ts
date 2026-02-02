/**
 * Listing Status Colors
 * Centralized styling for listing status badges across the application
 * 
 * Usage:
 * import { STATUS_COLORS, ListingStatus } from '@/app/constants/statusColors';
 * const colors = STATUS_COLORS[status];
 */

export type ListingStatus = 'DRAFT' | 'PENDING' | 'REVIEWING' | 'APPROVE' | 'REJECT' | 'ACTIVE' | 'SOLD';

export interface StatusColorConfig {
    bg: string;
    text: string;
    label?: string; // Optional display label override
}

export const STATUS_COLORS: Record<ListingStatus, StatusColorConfig> = {
    DRAFT: {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        label: 'Draft'
    },
    PENDING: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        label: 'Pending'
    },
    REVIEWING: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        label: 'Reviewing'
    },
    APPROVE: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: 'Approved'
    },
    REJECT: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        label: 'Rejected'
    },
    ACTIVE: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: 'Active'
    },
    SOLD: {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        label: 'Sold'
    },
} as const;

/**
 * Get status color config with fallback for unknown status
 */
export function getStatusColors(status: string): StatusColorConfig {
    return STATUS_COLORS[status as ListingStatus] || STATUS_COLORS.DRAFT;
}
