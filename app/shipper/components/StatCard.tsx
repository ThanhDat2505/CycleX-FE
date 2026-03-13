'use client';

import { DeliverySummary } from '@/app/types/shipper';
import { MESSAGES } from '@/app/constants/messages';
import {
    Package,
    Truck,
    AlertCircle,
    ArrowRight
} from 'lucide-react';

interface StatCardProps {
    id: string;
    label: string;
    value: number;
    subtext: string;
    icon: typeof Package;
    bgColor: string;
    textColor: string;
    borderColor: string;
    onClick: () => void;
}

/** Single stat card on the Shipper Dashboard */
export function StatCard({
    label, value, subtext, icon: Icon,
    bgColor, textColor, borderColor, onClick
}: StatCardProps) {
    return (
        <div
            onClick={onClick}
            className={`bg-white rounded-xl shadow-sm border ${borderColor} p-6 relative overflow-hidden group hover:shadow-md transition-all cursor-pointer`}
        >
            <div className={`absolute right-0 top-0 w-24 h-24 ${bgColor} rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 opacity-50`} />

            <div className="relative z-10 flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{label}</p>
                    <div className="flex items-baseline gap-2 mt-2">
                        <p className={`text-4xl font-bold ${textColor}`}>{value}</p>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        {subtext}
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity -ml-1 group-hover:ml-0" />
                    </p>
                </div>
                <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center ${textColor}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
}

/** Build stats config array from summary data */
export function buildStatsConfig(summary: DeliverySummary) {
    return [
        {
            id: 'assigned',
            label: MESSAGES.S60_STAT_ASSIGNED_LABEL,
            value: summary.assigned,
            subtext: MESSAGES.S60_STAT_ASSIGNED_SUBTEXT,
            icon: Package,
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600',
            borderColor: 'border-blue-100',
            statusFilter: 'ASSIGNED'
        },
        {
            id: 'inProgress',
            label: MESSAGES.S60_STAT_IN_PROGRESS_LABEL,
            value: summary.inProgress,
            subtext: MESSAGES.S60_STAT_IN_PROGRESS_SUBTEXT,
            icon: Truck,
            bgColor: 'bg-orange-50',
            textColor: 'text-orange-600',
            borderColor: 'border-orange-100',
            statusFilter: 'IN_PROGRESS'
        },
        {
            id: 'failed',
            label: MESSAGES.S60_STAT_FAILED_LABEL,
            value: summary.failed,
            subtext: MESSAGES.S60_STAT_FAILED_SUBTEXT,
            icon: AlertCircle,
            bgColor: 'bg-red-50',
            textColor: 'text-red-600',
            borderColor: 'border-red-100',
            statusFilter: 'FAILED'
        }
    ];
}
