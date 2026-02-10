'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { getSellerTransactions } from '@/app/services/transactionService';
import { TransactionWithDetails } from '@/app/types/transaction';
import { LoadingSpinner, EmptyState, Button } from '@/app/components/ui';
import { formatPrice, formatDate } from '@/app/utils/format';
import { useToast } from '@/app/contexts/ToastContext';

// Mock Data for Insights
const INSIGHTS = {
    totalRevenue: 45000000,
    totalOrders: 12,
    completionRate: 92,
    thisMonth: 8500000
};

export default function TransactionHistoryPage() {
    const router = useRouter();
    const { user, isLoggedIn, isLoading: isAuthLoading } = useAuth();
    const { addToast } = useToast();

    const [transactions, setTransactions] = useState<TransactionWithDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('ALL');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!isAuthLoading && !isLoggedIn) {
            router.push('/login');
        }
    }, [isAuthLoading, isLoggedIn, router]);

    useEffect(() => {
        async function fetchHistory() {
            if (!user?.userId) return;
            try {
                setIsLoading(true);
                // Fetch all transactions then filter client-side for "Smart Dashboard" feel
                const data = await getSellerTransactions(user.userId);
                setTransactions(data);
            } catch (error) {
                console.error('Failed to fetch history:', error);
                addToast('Không thể tải lịch sử giao dịch', 'error');
            } finally {
                setIsLoading(false);
            }
        }

        if (user?.userId) {
            fetchHistory();
        }
    }, [user, addToast]);

    // Filter Logic
    const filteredTransactions = transactions.filter(t => {
        const matchesStatus = filterStatus === 'ALL' || t.status === filterStatus;
        const matchesSearch = t.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.listingTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.transactionId.toString().includes(searchTerm);
        return matchesStatus && matchesSearch;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'COMPLETED': return 'bg-green-100 text-green-700 border-green-200';
            case 'CANCELLED': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'PENDING_SELLER_CONFIRM': return 'Chờ xử lý';
            case 'CONFIRMED': return 'Đã xác nhận';
            case 'COMPLETED': return 'Hoàn thành';
            case 'CANCELLED': return 'Đã hủy';
            default: return status;
        }
    };

    if (isAuthLoading) return <div className="flex justify-center p-12"><LoadingSpinner /></div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* 1. Header & Insights */}
            <div className="bg-white border-b border-gray-200 pt-8 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Lịch sử giao dịch</h1>

                    {/* Insight Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg shadow-blue-200">
                            <p className="text-blue-100 text-sm font-medium mb-1">Tổng doanh thu</p>
                            <p className="text-2xl font-bold">{formatPrice(INSIGHTS.totalRevenue)}</p>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                            <p className="text-gray-500 text-sm font-medium mb-1">Đơn hàng tháng này</p>
                            <div className="flex items-end gap-2">
                                <p className="text-2xl font-bold text-gray-900">{INSIGHTS.totalOrders}</p>
                                <span className="text-green-600 text-xs font-bold mb-1">+{INSIGHTS.thisMonth.toLocaleString()}đ</span>
                            </div>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                            <p className="text-gray-500 text-sm font-medium mb-1">Tỷ lệ hoàn thành</p>
                            <p className="text-2xl font-bold text-gray-900">{INSIGHTS.completionRate}%</p>
                            <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                                <div className="bg-green-500 h-full rounded-full" style={{ width: `${INSIGHTS.completionRate}%` }}></div>
                            </div>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col justify-center items-center cursor-pointer hover:bg-gray-50 transition-colors border-dashed border-2">
                            <span className="text-blue-600 font-bold text-sm">+ Xuất báo cáo</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
                <div className="bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden min-h-[500px]">

                    {/* Toolbar */}
                    <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white">
                        {/* Tabs */}
                        <div className="flex bg-gray-100 p-1 rounded-lg w-full sm:w-auto overflow-x-auto">
                            {['ALL', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${filterStatus === status
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {status === 'ALL' ? 'Tất cả' : getStatusLabel(status)}
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="relative w-full sm:w-64">
                            <input
                                type="text"
                                placeholder="Tìm theo tên, mã đơn..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Table */}
                    {isLoading ? (
                        <div className="p-12 flex justify-center"><LoadingSpinner /></div>
                    ) : filteredTransactions.length === 0 ? (
                        <EmptyState
                            title="Không tìm thấy đơn hàng nào"
                            description={searchTerm ? "Thử tìm kiếm với từ khóa khác" : "Lịch sử giao dịch của bạn sẽ xuất hiện ở đây"}
                        />
                    ) : (
                        <>
                            {/* Mobile: Card View */}
                            <div className="lg:hidden divide-y divide-gray-100">
                                {filteredTransactions.map((t) => (
                                    <div
                                        key={t.transactionId}
                                        onClick={() => router.push(`/transactions/${t.transactionId}`)}
                                        className="p-4 hover:bg-gray-50 transition-colors cursor-pointer active:bg-gray-100"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                                {t.listingImage && <img src={t.listingImage} className="w-full h-full object-cover" alt="" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className="font-bold text-gray-900 text-sm">#{t.transactionId}</p>
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(t.status)}`}>
                                                        {getStatusLabel(t.status)}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 truncate mt-0.5">{t.listingTitle}</p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <div>
                                                        <p className="text-xs text-gray-400">{t.buyerName} · {formatDate(t.createdAt)}</p>
                                                    </div>
                                                    <p className="text-sm font-bold text-blue-600">{formatPrice(t.totalAmount)}</p>
                                                </div>
                                                {/* Mini Timeline */}
                                                <div className="flex items-center gap-1 mt-2">
                                                    {[1, 2, 3].map((step) => {
                                                        const active =
                                                            (t.status === 'PENDING_SELLER_CONFIRM' && step <= 1) ||
                                                            (t.status === 'CONFIRMED' && step <= 2) ||
                                                            (t.status === 'COMPLETED' && step <= 3);
                                                        if (t.status === 'CANCELLED') return step === 1 ? <div key={step} className="w-1.5 h-1.5 rounded-full bg-red-400"></div> : null;
                                                        return <div key={step} className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-green-500' : 'bg-gray-200'}`}></div>;
                                                    })}
                                                    <span className="text-[10px] text-gray-400 ml-1">
                                                        {t.transactionType === 'PURCHASE' ? 'Mua ngay' : 'Đặt cọc'}
                                                    </span>
                                                </div>
                                            </div>
                                            <svg className="w-4 h-4 text-gray-300 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop: Table View */}
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                                            <th className="px-6 py-4 font-semibold">Mã đơn / Xe</th>
                                            <th className="px-6 py-4 font-semibold">Khách hàng</th>
                                            <th className="px-6 py-4 font-semibold text-right">Tổng tiền</th>
                                            <th className="px-6 py-4 font-semibold text-center">Trạng thái</th>
                                            <th className="px-6 py-4 font-semibold text-center">Tiến độ</th>
                                            <th className="px-6 py-4 text-right"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredTransactions.map((t) => (
                                            <tr key={t.transactionId} className="hover:bg-blue-50/30 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                                            {t.listingImage && <img src={t.listingImage} className="w-full h-full object-cover" alt="" />}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900 text-sm">#{t.transactionId}</p>
                                                            <p className="text-xs text-gray-500 truncate max-w-[150px]">{t.listingTitle}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-medium text-gray-900">{t.buyerName}</p>
                                                    <p className="text-xs text-gray-400">{formatDate(t.createdAt)}</p>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <p className="text-sm font-bold text-gray-900">{formatPrice(t.totalAmount)}</p>
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${t.transactionType === 'PURCHASE' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                                                        {t.transactionType === 'PURCHASE' ? 'Mua ngay' : 'Đặt cọc'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(t.status)}`}>
                                                        {getStatusLabel(t.status)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 w-32">
                                                    {/* Mini Timeline */}
                                                    <div className="flex items-center gap-1 justify-center opacity-40 group-hover:opacity-100 transition-opacity">
                                                        {[1, 2, 3].map((step) => {
                                                            const active =
                                                                (t.status === 'PENDING_SELLER_CONFIRM' && step <= 1) ||
                                                                (t.status === 'CONFIRMED' && step <= 2) ||
                                                                (t.status === 'COMPLETED' && step <= 3);
                                                            if (t.status === 'CANCELLED') return step === 1 ? <div key={step} className="w-2 h-2 rounded-full bg-red-400"></div> : null;
                                                            return (
                                                                <div
                                                                    key={step}
                                                                    className={`w-2 h-2 rounded-full transition-colors ${active ? 'bg-green-500' : 'bg-gray-200'}`}
                                                                ></div>
                                                            );
                                                        })}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        onClick={() => router.push(`/transactions/${t.transactionId}`)}
                                                    >
                                                        Chi tiết
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
