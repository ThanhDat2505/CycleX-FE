"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { getAllSellerTransactions } from "@/app/services/transactionService";
import { TransactionWithDetails } from "@/app/types/transaction";
import { LoadingSpinner } from "@/app/components/ui";
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
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Page Header ── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1 h-6 bg-orange-500 rounded-full" />
            <h1 className="text-2xl font-black text-gray-900">Giao dịch</h1>
          </div>
          <p className="text-sm text-gray-500 ml-4">
            Quản lý tất cả giao dịch mua bán của bạn
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Chờ xác nhận */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Chờ xác nhận</p>
              <p className="text-3xl font-black text-orange-500 leading-none mt-1">
                {stats.pending}
              </p>
              {stats.pending > 0 && (
                <span className="text-xs text-orange-500 font-semibold">Cần xử lý</span>
              )}
            </div>
          </div>

          {/* Đang xử lý */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Đang xử lý</p>
              <p className="text-3xl font-black text-amber-500 leading-none mt-1">
                {stats.inProgress}
              </p>
            </div>
          </div>

          {/* Hoàn thành */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Hoàn thành</p>
              <p className="text-3xl font-black text-emerald-500 leading-none mt-1">
                {stats.completed}
              </p>
            </div>
          </div>

          {/* Tổng doanh thu */}
          <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl shadow-sm shadow-orange-200 p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-orange-100 uppercase tracking-wide">Tổng doanh thu</p>
              <p className="text-xl font-black text-white leading-none mt-1">
                {formatPrice(stats.totalRevenue)}
              </p>
            </div>
          </div>
        </div>

        {/* ── Main Panel ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {/* Toolbar */}
          <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            {/* Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 sm:pb-0 flex-shrink-0">
              {STATUS_TABS.map((tab) => {
                const count = getTabCount(tab.key);
                const isActive = filterStatus === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setFilterStatus(tab.key)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-150 ${
                      isActive
                        ? "bg-orange-50 text-orange-600 border border-orange-200"
                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    {tab.label}
                    {count > 0 && (
                      <span className={`text-xs font-bold rounded-full px-1.5 py-0.5 min-w-5 text-center ${
                        isActive ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-500"
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-60 flex-shrink-0">
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Tìm theo tên, mã đơn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent focus:bg-white transition-all"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <LoadingSpinner />
              <p className="text-sm text-gray-400">Đang tải giao dịch...</p>
            </div>

          ) : filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-5">
                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="font-bold text-gray-800 text-lg">Không tìm thấy giao dịch nào</p>
              <p className="text-gray-400 text-sm mt-2 max-w-xs leading-relaxed">
                {searchTerm
                  ? `Không có kết quả cho "${searchTerm}". Thử từ khóa khác nhé.`
                  : "Các giao dịch của bạn sẽ xuất hiện ở đây sau khi có đơn hàng."}
              </p>
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="mt-4 px-4 py-2 text-sm font-semibold text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                  Xóa bộ lọc
                </button>
              )}
            </div>

          ) : (
            <>
              {/* Mobile Cards */}
              <div className="lg:hidden divide-y divide-gray-50">
                {filteredTransactions.map((t) => (
                  <div
                    key={t.transactionId}
                    onClick={() => router.push(`/transactions/${t.transactionId}`)}
                    className="px-5 py-4 flex items-center gap-4 cursor-pointer hover:bg-orange-50/40 active:bg-orange-50 transition-colors"
                  >
                    {/* Image */}
                    <div className="w-14 h-14 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
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
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <p className="text-xs text-gray-400 font-mono">#{t.transactionId}</p>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getStatusBadgeClasses(t.status)}`}>
                          {getStatusLabel(t.status)}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 truncate">{t.listingTitle}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-gray-400 truncate max-w-36">{t.buyerName} · {formatDate(t.createdAt)}</p>
                        <p className="text-sm font-black text-orange-600">{formatPrice(t.totalAmount)}</p>
                      </div>
                    </div>

                    <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                ))}
              </div>

              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/60">
                      <th className="px-6 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Đơn hàng</th>
                      <th className="px-6 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Khách hàng</th>
                      <th className="px-6 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Loại</th>
                      <th className="px-6 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Giá trị</th>
                      <th className="px-6 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Tiến độ</th>
                      <th className="px-6 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Trạng thái</th>
                      <th className="px-6 py-3.5" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredTransactions.map((t) => (
                      <tr
                        key={t.transactionId}
                        onClick={() => router.push(`/transactions/${t.transactionId}`)}
                        className="hover:bg-orange-50/30 transition-colors cursor-pointer group"
                      >
                        {/* Đơn hàng */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 group-hover:border-orange-200 transition-colors">
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
                            <div className="min-w-0">
                              <p className="text-xs font-mono text-gray-400">#{t.transactionId}</p>
                              <p className="text-sm font-semibold text-gray-900 truncate max-w-44 mt-0.5">{t.listingTitle}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{formatDate(t.createdAt)}</p>
                            </div>
                          </div>
                        </td>

                        {/* Khách hàng */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-xs font-black text-violet-600 flex-shrink-0">
                              {t.buyerName?.charAt(0)?.toUpperCase() || "?"}
                            </div>
                            <p className="text-sm font-medium text-gray-800 truncate max-w-32">{t.buyerName}</p>
                          </div>
                        </td>

                        {/* Loại */}
                        <td className="px-6 py-4">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                            t.transactionType === TRANSACTION_TYPE.PURCHASE
                              ? "bg-blue-50 text-blue-600"
                              : "bg-orange-50 text-orange-600"
                          }`}>
                            {TRANSACTION_TYPE_LABELS[t.transactionType as keyof typeof TRANSACTION_TYPE_LABELS] || t.transactionType}
                          </span>
                        </td>

                        {/* Giá trị */}
                        <td className="px-6 py-4 text-right">
                          <p className="text-sm font-black text-gray-900">{formatPrice(t.totalAmount)}</p>
                        </td>

                        {/* Tiến độ */}
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            <MiniTimeline status={t.status} />
                          </div>
                        </td>

                        {/* Trạng thái */}
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadgeClasses(t.status)}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                            {getStatusLabel(t.status)}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => router.push(`/transactions/${t.transactionId}`)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-500 hover:text-white rounded-lg border border-orange-200 hover:border-orange-500 transition-all"
                          >
                            Chi tiết
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Footer */}
                <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-100">
                  <p className="text-xs text-gray-400">
                    Hiển thị <span className="font-bold text-gray-600">{filteredTransactions.length}</span>
                    {(filterStatus !== "ALL" || searchTerm) && (
                      <> / <span className="font-bold text-gray-600">{transactions.length}</span></>
                    )} giao dịch
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

      {/* ═══════════ BANNER HEADER ═══════════ */}
      <div className="relative bg-white border-b border-gray-100 overflow-hidden">
        {/* Accent line top */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400" />
        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-20 w-80 h-80 rounded-full bg-orange-50 blur-3xl opacity-70 pointer-events-none" />
        <div className="absolute -bottom-16 left-1/3 w-56 h-56 rounded-full bg-blue-50 blur-3xl opacity-50 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
          {/* Page title */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1 h-5 rounded-full bg-orange-500 block flex-shrink-0" />
              <span className="text-xs font-extrabold text-orange-500 tracking-widest uppercase">
                Quản lý bán hàng
              </span>
            </div>
            <h1 className="text-3xl font-black text-gray-900">Giao dịch</h1>
            <p className="text-sm text-gray-400 mt-1.5">
              Tổng cộng{" "}
              <span className="font-bold text-gray-600">{transactions.length}</span>{" "}
              giao dịch
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Chờ xác nhận – orange */}
            <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 text-white overflow-hidden shadow-xl shadow-orange-500/25 group hover:-translate-y-1 transition-transform duration-200 cursor-default">
              <div className="absolute -right-6 -top-6 w-28 h-28 bg-white/10 rounded-full group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute right-2 bottom-1 w-16 h-16 bg-white/5 rounded-full" />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2.5">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  {stats.pending > 0 && (
                    <span className="bg-white/25 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                      Cần xử lý
                    </span>
                  )}
                </div>
                <p className="text-5xl font-black tracking-tight leading-none">{stats.pending}</p>
                <p className="text-orange-200 text-xs font-semibold mt-2.5 uppercase tracking-wider">Chờ xác nhận</p>
              </div>
            </div>

            {/* Đang xử lý – amber */}
            <div className="relative bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl p-5 text-white overflow-hidden shadow-xl shadow-amber-500/25 group hover:-translate-y-1 transition-transform duration-200 cursor-default">
              <div className="absolute -right-6 -top-6 w-28 h-28 bg-white/10 rounded-full group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute right-2 bottom-1 w-16 h-16 bg-white/5 rounded-full" />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2.5">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                </div>
                <p className="text-5xl font-black tracking-tight leading-none">{stats.inProgress}</p>
                <p className="text-amber-100 text-xs font-semibold mt-2.5 uppercase tracking-wider">Đang xử lý</p>
              </div>
            </div>

            {/* Hoàn thành – emerald */}
            <div className="relative bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white overflow-hidden shadow-xl shadow-emerald-500/25 group hover:-translate-y-1 transition-transform duration-200 cursor-default">
              <div className="absolute -right-6 -top-6 w-28 h-28 bg-white/10 rounded-full group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute right-2 bottom-1 w-16 h-16 bg-white/5 rounded-full" />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2.5">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-5xl font-black tracking-tight leading-none">{stats.completed}</p>
                <p className="text-emerald-100 text-xs font-semibold mt-2.5 uppercase tracking-wider">Hoàn thành</p>
              </div>
            </div>

            {/* Tổng doanh thu – blue/indigo */}
            <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white overflow-hidden shadow-xl shadow-blue-500/25 group hover:-translate-y-1 transition-transform duration-200 cursor-default">
              <div className="absolute -right-6 -top-6 w-28 h-28 bg-white/10 rounded-full group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute right-2 bottom-1 w-16 h-16 bg-white/5 rounded-full" />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2.5">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-2xl font-black tracking-tight leading-tight">{formatPrice(stats.totalRevenue)}</p>
                <p className="text-blue-200 text-xs font-semibold mt-2.5 uppercase tracking-wider">Tổng doanh thu</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════ MAIN PANEL ═══════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100/80 overflow-hidden min-h-96">

          {/* ─── Toolbar ─── */}
          <div className="px-5 py-3.5 border-b border-gray-100 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">

            {/* Status tabs – filled pill style */}
            <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto pb-0.5 sm:pb-0">
              {STATUS_TABS.map((tab) => {
                const count = getTabCount(tab.key);
                const isActive = filterStatus === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setFilterStatus(tab.key)}
                    className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 ${
                      isActive
                        ? "bg-orange-500 text-white shadow-md shadow-orange-300/40"
                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    {tab.label}
                    {count > 0 && (
                      <span
                        className={`text-xs font-bold rounded-full px-1.5 py-0.5 min-w-5 text-center leading-none ${
                          isActive
                            ? "bg-white/25 text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right side: result count + search */}
            <div className="flex items-center gap-3 w-full sm:w-auto flex-shrink-0">
              {(filterStatus !== "ALL" || searchTerm) && (
                <span className="hidden sm:block text-xs text-gray-400 whitespace-nowrap">
                  <span className="font-bold text-gray-600">{filteredTransactions.length}</span> kết quả
                </span>
              )}
              <div className="relative flex-1 sm:flex-none sm:w-64">
                <input
                  type="text"
                  placeholder="Tìm theo tên, mã đơn..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent focus:bg-white transition-all duration-200"
                />
                <svg
                  className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ─── Content ─── */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <LoadingSpinner />
              <p className="text-sm text-gray-400 animate-pulse">Đang tải giao dịch...</p>
            </div>

          ) : filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center shadow-inner">
                  <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center shadow-sm">
                  <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-800 font-bold text-lg">Không tìm thấy giao dịch</p>
              <p className="text-gray-400 text-sm mt-1.5 max-w-xs leading-relaxed">
                {searchTerm
                  ? `Không có kết quả cho "${searchTerm}". Thử từ khóa khác nhé.`
                  : "Các giao dịch của bạn sẽ xuất hiện ở đây sau khi có đơn hàng."}
              </p>

            </div>
          ) : (
            <>
              {/* ─── Mobile Card View ─── */}
              <div className="lg:hidden">
                {filteredTransactions.map((t, idx) => (
                  <div
                    key={t.transactionId}
                    onClick={() => router.push(`/transactions/${t.transactionId}`)}
                    className={`px-4 py-4 flex items-start gap-3 cursor-pointer active:bg-orange-50 transition-colors duration-150 border-b border-gray-50 last:border-0 ${
                      idx % 2 === 0 ? "bg-white hover:bg-orange-50/20" : "bg-slate-50/40 hover:bg-orange-50/30"
                    }`}
                  >
                    <div className="w-14 h-14 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden border border-gray-200/70 shadow-sm">
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
                        <p className="font-extrabold text-gray-900 text-sm">
                          <span className="text-gray-300 font-normal text-xs select-none">#</span>{t.transactionId}
                        </p>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border ${getStatusBadgeClasses(t.status)}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 flex-shrink-0" />
                          {getStatusLabel(t.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate font-medium mt-0.5">{t.listingTitle}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        <p className="text-xs text-gray-400 truncate max-w-[55%]">
                          {t.buyerName} · {formatDate(t.createdAt)}
                        </p>
                        <p className="text-sm font-extrabold text-orange-600 flex-shrink-0">{formatPrice(t.totalAmount)}</p>
                      </div>
                      <div className="flex items-center gap-1.5 mt-2">
                        <MiniTimeline status={t.status} size="sm" />
                        <span className="text-xs text-gray-400 ml-0.5">
                          {TRANSACTION_TYPE_LABELS[t.transactionType as keyof typeof TRANSACTION_TYPE_LABELS] || t.transactionType}
                        </span>
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-gray-300 flex-shrink-0 self-center" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                ))}
              </div>

              {/* ─── Desktop Table View ─── */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-200/60">
                      <th className="px-6 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Mã đơn / Xe</th>
                      <th className="px-6 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Khách hàng</th>
                      <th className="px-6 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Tổng tiền</th>
                      <th className="px-6 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Trạng thái</th>
                      <th className="px-6 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Tiến độ</th>
                      <th className="px-6 py-3.5"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((t, idx) => (
                      <tr
                        key={t.transactionId}
                        onClick={() => router.push(`/transactions/${t.transactionId}`)}
                        className={`border-b border-gray-50 hover:bg-orange-50/30 transition-colors duration-150 group cursor-pointer ${
                          idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                        }`}
                      >
                        {/* Mã đơn / Xe */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200/80 shadow-sm group-hover:border-orange-200 transition-colors">
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
                            <div className="min-w-0">
                              <p className="font-bold text-gray-900 text-sm">
                                <span className="text-gray-300 font-normal text-xs select-none">#</span>{t.transactionId}
                              </p>
                              <p className="text-xs text-gray-400 truncate max-w-40 mt-0.5">{t.listingTitle}</p>
                            </div>
                          </div>
                        </td>

                        {/* Khách hàng */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black text-white bg-gradient-to-br from-violet-400 to-purple-500 shadow-sm">
                              {t.buyerName?.charAt(0)?.toUpperCase() || "?"}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">{t.buyerName}</p>
                              <p className="text-xs text-gray-400">{formatDate(t.createdAt)}</p>
                            </div>
                          </div>
                        </td>

                        {/* Tổng tiền */}
                        <td className="px-6 py-4 text-right">
                          <p className="text-sm font-black text-gray-900">{formatPrice(t.totalAmount)}</p>
                          <span className={`mt-0.5 inline-block text-xs px-1.5 py-0.5 rounded-md font-bold ${
                            t.transactionType === TRANSACTION_TYPE.PURCHASE
                              ? "bg-blue-50 text-blue-600"
                              : "bg-orange-50 text-orange-600"
                          }`}>
                            {TRANSACTION_TYPE_LABELS[t.transactionType as keyof typeof TRANSACTION_TYPE_LABELS] || t.transactionType}
                          </span>
                        </td>

                        {/* Trạng thái */}
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadgeClasses(t.status)}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80 flex-shrink-0" />
                            {getStatusLabel(t.status)}
                          </span>
                        </td>

                        {/* Tiến độ */}
                        <td className="px-6 py-4 w-36">
                          <div className="flex justify-center opacity-40 group-hover:opacity-100 transition-opacity duration-200">
                            <MiniTimeline status={t.status} />
                          </div>
                        </td>

                        {/* Action */}
                        <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => router.push(`/transactions/${t.transactionId}`)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-500 hover:text-white rounded-lg border border-orange-200 hover:border-orange-500 transition-all duration-200 group/btn"
                          >
                            Chi tiết
                            <svg className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Table footer */}
                <div className="px-6 py-3 bg-gray-50/60 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-xs text-gray-400">
                    Hiển thị{" "}
                    <span className="font-bold text-gray-600">{filteredTransactions.length}</span>
                    {(filterStatus !== "ALL" || searchTerm) && (
                      <> / <span className="font-bold text-gray-600">{transactions.length}</span></>
                    )}{" "}
                    giao dịch
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
