"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  adminDisputeService,
  AdminDisputeQuery,
} from "@/app/services/adminDisputeService";
import { AdminDisputeListRow } from "@/app/types/dispute";
import {
  RefreshCw,
  Gavel,
  Clock,
  Loader2,
  MessageSquare,
  ShieldAlert,
  CheckCircle,
  X,
  AlertTriangle,
  Eye,
  User,
} from '@/app/components/ui/Icons';

const STATUS_OPTIONS = [
  { value: "ALL", label: "Tất cả trạng thái" },
  { value: "OPEN", label: "Đang mở" },
  { value: "IN_PROGRESS", label: "Đang xử lý" },
  { value: "NEED_MORE_INFO", label: "Cần bổ sung" },
  { value: "ESCALATED", label: "Đã chuyển Admin" },
  { value: "RESOLVED", label: "Đã giải quyết" },
  { value: "REJECTED", label: "Đã từ chối" },
];

const SORT_OPTIONS = [
  { value: "createdAt:DESC", label: "Mới nhất trước" },
  { value: "createdAt:ASC", label: "Cũ nhất trước" },
  { value: "updatedAt:DESC", label: "Cập nhật gần đây" },
  { value: "status:ASC", label: "Trạng thái A-Z" },
];

/** Detail link with Tailwind-only styling to avoid inspector.css conflicts */
function DetailLink({ disputeId }: { disputeId: number }) {
  return (
    <Link
      href={`/admin/disputes/${disputeId}`}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider border border-gray-200 bg-gray-50 text-gray-700 no-underline transition-all duration-150 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200"
    >
      <Eye size={14} />
      Xem chi tiết
    </Link>
  );
}

export default function AdminDisputeListClient() {
  const [items, setItems] = useState<AdminDisputeListRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [status, setStatus] = useState("ALL");
  const [createdFrom, setCreatedFrom] = useState("");
  const [createdTo, setCreatedTo] = useState("");
  const [qInput, setQInput] = useState("");
  const [qDebounced, setQDebounced] = useState("");
  const [sort, setSort] = useState("createdAt:DESC");

  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [sortBy, sortDir] = sort.split(":") as [
    "createdAt" | "updatedAt" | "status",
    "ASC" | "DESC",
  ];

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setQDebounced(qInput);
    }, 400);
    return () => window.clearTimeout(timeoutId);
  }, [qInput]);

  const load = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);

      setError(null);
      const query: AdminDisputeQuery = {
        page,
        limit: pageSize,
      };

      if (status && status !== "ALL") query.status = status;
      if (qDebounced.trim()) query.q = qDebounced.trim();
      if (createdFrom) query.fromDate = createdFrom;
      if (createdTo) query.toDate = createdTo;

      const result = await adminDisputeService.getDisputes(query);
      setItems(result.content);
      setTotalItems(result.totalElements);
      setTotalPages(Math.max(1, result.totalPages));
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Không tải được danh sách khiếu nại",
      );
      setItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, [status, createdFrom, createdTo, qDebounced, page]);

  const statusStyle = (status: string) => {
    const s = String(status).toUpperCase();
    switch (s) {
      case "OPEN":
        return "text-blue-700 bg-blue-50 border-blue-200";
      case "IN_PROGRESS":
        return "text-amber-700 bg-amber-50 border-amber-200";
      case "NEED_MORE_INFO":
        return "text-purple-700 bg-purple-50 border-purple-200";
      case "ESCALATED":
        return "text-rose-700 bg-rose-50 border-rose-200";
      case "RESOLVED":
        return "text-emerald-700 bg-emerald-50 border-emerald-200";
      case "REJECTED":
        return "text-gray-600 bg-gray-100 border-gray-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "OPEN":
        return <Clock size={12} />;
      case "IN_PROGRESS":
        return <Loader2 size={12} />;
      case "NEED_MORE_INFO":
        return <MessageSquare size={12} />;
      case "ESCALATED":
        return <ShieldAlert size={12} />;
      case "RESOLVED":
        return <CheckCircle size={12} />;
      case "REJECTED":
        return <X size={12} />;
      default:
        return <AlertTriangle size={12} />;
    }
  };

  if (loading && !refreshing) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-white min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-6 text-xs font-semibold text-gray-600 uppercase tracking-widest animate-pulse">
          Đang tải...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 p-4 lg:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="contentWrapper">
          {/* Filter Card */}
          <div className="filterCard">
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
              <div className="filterField !min-w-0">
                <label className="filterLabel">Trạng thái</label>
                <select
                  className="filterInput w-full"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filterField !min-w-0">
                <label className="filterLabel">Từ ngày tạo</label>
                <input
                  type="date"
                  className="filterInput w-full"
                  value={createdFrom}
                  onChange={(e) => setCreatedFrom(e.target.value)}
                />
              </div>

              <div className="filterField !min-w-0">
                <label className="filterLabel">Đến ngày tạo</label>
                <input
                  type="date"
                  className="filterInput w-full"
                  value={createdTo}
                  onChange={(e) => setCreatedTo(e.target.value)}
                />
              </div>

              <div className="filterField !min-w-0">
                <label className="filterLabel">Tìm kiếm</label>
                <input
                  type="text"
                  className="filterInput w-full"
                  placeholder="Tìm theo ID hoặc tiêu đề..."
                  value={qInput}
                  onChange={(e) => setQInput(e.target.value)}
                />
              </div>

              <div className="filterField !min-w-0">
                <label className="filterLabel">Sắp xếp</label>
                <select
                  className="filterInput w-full"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="filterActions mt-4">
              <button
                className="btn btnGhost"
                type="button"
                onClick={() => {
                  setStatus("ALL");
                  setCreatedFrom("");
                  setCreatedTo("");
                  setQInput("");
                  setQDebounced("");
                  setSort("createdAt:DESC");
                  setPage(0);
                }}
              >
                Xóa bộ lọc
              </button>
              <button
                className="btn btnGhost"
                type="button"
                onClick={() => load(true)}
              >
                <RefreshCw
                  size={14}
                  className={refreshing ? "animate-spin" : ""}
                />
                Làm mới
              </button>
            </div>
          </div>

          {/* Table Card */}
          <div className="tableCard" style={{ marginBottom: 40 }}>
            <div className="overflow-x-auto min-h-[400px]">
              {error ? (
                <div className="flex flex-col items-center justify-center py-32 text-center">
                  <div className="w-24 h-24 bg-red-50 rounded-[2rem] flex items-center justify-center mb-6 text-red-400">
                    <Gavel size={48} />
                  </div>
                  <h3 className="text-2xl font-black text-black mb-2 tracking-tight">
                    Lỗi tải dữ liệu
                  </h3>
                  <p className="text-gray-500 font-medium">{error}</p>
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-[2rem] flex items-center justify-center mb-6 text-gray-400">
                    <Gavel size={48} />
                  </div>
                  <h3 className="text-2xl font-black text-black mb-2 tracking-tight">
                    Không có khiếu nại
                  </h3>
                  <p className="text-gray-500 font-medium">
                    Hệ thống chưa có khiếu nại hoặc không tìm thấy kết quả.
                  </p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                        ID
                      </th>
                      <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                        Tin Đăng & Giao Dịch
                      </th>
                      <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                        Người tạo
                      </th>
                      <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-center">
                        Trạng thái
                      </th>
                      <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                        Ngày tạo
                      </th>
                      <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-right">
                        Chi tiết
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {items.map((row) => (
                      <tr
                        key={row.id}
                        className="group hover:bg-gray-50 transition-colors"
                      >
                        {/* ID column – always visible orange */}
                        <td className="px-8 py-6">
                          <span className="inline-flex items-center justify-center min-w-[48px] px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-sm font-black text-orange-600">
                            #{row.id}
                          </span>
                        </td>

                        {/* Listing & transaction column */}
                        <td className="px-8 py-6">
                          <div>
                            <p className="text-sm font-black text-gray-900 mb-1">
                              {row.listingTitle || "—"}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black text-gray-600 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                                TX-{row.transactionId}
                              </span>
                              <span className="text-[10px] font-bold text-gray-500 truncate max-w-[200px]">
                                {row.reasonText || "—"}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Requester name */}
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
                              <User size={14} className="text-gray-500" />
                            </div>
                            <span className="text-sm font-semibold text-gray-700">
                              {row.requesterName && row.requesterName.trim().length > 1 && row.requesterName !== "-"
                                ? row.requesterName
                                : "Không rõ"}
                            </span>
                          </div>
                        </td>

                        {/* Status badge */}
                        <td className="px-8 py-6 text-center">
                          <span
                            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase border transition-all ${statusStyle(row.status)}`}
                          >
                            {getStatusIcon(row.status)}
                            {row.status}
                          </span>
                        </td>

                        {/* Created at */}
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-900">
                              {row.createdAt?.split("T")[0] || "—"}
                            </span>
                            <span className="text-sm font-medium text-gray-500 mt-0.5">
                              {row.createdAt?.split("T")[1]?.split(".")[0] || ""}
                            </span>
                          </div>
                        </td>

                        {/* Detail link – inline hover style avoids CSS conflicts */}
                        <td className="px-8 py-6 text-right">
                          <DetailLink disputeId={row.id} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: 18,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    background: "#fff",
                    borderRadius: 12,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    padding: "8px 18px",
                  }}
                >
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPage(idx)}
                      style={{
                        minWidth: 36,
                        height: 36,
                        borderRadius: 8,
                        border:
                          idx === page
                            ? "2px solid #FF8A00"
                            : "1px solid #e5e7eb",
                        background: idx === page ? "#FFFAF0" : "#fff",
                        color: idx === page ? "#FF8A00" : "#374151",
                        fontWeight: 700,
                        fontSize: 16,
                        cursor: idx === page ? "default" : "pointer",
                        boxShadow:
                          idx === page
                            ? "0 2px 8px rgba(255,138,0,0.08)"
                            : "none",
                        outline: "none",
                        transition: "all 0.15s",
                        borderColor: idx === page ? "#FF8A00" : "#e5e7eb",
                      }}
                      disabled={idx === page}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
