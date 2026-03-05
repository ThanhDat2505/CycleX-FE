'use client';

import { TransactionWithDetails } from '@/app/types/transaction';
import Link from 'next/link';
import { formatPrice, formatDate } from '@/app/utils/format';
import { useToast } from '@/app/contexts/ToastContext';
import { useState } from 'react';

interface TransactionCardProps {
    transaction: TransactionWithDetails;
}

export default function TransactionCard({ transaction }: TransactionCardProps) {
    // Helper functions moved to utils
    const { addToast } = useToast();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isAccepted, setIsAccepted] = useState(false);

    const handleAccept = async () => {
        try {
            setIsProcessing(true);
            // Dynamic import to avoid cycles/ensure client side execution
            const { acceptTransaction } = await import('@/app/services/transactionService');
            await acceptTransaction(transaction.transactionId);

            setIsAccepted(true);
            addToast('Đã chấp nhận giao dịch thành công! 🎉', 'success');

            // In a real app, we might trigger a re-fetch or remove from list via prop callback
        } catch (error) {
            addToast('Có lỗi xảy ra. Vui lòng thử lại.', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    if (isAccepted) return null; // Optimistic removal

    return (
        <div className="bg-white rounded-xl shadow-card border border-gray-100 p-4 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 group relative">
            <div className="flex gap-5">
                {/* Image */}
                <div className="w-28 h-28 flex-shrink-0 relative overflow-hidden rounded-lg">
                    {transaction.listingImage ? (
                        <img
                            src={transaction.listingImage}
                            alt={transaction.listingTitle}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                            No Image
                        </div>
                    )}
                    <div className="absolute top-0 left-0 w-full h-full bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start gap-2">
                            <div>
                                <Link
                                    href={`/transactions/${transaction.transactionId}`}
                                    className="text-lg font-bold text-gray-800 hover:text-blue-600 line-clamp-1 transition-colors"
                                >
                                    {transaction.listingTitle}
                                </Link>
                                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                    <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono text-gray-600">
                                        #{transaction.transactionId}
                                    </span>
                                    <span className="text-gray-300">•</span>
                                    <span className="flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {formatDate(transaction.createdAt)}
                                    </span>
                                </p>
                            </div>
                            <span className="px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-bold rounded-full border border-yellow-100 shadow-sm whitespace-nowrap">
                                Chờ xác nhận
                            </span>
                        </div>

                        <div className="mt-3 flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <span className="font-medium text-gray-900">{transaction.buyerName}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${transaction.transactionType === 'PURCHASE' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <span className={`font-bold text-xs uppercase tracking-wide ${transaction.transactionType === 'PURCHASE' ? 'text-blue-600' : 'text-orange-600'}`}>
                                    {transaction.transactionType === 'PURCHASE' ? 'Mua ngay' : 'Đặt cọc'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between items-end">
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Tổng giá trị</span>
                            <span className="text-xl font-bold text-gray-900 leading-none mt-1">
                                {formatPrice(transaction.totalAmount)}
                            </span>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={handleAccept}
                                disabled={isProcessing}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 border border-transparent rounded-lg text-sm font-bold text-white hover:bg-green-700 transition-all shadow-sm hover:shadow active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? (
                                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                                {isProcessing ? 'Đang xử lý...' : 'Chấp nhận'}
                            </button>
                            <Link
                                href={`/transactions/${transaction.transactionId}`}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm group-hover:bg-blue-50 group-hover:text-blue-700 group-hover:border-blue-200"
                            >
                                Chi tiết
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
