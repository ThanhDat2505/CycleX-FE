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
      return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    if (s === "OPEN") return "text-rose-400 bg-rose-500/10 border-rose-500/20";
    if (s === "IN_PROGRESS")
      return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    return "text-gray-400 bg-white/5 border-white/10";
  };

  if (loading && !refreshing) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-brand-bg min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] animate-pulse">
          Syncing cases...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-brand-bg min-h-screen text-white p-4 lg:p-10 font-sans selection:bg-brand-primary/30">
      <div className="max-w-7xl mx-auto">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-8 border-b border-white/5">
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 mb-4">
              <Shield size={12} className="text-brand-primary" />
              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-400">
                Dispute Intelligence
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter leading-none mb-4">
              Dispute{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-orange-400">
                Queue
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-xl font-medium">
              Quản lý danh sách khiếu nại đang chờ xử lý. Hệ thống tự động phân
              phối theo mức độ ưu tiên.
            </p>
          </div>
          <button
            onClick={() => load(true)}
            className="flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-white hover:bg-white/10 transition-all active:scale-95"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin text-brand-primary" : ""}
            />
            Refresh Queue
          </button>
        </div>

        {/* Filters Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
              Trạng thái
            </label>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => {
                  setPage(0);
                  setStatus(e.target.value);
                }}
                className="w-full appearance-none px-6 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-[11px] font-bold uppercase tracking-wider text-gray-300 focus:outline-none focus:border-brand-primary/50 cursor-pointer"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    className="bg-brand-bg"
                  >
                    {opt.label}
                  </option>
                ))}
              </select>
              <Tag
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
                size={14}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
              Từ ngày
            </label>
            <input
              type="date"
              value={createdFrom}
              onChange={(e) => {
                setPage(0);
                setCreatedFrom(e.target.value);
              }}
              className="w-full px-6 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-[11px] font-bold text-gray-300 focus:outline-none focus:border-brand-primary/50 [color-scheme:dark]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
              Đến ngày
            </label>
            <input
              type="date"
              value={createdTo}
              onChange={(e) => {
                setPage(0);
                setCreatedTo(e.target.value);
              }}
              className="w-full px-6 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-[11px] font-bold text-gray-300 focus:outline-none focus:border-brand-primary/50 [color-scheme:dark]"
            />
          </div>

          <div className="space-y-2 lg:col-span-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
              Tìm kiếm nhanh
            </label>
            <div className="relative group">
              <input
                placeholder="Dispute ID / Transaction..."
                value={qInput}
                onChange={(e) => {
                  setPage(0);
                  setQInput(e.target.value);
                }}
                className="w-full px-6 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-sm font-bold focus:outline-none focus:border-brand-primary/50 transition-all placeholder:text-gray-700"
              />
              <Search
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-brand-primary transition-colors"
                size={18}
              />
            </div>
          </div>
        </div>

        {/* List Content */}
        <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl animate-fade-in mb-10">
          <div className="overflow-x-auto min-h-[400px]">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mb-6 text-gray-700">
                  <Gavel size={48} />
                </div>
                <h3 className="text-2xl font-black text-white mb-2 tracking-tight">
                  Hàng chờ trống
                </h3>
                <p className="text-gray-500 font-medium">
                  Không có tranh chấp nào khớp với yêu cầu của bạn.
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01]">
                    <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                      ID
                    </th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                      Transaction & Listing
                    </th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-center">
                      Trạng thái
                    </th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                      Khởi tạo
                    </th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                      Assignee
                    </th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-right">
                      Chi tiết
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {items.map((row) => (
                    <tr
                      key={row.id}
                      className="group hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all transform group-hover:rotate-6">
                            #{row.id}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div>
                          <p className="text-sm font-black text-white mb-1 group-hover:text-brand-primary transition-colors">
                            {row.listingTitle}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-gray-600 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                              TX-{row.transactionId}
                            </span>
                            <span className="text-[10px] font-bold text-gray-500 truncate max-w-[200px]">
                              {row.reason}
                            </span>
                          </div>
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
                          <span className="text-[11px] font-black text-white">
                            {row.createdAt.split("T")[0]}
                          </span>
                          <span className="text-[9px] font-bold text-gray-600 uppercase tracking-tighter mt-1">
                            {row.createdAt.split("T")[1]?.split(".")[0] ||
                              "Unknown"}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center">
                            <User size={12} className="text-gray-500" />
                          </div>
                          <span className="text-xs font-bold text-gray-400">
                            {row.assigneeName || "Chưa phân công"}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Link
                          href={`/inspector/disputes/${encodeURIComponent(row.id)}`}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/10 hover:border-brand-primary/50 transition-all active:scale-95"
                        >
                          <ExternalLink size={14} /> View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="px-8 py-6 border-t border-white/5 flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center gap-4">
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                  Trang <span className="text-white">{page + 1}</span> /{" "}
                  {totalPages}
                </p>
                <div className="h-4 w-px bg-white/10" />
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                  Hiển thị <span className="text-white">{items.length}</span> /{" "}
                  {totalItems} tranh chấp
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                  disabled={!canPrevious}
                  className="p-3 rounded-2xl border border-white/10 text-gray-400 disabled:opacity-20 hover:bg-white/5 hover:text-white transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex items-center gap-2">
                  <select
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black text-gray-400 focus:outline-none focus:border-brand-primary/50 cursor-pointer"
                    value={pageSize}
                    onChange={(e) => {
                      setPage(0);
                      setPageSize(Number(e.target.value));
                    }}
                  >
                    <option value={10} className="bg-brand-bg">
                      10 cases
                    </option>
                    <option value={20} className="bg-brand-bg">
                      20 cases
                    </option>
                    <option value={50} className="bg-brand-bg">
                      50 cases
                    </option>
                  </select>
                </div>
                <button
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={!canNext}
                  className="p-3 rounded-2xl border border-white/10 text-gray-400 disabled:opacity-20 hover:bg-white/5 hover:text-white transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
