/**
 * HeroSection Component
 * Large hero banner with background image and stats
 * Search has been moved to Header (global search icon)
 */

'use client';

import React from 'react';

const HERO_STATS = [
    { value: '2,500+', label: 'Xe Đăng Bán' },
    { value: '1,200+', label: 'Giao Dịch' },
    { value: '98%', label: 'Hài Lòng' },
] as const;

const HERO_BG_IMAGE = 'url(https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=1920&q=80)';
const DECORATIVE_IMAGE = 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80';

/** Style constants — tách riêng để JSX gọn gàng */
const STYLES = {
    section: 'relative bg-brand-bg text-white overflow-hidden min-h-[600px] flex items-center',
    bgImage: 'w-full h-full bg-cover bg-center transition-transform duration-1000 scale-105',
    bgOverlay: 'absolute inset-0 bg-gradient-to-r from-brand-bg via-brand-bg/90 to-transparent',
    container: 'relative z-10 container mx-auto px-6 md:px-12 lg:px-20 py-20',
    grid: 'grid lg:grid-cols-2 gap-12 items-center',
    content: 'max-w-2xl animate-slide-up',
    badge: 'inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-8 shadow-xl',
    badgeIcon: 'text-brand-primary animate-pulse',
    badgeText: 'text-sm font-semibold tracking-wide uppercase',
    heading: 'text-5xl md:text-6xl lg:text-7xl font-extrabold mb-8 leading-[1.1] tracking-tight',
    headingHighlight: 'text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-blue-400',
    description: 'text-xl text-gray-300 mb-12 leading-relaxed max-w-xl',
    statsCard: 'inline-grid grid-cols-3 gap-10 p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl',
    statValue: 'text-3xl md:text-4xl font-black text-brand-primary mb-2 group-hover:scale-110 transition-transform',
    statLabel: 'text-xs font-bold text-gray-400 uppercase tracking-widest leading-tight',
    decorativeWrapper: 'hidden lg:block relative animate-fade-in delay-300',
    decorativeGlow: 'absolute -inset-10 bg-brand-primary/20 blur-[100px] rounded-full animate-pulse',
    decorativeFrame: 'relative z-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-4 shadow-2xl transform hover:rotate-2 transition-transform duration-500',
    decorativeImageWrapper: 'aspect-[4/3] rounded-2xl overflow-hidden shadow-inner',
    decorativeImage: 'w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700',
} as const;

export default function HeroSection() {
    return (
        <section id="hero-section" className={STYLES.section}>
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <div
                    className={STYLES.bgImage}
                    style={{ backgroundImage: HERO_BG_IMAGE }}
                />
                <div className={STYLES.bgOverlay} />
            </div>

            {/* Content Container */}
            <div className={STYLES.container}>
                <div className={STYLES.grid}>
                    <div className={STYLES.content}>
                        {/* Glassmorphism Badge */}
                        <div className={STYLES.badge}>
                            <span className={STYLES.badgeIcon}>⭐</span>
                            <span className={STYLES.badgeText}>Nền Tảng Mua Bán Xe Đạp Hàng Đầu</span>
                        </div>

                        {/* Heading */}
                        <h1 className={STYLES.heading}>
                            Tìm Chiếc Xe Đạp{' '}
                            <span className={STYLES.headingHighlight}>Hoàn Hảo</span>{' '}
                            Cho Bạn
                        </h1>

                        {/* Description */}
                        <p className={STYLES.description}>
                            Nền tảng uy tín kết nối người mua và người bán xe đạp thể thao.
                            Minh bạch, an toàn, đáng tin cậy với hệ thống kiểm định chuyên nghiệp.
                        </p>

                        {/* Stats - Glassmorphism Card */}
                        <div className={STYLES.statsCard}>
                            {HERO_STATS.map((stat) => (
                                <div key={stat.label} className="text-center group">
                                    <div className={STYLES.statValue}>{stat.value}</div>
                                    <div className={STYLES.statLabel}>{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right side decorative element */}
                    <div className={STYLES.decorativeWrapper}>
                        <div className={STYLES.decorativeGlow} />
                        <div className={STYLES.decorativeFrame}>
                            <div className={STYLES.decorativeImageWrapper}>
                                <img
                                    src={DECORATIVE_IMAGE}
                                    className={STYLES.decorativeImage}
                                    alt="Decorative bike"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
