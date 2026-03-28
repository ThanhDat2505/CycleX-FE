"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  disputeService,
  type DisputeListResult,
  type DisputeListRow,
} from "@/app/services/inspectorDisputeService";
import { getErrorMessage } from "@/app/services/errorUtils";
import {
  Filter,
  Calendar,
  Shield,
  Hash,
  Search,
  Info,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Gavel,
  Clock,
  Tag,
  User,
  ExternalLink,
  AlertCircle,
  LayoutDashboard,
  ClipboardList,
  History,
} from "lucide-react";
import { formatDate } from "@/app/utils/format";

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

export default function DisputeListClient() {
  const [items, setItems] = useState<DisputeListRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [status, setStatus] = useState("ALL");
  const [createdFrom, setCreatedFrom] = useState("");
  const [createdTo, setCreatedTo] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [qInput, setQInput] = useState("");
  const [qDebounced, setQDebounced] = useState("");
  const [sort, setSort] = useState("createdAt:DESC");

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [sortBy, sortDir] = sort.split(":") as [
    "createdAt" | "updatedAt" | "status" | "disputeId",
    "ASC" | "DESC",
  ];

  const canPrevious = page > 0;
  const canNext = page + 1 < totalPages;

  const isAdmin = useMemo(() => {
    const context = disputeService.getCurrentUserContext();
    return context.role === "ADMIN";
  }, []);

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
      const result: DisputeListResult = await disputeService.getDisputes({
        status,
        createdFrom,
        createdTo,
        assigneeId: isAdmin ? assigneeId : undefined,
        q: qDebounced.trim() || undefined,
        sortBy,
        sortDir,
        page,
        limit: pageSize,
      });

      setItems(result.items);
      setPage(result.page);
      setPageSize(result.pageSize);
      setTotalItems(result.totalItems);
      setTotalPages(Math.max(1, result.totalPages));
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Không tải được danh sách tranh chấp"));
      setItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, [
    status,
    createdFrom,
    createdTo,
    assigneeId,
    qDebounced,
    sortBy,
    sortDir,
    page,
    pageSize,
    isAdmin,
  ]);

  const statusStyle = (status: string) => {
    const s = String(status).toUpperCase();
    if (s === "RESOLVED")
      return "text-emerald-700 bg-emerald-50 border-emerald-200";
    if (s === "OPEN") return "text-rose-600 bg-rose-50 border-rose-200";
    if (s === "IN_PROGRESS")
      return "text-amber-700 bg-amber-50 border-amber-200";
    return "text-gray-600 bg-gray-100 border-gray-200";
  };

  if (loading && !refreshing) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-brand-bg min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] animate-pulse">
          Đang đồng bộ danh sách...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-900 p-4 lg:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="contentWrapper">
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
                <label className="filterLabel">Tìm theo ID</label>
                <input
                  type="text"
                  className="filterInput w-full"
                  placeholder="disputeId / transactionId / listingId..."
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
                  setAssigneeId("");
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

          <div className="tableCard" style={{ marginBottom: 40 }}>
            <div className="overflow-x-auto min-h-[400px]">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-[2rem] flex items-center justify-center mb-6 text-gray-400">
                    <Gavel size={48} />
                  </div>
                  <h3 className="text-2xl font-black text-black mb-2 tracking-tight">
                    Hàng chờ trống
                  </h3>
                  <p className="text-gray-500 font-medium">
                    Không có tranh chấp nào khớp với yêu cầu của bạn.
                  </p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                        ID
                      </th>
                      <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                        Giao Dịch & Tin Đăng
                      </th>
                      <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                        Người tạo
                      </th>
                      <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-center">
                        Trạng thái
                      </th>
                      <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                        Khởi tạo
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
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-black text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all transform group-hover:rotate-6">
                              #{row.id}
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div>
                            <p className="text-sm font-black text-gray-900 mb-1 group-hover:text-brand-primary transition-colors">
                              {row.listingTitle}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                                TX-{row.transactionId}
                              </span>
                              <span className="text-[10px] font-bold text-gray-400 truncate max-w-[200px]">
                                {row.reason}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center">
                              <User size={12} className="text-gray-500" />
                            </div>
                            <span className="text-xs font-bold text-gray-700">
                              {row.requesterName || "—"}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <span
                            className={`inline-flex px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase border transition-all ${statusStyle(row.status)}`}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="text-[11px] font-black text-gray-900">
                              {row.createdAt.split("T")[0]}
                            </span>
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mt-1">
                              {row.createdAt.split("T")[1]?.split(".")[0] ||
                                "—"}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <Link
                            href={`/inspector/disputes/${encodeURIComponent(row.id)}`}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-white hover:bg-brand-primary hover:border-brand-primary transition-all active:scale-95"
                          >
                            <ExternalLink size={14} /> Xem Chi Tiết
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

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
