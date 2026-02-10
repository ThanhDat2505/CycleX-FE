'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { getBuyerTransactions, cancelTransaction } from '@/app/services/transactionService';
import { TransactionWithDetails } from '@/app/types/transaction';
import { LoadingSpinner, EmptyState, Button, StatusBadge } from '@/app/components/ui';
import { formatPrice, formatDate } from '@/app/utils/format';
import Link from 'next/link';
import { useToast } from '@/app/contexts/ToastContext';
import { TRANSACTION_STATUS } from '@/app/constants/transactionStatus';

export default function BuyerTransactionsPage() {
    const router = useRouter();
    const { user, isLoggedIn, isLoading: isAuthLoading, role } = useAuth();
    const { addToast } = useToast();
    const [actionLoading, setActionLoading] = useState<number | null>(null);

    const [transactions, setTransactions] = useState<TransactionWithDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Auth & Role check
        if (!isAuthLoading) {
            if (!isLoggedIn) {
                router.push('/login?returnUrl=/buyer/transactions');
                return;
            }
            if (role !== 'BUYER') {
                router.push('/');
                return;
            }
        }
    }, [isAuthLoading, isLoggedIn, role, router]);

    useEffect(() => {
        if (!user?.userId) return;

        let isMounted = true;

        async function fetchTransactions() {
            try {
                if (isMounted) setIsLoading(true);
                const data = await getBuyerTransactions(user!.userId);

                if (isMounted) {
                    // Sort by newest first
                    data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                    setTransactions(data);
                }
            } catch (error) {
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        fetchTransactions();

        return () => { isMounted = false; };
    }, [user?.userId]);

    // Removed getStatusBadge block as we use StatusBadge component now

    const handleQuickCancel = async (transactionId: number) => {
        if (!confirm('Bạn có chắc chắn muốn hủy yêu cầu này không? Hành động này không thể hoàn tác.')) return;

        try {
            setActionLoading(transactionId);
            const success = await cancelTransaction(transactionId);

            if (success) {
                addToast('Đã hủy yêu cầu thành công.', 'success');
                // Refresh list
                const data = await getBuyerTransactions(user!.userId);
                data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setTransactions(data);
            }
        } catch (error) {
            addToast('Có lỗi xảy ra khi hủy yêu cầu.', 'error');
        } finally {
            setActionLoading(null);
        }
    };

    if (isAuthLoading || isLoading) return <div className="p-12 flex justify-center"><LoadingSpinner /></div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Đơn mua của tôi</h1>

            {transactions.length === 0 ? (
                <EmptyState
                    title="Chưa có đơn hàng nào"
                    description="Bạn chưa thực hiện giao dịch nào."
                    action={
                        <Link href="/listings" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-brand-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary">
                            Xem tin đăng
                        </Link>
                    }
                />
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Xe</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người bán</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {transactions.map((t) => (
                                    <tr key={t.transactionId} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            #{t.transactionId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 relative rounded overflow-hidden">
                                                    <img className="h-10 w-10 object-cover" src={t.listingImage || '/placeholder-bike.png'} alt="" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{t.listingTitle}</div>
                                                    <div className="text-xs text-gray-500">ID: {t.listingId}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {t.sellerName || 'CycleX Seller'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(t.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-brand-primary">
                                            {formatPrice(t.totalAmount)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge status={t.status} showLabel />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                {t.status === TRANSACTION_STATUS.PENDING_SELLER_CONFIRM && (
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        loading={actionLoading === t.transactionId}
                                                        onClick={() => handleQuickCancel(t.transactionId)}
                                                        className="px-3"
                                                    >
                                                        Hủy
                                                    </Button>
                                                )}
                                                <Link
                                                    href={`/transactions/${t.transactionId}`}
                                                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
                                                >
                                                    Chi tiết
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
