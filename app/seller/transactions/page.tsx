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
  { key: TRANSACTION_STATUS.DISPUTED, label: "Tranh chấp" },
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
      <div className="bg-white border-b border-gray-200 pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Giao dịch</h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white shadow-lg shadow-orange-200">
              <p className="text-orange-100 text-sm font-medium mb-1">
                Chờ xác nhận
              </p>
              <p className="text-2xl font-bold">{stats.pending}</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
              <p className="text-gray-500 text-sm font-medium mb-1">
                Đang xử lý
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.inProgress}
              </p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
              <p className="text-gray-500 text-sm font-medium mb-1">
                Hoàn thành
              </p>
              <p className="text-2xl font-bold text-green-600">
                {stats.completed}
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg shadow-blue-200">
              <p className="text-blue-100 text-sm font-medium mb-1">
                Tổng doanh thu
              </p>
              <p className="text-2xl font-bold">
                {formatPrice(stats.totalRevenue)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden min-h-[500px]">
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white">
            {/* Status Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-lg w-full sm:w-auto overflow-x-auto">
              {STATUS_TABS.map((tab) => {
                const count = getTabCount(tab.key);
                return (
                  <button
                    key={tab.key}
                    onClick={() => setFilterStatus(tab.key)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                      filterStatus === tab.key
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.label}
                    {count > 0 && (
                      <span
                        className={`text-xs rounded-full px-1.5 py-0.5 ${
                          filterStatus === tab.key
                            ? "bg-orange-100 text-orange-600"
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

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Tìm theo tên, mã đơn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
              <svg
                className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
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
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="p-12 flex justify-center">
              <LoadingSpinner />
            </div>
          ) : filteredTransactions.length === 0 ? (
            <EmptyState
              title="Không tìm thấy giao dịch nào"
              description={
                searchTerm
                  ? "Thử tìm kiếm với từ khóa khác"
                  : "Các giao dịch của bạn sẽ xuất hiện ở đây"
              }
            />
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="lg:hidden divide-y divide-gray-100">
                {filteredTransactions.map((t) => (
                  <div
                    key={t.transactionId}
                    onClick={() =>
                      router.push(`/transactions/${t.transactionId}`)
                    }
                    className="p-4 hover:bg-gray-50 transition-colors cursor-pointer active:bg-gray-100"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                        {t.listingImage && (
                          <img
                            src={t.listingImage}
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-bold text-gray-900 text-sm">
                            #{t.transactionId}
                          </p>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeClasses(t.status)}`}
                          >
                            {getStatusLabel(t.status)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate mt-0.5">
                          {t.listingTitle}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-gray-400">
                            {t.buyerName} · {formatDate(t.createdAt)}
                          </p>
                          <p className="text-sm font-bold text-orange-600">
                            {formatPrice(t.totalAmount)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 mt-2">
                          <MiniTimeline status={t.status} size="sm" />
                          <span className="text-[10px] text-gray-400 ml-1">
                            {TRANSACTION_TYPE_LABELS[
                              t.transactionType as keyof typeof TRANSACTION_TYPE_LABELS
                            ] || t.transactionType}
                          </span>
                        </div>
                      </div>
                      <svg
                        className="w-4 h-4 text-gray-300 flex-shrink-0 mt-1"
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
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold">Mã đơn / Xe</th>
                      <th className="px-6 py-4 font-semibold">Khách hàng</th>
                      <th className="px-6 py-4 font-semibold text-right">
                        Tổng tiền
                      </th>
                      <th className="px-6 py-4 font-semibold text-center">
                        Trạng thái
                      </th>
                      <th className="px-6 py-4 font-semibold text-center">
                        Tiến độ
                      </th>
                      <th className="px-6 py-4 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredTransactions.map((t) => (
                      <tr
                        key={t.transactionId}
                        className="hover:bg-orange-50/30 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                              {t.listingImage && (
                                <img
                                  src={t.listingImage}
                                  className="w-full h-full object-cover"
                                  alt=""
                                />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-sm">
                                #{t.transactionId}
                              </p>
                              <p className="text-xs text-gray-500 truncate max-w-[150px]">
                                {t.listingTitle}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-gray-900">
                            {t.buyerName}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatDate(t.createdAt)}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="text-sm font-bold text-gray-900">
                            {formatPrice(t.totalAmount)}
                          </p>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
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
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadgeClasses(t.status)}`}
                          >
                            {getStatusLabel(t.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 w-32">
                          <div className="flex justify-center opacity-40 group-hover:opacity-100 transition-opacity">
                            <MiniTimeline status={t.status} />
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() =>
                              router.push(`/transactions/${t.transactionId}`)
                            }
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
