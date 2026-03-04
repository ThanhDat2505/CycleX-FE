/**
 * Badge Component
 * Reusable badge with icon and text
 * Used across: HeroSection, FeaturesSection, CategorySection, page.tsx
 */

import React from 'react';

interface BadgeProps {
    icon?: string;
    text: string;
    variant?: 'primary' | 'secondary';
    className?: string;
}

export default function Badge({
    icon,
    text,
    variant = 'primary',
    className = ''
}: BadgeProps) {
    const variantClasses = {
        primary: 'bg-brand-primary bg-opacity-10 border-brand-primary text-brand-primary',
        secondary: 'bg-gray-100 border-gray-300 text-gray-700',
    };

    return (
        <div
            className={`inline-flex items-center gap-2 border rounded-full px-4 py-2 ${variantClasses[variant]} ${className}`}
        >
            {icon && <span>{icon}</span>}
            <span className="text-sm font-medium">{text}</span>
        </div>
    );
}
