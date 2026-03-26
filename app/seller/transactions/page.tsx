"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { getAllSellerTransactions } from "@/app/services/transactionService";
import { TransactionWithDetails } from "@/app/types/transaction";
import { LoadingSpinner, EmptyState, Button } from "@/app/components/ui";
import MiniTimeline from "@/app/components/ui/MiniTimeline";
import { formatPrice, formatDate } from "@/app/utils/format";
import { useToast } from "@/app/contexts/ToastContext";
import { getStatusColors } from "@/app/constants/statusColors";
import {
  TRANSACTION_STATUS,
  TRANSACTION_STATUS_LABELS,
  TRANSACTION_TYPE,
  TRANSACTION_TYPE_LABELS,
} from "@/app/constants/transactionStatus";

const STATUS_TABS = [
  { key: "ALL", label: "Tất cả" },
  { key: TRANSACTION_STATUS.PENDING_SELLER_CONFIRM, label: "Chờ xác nhận" },
  { key: TRANSACTION_STATUS.PENDING_DELIVERY, label: "Chờ giao hàng" },
  { key: TRANSACTION_STATUS.IN_DELIVERY, label: "Đang giao" },
  { key: TRANSACTION_STATUS.COMPLETED, label: "Hoàn thành" },
  { key: TRANSACTION_STATUS.CANCELLED, label: "Đã hủy" },
];

export default function SellerTransactionsPage() {
  const router = useRouter();
  const { user, isLoggedIn, isLoading: isAuthLoading } = useAuth();
  const { addToast } = useToast();

  const [transactions, setTransactions] = useState<TransactionWithDetails[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // Stats
  const stats = useMemo(() => {
    const pending = transactions.filter(
      (t) => t.status === TRANSACTION_STATUS.PENDING_SELLER_CONFIRM,
    ).length;
    const inProgress = transactions.filter(
      (t) =>
        t.status === TRANSACTION_STATUS.PENDING_DELIVERY ||
        t.status === TRANSACTION_STATUS.IN_DELIVERY,
    ).length;
    const completed = transactions.filter(
      (t) => t.status === TRANSACTION_STATUS.COMPLETED,
    );
    const totalRevenue = completed.reduce((sum, t) => sum + t.totalAmount, 0);

    return { pending, inProgress, completed: completed.length, totalRevenue };
  }, [transactions]);

  useEffect(() => {
    if (!isAuthLoading && !isLoggedIn) {
      router.push("/login");
    }
  }, [isAuthLoading, isLoggedIn, router]);

  useEffect(() => {
    let isMounted = true;

    async function fetchAll() {
      if (!user?.userId) return;
      try {
        setIsLoading(true);
        const data = await getAllSellerTransactions(user.userId);
        if (isMounted) setTransactions(data);
      } catch {
        if (isMounted) addToast("Không thể tải danh sách giao dịch", "error");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    if (user?.userId) fetchAll();
    return () => {
      isMounted = false;
    };
  }, [user, addToast]);

  // Filtered list
  const filteredTransactions = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return transactions.filter((t) => {
      const matchesStatus = filterStatus === "ALL" || t.status === filterStatus;
      const matchesSearch =
        !searchTerm ||
        t.buyerName?.toLowerCase().includes(lowerSearch) ||
        t.listingTitle?.toLowerCase().includes(lowerSearch) ||
        t.transactionId.toString().includes(searchTerm);
      return matchesStatus && matchesSearch;
    });
  }, [transactions, filterStatus, searchTerm]);

  const getStatusBadgeClasses = useCallback((status: string) => {
    const colors = getStatusColors(status);
    return `${colors.bg} ${colors.text} border-current/20`;
  }, []);

  const getStatusLabel = useCallback((status: string): string => {
    return (
      TRANSACTION_STATUS_LABELS[
        status as keyof typeof TRANSACTION_STATUS_LABELS
      ] || status
    );
  }, []);

  // Count per tab
  const getTabCount = useCallback(
    (key: string) => {
      if (key === "ALL") return transactions.length;
      return transactions.filter((t) => t.status === key).length;
    },
    [transactions],
  );

  if (isAuthLoading)
    return (
      <div className="flex justify-center p-12">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header + Stats */}
      <div className="relative bg-white border-b border-gray-100 pt-8 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full -translate-y-1/2 translate-x-1/4 opacity-60 pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-blue-50 rounded-full translate-y-1/2 opacity-50 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          <div className="mb-6">
            <p className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-1">
              Quản lý
            </p>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Giao dịch
            </h1>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Chờ xác nhận */}
            <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 text-white shadow-lg shadow-orange-200 overflow-hidden">
              <div className="absolute -right-3 -top-3 w-20 h-20 bg-white/10 rounded-full" />
              <div className="absolute -right-1 -bottom-4 w-14 h-14 bg-white/10 rounded-full" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-orange-100 text-xs font-semibold uppercase tracking-wide">
                    Chờ xác nhận
                  </p>
                  <div className="bg-white/20 rounded-lg p-1.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-4xl font-black">{stats.pending}</p>
                <p className="text-orange-200 text-xs mt-1">đơn hàng</p>
              </div>
            </div>

            {/* Đang xử lý */}
            <div className="relative bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl p-5 text-white shadow-lg shadow-amber-200 overflow-hidden">
              <div className="absolute -right-3 -top-3 w-20 h-20 bg-white/10 rounded-full" />
              <div className="absolute -right-1 -bottom-4 w-14 h-14 bg-white/10 rounded-full" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-amber-100 text-xs font-semibold uppercase tracking-wide">
                    Đang xử lý
                  </p>
                  <div className="bg-white/20 rounded-lg p-1.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                </div>
                <p className="text-4xl font-black">{stats.inProgress}</p>
                <p className="text-amber-100 text-xs mt-1">đơn hàng</p>
              </div>
            </div>

            {/* Hoàn thành */}
            <div className="relative bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white shadow-lg shadow-emerald-200 overflow-hidden">
              <div className="absolute -right-3 -top-3 w-20 h-20 bg-white/10 rounded-full" />
              <div className="absolute -right-1 -bottom-4 w-14 h-14 bg-white/10 rounded-full" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-emerald-100 text-xs font-semibold uppercase tracking-wide">
                    Hoàn thành
                  </p>
                  <div className="bg-white/20 rounded-lg p-1.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-4xl font-black">{stats.completed}</p>
                <p className="text-emerald-100 text-xs mt-1">đơn hàng</p>
              </div>
            </div>

            {/* Tổng doanh thu */}
            <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white shadow-lg shadow-blue-200 overflow-hidden">
              <div className="absolute -right-3 -top-3 w-20 h-20 bg-white/10 rounded-full" />
              <div className="absolute -right-1 -bottom-4 w-14 h-14 bg-white/10 rounded-full" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-blue-100 text-xs font-semibold uppercase tracking-wide">
                    Tổng doanh thu
                  </p>
                  <div className="bg-white/20 rounded-lg p-1.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-2xl font-black leading-tight">{formatPrice(stats.totalRevenue)}</p>
                <p className="text-blue-200 text-xs mt-1">tổng cộng</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
          {/* Toolbar */}
          <div className="px-5 pt-5 pb-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
            {/* Status Tabs */}
            <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {STATUS_TABS.map((tab) => {
                const count = getTabCount(tab.key);
                const isActive = filterStatus === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setFilterStatus(tab.key)}
                    className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                      isActive
                        ? "bg-orange-50 text-orange-600"
                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-orange-500 rounded-full" />
                    )}
                    {tab.label}
                    {count > 0 && (
                      <span
                        className={`text-[11px] font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center ${
                          isActive
                            ? "bg-orange-500 text-white"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-60 flex-shrink-0">
              <input
                type="text"
                placeholder="Tìm theo tên, mã đơn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent focus:bg-white transition-all"
              />
              <svg
                className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="p-12 flex justify-center">
              <LoadingSpinner />
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-gray-700 font-semibold text-base">Không tìm thấy giao dịch nào</p>
              <p className="text-gray-400 text-sm mt-1">
                {searchTerm ? "Thử tìm kiếm với từ khóa khác" : "Các giao dịch của bạn sẽ xuất hiện ở đây"}
              </p>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="lg:hidden divide-y divide-gray-50">
                {filteredTransactions.map((t) => (
                  <div
                    key={t.transactionId}
                    onClick={() => router.push(`/transactions/${t.transactionId}`)}
                    className="p-4 hover:bg-orange-50/30 transition-colors cursor-pointer active:bg-orange-50"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200 shadow-sm">
                        {t.listingImage ? (
                          <img src={t.listingImage} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-bold text-gray-900 text-sm">
                            <span className="text-gray-400 font-normal">#</span>{t.transactionId}
                          </p>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeClasses(t.status)}`}>
                            {getStatusLabel(t.status)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate mt-0.5">{t.listingTitle}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-gray-400">
                            {t.buyerName} · {formatDate(t.createdAt)}
                          </p>
                          <p className="text-sm font-bold text-orange-600">{formatPrice(t.totalAmount)}</p>
                        </div>
                        <div className="flex items-center gap-1.5 mt-2">
                          <MiniTimeline status={t.status} size="sm" />
                          <span className="text-[10px] text-gray-400 ml-1">
                            {TRANSACTION_TYPE_LABELS[t.transactionType as keyof typeof TRANSACTION_TYPE_LABELS] || t.transactionType}
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

              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Mã đơn / Xe</th>
                      <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Khách hàng</th>
                      <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Tổng tiền</th>
                      <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Trạng thái</th>
                      <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Tiến độ</th>
                      <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((t, idx) => (
                      <tr
                        key={t.transactionId}
                        className={`border-b border-gray-50 hover:bg-orange-50/40 transition-colors group cursor-pointer ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}
                        onClick={() => router.push(`/transactions/${t.transactionId}`)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200 shadow-sm">
                              {t.listingImage ? (
                                <img src={t.listingImage} className="w-full h-full object-cover" alt="" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-sm">
                                <span className="text-gray-400 font-normal text-xs">#</span>{t.transactionId}
                              </p>
                              <p className="text-xs text-gray-500 truncate max-w-[160px] mt-0.5">{t.listingTitle}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex-shrink-0 flex items-center justify-center">
                              <span className="text-xs font-bold text-gray-600">
                                {t.buyerName?.charAt(0)?.toUpperCase() || "?"}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{t.buyerName}</p>
                              <p className="text-xs text-gray-400">{formatDate(t.createdAt)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="text-sm font-bold text-gray-900">{formatPrice(t.totalAmount)}</p>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                            t.transactionType === TRANSACTION_TYPE.PURCHASE
                              ? "bg-blue-50 text-blue-600"
                              : "bg-orange-50 text-orange-600"
                          }`}>
                            {TRANSACTION_TYPE_LABELS[t.transactionType as keyof typeof TRANSACTION_TYPE_LABELS] || t.transactionType}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadgeClasses(t.status)}`}>
                            {getStatusLabel(t.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 w-36">
                          <div className="flex justify-center opacity-50 group-hover:opacity-100 transition-opacity">
                            <MiniTimeline status={t.status} />
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
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
