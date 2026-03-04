/**
 * BikeSkeleton Component
 * Animated skeleton placeholder for bike cards
 * Used in FeaturedBikesSection during loading
 */

import React from 'react';

/** Style constants — tách riêng để JSX gọn gàng */
const STYLES = {
    wrapper: 'bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse',
    imagePlaceholder: 'aspect-[4/3] bg-gray-200',
    content: 'p-5 space-y-4',
    titleLine: 'h-5 bg-gray-200 rounded-md w-3/4',
    infoRow: 'flex justify-between items-center',
    infoLeft: 'h-4 bg-gray-100 rounded w-1/3',
    infoRight: 'w-8 h-4 bg-gray-100 rounded',
    bottomRow: 'flex justify-between items-end pt-2',
    priceLabelPlaceholder: 'h-3 bg-gray-100 rounded w-16',
    priceValuePlaceholder: 'h-6 bg-gray-200 rounded w-24',
    buttonPlaceholder: 'h-10 bg-gray-200 rounded-xl w-24',
} as const;

export default function BikeSkeleton() {
    return (
        <div className={STYLES.wrapper}>
            <div className={STYLES.imagePlaceholder} />

            <div className={STYLES.content}>
                <div className={STYLES.titleLine} />

                <div className={STYLES.infoRow}>
                    <div className={STYLES.infoLeft} />
                    <div className={STYLES.infoRight} />
                </div>

                <div className={STYLES.bottomRow}>
                    <div className="space-y-2">
                        <div className={STYLES.priceLabelPlaceholder} />
                        <div className={STYLES.priceValuePlaceholder} />
                    </div>
                    <div className={STYLES.buttonPlaceholder} />
                </div>
            </div>
        </div>
    );
}
