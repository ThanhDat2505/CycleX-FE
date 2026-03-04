/**
 * FeaturedBikesSection Component
 * "Xe Đạp Đang Hot" section for Home page
 *
 * Features:
 * - Displays 6 bikes max (from /api/home)
 * - NO pagination
 * - Grid layout: 3 columns desktop, 2 tablet, 1 mobile
 * - Single CTA "Xem thêm xe" linking to full listing page
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getFeaturedBikes } from '../services/listingService';
import { HomeBike } from '../types/listing';
import FeaturedBikeCard from './FeaturedBikeCard';
import SectionHeader from './ui/SectionHeader';
import BikeSkeleton from './ui/BikeSkeleton';

const MAX_FEATURED_BIKES = 6;
const SKELETON_DELAY_MS = 300;

/** Style constants — tách riêng để JSX gọn gàng */
const STYLES = {
    section: 'container mx-auto px-6 py-20',
    errorBox: 'bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl text-center animate-fade-in',
    grid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8',
    emptyState: 'col-span-full text-center py-20 text-gray-500 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200',
    ctaWrapper: 'text-center mt-16 animate-slide-up',
    ctaButton: 'inline-flex items-center gap-3 bg-brand-bg text-white px-10 py-4 rounded-full font-bold hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 group',
    ctaArrow: 'w-5 h-5 group-hover:translate-x-1 transition-transform',
} as const;

export default function FeaturedBikesSection() {
    const [bikes, setBikes] = useState<HomeBike[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchFeaturedBikes = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await getFeaturedBikes();

                if (isMounted) {
                    setBikes(data.slice(0, MAX_FEATURED_BIKES));
                }
            } catch {
                if (isMounted) {
                    setError('Không thể tải danh sách xe. Vui lòng thử lại sau.');
                }
            } finally {
                if (isMounted) {
                    setTimeout(() => {
                        if (isMounted) setLoading(false);
                    }, SKELETON_DELAY_MS);
                }
            }
        };

        fetchFeaturedBikes();

        return () => {
            isMounted = false;
        };
    }, []);

    const gridClassName = `${STYLES.grid} ${loading ? '' : 'animate-fade-in'}`;

    return (
        <section className={STYLES.section}>
            {/* Section Header */}
            <SectionHeader
                badge={{ icon: '🔥', text: 'Săn Xe Giá Tốt' }}
                title="Xe Đạp Đang Hot"
                description="Khám phá những mẫu xe đạp thể thao được cộng đồng quan tâm nhất tuần qua. Chất lượng đỉnh cao, giá thành hợp lý."
            />

            {/* Error State */}
            {error && (
                <div className={STYLES.errorBox}>{error}</div>
            )}

            {/* Content Grid */}
            <div className={gridClassName}>
                {loading ? (
                    [...Array(MAX_FEATURED_BIKES)].map((_, i) => (
                        <BikeSkeleton key={i} />
                    ))
                ) : bikes.length > 0 ? (
                    bikes.map(bike => (
                        <FeaturedBikeCard key={bike.listingId} bike={bike} />
                    ))
                ) : (
                    <div className={STYLES.emptyState}>
                        Chưa có xe nào để hiển thị
                    </div>
                )}
            </div>

            {/* CTA */}
            {!loading && bikes.length > 0 && !error && (
                <div className={STYLES.ctaWrapper}>
                    <Link href="/listings" className={STYLES.ctaButton}>
                        <span>Xem thêm xe</span>
                        <svg className={STYLES.ctaArrow} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            )}
        </section>
    );
}
