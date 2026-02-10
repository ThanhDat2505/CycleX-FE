'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { getTransactionDetail, acceptTransaction } from '@/app/services/transactionService';
import { TransactionWithDetails } from '@/app/types/transaction';
import { LoadingSpinner, Button } from '@/app/components/ui';
import { formatPrice, formatDate } from '@/app/utils/format';
import { useToast } from '@/app/contexts/ToastContext';
import OrderTimeline from './components/OrderTimeline';

export default function TransactionDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { isLoggedIn, isLoading: isAuthLoading, role, user } = useAuth();
    const { addToast } = useToast();

    const [transaction, setTransaction] = useState<TransactionWithDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const transactionId = Number(params.id);

    useEffect(() => {
        // Auth check
        if (!isAuthLoading) {
            if (!isLoggedIn) {
                router.push(`/login?returnUrl=/transactions/${transactionId}`);
                return;
            }
            // Basic Role Check: Must be SELLER or BUYER
            // (Ideally we check if they are THE seller/buyer of this transaction, but that requires fetching data first)
            // For now, we allow SELLER/BUYER roles to access the route structure, 
            // but strict data ownership check happens after data load or via backend.
            if (role !== 'SELLER' && role !== 'BUYER') {
                addToast('Bạn không có quyền truy cập trang này', 'error');
                router.push('/');
                return;
            }
        }
    }, [isAuthLoading, isLoggedIn, role, router, transactionId, addToast]);

    useEffect(() => {
        let isMounted = true;

        async function fetchDetail() {
            if (!transactionId || !user?.userId) return; // Wait for user to be loaded
            try {
                setIsLoading(true);
                const data = await getTransactionDetail(transactionId);

                if (isMounted) {
                    // Strict Data Ownership Check
                    const isOwner = data.buyerId === user.userId || data.sellerId === user.userId;

                    if (!isOwner) {
                        setError('Bạn không có quyền truy cập giao dịch này.');
                        addToast('Bạn không có quyền truy cập giao dịch này', 'error');
                        setTimeout(() => router.push('/'), 2000); // Redirect after showing error
                        return;
                    }

                    setTransaction(data);
                }
            } catch (err) {
                if (isMounted) {
                    console.error('Failed to fetch transaction detail:', err);
                    setError('Không thể tải thông tin giao dịch.');
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
                addToast('Đã xác nhận giao dịch thành công! 🎉', 'success');
                // Refresh data to show new status
                const updated = await getTransactionDetail(transaction.transactionId);
                setTransaction(updated);

                // Redirect back to pending list after delay so user can see the toast
                setTimeout(() => {
                    router.push('/seller/transactions/pending');
                }, 1500);
            }
        } catch (err) {
            console.error(err);
            addToast('Có lỗi xảy ra khi xác nhận.', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    if (isAuthLoading || isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error || !transaction) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="text-red-600 mb-4 font-medium">{error || 'Giao dịch không tồn tại'}</div>
                <Button onClick={() => router.back()} variant="secondary">Quay lại danh sách</Button>
            </div>
        );
    }

    // Status Badge Helper
    const getStatusBadge = (status: string) => {
        const styles = {
            PENDING_SELLER_CONFIRM: "bg-yellow-100 text-yellow-800 border-yellow-200",
            CONFIRMED: "bg-blue-100 text-blue-800 border-blue-200",
            COMPLETED: "bg-green-100 text-green-800 border-green-200",
            CANCELLED: "bg-red-100 text-red-800 border-red-200",
        };

        const labels = {
            PENDING_SELLER_CONFIRM: "Chờ xác nhận",
            CONFIRMED: "Đã xác nhận",
            COMPLETED: "Hoàn thành",
            CANCELLED: "Đã hủy",
        };

        const statusKey = status as keyof typeof styles;
        return (
            <span className={`px-4 py-1.5 rounded-full text-sm font-bold border shadow-sm ${styles[statusKey] || "bg-gray-100 text-gray-800 border-gray-200"}`}>
                {labels[statusKey] || status}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Hero Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white pt-10 pb-20 px-4 sm:px-6 lg:px-8 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/3 -translate-y-1/3">
                    <svg width="400" height="400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" /></svg>
                </div>
                <div className="max-w-5xl mx-auto relative z-10">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-blue-100 hover:text-white transition-colors mb-6 group font-medium"
                    >
                        <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Quay lại danh sách
                    </button>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight">Chi tiết đơn hàng #{transaction.transactionId}</h1>
                            <p className="text-blue-100 mt-2 flex items-center text-sm font-medium">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                Ngày tạo: {formatDate(transaction.createdAt)}
                            </p>
                        </div>
                        <div className="flex-shrink-0 animate-fade-in-up">
                            {getStatusBadge(transaction.status)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content - Overlapping Card Style */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">

                {/* Timeline */}
                <div className="animate-fade-in-up">
                    <OrderTimeline
                        status={transaction.status}
                        createdAt={transaction.createdAt}
                        updatedAt={transaction.updatedAt}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Buyer Info Card */}
                        <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden animate-slide-up">
                            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50 flex items-center justify-between">
                                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                    Thông tin người mua
                                </h3>
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Thông tin liên hệ</span>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-xs text-gray-500 font-medium uppercase">Họ và tên</p>
                                        <p className="font-semibold text-gray-900 text-lg">{transaction.buyerName}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-gray-500 font-medium uppercase">Số điện thoại</p>
                                        <p className="font-semibold text-gray-900 text-lg flex items-center gap-2">
                                            {transaction.receiverPhone || '---'}
                                            {transaction.receiverPhone && (
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(transaction.receiverPhone || '');
                                                        addToast('Đã sao chép số điện thoại', 'success', 2000);
                                                    }}
                                                    className="text-gray-400 hover:text-blue-500 transition-colors"
                                                    title="Sao chép"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                                </button>
                                            )}
                                        </p>
                                    </div>
                                    <div className="md:col-span-2 space-y-1">
                                        <p className="text-xs text-gray-500 font-medium uppercase">Địa chỉ nhận xe</p>
                                        <p className="font-medium text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100 border-dashed">
                                            {transaction.receiverAddress || 'Nhận tại cửa hàng'}
                                        </p>
                                    </div>
                                    {transaction.note && (
                                        <div className="md:col-span-2 space-y-1">
                                            <p className="text-xs text-gray-500 font-medium uppercase">Lời nhắn từ người mua</p>
                                            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 text-yellow-800 text-sm italic">
                                                "{transaction.note}"
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Vehicle Info Card */}
                        <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50 flex items-center justify-between">
                                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                    Thông tin xe
                                </h3>
                                <a href={`/listings/${transaction.listingId}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 group">
                                    Xem tin đăng
                                    <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                </a>
                            </div>
                            <div className="p-6">
                                <div className="flex flex-col sm:flex-row gap-6">
                                    <div className="w-full sm:w-40 h-40 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200 shadow-sm relative group">
                                        {transaction.listingImage ? (
                                            <img
                                                src={transaction.listingImage}
                                                alt={transaction.listingTitle}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <h3 className="font-bold text-gray-900 text-xl leading-tight">{transaction.listingTitle}</h3>
                                        <div className="flex items-center gap-3">
                                            <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-mono">ID: {transaction.listingId}</span>
                                            <span className="text-gray-300">|</span>
                                            <span className="text-sm text-gray-500">Người bán: CycleX Verified</span>
                                        </div>
                                        <div className="pt-3 border-t border-gray-100 flex items-baseline gap-2">
                                            <span className="text-xs text-gray-500 uppercase font-semibold">Giá niêm yết:</span>
                                            <span className="text-blue-600 font-bold text-lg">
                                                {formatPrice(transaction.totalAmount / (transaction.transactionType === 'DEPOSIT' ? 0.1 : 1))}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Invoice & Actions */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden sticky top-24 animate-slide-in-right">
                            <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white opacity-5 rounded-full"></div>
                                <h3 className="text-lg font-bold">Thanh toán</h3>
                                <p className="text-gray-400 text-xs mt-1">Chi tiết hoá đơn giao dịch</p>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                                    <span className="text-gray-600 text-sm">Loại giao dịch</span>
                                    <span className={`font-bold px-3 py-1 rounded-full text-xs ${transaction.transactionType === 'PURCHASE' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                                        }`}>
                                        {transaction.transactionType === 'PURCHASE' ? 'MUA NGAY' : 'ĐẶT CỌC'}
                                    </span>
                                </div>

                                <div className="space-y-2 text-sm">
                                    {transaction.depositAmount && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Tiền cọc</span>
                                            <span className="font-medium text-gray-900">{formatPrice(transaction.depositAmount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Phí nền tảng</span>
                                        <span className="font-medium text-gray-900">{formatPrice(transaction.platformFee)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Phí kiểm định</span>
                                        <span className="font-medium text-gray-900">{formatPrice(transaction.inspectionFee)}</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <div className="flex justify-between items-end">
                                        <span className="text-sm font-bold text-gray-900">Tổng cộng</span>
                                        <span className="text-2xl font-extrabold text-blue-600 leading-none">{formatPrice(transaction.totalAmount)}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 text-right mt-1">Đã bao gồm VAT nếu có</p>
                                </div>

                                {/* Actions */}
                                {transaction.status === 'PENDING_SELLER_CONFIRM' && (
                                    <div className="pt-4 mt-2">
                                        <Button
                                            onClick={handleAccept}
                                            loading={isProcessing}
                                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-200 transition-all hover:-translate-y-0.5 active:scale-95"
                                        >
                                            Chấp nhận yêu cầu
                                        </Button>
                                        <p className="text-xs text-gray-400 text-center mt-3 leading-relaxed">
                                            Giao dịch sẽ được chuyển sang trạng thái "Đã xác nhận". Bạn không thể hoàn tác hành động này.
                                        </p>
                                    </div>
                                )}

                                {transaction.status === 'CONFIRMED' && (
                                    <div className="pt-4 mt-2 bg-green-50 rounded-lg p-4 border border-green-100 text-center">
                                        <div className="text-green-700 font-bold flex items-center justify-center gap-2 mb-1">
                                            <svg className="w-5 h-5 bg-green-200 rounded-full p-0.5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Đã xác nhận
                                        </div>
                                        <p className="text-xs text-green-600 opacity-80">
                                            Vui lòng chuẩn bị xe để giao.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Action Bar (Only if Pending) */}
            {transaction.status === 'PENDING_SELLER_CONFIRM' && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] lg:hidden z-50">
                    <Button
                        onClick={handleAccept}
                        loading={isProcessing}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl shadow-lg"
                    >
                        Chấp nhận yêu cầu
                    </Button>
                </div>
            )}
        </div>
    );
}

