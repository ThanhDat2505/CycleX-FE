"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  disputeService,
  type DisputeDetail,
  type DisputeResolutionPayload,
} from "@/app/services/inspectorDisputeService";
import { getErrorMessage } from "@/app/services/errorUtils";
import {
  ArrowLeft,
  User,
  Store,
  Banknote,
  AlertTriangle,
  ImageIcon,
  ArrowLeftRight,
  Lightbulb,
} from "@/app/components/ui/Icons";

const SUGGESTION_LABELS: Record<string, string> = {
  REFUND_BUYER: "Hoàn tiền toàn bộ",
  PARTIAL_REFUND: "Hoàn tiền một phần",
  RELEASE_FUND_SELLER: "Từ chối khiếu nại",
};

const RESOLUTION_OPTIONS: Array<{
  value: DisputeResolutionPayload["action"];
  label: string;
  helper: string;
}> = [
  {
    value: "REFUND_BUYER",
    label: "Hoàn tiền cho Buyer",
    helper: "Hoàn tiền cho buyer và đóng tranh chấp.",
  },
  {
    value: "RELEASE_FUND_SELLER",
    label: "Giải ngân cho Seller",
    helper: "Xác nhận seller hợp lệ, giải ngân và kết thúc tranh chấp.",
  },
  {
    value: "CLOSE_CASE",
    label: "Đóng case",
    helper: "Đóng tranh chấp sau khi đã xác minh và chốt kết quả.",
  },
];

export default function DisputeResolutionClient({
  disputeId,
  backPath,
  successPath,
}: {
  disputeId: string;
  backPath?: string;
  successPath?: string;
}) {
  const router = useRouter();
  const resolvedBackPath =
    backPath ?? `/inspector/disputes/${encodeURIComponent(disputeId)}`;
  const resolvedSuccessPath = successPath ?? "/inspector/disputes";
  const [detail, setDetail] = useState<DisputeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [action, setAction] = useState<DisputeResolutionPayload["action"] | "">(
    "",
  );
  const [resolutionNote, setResolutionNote] = useState("");

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await disputeService.getDisputeDetail(disputeId);
        if (!mounted) return;
        setDetail(data);

        if (data.status === "RESOLVED" || data.status === "REJECTED") {
          setError("Khiếu nại này đã được xử lý. Không thể giải quyết lại.");
        }
      } catch (err: unknown) {
        if (!mounted) return;
        setError(
          getErrorMessage(err, "Không tải được khiếu nại để giải quyết"),
        );
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [disputeId]);

  const selectedOption = RESOLUTION_OPTIONS.find((opt) => opt.value === action);
  const canSubmit =
    !submitting &&
    !loading &&
    !error &&
    !!action &&
    resolutionNote.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSubmit || !action) return;

    try {
      setSubmitting(true);
      await disputeService.resolveDispute(disputeId, {
        action,
        resolutionNote: resolutionNote.trim(),
      });
      router.push(resolvedSuccessPath);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Giải quyết tranh chấp thất bại"));
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN").format(amount) + "đ";

  const imageEvidence = useMemo(
    () => detail?.evidence.filter((e) => e.type === "IMAGE" && e.url) ?? [],
    [detail?.evidence],
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="disputeHeaderBar">
        <div>
          <Link
            href={resolvedBackPath}
            className="text-sm font-extrabold text-gray-500 hover:text-gray-900 transition-colors inline-flex items-center gap-1"
            style={{ textDecoration: "none", marginBottom: "8px" }}
          >
            <ArrowLeft size={18} />
            Quay lại chi tiết
          </Link>
          <h1 className="page-title" style={{ marginTop: 8 }}>
            Xử lý tranh chấp #{disputeId}
          </h1>
          {detail && (
            <p className="text-gray-600">
              Giao dịch: TX-{detail.transaction.id}
            </p>
          )}
        </div>
      </div>

      {loading && <div className="box">Đang tải dữ liệu...</div>}

      {!loading && detail && (
        <>
          {/* ===== SUMMARY PANEL ===== */}
          <section className="box">
            <h3 className="boxTitle">Tóm tắt tranh chấp</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Buyer */}
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <User size={20} className="text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Người mua
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {detail.buyer.name}
                  </p>
                  <p className="text-xs text-gray-500">{detail.buyer.email}</p>
                </div>
              </div>

              {/* Seller */}
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <Store size={20} className="text-green-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Người bán
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {detail.seller.name}
                  </p>
                  <p className="text-xs text-gray-500">{detail.seller.email}</p>
                </div>
              </div>

              {/* Amount */}
              <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                <Banknote
                  size={20}
                  className="text-yellow-600 mt-0.5 shrink-0"
                />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Số tiền giao dịch
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {formatCurrency(detail.transaction.amountVnd)}
                  </p>
                </div>
              </div>

              {/* Reason */}
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                <AlertTriangle
                  size={20}
                  className="text-red-600 mt-0.5 shrink-0"
                />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Lý do khiếu nại
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {detail.reasonText}
                  </p>
                </div>
              </div>
            </div>

            {/* Listing info */}
            <div className="mt-4 flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              {detail.listing.imageUrl && (
                <img
                  src={detail.listing.imageUrl}
                  alt={detail.listing.title}
                  className="w-12 h-12 rounded object-cover border"
                />
              )}
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">
                  Sản phẩm
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {detail.listing.title}
                </p>
                <p className="text-xs text-gray-500">
                  {formatCurrency(detail.listing.priceVnd)}
                </p>
              </div>
            </div>

            {/* Description */}
            {detail.description && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                  Mô tả chi tiết
                </p>
                <p className="text-sm text-gray-800 whitespace-pre-line">
                  {detail.description}
                </p>
              </div>
            )}
          </section>

          {/* ===== ESCALATION INFO (if present) ===== */}
          {detail.escalationNote && (
            <section className="box border-l-4 border-purple-500">
              <h3 className="boxTitle flex items-center gap-2">
                <ArrowLeftRight size={20} className="text-purple-600" />
                Thông tin chuyển từ Inspector
              </h3>

              <div className="mt-3 space-y-3">
                {detail.escalationSuggestion && (
                  <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                    <Lightbulb
                      size={20}
                      className="text-purple-600 mt-0.5 shrink-0"
                    />
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">
                        Đề xuất hướng xử lý
                      </p>
                      <p className="text-sm font-bold text-purple-800">
                        {SUGGESTION_LABELS[detail.escalationSuggestion] ??
                          detail.escalationSuggestion}
                      </p>
                    </div>
                  </div>
                )}

                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                    Lý do chuyển
                  </p>
                  <p className="text-sm text-gray-800 whitespace-pre-line">
                    {detail.escalationNote}
                  </p>
                </div>

                {detail.escalatedBy && (
                  <p className="text-xs text-gray-500">
                    Chuyển bởi:{" "}
                    <span className="font-medium text-gray-700">
                      {detail.escalatedBy.name}
                    </span>
                  </p>
                )}
              </div>
            </section>
          )}

          {/* ===== EVIDENCE PREVIEW ===== */}
          {detail.evidence.length > 0 && (
            <section className="box">
              <h3 className="boxTitle flex items-center gap-2">
                <ImageIcon size={20} className="text-gray-600" />
                Bằng chứng ({detail.evidence.length})
              </h3>

              {/* Image thumbnails */}
              {imageEvidence.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {imageEvidence.map((ev, idx) => (
                    <a
                      key={idx}
                      href={ev.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-20 h-20 rounded-lg overflow-hidden border border-gray-200 hover:border-blue-400 transition-colors"
                    >
                      <img
                        src={ev.url}
                        alt={ev.name ?? `Bằng chứng ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </a>
                  ))}
                </div>
              )}

              {/* Text evidence */}
              {detail.evidence
                .filter((e) => e.type === "TEXT" && e.text)
                .map((ev, idx) => (
                  <div
                    key={`text-${idx}`}
                    className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-700 border-l-2 border-gray-300"
                  >
                    <span className="text-xs text-gray-400 uppercase">
                      {ev.uploaderRole ?? "Unknown"}:
                    </span>{" "}
                    {ev.text}
                  </div>
                ))}
            </section>
          )}

          {/* ===== ACTION FORM ===== */}
          <section className="box">
            <h3 className="boxTitle">Phán quyết cuối cùng</h3>

            {error && <div className="text-red-700 mb-4">{error}</div>}

            <div className="disputeResolutionGrid">
              <label className="field">
                <span className="filterLabel">Hướng giải quyết</span>
                <select
                  className="select"
                  value={action}
                  onChange={(e) =>
                    setAction(
                      e.target.value as DisputeResolutionPayload["action"] | "",
                    )
                  }
                  disabled={!!error}
                >
                  <option value="">-- Chọn hướng giải quyết --</option>
                  {RESOLUTION_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span className="filterLabel">Lý do phán xử (bắt buộc)</span>
                <textarea
                  className="textarea"
                  rows={5}
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Nhập lý do phán xử rõ ràng để cập nhật tranh chấp và giao dịch"
                  disabled={!!error}
                />
              </label>
            </div>

            {selectedOption && (
              <div className="disputeResolutionHint">
                {selectedOption.helper}
              </div>
            )}

            <div className="disputeResolutionActions">
              <Link href={resolvedBackPath} className="btn btnGhost">
                Huỷ
              </Link>
              <button
                className="btn btn-primary"
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit}
              >
                {submitting ? "Đang gửi..." : "Xác nhận phán quyết"}
              </button>
            </div>
          </section>
        </>
      )}

      {!loading && !detail && error && (
        <div className="box text-red-700">{error}</div>
      )}
    </div>
  );
}
