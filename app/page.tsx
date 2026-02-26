/**
 * ===========================================
 * S-01 HOME PAGE (Trang Chủ)
 * ===========================================
 * Route: / (root)
 * File: app/page.tsx (Next.js App Router convention)
 *
 * Public page displaying featured bikes preview with "Xem thêm xe" CTA.
 * Business Rules: BR-H01 through BR-H05
 *
 * Sections included:
 * - Header (navigation, auth)
 * - HeroSection (search, stats)
 * - FeaturesSection (why choose us)
 * - FeaturedBikesSection (6 bikes preview, no pagination)
 * - CategorySection (browse by category)
 * - Footer (links, contact)
 */

'use client';

import React, { useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import FeaturedBikesSection from './components/FeaturedBikesSection';
import CategorySection from './components/CategorySection';
import Footer from './components/Footer';
import { useAuth } from './hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function Home() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && user?.role === 'SHIPPER') {
            router.replace('/shipper');
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return <div className="min-h-screen bg-white" />; // Prevent flash of content
    }

    if (user?.role === 'SHIPPER') {
        return null; // Don't render home for Shipper
    }

    return (
        <div className="min-h-screen bg-white">

            {/* Hero Section */}
            <HeroSection />

            {/* Features Section */}
            <FeaturesSection />

            {/* Featured Bikes - "Xe Đạp Đang Hot" */}
            <FeaturedBikesSection />

            {/* Category Section */}
            <CategorySection />


        </div>
    );
}
