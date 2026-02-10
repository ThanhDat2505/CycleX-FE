'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { getSellerTransactions } from '@/app/services/transactionService';
import { TransactionWithDetails } from '@/app/types/transaction';
import TransactionCard from '../components/TransactionCard';
import { LoadingSpinner, EmptyState } from '@/app/components/ui';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/app/utils/format';

export default function PendingTransactionsPage() {
    const { user, isLoggedIn, isLoading: isAuthLoading, role } = useAuth();
    const router = useRouter();
    const [transactions, setTransactions] = useState<TransactionWithDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterType, setFilterType] = useState<'ALL' | 'PURCHASE' | 'DEPOSIT'>('ALL');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

    useEffect(() => {
        // Auth & Role check
        if (!isAuthLoading) {
            if (!isLoggedIn) {
                router.push('/login?returnUrl=/seller/transactions/pending');
                return;
            }
            if (role !== 'SELLER') {
                // Not authorized
                // In a real app, might show a nice 403 page
                // For now, redirect home with a toast (if we can use toast here)
                // Since this component uses useAuth, we can assume it's Client Component
                // We'll trust the user to be redirected
                router.push('/');
                return;
            }
        }
    }, [isAuthLoading, isLoggedIn, role, router]);

    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
            if (!user?.userId) return;

            try {
                setIsLoading(true);
                // Fetch only PENDING_SELLER_CONFIRM transactions
                const data = await getSellerTransactions(user.userId, 'PENDING_SELLER_CONFIRM');

                if (!isMounted) return;

                setTransactions(data);
            } catch (err) {
                if (isMounted) {
                    setError('Không thể tải danh sách giao dịch');
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        if (user?.userId) {
            fetchData();
        }

        return () => {
            isMounted = false;
        };
    }, [user?.userId]);

    // Filter and Sort Logic — memoized to avoid re-computing on every render
    const filteredTransactions = useMemo(() =>
        transactions
            .filter(t => {
                if (filterType === 'ALL') return true;
                return t.transactionType === filterType;
            })
            .sort((a, b) => {
                const timeA = new Date(a.createdAt).getTime();
                const timeB = new Date(b.createdAt).getTime();
                return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
            }),
        [transactions, filterType, sortOrder]
    );

    // Calculate Stats
    const totalPending = transactions.length;
    const totalValue = transactions.reduce((sum, t) => sum + t.totalAmount, 0);

    if (isAuthLoading || isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto animate-fade-in-up">

                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                        Yêu cầu chờ xác nhận
                    </h1>
                    <p className="text-gray-500 mt-2 text-lg">
                        Quản lý các yêu cầu mua và đặt cọc cần sự phản hồi của bạn.
                    </p>

                    {/* Stats Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                            <span className="text-sm text-gray-500 font-medium">Yêu cầu mới</span>
                            <span className="text-2xl font-bold text-blue-600 mt-1">{totalPending}</span>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:col-span-2">
                            <span className="text-sm text-gray-500 font-medium">Tổng giá trị chờ duyệt</span>
                            <span className="text-2xl font-bold text-gray-900 mt-1">
                                {formatPrice(totalValue)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Filter & Sort Controls */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    {/* Segmented Filter */}
                    <div className="bg-white p-1 rounded-lg border border-gray-200 shadow-sm inline-flex">
                        <button
                            onClick={() => setFilterType('ALL')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${filterType === 'ALL'
                                ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            Tất cả
                        </button>
                        <div className="w-px bg-gray-200 my-2 mx-1"></div>
                        <button
                            onClick={() => setFilterType('PURCHASE')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${filterType === 'PURCHASE'
                                ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            Mua ngay
                        </button>
                        <div className="w-px bg-gray-200 my-2 mx-1"></div>
                        <button
                            onClick={() => setFilterType('DEPOSIT')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${filterType === 'DEPOSIT'
                                ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            Đặt cọc
                        </button>
                    </div>

                    {/* Sort Dropdown */}
                    <div className="relative group">
                        <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:border-blue-300 transition-colors">
                            <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Sắp xếp:</span>
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                                className="text-sm font-medium text-gray-700 bg-transparent border-none focus:ring-0 p-0 pr-6 cursor-pointer outline-none appearance-none"
                                style={{ backgroundImage: 'none' }}
                            >
                                <option value="newest">Mới nhất</option>
                                <option value="oldest">Cũ nhất</option>
                            </select>
                            <svg className="w-4 h-4 text-gray-400 absolute right-3 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl flex items-center gap-3">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        {error}
                    </div>
                )}

                {filteredTransactions.length === 0 && !error ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center animate-fade-in">
                        <EmptyState
                            title="Không tìm thấy yêu cầu nào"
                            description={
                                filterType === 'ALL'
                                    ? "Hiện tại chưa có khách hàng nào gửi yêu cầu mua xe."
                                    : "Không có yêu cầu nào phù hợp với bộ lọc."
                            }
                            icon={
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                                    <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                </div>
                            }
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 animate-slide-up">
                        {filteredTransactions.map((transaction) => (
                            <TransactionCard
                                key={transaction.transactionId}
                                transaction={transaction}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
