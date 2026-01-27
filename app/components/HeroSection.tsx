/**
 * HeroSection Component
 * Large hero banner with background image and stats
 * Search has been moved to Header (global search icon)
 */

'use client';

import React from 'react';

export default function HeroSection() {

    return (
        <section id="hero-section" className="relative bg-brand-bg text-white overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <div
                    className="w-full h-full bg-cover bg-center"
                    style={{
                        backgroundImage: 'url(https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=1920&q=80)',
                    }}
                />
                <div className="absolute inset-0 bg-brand-bg bg-opacity-80" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 py-20 md:py-32">
                <div className="max-w-3xl">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-brand-primary bg-opacity-20 border border-brand-primary rounded-full px-4 py-2 mb-6">
                        <span className="text-brand-primary">⭐</span>
                        <span className="text-sm font-medium">Nền Tảng Mua Bán Xe Đạp Hàng Đầu</span>
                    </div>

                    {/* Heading */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                        Tìm Chiếc Xe Đạp{' '}
                        <span className="text-brand-primary">Hoàn Hảo</span>{' '}
                        Cho Bạn
                    </h1>

                    {/* Description */}
                    <p className="text-lg text-gray-300 mb-12">
                        Nền tảng uy tín kết nối người mua và người bán xe đạp thể thao.
                        Minh bạch, an toàn, đáng tin cậy với hệ thống kiểm định chuyên nghiệp.
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-8">
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-brand-primary mb-1">2,500+</div>
                            <div className="text-sm text-gray-300">Xe Đăng Bán</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-brand-primary mb-1">1,200+</div>
                            <div className="text-sm text-gray-300">Giao Dịch</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-brand-primary mb-1">98%</div>
                            <div className="text-sm text-gray-300">Hài Lòng</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
