/**
 * FeaturedBikeCard Component
 * Simplified card for Home page "Xe Đạp Đang Hot" section and Listing Grid
 *
 * Displays:
 * - Image with HOT badge & Location overlay
 * - Title
 * - Price
 * - Action: Purchase button (S-50 integration)
 *
 * Handles its own navigation to avoid nesting button inside Link
 */

'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { HomeBike } from '../types/listing';
import { formatPrice } from '../utils/format';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';
import { MapPin, ShoppingCart } from 'lucide-react';

const FALLBACK_IMAGE = '/images/bike-placeholder.svg';
const HOT_THRESHOLD = 10;

/** Style constants — tách riêng để JSX gọn gàng */
const STYLES = {
    card: 'group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col h-full border border-gray-100 overflow-hidden hover:-translate-y-2',
    imageWrapper: 'relative aspect-[4/3] overflow-hidden bg-gray-100',
    image: 'w-full h-full object-cover transition-transform duration-700 group-hover:scale-110',
    imageOverlay: 'absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500',
    hotBadge: 'absolute top-3 left-3 bg-red-500/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg animate-fade-in',
    locationBadge: 'absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-md text-white text-[11px] px-2.5 py-1 rounded-lg',
    locationIcon: 'w-3 h-3 text-brand-primary',
    content: 'p-5 flex flex-col flex-grow',
    title: 'text-gray-800 font-bold leading-snug line-clamp-2 group-hover:text-brand-primary transition-colors h-[48px] mb-4',
    bottomRow: 'mt-auto flex items-center justify-between gap-3 pt-2 border-t border-gray-50',
    priceLabel: 'text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5 whitespace-nowrap',
    priceValue: 'text-lg font-black text-brand-primary tracking-tight whitespace-nowrap',
    purchaseButton: 'flex items-center gap-2 px-4 py-2 bg-brand-bg text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-brand-primary/20 group/btn active:scale-95 whitespace-nowrap flex-shrink-0',
    purchaseIcon: 'w-3.5 h-3.5 group-hover/btn:rotate-12 transition-transform',
} as const;

interface FeaturedBikeCardProps {
    bike: HomeBike;
    className?: string;
}

export default function FeaturedBikeCard({ bike, className = '' }: FeaturedBikeCardProps) {
    const router = useRouter();
    const { role } = useAuth();
    const { addToast } = useToast();
    const isSeller = role === 'SELLER';

    const handleCardClick = useCallback(() => {
        router.push(`/listings/${bike.listingId}`);
    }, [router, bike.listingId]);

    const handlePurchase = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        if (isSeller) {
            addToast('Tài khoản Người bán không thể thực hiện mua xe. Vui lòng đăng nhập bằng tài khoản Người mua.', 'error');
            return;
        }
        const query = bike.productId
            ? `listingId=${bike.listingId}&productId=${bike.productId}`
            : `listingId=${bike.listingId}`;
        router.push(`/purchase-request?${query}`);
    }, [router, bike.listingId, bike.productId, isSeller, addToast]);

    const isHot = (bike.viewCount || 0) > HOT_THRESHOLD;

    return (
        <div
            onClick={handleCardClick}
            className={`${STYLES.card} ${className}`}
        >
            {/* Image Container */}
            <div className={STYLES.imageWrapper}>
                <img
                    src={bike.imageUrl || FALLBACK_IMAGE}
                    alt={bike.title}
                    className={STYLES.image}
                    onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                />

                {/* Overlay Shimmer on Hover */}
                <div className={STYLES.imageOverlay} />

                {/* Hot Badge */}
                {isHot && (
                    <div className={STYLES.hotBadge}>
                        <span className="animate-pulse">🔥</span> HOT
                    </div>
                )}

                {/* Location Badge */}
                {bike.locationCity && (
                    <div className={STYLES.locationBadge}>
                        <MapPin className={STYLES.locationIcon} />
                        {bike.locationCity}
                    </div>
                )}
            </div>

            {/* Card Content */}
            <div className={STYLES.content}>
                <h3 className={STYLES.title}>{bike.title}</h3>

                {/* Bottom Row: Price & Button */}
                <div className={STYLES.bottomRow}>
                    <div className="flex flex-col">
                        <span className={STYLES.priceLabel}>Giá bán</span>
                        <div className={STYLES.priceValue}>
                            {formatPrice(bike.price)}
                        </div>
                    </div>

                    <button
                        onClick={handlePurchase}
                        className={STYLES.purchaseButton}
                    >
                        <ShoppingCart className={STYLES.purchaseIcon} />
                        <span>Đặt mua</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
