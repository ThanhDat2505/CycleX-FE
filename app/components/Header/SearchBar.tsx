/**
 * SearchBar Component
 * Expandable search input for Header
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
    className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ className = '' }) => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = keyword.trim();

        // Validation: Minimum 3 characters
        if (trimmed.length < 3) {
            setError('Vui lòng nhập ít nhất 3 ký tự');
            return;
        }

        // Clear error and set loading
        setError('');
        setIsLoading(true);

        // Navigate to search results
        router.push(`/listings?keyword=${encodeURIComponent(trimmed)}`);

        // Reset states
        setIsOpen(false);
        setKeyword('');

        // Clear loading after navigation starts
        setTimeout(() => setIsLoading(false), 1000);
    };

    const handleBlur = () => {
        // Delay to allow form submission
        setTimeout(() => {
            if (!isLoading) {
                setIsOpen(false);
                setKeyword('');
                setError('');
            }
        }, 200);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className={`text-white hover:text-brand-primary transition-colors ${className}`}
                aria-label="Search"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-1">
            <div className="relative flex items-center gap-2">
                <input
                    type="text"
                    placeholder="Tìm kiếm xe... (3 ký tự trở lên)"
                    value={keyword}
                    onChange={(e) => {
                        setKeyword(e.target.value);
                        setError('');
                    }}
                    className={`w-48 md:w-64 px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 ${error ? 'ring-2 ring-red-500 focus:ring-red-500' : 'focus:ring-brand-primary'
                        }`}
                    autoFocus
                    disabled={isLoading}
                    onBlur={handleBlur}
                />
                {isLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <svg className="animate-spin h-5 w-5 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                )}
            </div>
            {error && (
                <p className="text-red-400 text-sm px-1 absolute -bottom-6 left-0 whitespace-nowrap">
                    {error}
                </p>
            )}
        </form>
    );
};

export default SearchBar;
