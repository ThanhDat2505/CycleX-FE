import React from 'react';

interface LoadingSpinnerProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    color?: 'primary' | 'white' | 'gray';
}

const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
    xl: 'w-12 h-12 border-4',
};

const colors = {
    primary: 'border-orange-600 border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-400 border-t-transparent',
};

export function LoadingSpinner({
    className = '',
    size = 'md',
    color = 'primary',
}: LoadingSpinnerProps) {
    return (
        <div
            className={`
                animate-spin rounded-full
                ${sizes[size]}
                ${colors[color]}
                ${className}
            `}
        />
    );
}
