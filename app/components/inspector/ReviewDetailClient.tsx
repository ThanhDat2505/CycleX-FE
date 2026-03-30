/* eslint-disable @typescript-eslint/no-explicit-any */

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
  const [activePanel, setActivePanel] = useState<ActionPanel>("NONE");
  const [selectedThumb, setSelectedThumb] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [checklist, setChecklist] = useState([false, false, false, false]);
  const [needInfoChecklist, setNeedInfoChecklist] = useState({
    frameSerial: false,
    invoice: false,
  });

  const [approveReason, setApproveReason] = useState("");
  const [approveErrorMessage, setApproveErrorMessage] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [rejectReasonOther, setRejectReasonOther] = useState("");
  const [rejectErrorMessage, setRejectErrorMessage] = useState("");

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
        const detail = await inspectorService.getListingDetail(id);
        if (mounted) setListing(detail);

        const normalizedStatus = String(detail?.status ?? "")
          .trim()
          .toUpperCase();

        if (
          normalizedStatus === "PENDING" ||
          normalizedStatus === "PENDING_APPROVAL"
        ) {
          try {
            await inspectorService.lockListing(id);
          } catch {}
        }
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
    if (panel === "REJECT") {
      setRejectReason("");
      setRejectReasonOther("");
      setRejectErrorMessage("");
    }
  };

  // Lý do nào cần nhập chi tiết
  const reasonNeedsDetails = (reason: string) => {
    return ["mismatch_desc", "missing_info", "other"].includes(reason);
  };

  // Có thể xác nhận reject không
  const canConfirmReject =
    rejectReason !== "" &&
    (!reasonNeedsDetails(rejectReason) || rejectReasonOther.trim() !== "");

  const isChecklistComplete = checklist.every((item) => item === true);
  const isReadOnly = ["APPROVED", "REJECTED", "DONE", "PASSED"].includes(
    String(listing?.status || "")
      .toUpperCase()
      .trim(),
  );

  const checkedCount = checklist.filter(Boolean).length;
  const totalCount = checklist.length;

  return (
    <div className="wrap review-detail-page">
      {/* Toast notification */}
      {approveErrorMessage && (
        <div
          style={{
            position: "fixed",
            bottom: 32,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            background: "#1e293b",
            color: "#fff",
            padding: "14px 24px",
            borderRadius: 14,
            fontWeight: 700,
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            gap: 10,
            boxShadow: "0 8px 32px rgba(15,23,42,0.22)",
            animation: "fadeInUp 0.25s ease",
            maxWidth: "90vw",
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {approveErrorMessage}
          <button
            onClick={() => setApproveErrorMessage("")}
            style={{ marginLeft: 8, background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: 18, lineHeight: 1, padding: 0 }}
          >×</button>
        </div>
      )}

      <header className="header">
        <div className="min-w-0">
          <div className="mt-7 mb-2">
            <Link
              href="/inspector/pending-list"
              style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 999, background: "#f1f5f9", border: "1px solid #e2e8f0", color: "#475569", fontWeight: 700, fontSize: 13, transition: "all 0.18s", width: "fit-content" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background="#e2e8f0"; (e.currentTarget as HTMLElement).style.color="#0f172a"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background="#f1f5f9"; (e.currentTarget as HTMLElement).style.color="#475569"; }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>
              Quay lại
            </Link>
          </div>

          <h1 className="page-title wrap-break-word">{listing.productName}</h1>

          <div className="meta">
            <span className="metaItem min-w-0" style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "5px 12px" }}>
              <span className="material-symbols-outlined text-[16px] text-gray-400">calendar_today</span>
              <span className="metaLabel">Gửi ngày:</span>
              <span className="font-bold wrap-break-word">{listing.submittedAt}</span>
            </span>

            <span className="metaItem min-w-0" style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 8, padding: "5px 12px" }}>
              <span className="material-symbols-outlined text-[16px]" style={{ color: "#f97316" }}>schedule</span>
              <span className="metaLabel" style={{ color: "#ea580c" }}>Chờ duyệt:</span>
              <span className="font-bold wrap-break-word" style={{ color: "#c2410c" }}>{listing.waitingDays} ngày</span>
            </span>
          </div>
        </div>
      </header>

      <div className="layout">
        <div className="left">
          <section className="gallery">
            <div
              className="mainBox"
              style={{
                overflow: "hidden",
                borderRadius: "18px",
                background: "#f0f4ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "400px",
              }}
            >
              {listing.images.main || listing.images.thumbs[0] ? (
                <img
                  src={
                    listing.images.thumbs[selectedThumb] || listing.images.main
                  }
                  alt={listing.productName}
                  style={{
                    width: "100%",
                    height: "400px",
                    objectFit: "contain",
                  }}
                  onClick={() => setShowImageModal(true)}
                  className="cursor-zoom-in"
                  title="Xem ảnh lớn"
                />
              ) : (
                <span style={{ color: "#999" }}>Không có ảnh</span>
              )}
            </div>
            <div className="thumbGrid">
              {listing.images.thumbs.map((url, idx) => (
                <div
                  key={idx}
                  className="thumbBox"
                  style={{
                    cursor: "pointer",
                    border:
                      idx === selectedThumb
                        ? "2px solid #2563eb"
                        : "2px solid transparent",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                  onClick={() => {
                    setSelectedThumb(idx);
                    setShowImageModal(true);
                  }}
                >
                  {url ? (
                    <img
                      src={url}
                      alt={`Ảnh ${idx + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  ) : null}
                </div>
              ))}
            </div>

            {showImageModal && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "100vh",
                  background: "rgba(0,0,0,0.7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1000,
                }}
                onClick={() => setShowImageModal(false)}
              >
                <img
                  src={
                    listing.images.thumbs[selectedThumb] || listing.images.main
                  }
                  alt={listing.productName}
                  style={{
                    maxWidth: "90vw",
                    maxHeight: "90vh",
                    objectFit: "contain",
                    background: "#fff",
                    borderRadius: "12px",
                    boxShadow: "0 2px 16px rgba(0,0,0,0.3)",
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  style={{
                    position: "absolute",
                    top: 24,
                    right: 32,
                    background: "rgba(0,0,0,0.6)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "50%",
                    width: 40,
                    height: 40,
                    fontSize: 24,
                    cursor: "pointer",
                  }}
                  onClick={() => setShowImageModal(false)}
                  title="Đóng"
                >
                  ×
                </button>
              </div>
            )}
          </section>

          {!isReadOnly && (
            <section className="box" style={{ border: "1px solid #dbeafe", background: "linear-gradient(180deg,#fff 0%,#f0f7ff 100%)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h3 className="boxTitle" style={{ marginBottom: 0 }}>Checklist kiểm duyệt</h3>
                <span style={{
                  fontSize: 13,
                  fontWeight: 800,
                  padding: "4px 12px",
                  borderRadius: 999,
                  background: isChecklistComplete ? "#dcfce7" : "#fef9c3",
                  color: isChecklistComplete ? "#15803d" : "#a16207",
                  border: `1px solid ${isChecklistComplete ? "#bbf7d0" : "#fde68a"}`,
                  transition: "all 0.3s",
                }}>
                  {checkedCount}/{totalCount} mục
                </span>
              </div>

              {/* Progress bar */}
              <div style={{ height: 6, background: "#e2e8f0", borderRadius: 999, marginBottom: 18, overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${(checkedCount / totalCount) * 100}%`,
                  background: isChecklistComplete ? "linear-gradient(90deg,#16a34a,#22c55e)" : "linear-gradient(90deg,#f59e0b,#fbbf24)",
                  borderRadius: 999,
                  transition: "width 0.4s ease, background 0.4s ease",
                }} />
              </div>

              <div className="flex flex-col gap-2">
                {[
                  "Hình ảnh rõ nét, đầy đủ góc độ",
                  "Thông tin mô tả khớp với hình ảnh",
                  "Giá cả hợp lý với tình trạng xe",
                  "Người bán đáng tin cậy, không có dấu hiệu lừa đảo",
                ].map((text, idx) => (
                  <label
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 14px",
                      borderRadius: 10,
                      cursor: "pointer",
                      border: `1px solid ${checklist[idx] ? "#bbf7d0" : "#e2e8f0"}`,
                      background: checklist[idx] ? "#f0fdf4" : "#fff",
                      transition: "all 0.2s",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checklist[idx]}
                      onChange={(e) => {
                        const newChecklist = [...checklist];
                        newChecklist[idx] = e.target.checked;
                        setChecklist(newChecklist);
                        setApproveErrorMessage("");
                      }}
                      style={{ width: 18, height: 18, accentColor: "#16a34a", cursor: "pointer", flexShrink: 0 }}
                    />
                    <span style={{
                      fontSize: 14,
                      fontWeight: checklist[idx] ? 700 : 500,
                      color: checklist[idx] ? "#15803d" : "#4b5563",
                      transition: "all 0.2s",
                      userSelect: "none",
                    }}>{text}</span>
                  </label>
                ))}
              </div>
            </section>
          )}

          <section className="box">
            <h3 className="boxTitle">Thông số kỹ thuật</h3>
            <div className="specGrid">
              <div className="specItem">
                <span className="specLabel">Hãng xe</span>
                <span className="specValue">{listing.specs.brand}</span>
              </div>
              <div className="specItem">
                <span className="specLabel">Loại xe</span>
                <span className="specValue">{(() => {
                  const t = String(listing.specs.type || "").toLowerCase();
                  if (t.includes("mountain")) return "Xe đạp địa hình";
                  if (t.includes("city") || t.includes("urban")) return "Xe đạp đường phố";
                  if (t.includes("touring")) return "Xe đạp touring";
                  if (t.includes("road")) return "Xe đạp đua (Road)";
                  if (t.includes("e-bike") || t.includes("electric")) return "Xe đạp điện";
                  if (t.includes("folding") || t.includes("fold")) return "Xe đạp gấp";
                  if (t.includes("hybrid")) return "Xe đạp lai (Hybrid)";
                  if (t.includes("bmx")) return "Xe đạp BMX";
                  if (t.includes("kids") || t.includes("child")) return "Xe đạp trẻ em";
                  return listing.specs.type || "—";
                })()}</span>
              </div>

              <div className="specItem">
                <span className="specLabel">Màu sắc</span>
                <span className="specValue">Đen / Đỏ</span>
              </div>
              <div className="specItem">
                <span className="specLabel">Tình trạng</span>
                <span className="specValue">{listing.specs.condition}</span>
              </div>
            </div>
          </section>
        </div>

        <div
          className="card sticky top-24 self-start"
          style={{ overflow: "visible" }}
        >
          <div className="price">{priceText}</div>

          <div className="seller">
            <div className="avatar-circle"></div>
            <span className="sellerName">{listing.sellerName}</span>
          </div>

          {!isReadOnly ? (
            <div className="flex flex-col gap-3 mt-5 w-full">
              {/* Wrapper div bắt click để hiện thông báo khi button bị disabled */}
              <div
                style={{ position: "relative" }}
                onClick={() => {
                  if (!isChecklistComplete) {
                    const remaining = checklist.filter(v => !v).length;
                    setApproveErrorMessage(
                      `Vui lòng tick đủ ${totalCount} mục trong checklist để duyệt tin. Còn thiếu ${remaining} mục.`
                    );
                    // Auto clear after 4s
                    setTimeout(() => setApproveErrorMessage(""), 4000);
                  }
                }}
              >
                <button
                  className={`btn w-full text-[14px] font-bold shadow-sm transition-all duration-300 ${
                    isChecklistComplete
                      ? "btn-success hover:brightness-110"
                      : ""
                  }`}
                  style={{
                    padding: "14px 0",
                    width: "100%",
                    ...(isChecklistComplete
                      ? {}
                      : {
                          backgroundColor: "#86efac",
                          borderColor: "#86efac",
                          color: "#ffffff",
                          opacity: 0.55,
                          pointerEvents: "none",
                        }
                    )
                  }}
                  type="button"
                  disabled={!isChecklistComplete || submitting}
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (!listing) return;
                    const confirmed = window.confirm(
                      "Bạn có chắc chắn muốn duyệt tin đăng này?",
                    );
                    if (!confirmed) return;
                    try {
                      setSubmitting(true);
                      const payload = {
                        reasonCode: "MEETS_STANDARDS",
                        reasonText: "Đã qua kiểm duyệt (Checklist hoàn tất)",
                      };
                      await inspectorService.approveListing(listing.id, payload);
                      alert("Đã duyệt tin thành công!");
                      router.push("/inspector/dashboard");
                    } catch (err: any) {
                      alert(err?.message || "Duyệt tin thất bại");
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                >
                  {submitting ? (
                    "Đang xử lý..."
                  ) : isChecklistComplete ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      DUYỆT TIN
                    </span>
                  ) : (
                    `DUYỆT TIN (${checkedCount}/${totalCount})`
                  )}
                </button>
              </div>
              <button
                className="btn btn-danger btn-reject-solid w-full py-3.5 text-[14px] font-bold shadow-sm"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                type="button"
                onClick={() => togglePanel("REJECT")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                TỪ CHỐI
              </button>

              {activePanel === "NEED_INFO" && (
                <section className="panel mt-2 border border-[#2563eb]/20 rounded-xl overflow-hidden bg-white shadow-sm">
                  <div className="panel-title bg-[#f0f4ff] px-4 py-3 font-bold text-[#1e40af] border-b border-[#2563eb]/10">
                    Nội dung cần bổ sung
                  </div>
                  <div className="p-4">
                    <div className="checklist flex flex-col gap-3">
                      <label className="check-item flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-5 h-5 rounded border-gray-300 text-[#2563eb] focus:ring-[#2563eb]"
                          checked={needInfoChecklist.frameSerial}
                          onChange={(e) =>
                            setNeedInfoChecklist((prev) => ({
                              ...prev,
                              frameSerial: e.target.checked,
                            }))
                          }
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Ảnh số khung/serial
                        </span>
                      </label>
                      <label className="check-item flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-5 h-5 rounded border-gray-300 text-[#2563eb] focus:ring-[#2563eb]"
                          checked={needInfoChecklist.invoice}
                          onChange={(e) =>
                            setNeedInfoChecklist((prev) => ({
                              ...prev,
                              invoice: e.target.checked,
                            }))
                          }
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Ảnh hóa đơn/giấy tờ
                        </span>
                      </label>
                    </div>
                    <div className="confirm mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                      <span className="confirm-text text-sm text-gray-500 font-medium">
                        Xác nhận gửi?
                      </span>
                      <button
                        className="btn btn-info px-6 py-2 text-sm font-bold"
                        type="button"
                        disabled={
                          submitting ||
                          (!needInfoChecklist.frameSerial &&
                            !needInfoChecklist.invoice)
                        }
                        onClick={async () => {
                          const confirmed = window.confirm(
                            "Bạn có chắc chắn muốn yêu cầu bổ sung thông tin cho tin đăng này?",
                          );
                          if (!confirmed) return;

                          try {
                            setSubmitting(true);
                            const requiredItems = [];
                            if (needInfoChecklist.frameSerial)
                              requiredItems.push("Ảnh số khung/serial");
                            if (needInfoChecklist.invoice)
                              requiredItems.push("Ảnh hóa đơn/giấy tờ");

                            await inspectorService.requestMoreInfo(listing.id, {
                              requiredItems,
                              reasonText:
                                "Vui lòng bổ sung thêm: " +
                                requiredItems.join(", "),
                            });

                            alert("Đã gửi yêu cầu bổ sung thành công!");
                            router.push("/inspector/dashboard");
                          } catch (err: any) {
                            alert(err?.message || "Yêu cầu bổ sung thất bại");
                          } finally {
                            setSubmitting(false);
                            setActivePanel("NONE");
                          }
                        }}
                      >
                        GỬI
                      </button>
                    </div>
                  </div>
                </section>
              )}
              {activePanel === "REJECT" && (
                <section className="panel panel-reject mt-2 border border-red-200 rounded-xl overflow-hidden bg-white shadow-sm">
                  <div className="panel-title bg-red-50 px-4 py-3 font-bold text-red-700 border-b border-red-100">
                    Lý do từ chối
                  </div>
                  <div className="p-4">
                    <label className="block w-full">
                      <select
                        className="select w-full border border-gray-300 rounded-lg shadow-sm focus:border-red-500 focus:ring-red-500 text-sm p-3 outline-none"
                        value={rejectReason}
                        onChange={(e) => {
                          setRejectReason(e.target.value);
                          setRejectReasonOther("");
                          setRejectErrorMessage("");
                        }}
                      >
                        <option value="">-- Chọn --</option>
                        <option value="mismatch_desc">Sai mô tả</option>
                        <option value="missing_info">Thiếu thông tin</option>
                        <option value="duplicate_post">Tin bị trùng</option>
                        <option value="spam_content">Nội dung spam</option>
                        <option value="wrong_photo">Ảnh không đúng</option>
                        <option value="other">Khác (nhập chi tiết)</option>
                      </select>
                    </label>

                    {reasonNeedsDetails(rejectReason) && (
                      <div className="mt-3">
                        <textarea
                          className="w-full border border-gray-300 rounded-lg shadow-sm focus:border-red-500 focus:ring-red-500 text-sm p-3 outline-none"
                          rows={3}
                          placeholder="Vui lòng nhập lý do cụ thể..."
                          value={rejectReasonOther}
                          onChange={(e) => {
                            setRejectReasonOther(e.target.value);
                            setRejectErrorMessage("");
                          }}
                        />
                      </div>
                    )}

                    {rejectErrorMessage && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700 font-medium">
                          {rejectErrorMessage}
                        </p>
                      </div>
                    )}

                    <div className="confirm mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                      <span className="confirm-text text-sm text-gray-500 font-medium">
                        Xác nhận từ chối?
                      </span>
                      <button
                        className="btn btn-danger btn-reject-solid px-5 py-2 text-sm font-bold"
                        type="button"
                        disabled={!canConfirmReject || submitting}
                        onClick={async () => {
                          if (!rejectReason) {
                            setRejectErrorMessage(
                              "Vui lòng chọn lý do từ chối",
                            );
                            return;
                          }

                          if (
                            reasonNeedsDetails(rejectReason) &&
                            !rejectReasonOther.trim()
                          ) {
                            setRejectErrorMessage("Vui lòng nhập lý do cụ thể");
                            return;
                          }

                          const confirmed = window.confirm(
                            "Bạn có chắc chắn muốn từ chối tin đăng này?",
                          );
                          if (!confirmed) return;

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
                          const reasonText = rejectReasonOther;

                          try {
                            setSubmitting(true);
                            const rejectPayload = {
                              reasonCode,
                              reasonText,
                            };
                            await inspectorService.rejectListing(
                              listing.id,
                              rejectPayload,
                            );
                            alert("Đã từ chối tin thành công!");
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
                  </div>
                </section>
              )}
            </div>
          ) : (
            <div className="mt-6 p-5 bg-gray-50 border border-gray-200 rounded-xl text-center shadow-inner flex flex-col justify-center items-center gap-2">
              <span
                className={`material-symbols-outlined text-3xl ${
                  listing.status === "APPROVED" || listing.status === "PASSED"
                    ? "text-green-500"
                    : listing.status === "REJECTED"
                      ? "text-red-500"
                      : "text-gray-400"
                }`}
              >
                {listing.status === "APPROVED" || listing.status === "PASSED"
                  ? "check_circle"
                  : listing.status === "REJECTED"
                    ? "cancel"
                    : "task_alt"}
              </span>
              <span className="block text-sm text-gray-600 font-medium tracking-wide">
                {listing.status === "APPROVED" || listing.status === "PASSED"
                  ? "Tin đăng đã được duyệt"
                  : listing.status === "REJECTED"
                    ? "Tin đăng đã bị từ chối"
                    : "Tin đăng đã xử lý"}
              </span>
              <span
                className={`inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                  listing.status === "APPROVED" || listing.status === "PASSED"
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : listing.status === "REJECTED"
                      ? "bg-red-100 text-red-800 border border-red-200"
                      : "bg-gray-200 text-gray-800 border border-gray-300"
                }`}
              >
                {listing.status}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Đã xóa nút chat với seller */}
    </div>
  );
}
