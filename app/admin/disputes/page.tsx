"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
  AlertTriangle,
  CheckCircle,
  Clock,
  ShieldAlert,
  MessageSquare,
  Eye,
  Package,
  Users,
  Gavel,
  Calendar,
} from "lucide-react";
import {
  adminDisputeService,
  AdminDisputeQuery,
} from "../../services/adminDisputeService";
import {
  AdminDisputeListRow,
  DisputeDetailResponse,
  DisputeStatus,
} from "../../types/dispute";
import { useToast } from "../../contexts/ToastContext";
import { formatDate } from "../../utils/format";

export default function AdminDisputesPage() {
  useEffect(() => {
    document.title = "Disputes | CycleX Admin";
  }, []);

  const { addToast } = useToast();

  const [disputes, setDisputes] = useState<AdminDisputeListRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState<AdminDisputeQuery>({ page: 0, limit: 10 });
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  // Detail modal
  const [selectedDispute, setSelectedDispute] =
    useState<DisputeDetailResponse | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsDetailOpen(false);
        setSelectedDispute(null);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const fetchDisputes = useCallback(
    async (q: AdminDisputeQuery) => {
      setRefreshing(true);
      try {
        const data = await adminDisputeService.getDisputes(q);
        setDisputes(data.content);
        setTotalElements(data.totalElements);
        setTotalPages(data.totalPages);
        setQuery(q);
      } catch (error: any) {
        addToast(error.message || "Không thể tải danh sách khiếu nại", "error");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [addToast],
  );

  useEffect(() => {
    fetchDisputes(query);
  }, [fetchDisputes]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDisputes({ ...query, q: searchInput, page: 0 });
  };

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value || undefined;
    fetchDisputes({ ...query, status: val, page: 0 });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchDisputes({ ...query, page: newPage });
    }
  };

  const openDetail = async (disputeId: number) => {
    setLoadingDetail(true);
    setIsDetailOpen(true);
    try {
      const detail = await adminDisputeService.getDisputeDetail(disputeId);
      setSelectedDispute(detail);
    } catch (error: any) {
      addToast(error.message || "Không thể tải chi tiết khiếu nại", "error");
      setIsDetailOpen(false);
    } finally {
      setLoadingDetail(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "OPEN":
        return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      case "IN_PROGRESS":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "NEED_MORE_INFO":
        return "text-purple-400 bg-purple-500/10 border-purple-500/20";
      case "ESCALATED":
        return "text-rose-400 bg-rose-500/10 border-rose-500/20";
      case "RESOLVED":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "REJECTED":
        return "text-gray-400 bg-gray-500/10 border-gray-500/20";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/20";
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

  const statusLabels: Record<string, string> = {
    OPEN: "Mở",
    IN_PROGRESS: "Đang xử lý",
    NEED_MORE_INFO: "Cần thêm thông tin",
    ESCALATED: "Đã chuyển lên",
    RESOLVED: "Đã giải quyết",
    REJECTED: "Từ chối",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-bg">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
          <p className="mt-4 text-gray-400 font-bold uppercase tracking-widest text-xs">
            Đang tải khiếu nại...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg text-white p-4 lg:p-10 selection:bg-brand-primary/30 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-8 border-b border-white/5">
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 mb-4 shadow-xl">
              <span className="text-brand-primary text-xs animate-pulse">
                ●
              </span>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">
                Quản trị hệ thống CycleX
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter leading-none mb-4">
              Dispute{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-blue-400">
                Management
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-xl font-medium">
              Theo dõi và quản lý toàn bộ khiếu nại trên hệ thống.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10 items-center">
          <form
            onSubmit={handleSearch}
            className="lg:col-span-5 relative group"
          >
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-primary transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="Tìm kiếm theo tiêu đề hoặc ID..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/50 transition-all placeholder:text-gray-600"
            />
          </form>

          <div className="lg:col-span-4 relative">
            <select
              onChange={handleStatusFilter}
              value={query.status || ""}
              className="w-full appearance-none px-6 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 focus:outline-none focus:border-brand-primary/50 cursor-pointer"
            >
              <option value="" className="bg-brand-bg">
                Tất cả trạng thái
              </option>
              {(
                [
                  "OPEN",
                  "IN_PROGRESS",
                  "NEED_MORE_INFO",
                  "ESCALATED",
                  "RESOLVED",
                  "REJECTED",
                ] as DisputeStatus[]
              ).map((s) => (
                <option key={s} value={s} className="bg-brand-bg">
                  {s}
                </option>
              ))}
            </select>
            <Filter
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
              size={14}
            />
          </div>

          <div className="lg:col-span-3 flex justify-end">
            <button
              onClick={() => fetchDisputes(query)}
              disabled={refreshing}
              className={`flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-white hover:bg-white/10 transition-all ${refreshing ? "cursor-not-allowed opacity-50" : ""}`}
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
              Làm mới
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl animate-fade-in mb-10">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                    ID
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                    Listing
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                    Người tạo
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                    Lý do
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                    Trạng thái
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                    Phụ trách
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-right">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {disputes.map((d) => (
                  <tr
                    key={d.id}
                    className="group hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-5">
                      <span className="text-xs font-black text-brand-primary">
                        #{d.id}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div>
                        <p className="text-sm font-bold text-white truncate max-w-[200px]">
                          {d.listingTitle || "N/A"}
                        </p>
                        <p className="text-[10px] text-gray-500 font-bold">
                          Order #{d.transactionId}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-bold text-gray-300">
                        {d.requesterName || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs font-bold text-gray-400 truncate max-w-[150px] block">
                        {d.reasonText || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-black tracking-widest border uppercase ${getStatusStyle(d.status)}`}
                      >
                        {getStatusIcon(d.status)}
                        {d.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-bold text-gray-400">
                        {d.assigneeName || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs font-bold text-gray-500">
                        {d.createdAt ? formatDate(d.createdAt) : "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button
                        onClick={() => openDetail(d.id)}
                        className="p-2.5 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 rounded-xl hover:bg-brand-primary hover:text-white transition-all active:scale-95"
                        title="Xem chi tiết"
                      >
                        <Eye size={16} strokeWidth={2.5} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty */}
          {!refreshing && disputes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mb-6 text-gray-700">
                <Gavel size={48} />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">
                Không có khiếu nại nào
              </h3>
              <p className="text-gray-500 font-medium">
                Hệ thống chưa có khiếu nại hoặc không tìm thấy kết quả.
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-8 py-6 border-t border-white/5 flex items-center justify-between bg-white/[0.01]">
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                Trang{" "}
                <span className="text-white">{(query.page ?? 0) + 1}</span> /{" "}
                <span className="text-white">{totalPages}</span> (
                {totalElements} Kết quả)
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => handlePageChange((query.page ?? 0) - 1)}
                  disabled={(query.page ?? 0) === 0}
                  className="p-3 rounded-2xl border border-white/10 text-gray-400 disabled:opacity-20 hover:bg-white/5 hover:text-white transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => handlePageChange((query.page ?? 0) + 1)}
                  disabled={(query.page ?? 0) >= totalPages - 1}
                  className="p-3 rounded-2xl border border-white/10 text-gray-400 disabled:opacity-20 hover:bg-white/5 hover:text-white transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* DETAIL MODAL */}
        {isDetailOpen && (
          <div
            onMouseDown={() => {
              setIsDetailOpen(false);
              setSelectedDispute(null);
            }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-bg/80 backdrop-blur-xl animate-fade-in cursor-default overflow-y-auto"
          >
            <div
              onMouseDown={(e) => e.stopPropagation()}
              className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-8 max-w-3xl w-full shadow-2xl animate-scale-in relative overflow-hidden my-auto max-h-[90vh] overflow-y-auto"
            >
              <div className="absolute top-0 inset-x-0 h-2 bg-brand-primary" />

              <button
                onClick={() => {
                  setIsDetailOpen(false);
                  setSelectedDispute(null);
                }}
                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors z-10"
              >
                <X size={24} />
              </button>

              {loadingDetail && (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
                </div>
              )}
              {!loadingDetail && selectedDispute && (
                <div className="space-y-6">
                  {/* Header */}
                  <div className="text-center mb-2">
                    <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-brand-primary/20 text-brand-primary">
                      <Gavel size={32} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-2xl font-black text-white tracking-tight">
                      Khiếu nại #{selectedDispute.id}
                    </h2>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 mt-2 rounded-xl text-[10px] font-black tracking-widest border uppercase ${getStatusStyle(selectedDispute.status)}`}
                    >
                      {getStatusIcon(selectedDispute.status)}
                      {statusLabels[selectedDispute.status] ||
                        selectedDispute.status}
                    </span>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Buyer */}
                    <InfoCard
                      icon={<Users size={16} />}
                      label="Người mua (Buyer)"
                      name={selectedDispute.buyer?.name}
                      email={selectedDispute.buyer?.email}
                      phone={selectedDispute.buyer?.phone}
                    />
                    {/* Seller */}
                    <InfoCard
                      icon={<Package size={16} />}
                      label="Người bán (Seller)"
                      name={selectedDispute.seller?.name}
                      email={selectedDispute.seller?.email}
                      phone={selectedDispute.seller?.phone}
                    />
                    {/* Inspector/Assignee */}
                    <InfoCard
                      icon={<ShieldAlert size={16} />}
                      label="Inspector phụ trách"
                      name={selectedDispute.assignee?.name || "Chưa gán"}
                      email={selectedDispute.assignee?.email}
                      phone={selectedDispute.assignee?.phone}
                    />
                    {/* Listing */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                      <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">
                        <Package size={14} /> Listing
                      </div>
                      <p className="text-sm font-bold text-white">
                        {selectedDispute.listing?.title || "N/A"}
                      </p>
                      {selectedDispute.listing?.priceVnd != null && (
                        <p className="text-xs text-brand-primary font-black mt-1">
                          {selectedDispute.listing.priceVnd.toLocaleString(
                            "vi-VN",
                          )}{" "}
                          VNĐ
                        </p>
                      )}
                      {selectedDispute.listing?.status && (
                        <p className="text-[10px] text-gray-500 mt-1">
                          Trạng thái: {selectedDispute.listing.status}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Transaction / Order */}
                  {selectedDispute.transaction && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                      <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">
                        <Calendar size={14} /> Giao dịch (Order)
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div>
                          <p className="text-gray-500 font-bold">ID</p>
                          <p className="text-white font-black">
                            #{selectedDispute.transaction.id}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 font-bold">Trạng thái</p>
                          <p className="text-white font-black">
                            {selectedDispute.transaction.status}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 font-bold">Số tiền</p>
                          <p className="text-brand-primary font-black">
                            {selectedDispute.transaction.amountVnd?.toLocaleString(
                              "vi-VN",
                            )}{" "}
                            VNĐ
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 font-bold">Ngày tạo</p>
                          <p className="text-white font-bold">
                            {selectedDispute.transaction.createdAt
                              ? formatDate(
                                  selectedDispute.transaction.createdAt,
                                )
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Reason & Description */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                    <div>
                      <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">
                        Lý do khiếu nại
                      </p>
                      <p className="text-sm font-bold text-amber-400">
                        {selectedDispute.reasonText ||
                          selectedDispute.reasonCode ||
                          "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">
                        Mô tả
                      </p>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {selectedDispute.description || "Không có mô tả"}
                      </p>
                    </div>
                  </div>

                  {/* Resolution */}
                  {(selectedDispute.resolutionNote ||
                    selectedDispute.resolutionAction) && (
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 space-y-2">
                      <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                        Kết quả xử lý
                      </p>
                      {selectedDispute.resolutionAction && (
                        <p className="text-sm font-bold text-emerald-400">
                          Hành động: {selectedDispute.resolutionAction}
                        </p>
                      )}
                      {selectedDispute.resolutionNote && (
                        <p className="text-sm text-gray-300">
                          {selectedDispute.resolutionNote}
                        </p>
                      )}
                      {selectedDispute.resolvedAt && (
                        <p className="text-[10px] text-gray-500">
                          Giải quyết lúc:{" "}
                          {formatDate(selectedDispute.resolvedAt)}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Evidence */}
                  {selectedDispute.evidence &&
                    selectedDispute.evidence.length > 0 && (
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">
                          Bằng chứng ({selectedDispute.evidence.length})
                        </p>
                        <div className="space-y-2">
                          {selectedDispute.evidence.map((ev) => (
                            <div
                              key={`${ev.type}-${ev.uploaderRole}-${ev.url || ev.text || ""}`}
                              className="flex items-center gap-3 bg-white/5 rounded-xl p-3"
                            >
                              <span className="text-[10px] font-black text-gray-500 uppercase w-16">
                                {ev.uploaderRole}
                              </span>
                              <span className="text-[10px] font-black text-brand-primary uppercase">
                                {ev.type}
                              </span>
                              {ev.type === "IMAGE" && ev.url && (
                                <a
                                  href={ev.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-400 hover:underline truncate"
                                >
                                  Xem ảnh
                                </a>
                              )}
                              {ev.type === "TEXT" && ev.text && (
                                <span className="text-xs text-gray-300 truncate">
                                  {ev.text}
                                </span>
                              )}
                              {ev.type === "VIDEO" && ev.url && (
                                <a
                                  href={ev.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-400 hover:underline truncate"
                                >
                                  Xem video
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Timestamps */}
                  <div className="flex items-center justify-between text-[10px] text-gray-600 font-bold pt-2 border-t border-white/5">
                    <span>
                      Tạo:{" "}
                      {selectedDispute.createdAt
                        ? formatDate(selectedDispute.createdAt)
                        : "N/A"}
                    </span>
                    <span>
                      Cập nhật:{" "}
                      {selectedDispute.updatedAt
                        ? formatDate(selectedDispute.updatedAt)
                        : "N/A"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  name,
  email,
  phone,
}: Readonly<{
  icon: React.ReactNode;
  label: string;
  name?: string;
  email?: string;
  phone?: string;
}>) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
      <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">
        {icon} {label}
      </div>
      <p className="text-sm font-bold text-white">{name || "N/A"}</p>
      {email && <p className="text-[11px] text-gray-500 mt-0.5">{email}</p>}
      {phone && <p className="text-[11px] text-gray-500">{phone}</p>}
    </div>
  );
}
