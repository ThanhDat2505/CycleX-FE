"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  inspectorService,
  type InspectorReviewDetail,
} from "@/app/services/inspectorService";

type ActionPanel = "NONE" | "NEED_INFO" | "APPROVE" | "REJECT";

export default function ReviewDetailClient({
  listingId,
}: {
  listingId?: string;
}) {
  const router = useRouter();
  const [listing, setListing] = useState<InspectorReviewDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [activePanel, setActivePanel] = useState<ActionPanel>("NONE");

  const [approveReason, setApproveReason] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [rejectOther, setRejectOther] = useState("");
  const [needInfoNote, setNeedInfoNote] = useState("");

  useEffect(() => {
    let mounted = true;
    const id = listingId?.trim();

    if (!id) {
      setLoading(false);
      setError("Thiếu mã tin đăng");
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        await inspectorService.lockListing(id);
        const detail = await inspectorService.getListingDetail(id);
        if (mounted) setListing(detail);
      } catch (err: any) {
        if (mounted) {
          setError(err?.message || "Không tải được chi tiết tin");
          setListing(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [listingId]);

  const reqId = "REQ-" + (listing?.id?.replace(/\D/g, "") || "0000");

  const chatHref = `/inspector/inspector-chat?req=${encodeURIComponent(reqId)}&id=${encodeURIComponent(listing?.id || "")}`;

  const priceText = useMemo(() => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(listing?.priceVnd ?? 0);
  }, [listing?.priceVnd]);

  if (loading) {
    return (
      <div className="p-10 text-center font-bold text-gray-500">
        Đang tải chi tiết tin đăng...
      </div>
    );
  }

  if (!listing || error) {
    return (
      <div className="p-10 text-center font-bold text-gray-500">
        {error || "Không tìm thấy tin đăng."}
      </div>
    );
  }

  const togglePanel = (panel: ActionPanel) => {
    setActivePanel((prev) => (prev === panel ? "NONE" : panel));
  };

  const rejectNeedsOtherText = rejectReason === "other";
  const canConfirmReject =
    rejectReason !== "" &&
    (!rejectNeedsOtherText || rejectOther.trim().length > 0);

  return (
    <div className="wrap review-detail-page">
      <header className="header">
        <div className="min-w-0">
          <div className="meta">
            <Link
              href="/inspector/pending-list"
              className="text-sm font-extrabold text-gray-500 hover:text-gray-900 transition-colors mb-2 inline-flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[18px]">
                arrow_back
              </span>
              Quay lại
            </Link>
          </div>

          <h1 className="page-title wrap-break-word">{listing.productName}</h1>

          <div className="meta">
            <span className="metaItem min-w-0">
              <span className="material-symbols-outlined text-[18px] text-gray-400">
                calendar_today
              </span>
              <span className="metaLabel">Gửi ngày:</span>
              <span className="font-bold wrap-break-word">
                {listing.submittedAt}
              </span>
            </span>

            <span className="metaItem min-w-0">
              <span className="material-symbols-outlined text-[18px] text-gray-400">
                schedule
              </span>
              <span className="metaLabel">Chờ duyệt:</span>
              <span className="font-bold wrap-break-word">
                {listing.waitingDays} ngày
              </span>
            </span>
          </div>
        </div>

        <div className="rightActions">
          <button className="btnGhost" type="button">
            <span className="material-symbols-outlined">flag</span>
            Báo cáo
          </button>
        </div>
      </header>

      <div className="layout">
        <div className="left">
          <section className="gallery">
            <div className="mainBox"></div>
            <div className="thumbGrid">
              {listing.images.thumbs.map((_, idx) => (
                <div key={idx} className="thumbBox"></div>
              ))}
            </div>
          </section>

          <section className="box">
            <h3 className="boxTitle">Thông số kỹ thuật</h3>
            <div className="specGrid">
              <div className="specItem">
                <span className="specLabel">Hãng xe</span>
                <span className="specValue">{listing.specs.brand}</span>
              </div>
              <div className="specItem">
                <span className="specLabel">Loại xe</span>
                <span className="specValue">{listing.specs.type}</span>
              </div>
              <div className="specItem">
                <span className="specLabel">Khung sườn</span>
                <span className="specValue">{listing.specs.frame}</span>
              </div>
              <div className="specItem">
                <span className="specLabel">Trọng lượng</span>
                <span className="specValue">{listing.specs.weight}</span>
              </div>
              <div className="specItem">
                <span className="specLabel">Màu sắc</span>
                <span className="specValue">Đen / Đỏ</span>
              </div>
              <div className="specItem">
                <span className="specLabel">Tình trạng</span>
                <span className="specValue">Đã qua sử dụng (98%)</span>
              </div>
            </div>
          </section>

          <section className="box">
            <h3 className="boxTitle">Lịch sử xử lý</h3>
            <div className="history">
              {listing.history.map((item, index) => (
                <div key={index} className="historyRow">
                  <div className="timelineMarker">
                    <div className={`dot ${item.variant}`} />
                  </div>
                  <div className="hContent">
                    <div className="hHeader">
                      <span className="hTag">{item.tag}</span>
                      <span className="hTime wrap-break-word">{item.at}</span>
                    </div>
                    <p className="hDesc wrap-break-word">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="card" style={{ overflow: "visible" }}>
          <div className="price">{priceText}</div>

          <div className="seller">
            <div className="avatar-circle"></div>
            <span className="sellerName">{listing.sellerName}</span>
          </div>

          <div className="mb-4" style={{ marginBottom: 16 }}>
            <Link
              href={chatHref}
              className="btn btn-info no-underline flex items-center justify-center"
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                className="material-symbols-outlined mr-2"
                style={{ marginRight: 8 }}
              >
                chat
              </span>
              MỞ CHAT VỚI SELLER
            </Link>
          </div>

          <div className="note-box" aria-label="Ghi chú đánh giá">
            <div className="note-box-title">Ghi chú đánh giá (nội bộ)</div>
            <textarea
              className="textarea"
              placeholder="VD: xe đúng mô tả, ảnh đủ góc..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            ></textarea>
          </div>

          <button
            className="btn btn-info"
            type="button"
            onClick={() => togglePanel("NEED_INFO")}
          >
            YÊU CẦU BỔ SUNG
          </button>
          <button
            className="btn btn-success"
            type="button"
            onClick={() => togglePanel("APPROVE")}
          >
            DUYỆT TIN
          </button>
          <button
            className="btn btn-danger"
            type="button"
            onClick={() => togglePanel("REJECT")}
          >
            TỪ CHỐI
          </button>

          {activePanel === "NEED_INFO" && (
            <section className="panel">
              <div className="panel-title">Nội dung cần bổ sung</div>
              <textarea
                className="textarea"
                rows={4}
                placeholder="VD: Bổ sung ảnh số khung..."
                value={needInfoNote}
                onChange={(e) => setNeedInfoNote(e.target.value)}
              ></textarea>
              <div className="checklist">
                <label className="check-item">
                  <input type="checkbox" /> Ảnh số khung/serial
                </label>
                <label className="check-item">
                  <input type="checkbox" /> Ảnh hóa đơn/giấy tờ
                </label>
              </div>
              <div className="confirm">
                <span className="confirm-text">Bạn chắc chắn muốn gửi?</span>
                <button
                  className="btn btn-info btn-sm"
                  type="button"
                  disabled={submitting || needInfoNote.trim().length === 0}
                  onClick={() => {
                    alert(
                      "Đã gửi yêu cầu bổ sung (UI). Endpoint riêng chưa có trong collection INSPECTOR.",
                    );
                    setActivePanel("NONE");
                  }}
                >
                  GỬI
                </button>
              </div>
            </section>
          )}

          {activePanel === "APPROVE" && (
            <section className="panel">
              <div className="panel-title">Lý do duyệt</div>
              <label className="field">
                <select
                  className="select"
                  value={approveReason}
                  onChange={(e) => setApproveReason(e.target.value)}
                >
                  <option value="">-- Chọn --</option>
                  <option value="ok">Đủ ảnh & mô tả khớp</option>
                  <option value="price">Giá hợp lý</option>
                </select>
              </label>
              <div className="confirm">
                <span className="confirm-text">Xác nhận duyệt tin?</span>
                <button
                  className="btn btn-success btn-sm"
                  type="button"
                  disabled={submitting || approveReason === ""}
                  onClick={async () => {
                    if (!listing) return;
                    const reasonCode =
                      approveReason === "ok"
                        ? "MEETS_STANDARDS"
                        : "GOOD_CONDITION";
                    const reasonText =
                      approveReason === "ok"
                        ? "Đủ ảnh và mô tả khớp"
                        : "Giá phù hợp với thông tin sản phẩm";

                    try {
                      setSubmitting(true);
                      await inspectorService.approveListing(listing.id, {
                        reasonCode,
                        reasonText,
                        note,
                      });
                      alert("Đã duyệt tin thành công");
                      router.push("/inspector/dashboard");
                    } catch (err: any) {
                      alert(err?.message || "Duyệt tin thất bại");
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                >
                  XÁC NHẬN
                </button>
              </div>
            </section>
          )}

          {activePanel === "REJECT" && (
            <section className="panel panel-reject">
              <div className="panel-title">Lý do từ chối</div>
              <label className="field">
                <select
                  className="select"
                  value={rejectReason}
                  onChange={(e) => {
                    const v = e.target.value;
                    setRejectReason(v);
                    if (v !== "other") setRejectOther("");
                  }}
                >
                  <option value="">-- Chọn --</option>
                  <option value="mismatch_desc">Sai mô tả</option>
                  <option value="missing_info">Thiếu thông tin</option>
                  <option value="duplicate_post">Tin bị trùng</option>
                  <option value="spam_content">Nội dung spam</option>
                  <option value="wrong_photo">Ảnh không đúng</option>
                  <option value="other">Khác</option>
                </select>
              </label>
              {rejectReason === "other" && (
                <textarea
                  className="textarea mt-2"
                  rows={3}
                  placeholder="Nhập lý do khác..."
                  value={rejectOther}
                  onChange={(e) => setRejectOther(e.target.value)}
                />
              )}
              <div className="confirm">
                <span className="confirm-text">Xác nhận từ chối?</span>
                <button
                  className="btn btn-danger btn-sm"
                  type="button"
                  disabled={!canConfirmReject || submitting}
                  onClick={async () => {
                    if (!canConfirmReject) return;

                    const reasonCode =
                      rejectReason === "mismatch_desc"
                        ? "MISMATCH_DESC"
                        : rejectReason === "missing_info"
                          ? "MISSING_INFO"
                          : rejectReason === "duplicate_post"
                            ? "DUPLICATE_POST"
                            : rejectReason === "spam_content"
                              ? "SPAM_CONTENT"
                              : rejectReason === "wrong_photo"
                                ? "WRONG_PHOTO"
                                : "OTHER";
                    const reasonText =
                      rejectReason === "other" && rejectOther.trim().length > 0
                        ? rejectOther.trim()
                        : rejectReason;

                    try {
                      setSubmitting(true);
                      await inspectorService.rejectListing(listing.id, {
                        reasonCode,
                        reasonText,
                        note,
                      });
                      alert("Đã từ chối tin thành công");
                      router.push("/inspector/dashboard");
                    } catch (err: any) {
                      alert(err?.message || "Từ chối tin thất bại");
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                >
                  XÁC NHẬN
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
