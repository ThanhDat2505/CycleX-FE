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
        if (isMounted)
          addToast("Không thể tải danh sách giao dịch", "error");
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
              Giao Dịch
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
                    {(filterStatus !== "ALL" || searchTerm) && (
                      <>
                        {" "}
                        /{" "}
                        <span className="font-bold text-gray-600">
                          {transactions.length}
                        </span>
                      </>
                    )}{" "}
                    Giao Dịch
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
