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
import { MESSAGES } from '@/app/constants';

/** Style constants */
const STYLES = {
    loadingWrapper: 'p-12 flex justify-center',
    pageWrapper: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up',
    pageTitle: 'text-2xl font-bold text-gray-900 mb-6',
    emptyAction: 'inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-brand-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary',
    tableCard: 'bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden',
    tableWrapper: 'overflow-x-auto',
    table: 'min-w-full divide-y divide-gray-200',
    thead: 'bg-gray-50',
    th: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
    thRight: 'px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider',
    tbody: 'bg-white divide-y divide-gray-200',
    row: 'hover:bg-gray-50 transition-colors',
    cellId: 'px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900',
    cellDefault: 'px-6 py-4 whitespace-nowrap',
    cellText: 'px-6 py-4 whitespace-nowrap text-sm text-gray-500',
    cellPrice: 'px-6 py-4 whitespace-nowrap text-sm font-semibold text-brand-primary',
    cellActions: 'px-6 py-4 whitespace-nowrap text-right text-sm font-medium',
    actionsGroup: 'flex justify-end gap-2',
    bikeThumb: 'flex-shrink-0 h-10 w-10 relative rounded overflow-hidden',
    bikeImage: 'h-10 w-10 object-cover',
    bikeName: 'text-sm font-medium text-gray-900 truncate max-w-[200px]',
    bikeSubtext: 'text-xs text-gray-500',
    detailLink: 'flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm',
    detailIcon: 'w-4 h-4',
} as const;

export default function BuyerTransactionsPage() {
    const router = useRouter();
    const { user, isLoggedIn, isLoading: isAuthLoading, role, requireAuth } = useAuth();
    const { addToast } = useToast();
    const [actionLoading, setActionLoading] = useState<number | null>(null);

    const [transactions, setTransactions] = useState<TransactionWithDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isAuthLoading) return;

        if (!requireAuth('/buyer/transactions')) return;

        if (role !== 'BUYER') {
            router.push('/');
        }
    }, [isAuthLoading, requireAuth, role, router]);

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
            } catch {
                if (isMounted) {
                    addToast(MESSAGES.BUYER_TX_FETCH_ERROR, 'error');
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        fetchTransactions();

        return () => { isMounted = false; };
    }, [user?.userId, addToast]);

    const handleQuickCancel = async (transactionId: number) => {
        if (!confirm(MESSAGES.BUYER_TX_CANCEL_CONFIRM)) return;

        try {
            setActionLoading(transactionId);
            const success = await cancelTransaction(transactionId);

            if (success) {
                addToast(MESSAGES.BUYER_TX_CANCEL_SUCCESS, 'success');
                // Refresh list
                const data = await getBuyerTransactions(user!.userId);
                data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setTransactions(data);
            }
        } catch {
            addToast(MESSAGES.BUYER_TX_CANCEL_ERROR, 'error');
        } finally {
            setActionLoading(null);
        }
    };

    if (isAuthLoading || isLoading) return <div className={STYLES.loadingWrapper}><LoadingSpinner /></div>;

    return (
        <div className={STYLES.pageWrapper}>
            <h1 className={STYLES.pageTitle}>{MESSAGES.BUYER_TX_PAGE_TITLE}</h1>

            {transactions.length === 0 ? (
                <EmptyState
                    title={MESSAGES.BUYER_TX_EMPTY_TITLE}
                    description={MESSAGES.BUYER_TX_EMPTY_DESC}
                    action={
                        <Link href="/listings" className={STYLES.emptyAction}>
                            {MESSAGES.BUYER_TX_EMPTY_ACTION}
                        </Link>
                    }
                />
            ) : (
                <div className={STYLES.tableCard}>
                    <div className={STYLES.tableWrapper}>
                        <table className={STYLES.table}>
                            <thead className={STYLES.thead}>
                                <tr>
                                    <th className={STYLES.th}>{MESSAGES.BUYER_TX_COL_ID}</th>
                                    <th className={STYLES.th}>{MESSAGES.BUYER_TX_COL_BIKE}</th>
                                    <th className={STYLES.th}>{MESSAGES.BUYER_TX_COL_SELLER}</th>
                                    <th className={STYLES.th}>{MESSAGES.BUYER_TX_COL_DATE}</th>
                                    <th className={STYLES.th}>{MESSAGES.BUYER_TX_COL_TOTAL}</th>
                                    <th className={STYLES.th}>{MESSAGES.BUYER_TX_COL_STATUS}</th>
                                    <th className={STYLES.thRight}>{MESSAGES.BUYER_TX_COL_ACTIONS}</th>
                                </tr>
                            </thead>
                            <tbody className={STYLES.tbody}>
                                {transactions.map((t) => (
                                    <tr key={t.transactionId} className={STYLES.row}>
                                        <td className={STYLES.cellId}>
                                            #{t.transactionId}
                                        </td>
                                        <td className={STYLES.cellDefault}>
                                            <div className="flex items-center">
                                                <div className={STYLES.bikeThumb}>
                                                    <img className={STYLES.bikeImage} src={t.listingImage || '/placeholder-bike.png'} alt="" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className={STYLES.bikeName}>{t.listingTitle}</div>
                                                    <div className={STYLES.bikeSubtext}>ID: {t.listingId}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={STYLES.cellText}>
                                            {t.sellerName || MESSAGES.BUYER_TX_SELLER_DEFAULT}
                                        </td>
                                        <td className={STYLES.cellText}>
                                            {formatDate(t.createdAt)}
                                        </td>
                                        <td className={STYLES.cellPrice}>
                                            {formatPrice(t.totalAmount)}
                                        </td>
                                        <td className={STYLES.cellDefault}>
                                            <StatusBadge status={t.status} showLabel />
                                        </td>
                                        <td className={STYLES.cellActions}>
                                            <div className={STYLES.actionsGroup}>
                                                {t.status === TRANSACTION_STATUS.PENDING_SELLER_CONFIRM && (
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        loading={actionLoading === t.transactionId}
                                                        onClick={() => handleQuickCancel(t.transactionId)}
                                                        className="px-3"
                                                    >
                                                        {MESSAGES.BUYER_TX_BTN_CANCEL}
                                                    </Button>
                                                )}
                                                <Link
                                                    href={`/transactions/${t.transactionId}`}
                                                    className={STYLES.detailLink}
                                                >
                                                    {MESSAGES.BUYER_TX_BTN_DETAIL}
                                                    <svg className={STYLES.detailIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
