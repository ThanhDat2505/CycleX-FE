import React from 'react';

interface EmptyStateProps {
    title?: string;
    description?: string;
    icon?: React.ReactNode;
    action?: React.ReactNode;
    className?: string;
}

export function EmptyState({
    title = 'Không có dữ liệu',
    description,
    icon,
    action,
    className = '',
}: EmptyStateProps) {
    return (
        <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                {icon || (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                )}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
                {title}
            </h3>
            {description && (
                <p className="text-gray-500 max-w-sm mb-6">
                    {description}
                </p>
            )}
            {action}
        </div>
    );
}
