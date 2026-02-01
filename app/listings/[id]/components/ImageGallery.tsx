/**
 * ImageGallery Component
 * Displays listing images with main view + thumbnail navigation
 * Supports keyboard navigation and responsive design
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
    images: string[];
    alt: string;
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="aspect-w-4 aspect-h-3 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
            </div>
        );
    }

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const hasMultipleImages = images.length > 1;

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-w-4 aspect-h-3 bg-gray-100 rounded-lg overflow-hidden group">
                <img
                    src={images[currentIndex]}
                    alt={`${alt} - Image ${currentIndex + 1}`}
                    className="w-full h-full object-cover"
                />

                {/* Navigation Arrows (only if multiple images) */}
                {hasMultipleImages && (
                    <>
                        <button
                            onClick={goToPrevious}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Previous image"
                        >
                            ←
                        </button>
                        <button
                            onClick={goToNext}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Next image"
                        >
                            →
                        </button>
                    </>
                )}

                {/* Image Counter */}
                {hasMultipleImages && (
                    <div className="absolute bottom-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                        {currentIndex + 1} / {images.length}
                    </div>
                )}
            </div>

            {/* Thumbnail Strip (only if multiple images) */}
            {hasMultipleImages && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${index === currentIndex
                                    ? 'border-blue-600 ring-2 ring-blue-300'
                                    : 'border-gray-300 hover:border-gray-400'
                                }`}
                        >
                            <img
                                src={image}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
