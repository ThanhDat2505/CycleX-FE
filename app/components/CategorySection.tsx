/**
 * CategorySection Component
 * Displays bike categories for users to explore
 * Based on Figma mockup design
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { BIKE_CATEGORIES } from '../constants/categories';
import SectionHeader from './ui/SectionHeader';

export default function CategorySection() {

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <SectionHeader
                    badge={{ icon: '📁', text: 'Danh Mục' }}
                    title="Khám Phá Theo Loại Xe"
                    description="Tìm kiếm xe đạp phù hợp với nhu cầu và phong cách của bạn"
                />

                {/* Categories Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {BIKE_CATEGORIES.map((category, index) => (
                        <Link
                            key={index}
                            href={`/listings?category=${category.slug}`}
                            className="bg-gray-50 hover:bg-brand-primary hover:text-white rounded-lg p-6 text-center transition-all group border border-transparent hover:border-brand-primary"
                        >
                            {/* Icon */}
                            <div className="text-4xl mb-3">
                                {category.icon}
                            </div>

                            {/* Category Name */}
                            <h3 className="font-semibold text-gray-800 group-hover:text-white mb-2">
                                {category.name}
                            </h3>

                            {/* Count */}
                            <p className="text-sm text-gray-500 group-hover:text-white group-hover:text-opacity-90">
                                {category.count} xe
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
