import { DeliveryFilter } from '@/app/types/shipper';

/**
 * Shared delivery utility functions for Shipper pages (S-61, S-62)
 * Extracted to avoid DRY violations across list and detail pages.
 */

const VALID_FILTERS: DeliveryFilter[] = ['ALL', 'ASSIGNED', 'IN_PROGRESS', 'DELIVERED', 'FAILED'];

/**
 * Validate and parse a URL status parameter into a DeliveryFilter.
 * Returns 'ALL' if the value is invalid or missing.
 */
export function parseDeliveryFilter(value: string | null): DeliveryFilter {
    if (!value) return 'ALL';
    return VALID_FILTERS.includes(value as DeliveryFilter)
        ? (value as DeliveryFilter)
        : 'ALL';
}

/** Get Tailwind CSS classes for a delivery status badge */
export function getStatusColor(status: string): string {
    switch (status) {
        case 'ASSIGNED': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'IN_PROGRESS': return 'bg-orange-100 text-orange-800 border-orange-200';
        case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200';
        case 'FAILED': return 'bg-red-100 text-red-800 border-red-200';
        default: return 'bg-gray-100 text-gray-800';
    }
}

/** Get Vietnamese label for a delivery status */
export function getStatusLabel(status: string): string {
    switch (status) {
        case 'ASSIGNED': return 'Mới phân công';
        case 'IN_PROGRESS': return 'Đang giao';
        case 'DELIVERED': return 'Đã giao thành công';
        case 'FAILED': return 'Giao thất bại';
        default: return status;
    }
}
