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
    const inProgress = transactions.filter(
      (t) =>
        t.status === TRANSACTION_STATUS.PENDING_DELIVERY ||
        t.status === TRANSACTION_STATUS.IN_DELIVERY,
    ).length;
    const completed = transactions.filter(
      (t) => t.status === TRANSACTION_STATUS.COMPLETED,
    );
    const totalRevenue = completed.reduce((sum, t) => sum + t.totalAmount, 0);

    return { inProgress, completed: completed.length, totalRevenue };
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
        if (isMounted) {
          setTransactions(
            data.filter(
              (t) => t.status !== TRANSACTION_STATUS.PENDING_SELLER_CONFIRM,
            ),
          );
        }
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
      {/* -- Page Header -- */}
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
        {/* -- Stat Cards -- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Đang xử lý */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 text-amber-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Đang xử lý
              </p>
              <p className="text-3xl font-black text-amber-500 leading-none mt-1">
                {stats.inProgress}
              </p>
            </div>
          </div>

          {/* Hoàn thành */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 text-emerald-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Hoàn thành
              </p>
              <p className="text-3xl font-black text-emerald-500 leading-none mt-1">
                {stats.completed}
              </p>
            </div>
          </div>

          {/* T?ng doanh thu */}
          <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl shadow-sm shadow-orange-200 p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-orange-100 uppercase tracking-wide">
                Tổng doanh thu
              </p>
              <p className="text-xl font-black text-white leading-none mt-1">
                {formatPrice(stats.totalRevenue)}
              </p>
            </div>
          </div>
        </div>

        {/* -- Main Panel -- */}
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
                      <span
                        className={`text-xs font-bold rounded-full px-1.5 py-0.5 min-w-5 text-center ${
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
              <svg
                className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Tìm theo tên, mã don..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent focus:bg-white transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  title="Xóa tìm kiếm"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
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
                <svg
                  className="w-10 h-10 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <p className="font-bold text-gray-800 text-lg">
                Không tìm thấy giao dịch nào
              </p>
              <p className="text-gray-400 text-sm mt-2 max-w-xs leading-relaxed">
                {searchTerm
                  ? `Không có kết quả cho "${searchTerm}". Thử từ khóa khác nhé.`
                  : "Các giao dịch của bạn sẽ xuất hiện ở đây sau khi có đơn hàng."}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-4 px-4 py-2 text-sm font-semibold text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                >
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
                    onClick={() =>
                      router.push(`/transactions/${t.transactionId}`)
                    }
                    className="px-5 py-4 flex items-center gap-4 cursor-pointer hover:bg-orange-50/40 active:bg-orange-50 transition-colors"
                  >
                    {/* Image */}
                    <div className="w-14 h-14 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                      {t.listingImage ? (
                        <img
                          src={t.listingImage}
                          className="w-full h-full object-cover"
                          alt=""
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-gray-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <p className="text-xs text-gray-400 font-mono">
                          #{t.transactionId}
                        </p>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getStatusBadgeClasses(t.status)}`}
                        >
                          {getStatusLabel(t.status)}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {t.listingTitle}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-gray-400 truncate max-w-36">
                          {t.buyerName} · {formatDate(t.createdAt)}
                        </p>
                        <p className="text-sm font-black text-orange-600">
                          {formatPrice(t.totalAmount)}
                        </p>
                      </div>
                    </div>

                    <svg
                      className="w-4 h-4 text-gray-300 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                ))}
              </div>

              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/60">
                      <th className="px-6 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Đơn hàng
                      </th>
                      <th className="px-6 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Khách hàng
                      </th>
                      <th className="px-6 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Loại
                      </th>
                      <th className="px-6 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                        Giá trị
                      </th>
                      <th className="px-6 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">
                        Tiến độ
                      </th>
                      <th className="px-6 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3.5" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredTransactions.map((t) => (
                      <tr
                        key={t.transactionId}
                        onClick={() =>
                          router.push(`/transactions/${t.transactionId}`)
                        }
                        className="hover:bg-orange-50/30 transition-colors cursor-pointer group"
                      >
                        {/* Đơn hàng */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 group-hover:border-orange-200 transition-colors">
                              {t.listingImage ? (
                                <img
                                  src={t.listingImage}
                                  className="w-full h-full object-cover"
                                  alt=""
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <svg
                                    className="w-5 h-5 text-gray-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={1.5}
                                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-mono text-gray-400">
                                #{t.transactionId}
                              </p>
                              <p className="text-sm font-semibold text-gray-900 truncate max-w-44 mt-0.5">
                                {t.listingTitle}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {formatDate(t.createdAt)}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Khách hàng */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-xs font-black text-violet-600 flex-shrink-0">
                              {t.buyerName?.charAt(0)?.toUpperCase() || "?"}
                            </div>
                            <p className="text-sm font-medium text-gray-800 truncate max-w-32">
                              {t.buyerName}
                            </p>
                          </div>
                        </td>

                        {/* Loại */}
                        <td className="px-6 py-4">
                          <span
                            className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                              t.transactionType === TRANSACTION_TYPE.PURCHASE
                                ? "bg-blue-50 text-blue-600"
                                : "bg-orange-50 text-orange-600"
                            }`}
                          >
                            {TRANSACTION_TYPE_LABELS[
                              t.transactionType as keyof typeof TRANSACTION_TYPE_LABELS
                            ] || t.transactionType}
                          </span>
                        </td>

                        {/* Giá trị */}
                        <td className="px-6 py-4 text-right">
                          <p className="text-sm font-black text-gray-900">
                            {formatPrice(t.totalAmount)}
                          </p>
                        </td>

                        {/* Tiến độ */}
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            <MiniTimeline status={t.status} />
                          </div>
                        </td>

                        {/* Trạng thái */}
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadgeClasses(t.status)}`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                            {getStatusLabel(t.status)}
                          </span>
                        </td>

                        {/* Action */}
                        <td
                          className="px-6 py-4 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() =>
                              router.push(`/transactions/${t.transactionId}`)
                            }
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-500 hover:text-white rounded-lg border border-orange-200 hover:border-orange-500 transition-all"
                          >
                            Chi tiết
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M9 5l7 7-7 7"
                              />
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
                    Hiển thị{" "}
                    <span className="font-bold text-gray-600">
                      {filteredTransactions.length}
                    </span>
                    {(filterStatus !== "ALL" || searchTerm) && (
                      <>
                        {" "}
                        /{" "}
                        <span className="font-bold text-gray-600">
                          {transactions.length}
                        </span>
                      </>
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
