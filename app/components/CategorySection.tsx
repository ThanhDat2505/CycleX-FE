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

/** Style constants — tách riêng để JSX gọn gàng */
const STYLES = {
    section: 'py-24 bg-gray-50/50',
    container: 'container mx-auto px-6',
    grid: 'grid grid-cols-2 md:grid-cols-4 gap-6',
    card: 'relative group bg-white rounded-3xl p-8 text-center transition-all duration-500 border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 overflow-hidden animate-fade-in',
    hoverGradient: 'absolute inset-0 bg-gradient-to-br from-brand-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500',
    icon: 'relative z-10 text-5xl mb-6 transform group-hover:scale-125 group-hover:rotate-12 transition-transform duration-500',
    title: 'relative z-10 font-bold text-gray-800 text-lg mb-2 group-hover:text-brand-primary transition-colors',
    countBadge: 'relative z-10 inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-bold group-hover:bg-brand-primary group-hover:text-white transition-all',
    cornerDecor: 'absolute -bottom-4 -right-4 w-12 h-12 bg-brand-primary/5 rounded-full group-hover:scale-[4] transition-transform duration-700',
} as const;

export default function CategorySection() {
    return (
        <section className={STYLES.section}>
            <div className={STYLES.container}>
                {/* Section Header */}
                <SectionHeader
                    badge={{ icon: '🚲', text: 'Khám Phá' }}
                    title="Danh Mục Xe Đạp"
                    description="Tìm kiếm chiếc xe phù hợp nhất với phong cách và đam mê của bạn thông qua hệ thống danh mục đa dạng."
                />

                {/* Categories Grid */}
                <div className={STYLES.grid}>
                    {BIKE_CATEGORIES.map((category, index) => (
                        <Link
                            key={index}
                            href={`/listings?category=${category.slug}`}
                            className={STYLES.card}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className={STYLES.hoverGradient} />
                            <div className={STYLES.icon}>{category.icon}</div>
                            <h3 className={STYLES.title}>{category.name}</h3>
                            <div className={STYLES.countBadge}>{category.count} sản phẩm</div>
                            <div className={STYLES.cornerDecor} />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
