/**
 * FeaturesSection Component
 * Displays 4 key features/benefits of the CycleX platform
 * Based on Figma mockup design
 */

import React from 'react';
import SectionHeader from './ui/SectionHeader';

export default function FeaturesSection() {
    const features = [
        {
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: 'Chất Lượng Đảm Bảo',
            description: 'Xe đạp được kiểm định kỹ lưỡng bởi chuyên gia trước khi đăng bán'
        },
        {
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            ),
            title: 'Giao Dịch An Toàn',
            description: 'Hệ thống bảo mật cao, thông tin minh bạch và đáng tin cậy'
        },
        {
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            title: 'Hỗ Trợ 24/7',
            description: 'Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ mọi lúc'
        },
        {
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: 'Giá Cả Hợp Lý',
            description: 'Mức giá cạnh tranh, phù hợp với chất lượng sản phẩm'
        }
    ];

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                {/* Section Title */}
                <SectionHeader
                    title="Tại Sao Chọn CycleX?"
                    description="Nền tảng mua bán xe đạp uy tín với hệ thống kiểm định chuyên nghiệp"
                />

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
                        >
                            {/* Icon */}
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-primary bg-opacity-10 rounded-full text-brand-primary mb-4">
                                {feature.icon}
                            </div>

                            {/* Title */}
                            <h3 className="text-lg font-bold text-gray-800 mb-2">
                                {feature.title}
                            </h3>

                            {/* Description */}
                            <p className="text-sm text-gray-600">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
