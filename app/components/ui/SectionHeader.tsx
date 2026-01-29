/**
 * SectionHeader Component
 * Reusable section header with badge, title, and description
 * Used across: FeaturesSection, CategorySection, page.tsx
 */

import React from 'react';
import Badge from './Badge';

interface SectionHeaderProps {
    badge?: {
        icon: string;
        text: string;
    };
    title: string;
    description?: string;
    align?: 'left' | 'center';
    className?: string;
}

export default function SectionHeader({
    badge,
    title,
    description,
    align = 'center',
    className = ''
}: SectionHeaderProps) {
    const alignClass = align === 'center' ? 'text-center' : 'text-left';

    return (
        <div className={`mb-12 ${alignClass} ${className}`}>
            {badge && (
                <Badge
                    icon={badge.icon}
                    text={badge.text}
                    className="mb-4"
                />
            )}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                {title}
            </h2>
            {description && (
                <p className={`text-gray-600 ${align === 'center' ? 'max-w-2xl mx-auto' : ''}`}>
                    {description}
                </p>
            )}
        </div>
    );
}
