/**
 * Pagination Component
 * Reusable pagination controls for search results
 * Based on BR-S31-02: Page-based pagination
 */

'use client';

import React, { useMemo, useCallback } from 'react';
import { MESSAGES, UI_CONFIG } from '../../constants';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

/** Style constants */
const STYLES = {
    wrapper: 'flex items-center justify-center gap-2 mt-8',
    pageNumbersRow: 'flex gap-2',
    ellipsis: 'px-3 py-2 text-gray-400',
    buttonDisabled: 'px-4 py-2 rounded-lg font-medium transition-colors bg-gray-200 text-gray-400 cursor-not-allowed',
    buttonEnabled: 'px-4 py-2 rounded-lg font-medium transition-colors bg-white text-gray-700 hover:bg-brand-primary hover:text-white border border-gray-300',
    pageActive: 'px-4 py-2 rounded-lg font-medium transition-colors bg-brand-primary text-white',
    pageInactive: 'px-4 py-2 rounded-lg font-medium transition-colors bg-white text-gray-700 hover:bg-gray-100 border border-gray-300',
} as const;

const ELLIPSIS = '...';

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    // PERF-02: Memoize page number calculation
    const pageNumbers = useMemo(() => {
        const pages: (number | string)[] = [];

        if (totalPages <= UI_CONFIG.MAX_VISIBLE_PAGE_NUMBERS) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            if (currentPage > 3) {
                pages.push(ELLIPSIS);
            }

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push(ELLIPSIS);
            }

            pages.push(totalPages);
        }

        return pages;
    }, [currentPage, totalPages]);

    const handlePageClick = useCallback((page: number) => {
        if (page === currentPage) return;
        onPageChange(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage, onPageChange]);

    return (
        <div className={STYLES.wrapper}>
            {/* Previous Button */}
            <button
                onClick={() => handlePageClick(currentPage - 1)}
                disabled={currentPage === 1}
                className={currentPage === 1 ? STYLES.buttonDisabled : STYLES.buttonEnabled}
            >
                {MESSAGES.PAGINATION_PREVIOUS}
            </button>

            {/* Page Numbers */}
            <div className={STYLES.pageNumbersRow}>
                {pageNumbers.map((page, index) => {
                    if (page === ELLIPSIS) {
                        return (
                            <span key={`ellipsis-${index}`} className={STYLES.ellipsis}>
                                {ELLIPSIS}
                            </span>
                        );
                    }

                    const pageNum = page as number;
                    return (
                        <button
                            key={pageNum}
                            onClick={() => handlePageClick(pageNum)}
                            className={currentPage === pageNum ? STYLES.pageActive : STYLES.pageInactive}
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
                className={currentPage === totalPages ? STYLES.buttonDisabled : STYLES.buttonEnabled}
            >
                {MESSAGES.PAGINATION_NEXT}
            </button>
        </div>
    );
}
