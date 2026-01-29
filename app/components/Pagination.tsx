/**
 * Pagination Component
 * Simple Previous/Next navigation for paginated lists
 */

import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProps) {
    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;

    return (
        <div className="flex items-center justify-center gap-4 mt-8">
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={isFirstPage}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${isFirstPage
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
            >
                Previous
            </button>

            {/* Page Indicator */}
            <span className="text-gray-700 font-medium">
                Page {currentPage} of {totalPages}
            </span>

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={isLastPage}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${isLastPage
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
            >
                Next
            </button>
        </div>
    );
}
