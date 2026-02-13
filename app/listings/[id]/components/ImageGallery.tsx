/**
 * ImageGallery Component
 * Displays listing images with main view + thumbnail navigation
 * Supports keyboard navigation and responsive design
 */

'use client';

import { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Bike } from 'lucide-react';
import { MESSAGES } from '../../../constants';

interface ImageGalleryProps {
    images: string[];
    alt: string;
}

/** Style constants */
const STYLES = {
    wrapper: 'space-y-4 animate-fade-in',
    mainImage: 'relative aspect-[4/3] bg-gray-100 rounded-3xl overflow-hidden group shadow-lg border border-gray-100',
    image: 'w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-110',
    navButton: 'absolute top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm text-gray-900 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl hover:bg-brand-primary hover:text-white',
    navButtonLeft: 'left-4 -translate-x-2 group-hover:translate-x-0',
    navButtonRight: 'right-4 translate-x-2 group-hover:translate-x-0',
    counter: 'absolute bottom-4 right-4 bg-black/50 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-wider',
    thumbnailStrip: 'flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x',
    thumbnailActive: 'relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-4 border-brand-primary shadow-lg scale-95 transition-all duration-300 snap-center',
    thumbnailInactive: 'relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 border-transparent grayscale hover:grayscale-0 hover:border-gray-200 transition-all duration-300 snap-center',
    thumbnailImage: 'w-full h-full object-cover',
    emptyState: 'aspect-[4/3] bg-gray-50 rounded-3xl flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-200',
    emptyText: 'text-gray-400 font-medium',
} as const;

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // PERF-01: Wrap handlers in useCallback
    const changeImage = useCallback((index: number) => {
        if (index === currentIndex || isTransitioning) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentIndex(index);
            setIsTransitioning(false);
        }, 300); // Match transition duration
    }, [currentIndex, isTransitioning]);

    const goToNext = useCallback(() => {
        changeImage((currentIndex + 1) % images.length);
    }, [currentIndex, images.length, changeImage]);

    const goToPrevious = useCallback(() => {
        changeImage((currentIndex - 1 + images.length) % images.length);
    }, [currentIndex, images.length, changeImage]);

    const handleThumbnailClick = useCallback((index: number) => {
        changeImage(index);
    }, [changeImage]);

    if (!images || images.length === 0) {
        return (
            <div className={STYLES.emptyState}>
                <Bike className="text-gray-200" size={48} />
                <span className={STYLES.emptyText}>{MESSAGES.DETAIL_NO_IMAGE}</span>
            </div>
        );
    }

    const hasMultipleImages = images.length > 1;

    return (
        <div className={STYLES.wrapper}>
            {/* Main Image */}
            <div className={STYLES.mainImage}>
                <img
                    src={images[currentIndex]}
                    alt={`${alt} - Image ${currentIndex + 1}`}
                    className={`${STYLES.image} ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
                />

                {/* Navigation Arrows */}
                {hasMultipleImages && (
                    <>
                        <button
                            onClick={goToPrevious}
                            className={`${STYLES.navButton} ${STYLES.navButtonLeft}`}
                            aria-label="Previous image"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={goToNext}
                            className={`${STYLES.navButton} ${STYLES.navButtonRight}`}
                            aria-label="Next image"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </>
                )}

                {/* Image Counter */}
                {hasMultipleImages && (
                    <div className={STYLES.counter}>
                        {currentIndex + 1} / {images.length}
                    </div>
                )}
            </div>

            {/* Thumbnail Strip */}
            {hasMultipleImages && (
                <div className={STYLES.thumbnailStrip}>
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => handleThumbnailClick(index)}
                            className={index === currentIndex
                                ? STYLES.thumbnailActive
                                : STYLES.thumbnailInactive}
                        >
                            <img
                                src={image}
                                alt={`Thumbnail ${index + 1}`}
                                className={STYLES.thumbnailImage}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
