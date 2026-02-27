'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { getTransactionDetail, acceptTransaction, cancelTransaction } from '@/app/services/transactionService';
import { TransactionWithDetails } from '@/app/types/transaction';
import { LoadingSpinner, Button, StatusBadge } from '@/app/components/ui';
import { formatDate } from '@/app/utils/format';
import { useToast } from '@/app/contexts/ToastContext';
import { TRANSACTION_STATUS } from '@/app/constants/transactionStatus';
import { MESSAGES } from '@/app/constants';
import OrderTimeline from './components/OrderTimeline';
import ContactInfoCard from './components/ContactInfoCard';
import VehicleInfoCard from './components/VehicleInfoCard';
import InvoiceWidget from './components/InvoiceWidget';

/** Style constants */
const STYLES = {
    loadingWrapper: 'min-h-screen bg-gray-50 flex items-center justify-center',
    errorWrapper: 'min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4',
    errorText: 'text-red-600 mb-4 font-medium',
    pageWrapper: 'min-h-screen bg-gray-50 pb-24',
    heroHeader: 'bg-gradient-to-r from-blue-600 to-blue-800 text-white pt-10 pb-20 px-4 sm:px-6 lg:px-8 shadow-lg relative overflow-hidden',
    heroDecorative: 'absolute top-0 right-0 opacity-10 transform translate-x-1/3 -translate-y-1/3',
    heroContainer: 'max-w-5xl mx-auto relative z-10',
    backButton: 'flex items-center text-blue-100 hover:text-white transition-colors mb-6 group font-medium',
    backIcon: 'w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform',
    headerRow: 'flex flex-col md:flex-row md:items-center justify-between gap-4',
    pageTitle: 'text-3xl font-extrabold tracking-tight',
    dateRow: 'text-blue-100 mt-2 flex items-center text-sm font-medium',
    dateIcon: 'w-4 h-4 mr-2',
    badgeWrapper: 'flex-shrink-0 animate-fade-in-up',
    mainContent: 'max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20',
    timelineWrapper: 'animate-fade-in-up',
    grid: 'grid grid-cols-1 lg:grid-cols-3 gap-8',
    leftCol: 'lg:col-span-2 space-y-6',
    rightCol: 'space-y-6',
    mobileBar: 'fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] lg:hidden z-50',
    btnAcceptMobile: 'w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl shadow-lg',
    btnCancelMobile: 'w-full bg-red-50 hover:bg-red-100 text-red-600 border-red-200 font-bold py-3.5 rounded-xl shadow-lg',
} as const;

export default function TransactionDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { isLoggedIn, isLoading: isAuthLoading, role, user, requireAuth } = useAuth();
    const { addToast } = useToast();

    const [transaction, setTransaction] = useState<TransactionWithDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const timeoutIds = useRef<NodeJS.Timeout[]>([]);

    // delete all pending setTimeout when unmounted
    useEffect(() => {
        return () => {
            timeoutIds.current.forEach(id => clearTimeout(id));
        };
    }, []);

    const transactionId = Number(params.id);

    useEffect(() => {
        if (isAuthLoading) return;

        if (!requireAuth(`/transactions/${transactionId}`)) return;

        if (role !== 'SELLER' && role !== 'BUYER') {
            addToast(MESSAGES.TX_DETAIL_NO_ACCESS_PAGE, 'error');
            router.push('/');
        }
    }, [isAuthLoading, requireAuth, role, router, transactionId, addToast]);

    useEffect(() => {
        let isMounted = true;

        async function fetchDetail() {
            if (!transactionId || !user?.userId) return;
            try {
                setIsLoading(true);
                const data = await getTransactionDetail(transactionId);

                if (isMounted) {
                    const isOwner = data.buyerId === user.userId || data.sellerId === user.userId;

                    if (!isOwner) {
                        setError(MESSAGES.TX_DETAIL_NO_ACCESS_TX);
                        addToast(MESSAGES.TX_DETAIL_NO_ACCESS_TX, 'error');
                        setTimeout(() => router.push('/'), 2000);
                        return;
                    }

                    setTransaction(data);
                }
            } catch (err) {
                if (isMounted) {
                    setError(MESSAGES.TX_DETAIL_FETCH_ERROR);
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        if (user?.userId) {
            fetchDetail();
        }

        return () => { isMounted = false; };
    }, [transactionId, user?.userId, router, addToast]);

    const handleAccept = async () => {
        if (!transaction) return;

        try {
            setIsProcessing(true);
            const success = await acceptTransaction(transaction.transactionId);

            if (success) {
                addToast(MESSAGES.TX_DETAIL_ACCEPT_SUCCESS, 'success');
                const updated = await getTransactionDetail(transaction.transactionId);
                setTransaction(updated);

                const tm = setTimeout(() => {
                    router.push('/seller/transactions/pending');
                }, 1500);
                timeoutIds.current.push(tm);
            }
        } catch (err) {
            addToast(MESSAGES.TX_DETAIL_ACCEPT_ERROR, 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCancel = async () => {
        if (!transaction) return;
        if (transaction.status !== TRANSACTION_STATUS.PENDING_SELLER_CONFIRM) {
            addToast(MESSAGES.TX_DETAIL_CANCEL_STATUS_ERROR, 'error');
            return;
        }

        if (!confirm(MESSAGES.TX_DETAIL_CANCEL_CONFIRM)) return;

        try {
            setIsProcessing(true);
            const success = await cancelTransaction(transaction.transactionId);

            if (success) {
                addToast(MESSAGES.TX_DETAIL_CANCEL_SUCCESS, 'success');
                router.push('/buyer/transactions');
            }
        } catch (err) {
            addToast(MESSAGES.TX_DETAIL_CANCEL_ERROR, 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    if (isAuthLoading || isLoading) {
        return (
            <div className={STYLES.loadingWrapper}>
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error || !transaction) {
        return (
            <div className={STYLES.errorWrapper}>
                <div className={STYLES.errorText}>{error || MESSAGES.TX_DETAIL_NOT_FOUND}</div>
                <Button onClick={() => router.back()} variant="secondary">{MESSAGES.TX_DETAIL_BACK}</Button>
            </div>
        );
    }

    const viewerRole = role as 'SELLER' | 'BUYER';

    return (
        <div className={STYLES.pageWrapper}>
            {/* Hero Header */}
            <div className={STYLES.heroHeader}>
                <div className={STYLES.heroDecorative}>
                    <svg width="400" height="400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" /></svg>
                </div>
                <div className={STYLES.heroContainer}>
                    <button
                        onClick={() => router.back()}
                        className={STYLES.backButton}
                    >
                        <svg className={STYLES.backIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        {MESSAGES.TX_DETAIL_BACK}
                    </button>
                    <div className={STYLES.headerRow}>
                        <div>
                            <h1 className={STYLES.pageTitle}>{MESSAGES.TX_DETAIL_TITLE_PREFIX} #{transaction.transactionId}</h1>
                            <p className={STYLES.dateRow}>
                                <svg className={STYLES.dateIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                {MESSAGES.TX_DETAIL_CREATED_AT} {formatDate(transaction.createdAt)}
                            </p>
                        </div>
                        <div className={STYLES.badgeWrapper}>
                            <StatusBadge status={transaction.status} showLabel size="lg" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className={STYLES.mainContent}>

                {/* Timeline */}
                <div className={STYLES.timelineWrapper}>
                    <OrderTimeline
                        status={transaction.status}
                        createdAt={transaction.createdAt}
                        updatedAt={transaction.updatedAt}
                    />
                </div>

                <div className={STYLES.grid}>

                    {/* Left Column: Details */}
                    <div className={STYLES.leftCol}>
                        <ContactInfoCard transaction={transaction} viewerRole={viewerRole} />
                        <VehicleInfoCard transaction={transaction} />
                    </div>

                    {/* Right Column: Invoice & Actions */}
                    <div className={STYLES.rightCol}>
                        <InvoiceWidget
                            transaction={transaction}
                            viewerRole={viewerRole}
                            isProcessing={isProcessing}
                            onAccept={handleAccept}
                            onCancel={handleCancel}
                        />
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Action Bar (Only if Pending) */}
            {transaction.status === TRANSACTION_STATUS.PENDING_SELLER_CONFIRM && (
                <div className={STYLES.mobileBar}>
                    {viewerRole === 'SELLER' ? (
                        <Button
                            onClick={handleAccept}
                            loading={isProcessing}
                            className={STYLES.btnAcceptMobile}
                        >
                            {MESSAGES.TX_DETAIL_BTN_ACCEPT}
                        </Button>
                    ) : (
                        <Button
                            onClick={handleCancel}
                            loading={isProcessing}
                            className={STYLES.btnCancelMobile}
                        >
                            {MESSAGES.TX_DETAIL_BTN_CANCEL}
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
