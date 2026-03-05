/**
 * StatusBadge Component
 * Reusable badge component for displaying listing status
 * 
 * Usage:
 * <StatusBadge status="PENDING" />
 * <StatusBadge status="APPROVE" size="sm" />
 */

import React from 'react';
import { getStatusColors, type ListingStatus } from '@/app/constants/statusColors';

interface StatusBadgeProps {
    status: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    showLabel?: boolean; // Use label instead of raw status
}

const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
} as const;

export const StatusBadge: React.FC<StatusBadgeProps> = ({
    status,
    size = 'md',
    className = '',
    showLabel = false,
}) => {
    const colors = getStatusColors(status);
    const displayText = showLabel && colors.label ? colors.label : status;

    return (
        <span
            className={`
                inline-flex items-center justify-center
                rounded-full font-bold
                ${colors.bg} ${colors.text}
                ${sizeClasses[size]}
                ${className}
            `.trim()}
        >
            {displayText}
        </span>
    );
};

export default StatusBadge;
