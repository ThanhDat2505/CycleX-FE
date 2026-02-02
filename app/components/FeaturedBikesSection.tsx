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

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { HomeBike } from '../types/listing';
import FeaturedBikeCard from './FeaturedBikeCard';
import Badge from './ui/Badge';
import { generateMockHomeBikes } from '../services/mockData';

const MAX_FEATURED_BIKES = 6;

export default function FeaturedBikesSection() {
    const [bikes, setBikes] = useState<HomeBike[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchFeaturedBikes();
    }, []);

    /**
     * Fetch featured bikes from /backend/api/home
     * Falls back to mock data if USE_MOCK_API is enabled
     */
    const fetchFeaturedBikes = async () => {
        setLoading(true);
        setError(null);

        // Use mock data in development
        if (process.env.NEXT_PUBLIC_MOCK_API === 'true') {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500));
            setBikes(generateMockHomeBikes());
            setLoading(false);
            return;
        }

        // Real API call
        try {
            const response = await fetch('/backend/api/home');

            if (!response.ok) {
                throw new Error('Failed to fetch featured bikes');
            }

            const data: HomeBike[] = await response.json();

            // Limit to 6 bikes for Home preview
            setBikes(data.slice(0, MAX_FEATURED_BIKES));
        } catch (err) {
            setError('Không thể tải danh sách xe. Vui lòng thử lại sau.');
            console.error('Error fetching featured bikes:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="container mx-auto px-4 py-12">
            {/* Section Header */}
            <div className="text-center mb-12">
                <Badge icon="🔥" text="Nổi Bật" className="mb-4" />
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                    Xe Đạp Đang Hot
                </h2>
                <p className="text-gray-600">
                    Những chiếc xe đạp được quan tâm nhiều nhất tuần này
                </p>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
                    {error}
                </div>
            )}

            {/* Bikes Grid */}
            {!loading && !error && bikes.length > 0 && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {bikes.map((bike) => (
                            <Link
                                key={bike.listingId}
                                href={`/listings/${bike.listingId}`}
                            >
                                <FeaturedBikeCard bike={bike} />
                            </Link>
                        ))}
                    </div>

                    {/* CTA Button */}
                    <div className="text-center">
                        <Link
                            href="/listings"
                            className="inline-flex items-center gap-2 bg-brand-primary hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
                        >
                            Xem thêm xe
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                </>
            )}

            {/* Empty State */}
            {!loading && !error && bikes.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">Chưa có xe nào để hiển thị</p>
                </div>
            )}
        </section>
    );
}
