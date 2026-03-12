'use client';

import { MESSAGES } from '@/app/constants/messages';
import { DeliveryFilter, DeliverySummary } from '@/app/types/shipper';
import { getStatusLabel } from '@/app/utils/deliveryUtils';

interface DeliveryFilterBarProps {
    currentFilter: DeliveryFilter;
    stats: DeliverySummary | null;
    onFilterChange: (filter: DeliveryFilter) => void;
}

const FILTER_ORDER: DeliveryFilter[] = ['ALL', 'ASSIGNED', 'IN_PROGRESS', 'FAILED', 'DELIVERED'];

/** Get count for a specific status filter */
function getCount(stats: DeliverySummary | null, status: string): number {
    if (!stats) return 0;
    switch (status) {
        case 'ALL': return stats.assigned + stats.inProgress + stats.delivered + stats.failed;
        case 'ASSIGNED': return stats.assigned;
        case 'IN_PROGRESS': return stats.inProgress;
        case 'DELIVERED': return stats.delivered;
        case 'FAILED': return stats.failed;
        default: return 0;
    }
}

/** Filter tab bar with status counts */
export function DeliveryFilterBar({ currentFilter, stats, onFilterChange }: DeliveryFilterBarProps) {
    return (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {FILTER_ORDER.map((status) => {
                const count = getCount(stats, status);
                const isActive = currentFilter === status;

                return (
                    <button
                        key={status}
                        onClick={() => onFilterChange(status)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border flex items-center gap-2 ${isActive
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                            }`}
                    >
                        {status === 'ALL' ? MESSAGES.S61_FILTER_ALL : getStatusLabel(status)}
                        <span className={`px-1.5 py-0.5 rounded-full text-xs ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                            }`}>
                            {count}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
