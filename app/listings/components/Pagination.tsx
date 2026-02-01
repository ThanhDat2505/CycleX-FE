/**
 * Pagination Component
 * Reusable pagination controls for search results
 * Based on BR-S31-02: Page-based pagination
 */

'use client';

import React from 'react';
import { MESSAGES, UI_CONFIG } from '../../constants';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    // Don't show pagination if only 1 page
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];

        if (totalPages <= UI_CONFIG.MAX_VISIBLE_PAGE_NUMBERS) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            if (currentPage > 3) {
                pages.push('...');
            }

            // Show pages around current page
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push('...');
            }

            // Always show last page
            pages.push(totalPages);
        }

        return pages;
    };

    const handlePageClick = (page: number) => {
        if (page === currentPage) return;
        onPageChange(page);
        // Scroll to top of page
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            {/* Previous Button */}
            <button
                onClick={() => handlePageClick(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentPage === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-brand-primary hover:text-white border border-gray-300'
                    }`}
            >
                {MESSAGES.PAGINATION_PREVIOUS}
            </button>

            {/* Page Numbers */}
            <div className="flex gap-2">
                {getPageNumbers().map((page, index) => {
                    if (page === '...') {
                        return (
                            <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">
                                ...
                            </span>
                        );
                    }

                    const pageNum = page as number;
                    return (
                        <button
                            key={pageNum}
                            onClick={() => handlePageClick(pageNum)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentPage === pageNum
                                ? 'bg-brand-primary text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                }`}
                        >
                            {pageNum}
                        </button>
                    );
                })}
            </div>

            {/* Next Button */}
            <button
                onClick={() => handlePageClick(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentPage === totalPages
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-brand-primary hover:text-white border border-gray-300'
                    }`}
            >
                {MESSAGES.PAGINATION_NEXT}
            </button>
        </div>
    );
}
