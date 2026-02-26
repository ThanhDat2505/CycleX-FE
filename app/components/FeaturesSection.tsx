/**
 * FeaturesSection Component
 * Displays 4 key features/benefits of the CycleX platform
 * Based on Figma mockup design
 */

import React from 'react';
import SectionHeader from './ui/SectionHeader';
import { PLATFORM_FEATURES } from '../constants/features';

/** Style constants — tách riêng để JSX gọn gàng */
const STYLES = {
    section: 'py-16 bg-gray-50',
    container: 'container mx-auto px-4',
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8',
    card: 'bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow',
    iconWrapper: 'inline-flex items-center justify-center w-20 h-20 bg-brand-primary bg-opacity-10 rounded-full text-brand-primary mb-4',
    title: 'text-lg font-bold text-gray-800 mb-2',
    description: 'text-sm text-gray-600',
} as const;

export default function FeaturesSection() {
    return (
        <section className={STYLES.section}>
            <div className={STYLES.container}>
                {/* Section Title */}
                <SectionHeader
                    title="Tại Sao Chọn CycleX?"
                    description="Nền tảng mua bán xe đạp uy tín với hệ thống kiểm định chuyên nghiệp"
                />

                {/* Features Grid */}
                <div className={STYLES.grid}>
                    {PLATFORM_FEATURES.map((feature, index) => (
                        <div key={index} className={STYLES.card}>
                            <div className={STYLES.iconWrapper}>
                                {feature.icon}
                            </div>
                            <h3 className={STYLES.title}>{feature.title}</h3>
                            <p className={STYLES.description}>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
