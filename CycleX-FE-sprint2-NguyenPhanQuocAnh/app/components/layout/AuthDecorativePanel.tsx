'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const FEATURES = [
    'Nền tảng mua bán xe đạp uy tín hàng đầu',
    'Hệ thống kiểm định chất lượng chuyên nghiệp',
    'Giao dịch an toàn, minh bạch, tin cậy',
    'Cộng đồng đam mê xe đạp thể thao lớn mạnh'
];

const STYLES = {
    wrapper: 'hidden lg:flex flex-col justify-center items-center relative w-1/2 min-h-screen bg-brand-bg overflow-hidden p-12 text-white',
    overlay: 'absolute inset-0 bg-gradient-to-br from-brand-bg/80 via-brand-bg/60 to-transparent z-10',
    bgImage: 'absolute inset-0 w-full h-full object-cover transition-transform duration-[10s] hover:scale-110',
    content: 'relative z-20 max-w-lg',
    slogan: 'text-4xl lg:text-5xl font-extrabold mb-8 leading-tight tracking-tight animate-fade-in',
    featureList: 'space-y-6 animate-slide-up delay-300',
    featureItem: 'flex items-start gap-4 group',
    featureIcon: 'w-6 h-6 text-brand-primary mt-1 group-hover:scale-125 transition-transform duration-300',
    featureText: 'text-lg text-gray-200 font-medium',
    footer: 'absolute bottom-12 left-12 z-20 flex items-center gap-2 text-gray-400 text-sm animate-fade-in delay-500',
    footerDot: 'w-1 h-1 bg-brand-primary rounded-full'
} as const;

/**
 * AuthDecorativePanel
 * The branding panel shown on the right/left side of Auth forms on Desktop
 */
export function AuthDecorativePanel() {
    return (
        <div className={STYLES.wrapper}>
            {/* Background Image & Gradient Overlay */}
            <img
                src="https://images.unsplash.com/photo-1532298229144-0ee051189ff2?w=1200&q=80"
                alt="CycleX Branding"
                className={STYLES.bgImage}
            />
            <div className={STYLES.overlay} />

            {/* Main Content */}
            <div className={STYLES.content}>
                <h2 className={STYLES.slogan}>
                    Bắt đầu hành trình của bạn cùng <span className="text-brand-primary">CycleX</span>
                </h2>

                <div className={STYLES.featureList}>
                    {FEATURES.map((feature, index) => (
                        <div key={index} className={STYLES.featureItem}>
                            <CheckCircle2 className={STYLES.featureIcon} />
                            <p className={STYLES.featureText}>{feature}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Branding */}
            <div className={STYLES.footer}>
                <span>CycleX Platform</span>
                <div className={STYLES.footerDot} />
                <span>Premium Quality</span>
            </div>
        </div>
    );
}
