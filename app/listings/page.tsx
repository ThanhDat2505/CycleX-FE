'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { searchListings } from '../services/listingService';
import { HomeBike } from '../types/listing';
import FeaturedBikeCard from '../components/FeaturedBikeCard';

/**
 * S-31 - Listing List Page
 * Display search results from keyword search
 * Features: Grid layout, loading state, error handling, empty state
 */
export default function ListingsPage() {
    const searchParams = useSearchParams();
    const keyword = searchParams.get('keyword') || '';

    const [listings, setListings] = useState<HomeBike[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchSearchResults() {
            if (!keyword || keyword.length < 3) {
                setError('Vui lòng nhập từ khóa tìm kiếm (tối thiểu 3 ký tự)');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError('');
                const results = await searchListings(keyword);
                setListings(results);
            } catch (err: any) {
                console.error('❌ Search error:', err);
                setError(err.message || 'Không thể tìm kiếm. Vui lòng thử lại.');
            } finally {
                setLoading(false);
            }
        }

        fetchSearchResults();
    }, [keyword]);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Kết quả tìm kiếm
                    </h1>
                    {keyword && (
                        <p className="text-gray-600">
                            Từ khóa: <span className="font-semibold text-brand-primary">"{keyword}"</span>
                        </p>
                    )}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="text-center">
                            <svg className="animate-spin h-12 w-12 text-brand-primary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="text-gray-600">Đang tìm kiếm...</p>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-md mx-auto">
                        <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-red-700 font-medium">{error}</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && listings.length === 0 && (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center max-w-md mx-auto">
                        <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            Không tìm thấy kết quả
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Không có xe nào phù hợp với từ khóa "{keyword}"
                        </p>
                        <p className="text-sm text-gray-500">
                            Thử tìm kiếm với từ khóa khác hoặc rút ngắn từ khóa
                        </p>
                    </div>
                )}

                {/* Results Grid */}
                {!loading && !error && listings.length > 0 && (
                    <>
                        <div className="mb-4 text-gray-600">
                            Tìm thấy <span className="font-semibold text-brand-primary">{listings.length}</span> kết quả
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {listings.map((bike) => (
                                <FeaturedBikeCard key={bike.listingId} bike={bike} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
