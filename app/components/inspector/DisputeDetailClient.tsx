"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  disputeService,
  type DisputeDetail,
  type DisputeEvidence,
} from "@/app/services/inspectorDisputeService";
import { getErrorMessage } from "@/app/services/errorUtils";
import { useToast } from "@/app/contexts/ToastContext";
import {
  ChevronLeft,
  Loader2,
  ShieldAlert,
  CheckCircle,
  XCircle,
  History,
  ImageIcon,
  ExternalLink,
  Zap,
  ShoppingBag,
  User,
  FileText,
  Gavel,
  ArrowRight,
  ArrowUpRight,
  HelpCircle,
  Send,
  AlertTriangle,
} from '@/app/components/ui/Icons';
import { formatDate } from "@/app/utils/format";
import { TRANSACTION_STATUS_LABELS, type TransactionStatus } from "@/app/constants/transactionStatus";

export default function DisputeDetailClient({
  disputeId,
  viewerRole = "INSPECTOR",
}: {
  disputeId: string;
  viewerRole?: "INSPECTOR" | "ADMIN";
}) {
  const router = useRouter();
  const { addToast } = useToast();
  const [detail, setDetail] = useState<DisputeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openingEvidenceIndex, setOpeningEvidenceIndex] = useState<
    number | null
  >(null);
  const [evidenceError, setEvidenceError] = useState<string | null>(null);
  const [claiming, setClaiming] = useState(false);
  const [escalating, setEscalating] = useState(false);
  const [showEscalateForm, setShowEscalateForm] = useState(false);
  const [escalateNote, setEscalateNote] = useState("");
  const [escalateSuggestion, setEscalateSuggestion] = useState("");
  const [escalateValidationError, setEscalateValidationError] = useState("");
  const [showRequestInfo, setShowRequestInfo] = useState(false);
  const [requestInfoMessage, setRequestInfoMessage] = useState("");
  const [requestingInfo, setRequestingInfo] = useState(false);

  const handleOpenEvidence = async (item: DisputeEvidence, index: number) => {
    if (!item.url) return;
    setEvidenceError(null);
    try {
      setOpeningEvidenceIndex(index);
      const resolvedUrl = await disputeService.getEvidenceBlobUrl(item.url);
      const opened = window.open(resolvedUrl, "_blank", "noopener,noreferrer");
      // Only schedule revoke for blob: URLs; /public/ paths are static and don't need revocation
      if (resolvedUrl.startsWith("blob:")) {
        setTimeout(() => URL.revokeObjectURL(resolvedUrl), 60_000);
      }
      if (!opened) {
        setEvidenceError(
          "Trình duyệt đã chặn cửa sổ mới. Vui lòng cho phép popup.",
        );
      }
    } catch (err: unknown) {
      setEvidenceError(
        getErrorMessage(err, "Không thể mở bằng chứng. Vui lòng thử lại."),
      );
    } finally {
      setOpeningEvidenceIndex(null);
    }
  };

  const handleClaim = async () => {
    try {
      setClaiming(true);
      const updated = await disputeService.claimDispute(disputeId);
      setDetail(updated);
      addToast("Đã nhận xử lý khiếu nại thành công", "success");
    } catch (err: unknown) {
      addToast(getErrorMessage(err, "Không thể nhận xử lý khiếu nại"), "error");
    } finally {
      setClaiming(false);
    }
  };

  const handleEscalate = async () => {
    if (!escalateNote.trim()) {
      setEscalateValidationError("Lý do chuyển là bắt buộc");
      return;
    }
    try {
      setEscalating(true);
      setEscalateValidationError("");
      const updated = await disputeService.escalateDispute(
        disputeId,
        escalateNote.trim(),
        escalateSuggestion || undefined,
      );
      setDetail(updated);
      setShowEscalateForm(false);
      setEscalateNote("");
      setEscalateSuggestion("");
      addToast("Đã chuyển tiếp khiếu nại lên Admin", "success");
    } catch (err: unknown) {
      addToast(
        getErrorMessage(err, "Không thể chuyển tiếp khiếu nại"),
        "error",
      );
    } finally {
      setEscalating(false);
    }
  };

  const handleRequestMoreInfo = async () => {
    if (!requestInfoMessage.trim()) return;
    try {
      setRequestingInfo(true);
      const updated = await disputeService.requestMoreInfo(
        disputeId,
        requestInfoMessage,
      );
      setDetail(updated);
      setShowRequestInfo(false);
      setRequestInfoMessage("");
      addToast("Đã gửi yêu cầu bổ sung thông tin đến người mua", "success");
    } catch (err: unknown) {
      addToast(
        getErrorMessage(err, "Không thể gửi yêu cầu bổ sung thông tin"),
        "error",
      );
    } finally {
      setRequestingInfo(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await disputeService.getDisputeDetail(disputeId);
        if (!mounted) return;
        setDetail(data);
      } catch (err: unknown) {
        if (!mounted) return;
        setError(getErrorMessage(err, "Không tải được tiết khiếu nại"));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [disputeId]);

  const priceVnd = useMemo(() => {
    const value = detail?.listing.priceVnd || 0;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  }, [detail?.listing.priceVnd]);

  const visibleEvidence = useMemo(
    () =>
      detail?.evidence.filter(
        (item: DisputeEvidence) => Boolean(item.url?.trim()),
      ) ?? [],
    [detail?.evidence],
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white transition-all">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-100 border-t-brand-primary rounded-full animate-spin"></div>
          <Zap
            size={24}
            className="absolute inset-0 m-auto text-brand-primary animate-pulse"
          />
        </div>
        <p className="mt-8 text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] animate-pulse">
          Đang tải dữ liệu khiếu nại...
        </p>
      </div>
    );
  }

  if (!detail || error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white p-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center max-w-md animate-scale-in shadow-md">
          <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <ShieldAlert size={40} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter uppercase leading-tight">
            Lỗi Truy Cập
          </h2>
          <p className="text-gray-500 font-medium mb-10 leading-relaxed">
            {error || "Dữ liệu khiếu nại bị hỏng hoặc không tồn tại."}
          </p>
          <button
            onClick={() => router.back()}
            className="text-sm font-extrabold text-gray-500 hover:text-gray-800 transition-colors inline-flex items-center justify-center gap-1 bg-transparent border-none p-0 cursor-pointer w-full mt-4"
          >
            <ChevronLeft size={18} />
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const isSolved = detail.status === "RESOLVED";
  const isRejected = detail.status === "REJECTED";
  const isOpen = detail.status === "OPEN";
  const isInProgress = detail.status === "IN_PROGRESS";
  const isNeedMoreInfo = detail.status === "NEED_MORE_INFO";
  const isEscalated = detail.status === "ESCALATED";
  const canAct = !isSolved && !isRejected;

  const statusLabel = (() => {
    switch (detail.status) {
      case "OPEN":
        return "Đang mở";
      case "IN_PROGRESS":
        return "Đang xử lý";
      case "NEED_MORE_INFO":
        return "Cần bổ sung";
      case "ESCALATED":
        return "Đã chuyển Admin";
      case "RESOLVED":
        return "Đã giải quyết";
      case "REJECTED":
        return "Đã từ chối";
      default:
        return detail.status;
    }
  })();

  return (
    <div className="bg-white min-h-screen text-gray-900 p-4 lg:p-10 font-sans selection:bg-brand-primary/20">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-gray-200">
          <div className="animate-slide-up">
            <Link
              href={viewerRole === "ADMIN" ? "/admin/disputes" : "/inspector/disputes"}
              className="text-sm font-extrabold text-gray-500 hover:text-gray-800 transition-colors mb-6 inline-flex items-center gap-1"
              style={{ textDecoration: "none" }}
            >
              <ChevronLeft size={18} />
              Quay lại
            </Link>
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none text-gray-900">
                Khiếu Nại{" "}
                <span className="text-brand-primary">
                  #{detail.id}
                </span>
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div
                className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase border ${
                  isSolved
                    ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                    : isRejected
                      ? "text-rose-700 bg-rose-50 border-rose-200"
                      : isNeedMoreInfo
                        ? "text-amber-700 bg-amber-50 border-amber-200"
                        : isEscalated
                          ? "text-purple-700 bg-purple-50 border-purple-200"
                          : "text-brand-primary bg-orange-50 border-orange-200 animate-pulse"
                }`}
              >
                {statusLabel}
              </div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                Khởi tạo: {detail.createdAt}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Claim button - only for OPEN disputes */}
            {isOpen && (
              <button
                onClick={handleClaim}
                disabled={claiming}
                className="group flex items-center gap-3 px-6 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] shadow-lg transition-all active:scale-95 disabled:opacity-50"
              >
                {claiming ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <CheckCircle size={16} />
                )}
                Nhận xử lý
              </button>
            )}

            {/* Request more info button */}
            {(isInProgress ||
              isNeedMoreInfo ||
              (isEscalated && viewerRole === "ADMIN")) && (
              <button
                onClick={() => setShowRequestInfo(!showRequestInfo)}
                className="group flex items-center gap-3 px-6 py-4 bg-amber-50 text-amber-700 border border-amber-200 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] transition-all active:scale-95 shadow-sm"
              >
                <HelpCircle size={16} />
                Yêu cầu bổ sung
              </button>
            )}

            {/* Escalate button - only show for inspectors, not for admins */}
            {canAct && !isEscalated && viewerRole !== "ADMIN" && (
              <button
                onClick={() => setShowEscalateForm(!showEscalateForm)}
                className="group flex items-center gap-3 px-6 py-4 bg-purple-50 text-purple-700 border border-purple-200 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] transition-all active:scale-95 shadow-sm"
              >
                <ArrowUpRight size={16} />
                Chuyển Admin
              </button>
            )}

            {/* Resolution button */}
            {canAct &&
              (isInProgress ||
                isNeedMoreInfo ||
                (isEscalated && viewerRole === "ADMIN")) && (
                <Link
                  href={
                    viewerRole === "ADMIN"
                      ? `/admin/disputes/${encodeURIComponent(detail.id)}/resolution`
                      : `/inspector/disputes/${encodeURIComponent(detail.id)}/resolution`
                  }
                  className="group flex items-center gap-4 px-8 py-4 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-glow-orange transition-all active:scale-95"
                >
                  <Gavel
                    size={18}
                    className="group-hover:rotate-12 transition-transform"
                  />
                  Xử lý
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              )}
          </div>
        </div>

        {/* Escalate to Admin form */}
        {showEscalateForm &&
          canAct &&
          !isEscalated &&
          viewerRole !== "ADMIN" && (
            <div className="bg-purple-50 border border-purple-200 rounded-3xl p-8 animate-fade-in">
              <h4 className="text-sm font-black text-purple-700 uppercase tracking-wider mb-6 flex items-center gap-2">
                <AlertTriangle size={16} />
                Chuyển tiếp lên Admin
              </h4>
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-2">
                    Lý do chuyển <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    value={escalateNote}
                    onChange={(e) => {
                      setEscalateNote(e.target.value);
                      if (escalateValidationError)
                        setEscalateValidationError("");
                    }}
                    placeholder="VD: Không đủ bằng chứng để kết luận, seller phản hồi không hợp tác..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white border border-purple-200 rounded-2xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-purple-400 resize-none"
                  />
                  {escalateValidationError && (
                    <p className="mt-1 text-xs font-bold text-rose-600">
                      {escalateValidationError}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-2">
                    Đề xuất hướng xử lý{" "}
                    <span className="text-gray-600">(tuỳ chọn)</span>
                  </label>
                  <select
                    value={escalateSuggestion}
                    onChange={(e) => setEscalateSuggestion(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-purple-200 rounded-2xl text-sm text-gray-800 focus:outline-none focus:border-purple-400"
                  >
                    <option value="">-- Không có đề xuất --</option>
                    <option value="REFUND_BUYER">Hoàn tiền toàn bộ</option>
                    <option value="PARTIAL_REFUND">Hoàn tiền một phần</option>
                    <option value="RELEASE_FUND_SELLER">
                      Từ chối khiếu nại
                    </option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowEscalateForm(false);
                    setEscalateNote("");
                    setEscalateSuggestion("");
                    setEscalateValidationError("");
                  }}
                  className="px-6 py-3 bg-gray-100 text-gray-500 font-bold text-xs rounded-xl hover:bg-gray-200 transition-all"
                >
                  Hủy
                </button>
                <button
                  onClick={() => void handleEscalate()}
                  disabled={escalating || !escalateNote.trim()}
                  className="px-6 py-3 bg-purple-600 text-white font-bold text-xs rounded-xl hover:bg-purple-700 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {escalating ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <ArrowUpRight size={14} />
                  )}
                  Xác nhận chuyển
                </button>
              </div>
            </div>
          )}

        {/* Request more info form */}
        {showRequestInfo && (
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 animate-fade-in">
              <h4 className="text-sm font-black text-amber-700 uppercase tracking-wider mb-4">
              Yêu cầu bổ sung thông tin
            </h4>
            <textarea
              value={requestInfoMessage}
              onChange={(e) => setRequestInfoMessage(e.target.value)}
              placeholder="Nhập yêu cầu bổ sung cho người mua... VD: Vui lòng gửi thêm ảnh chụp rõ phần hư hỏng"
              rows={3}
              className="w-full px-4 py-3 bg-white border border-amber-200 rounded-2xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-amber-400 resize-none"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setShowRequestInfo(false);
                  setRequestInfoMessage("");
                }}
                className="px-6 py-3 bg-gray-100 text-gray-600 font-bold text-xs rounded-xl hover:bg-gray-200 transition-all"
              >
                Hủy
              </button>
              <button
                onClick={handleRequestMoreInfo}
                disabled={!requestInfoMessage.trim() || requestingInfo}
                className="px-6 py-3 bg-amber-500 text-amber-950 font-bold text-xs rounded-xl hover:bg-amber-600 hover:text-white transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {requestingInfo ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Send size={14} />
                )}
                Gửi yêu cầu
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-12 space-y-8">
            <div className="bg-white border border-gray-200 rounded-[2.5rem] p-10 shadow-md animate-fade-in">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-brand-primary">
                  <ShieldAlert size={28} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">
                    Cơ sở khiếu nại
                  </p>
                  <h3 className="text-2xl font-black tracking-tight text-gray-900 uppercase">
                    {detail.reasonText}
                  </h3>
                </div>
              </div>
              <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
                <p className="text-xl font-medium text-gray-700 leading-relaxed italic">
                  &ldquo;{detail.description}&rdquo;
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                  <ImageIcon size={20} />
                </div>
                <h3 className="text-lg font-black tracking-widest uppercase text-gray-900">
                    Kho Bằng Chứng
                  </h3>
                </div>
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  {visibleEvidence.length} đối tượng
                </span>
              </div>

              {evidenceError && (
                <p className="mb-4 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
                  ⚠ {evidenceError}
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {visibleEvidence.length > 0 ? (
                  visibleEvidence.map((item, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => void handleOpenEvidence(item, index)}
                      disabled={openingEvidenceIndex === index}
                      className="group relative bg-white border border-gray-200 rounded-3xl p-6 text-left hover:border-brand-primary/50 hover:shadow-lg transition-all active:scale-[0.98] overflow-hidden shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-4">
                        {item.type === "IMAGE" && item.url ? (
                          <div className="w-full h-28 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 mb-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.url}
                              alt={`Bằng chứng ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (
                                  e.currentTarget as HTMLImageElement
                                ).style.display = "none";
                              }}
                            />
                          </div>
                        ) : (
                            <div className="w-12 h-12 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 group-hover:text-brand-primary group-hover:border-brand-primary/30 transition-all">
                            {openingEvidenceIndex === index ? (
                              <Loader2 size={24} className="animate-spin" />
                            ) : (
                              <FileText size={24} />
                            )}
                          </div>
                        )}
                        {openingEvidenceIndex === index && (
                          <Loader2
                            size={16}
                            className="animate-spin text-brand-primary ml-2"
                          />
                        )}
                        <ExternalLink
                          size={16}
                          className="text-gray-500 group-hover:text-brand-primary transition-colors ml-auto"
                        />
                      </div>
                      <span className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">
                        {item.uploaderRole
                          ? `Nguồn: ${item.uploaderRole}`
                          : "Đối tượng hệ thống"}
                      </span>
                      <h4 className="text-xs font-bold text-gray-700 truncate group-hover:text-brand-primary transition-colors">
                        {formatDate(detail.createdAt).split(" ")[0]} -{" "}
                        {index + 1}
                      </h4>
                    </button>
                  ))
                ) : (
                    <div className="col-span-full p-12 text-center bg-gray-50 border border-dashed border-gray-200 rounded-[2rem]">
                      <p className="text-gray-500 font-bold uppercase tracking-widest text-xs italic">
                      Không có bằng chứng đi kèm
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Inspector Escalation info — visible to admin when dispute is ESCALATED */}
            {isEscalated && viewerRole === "ADMIN" && detail.escalationNote && (
              <div className="bg-purple-50 border border-purple-200 rounded-[2.5rem] p-8 animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 border border-purple-200 text-purple-600 flex items-center justify-center">
                    <AlertTriangle size={18} />
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-700">
                    Chuyển Tiếp Lên Admin
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="p-5 bg-white rounded-2xl border border-purple-100">
                      <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">
                        Lý do chuyển
                      </p>
                      <p className="text-sm font-medium text-gray-800 leading-relaxed">
                      &ldquo;{detail.escalationNote}&rdquo;
                    </p>
                  </div>
                  {detail.escalationSuggestion && (
                      <div className="p-5 bg-white rounded-2xl border border-purple-100">
                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">
                          Đề xuất xử lý
                        </p>
                        <p className="text-sm font-bold text-purple-700">
                        {detail.escalationSuggestion === "REFUND_BUYER"
                          ? "Hoàn tiền toàn bộ"
                          : detail.escalationSuggestion === "PARTIAL_REFUND"
                            ? "Hoàn tiền một phần"
                            : detail.escalationSuggestion ===
                                "RELEASE_FUND_SELLER"
                              ? "Từ chối khiếu nại"
                              : detail.escalationSuggestion}
                      </p>
                    </div>
                  )}
                  {detail.escalatedBy && (
                      <div className="p-5 bg-white rounded-2xl border border-purple-100">
                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">
                          Người chuyển
                        </p>
                        <p className="text-sm font-bold text-gray-800">
                        {detail.escalatedBy.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {detail.escalatedBy.email}
                      </p>
                    </div>
                  )}
                  {detail.escalatedAt && (
                      <div className="p-5 bg-white rounded-2xl border border-purple-100">
                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">
                          Thời gian chuyển
                        </p>
                        <p className="text-sm font-bold text-gray-800">
                        {detail.escalatedAt}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white border border-gray-200 rounded-[2.5rem] p-8 space-y-8 animate-fade-in delay-200 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <History size={18} className="text-brand-primary" />
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                    Thông Tin Giao Dịch
                  </h4>
                </div>

                <div className="space-y-6">
                    <div className="flex justify-between items-center p-5 bg-gray-50 rounded-2xl border border-gray-100">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                        Mã Giao Dịch
                      </span>
                    <span className="text-sm font-mono font-bold text-brand-primary">
                      #TX-{detail.transaction.id}
                    </span>
                  </div>
                    <div className="flex justify-between items-center p-5 bg-gray-50 rounded-2xl border border-gray-100">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                        Trạng Thái Đơn Hàng
                      </span>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                      {TRANSACTION_STATUS_LABELS[detail.transaction.status as TransactionStatus] ?? detail.transaction.status}
                    </span>
                  </div>
                </div>

                <div className="pt-8 border-t border-gray-100 grid grid-cols-2 gap-6">
                  <div className="group">
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">
                    Người Mua
                  </p>
                  <p className="text-xs font-black text-gray-800 group-hover:text-brand-primary transition-colors">
                      {detail.buyer.name}
                    </p>
                    <p className="text-[10px] font-medium text-gray-500 truncate">
                      {detail.buyer.email}
                    </p>
                  </div>
                  <div className="group">
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">
                    Người Bán
                  </p>
                  <p className="text-xs font-black text-gray-800 group-hover:text-brand-primary transition-colors">
                      {detail.seller.name}
                    </p>
                    <p className="text-[10px] font-medium text-gray-500 truncate">
                      {detail.seller.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-[2.5rem] p-8 space-y-8 animate-fade-in delay-300 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <ShoppingBag size={18} className="text-brand-primary" />
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                    Thông Tin Xe
                  </h4>
                </div>

                  <div className="group flex gap-6 p-6 bg-gray-50 rounded-3xl border border-gray-100 hover:border-brand-primary/30 transition-all">
                    <div className="w-24 h-24 rounded-2xl bg-gray-200 border border-gray-300 overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                    {detail.listing.imageUrl ? (
                      <img
                        src={detail.listing.imageUrl}
                        alt={detail.listing.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          <ShoppingBag size={32} />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-center">
                      <h5 className="text-sm font-black text-gray-900 mb-2 leading-tight group-hover:text-brand-primary transition-colors">
                      {detail.listing.title}
                    </h5>
                    <p className="text-xs font-mono font-bold text-brand-primary">
                      {priceVnd}
                    </p>
                      <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest mt-2 px-2 py-0.5 bg-gray-100 rounded border border-gray-200 w-fit">
                      PID-{detail.listing.id}
                    </span>
                  </div>
                </div>

                {viewerRole !== "ADMIN" && (
                  <div className="pt-8 border-t border-gray-100">
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">
                      Inspector Phụ Trách
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 text-orange-500 flex items-center justify-center">
                        <User size={18} strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-gray-800">
                          {detail.assignee.name}
                        </p>
                        <p className="text-[10px] font-medium text-gray-500">
                          {detail.assignee.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center pt-20 border-t border-gray-100">
          <p className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.4em]">
            CycleX Mã Hồ Sơ: {detail.id}
          </p>
        </div>
      </div>
    </div>
  );
}
