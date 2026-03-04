"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { getListingById } from "@/app/mocks/inspector/inspectorListings";

function formatVnd(v?: number) {
  if (typeof v !== "number") return "—";
  return `${v.toLocaleString("vi-VN")} đ`;
}

function formatDateDMY(iso?: string) {
  if (!iso) return "—";
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return iso;
  return `${m[3]}/${m[2]}/${m[1]}`;
}

export default function InspectorRequestDetail() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const reqParam = searchParams.get("req") || "REQ-20001";
  const idParam = searchParams.get("id") || "ID-55555";

  const listing = useMemo(() => getListingById(idParam), [idParam]);

  const [imgIndex, setImgIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const totalImages = (listing?.images?.thumbs?.length ?? 0) + 1;

  const nextImg = (e: React.MouseEvent) => {
    e.preventDefault();
    triggerFade();
    setTimeout(() => {
      setImgIndex((prev) => (prev + 1) % totalImages);
    }, 150);
  };

  const prevImg = (e: React.MouseEvent) => {
    e.preventDefault();
    triggerFade();
    setTimeout(() => {
      setImgIndex((prev) => (prev - 1 + totalImages) % totalImages);
    }, 150);
  };

  const triggerFade = () => {
    setIsFading(true);
    setTimeout(() => setIsFading(false), 300);
  };

  const productName = listing?.productName ?? "—";
  const storeName = listing?.storeName ?? "—";
  const sellerName = listing?.sellerName ?? "—";
  const createdAt = formatDateDMY(listing?.submittedAt);

  const price = formatVnd(listing?.priceVnd);
  const brand = listing?.specs?.brand ?? "—";
  const type = listing?.specs?.type ?? "—";
  const frame = listing?.specs?.frame ?? "—";
  const weight = listing?.specs?.weight ?? "—";
  const chatHref = `/inspector/inspector-chat?req=${encodeURIComponent(reqParam)}&id=${encodeURIComponent(idParam)}`;
  return (
    <main className="main-content">
      <div className="wrap">
        <header className="pageHeader">
          <div className="header">
            <div>
              <h1 className="title">
                Chi tiết yêu cầu bổ sung: <span>#{reqParam}</span>
              </h1>
              <div className="meta">
                <div className="metaItem">
                  <span className="metaLabel">Listing:</span>
                  <strong>#{idParam}</strong>
                </div>
                <div className="metaItem">
                  <span className="metaLabel">Ngày tạo:</span>
                  <strong>{createdAt}</strong>
                </div>
                <div className="metaItem">
                  <span className="metaLabel">Cửa hàng:</span>
                  <strong>{storeName}</strong>
                </div>
              </div>
            </div>
            <div className="rightActions">
              <Link className="btnGhost" href="/inspector/review-required">
                ← Quay lại danh sách
              </Link>
            </div>
          </div>
        </header>

        <div className="layout">
          <section className="left">
            <section className="box">
              <div className="irdHead">
                <div className="boxTitle" style={{ marginBottom: 0 }}>
                  Thông tin tin đăng
                </div>
                <span className="irdBadge">{type}</span>
              </div>

              <div className="irdListingGrid">
                <div style={{ position: "relative" }}>
                  <div
                    className={`irdListingImg ${isFading ? "fade-anim" : ""}`}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px dashed var(--muted)",
                      background: "rgba(0,0,0,0.02)",
                      height: "400px",
                      borderRadius: "18px",
                      position: "relative",
                      transition: "opacity 0.3s ease-in-out",
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontSize: "64px",
                        color: "var(--muted)",
                        opacity: 0.3,
                      }}
                    >
                      image
                    </span>
                    <strong
                      style={{
                        fontSize: "24px",
                        marginTop: "10px",
                        color: "var(--text)",
                      }}
                    >
                      Ảnh #{imgIndex + 1}
                    </strong>
                    <p style={{ color: "var(--muted)", fontSize: "14px" }}>
                      Click mũi tên để xem ảnh tiếp theo
                    </p>

                    <button
                      onClick={prevImg}
                      style={{
                        position: "absolute",
                        left: "15px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "var(--dark)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "50%",
                        width: "44px",
                        height: "44px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "var(--shadow-md)",
                      }}
                    >
                      <span className="material-symbols-outlined">
                        arrow_back
                      </span>
                    </button>
                    <button
                      onClick={nextImg}
                      style={{
                        position: "absolute",
                        right: "15px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "var(--dark)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "50%",
                        width: "44px",
                        height: "44px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "var(--shadow-md)",
                      }}
                    >
                      <span className="material-symbols-outlined">
                        arrow_forward
                      </span>
                    </button>

                    <div
                      style={{
                        position: "absolute",
                        bottom: "20px",
                        display: "flex",
                        gap: "8px",
                      }}
                    >
                      {[...Array(totalImages)].map((_, i) => (
                        <div
                          key={i}
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background:
                              i === imgIndex ? "var(--dark)" : "var(--border)",
                            transition: "all 0.3s",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="irdListingInfo">
                  <div className="specItem">
                    <div className="specLabel">Tên xe</div>
                    <div className="specValue">{productName}</div>
                  </div>
                  <div className="specItem">
                    <div className="specLabel">Giá niêm yết</div>
                    <div
                      className="specValue"
                      style={{ color: "#ff383c", fontSize: "20px" }}
                    >
                      {price}
                    </div>
                  </div>
                  <div className="irdSpecGrid">
                    <div className="specItem">
                      <div className="specLabel">Brand</div>
                      <div className="specValue">{brand}</div>
                    </div>
                    <div className="specItem">
                      <div className="specLabel">Frame</div>
                      <div className="specValue">{frame}</div>
                    </div>
                    <div className="specItem">
                      <div className="specLabel">Weight</div>
                      <div className="specValue">{weight}</div>
                    </div>
                    <div className="specItem">
                      <div className="specLabel">Condition</div>
                      <div className="specValue">Used</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="box">
              <div className="boxTitle">Checklist thông tin cần bổ sung</div>
              <div className="irdChecklist">
                <div className="irdCheckItem">
                  <div className="irdCheckTop">
                    <div className="irdCheckTitle">
                      Ảnh số khung / serial (bắt buộc)
                    </div>
                    <span className="irdPill missing">MISSING</span>
                  </div>
                </div>
              </div>
            </section>
          </section>

          <aside className="card">
            <div className="irdHead" style={{ marginBottom: 12 }}>
              <div className="boxTitle" style={{ marginBottom: 0 }}>
                Thao tác
              </div>
            </div>

            <button
              className="btn btn-success"
              onClick={() =>
                router.push(`/inspector/inspector-checklist?id=${idParam}`)
              }
              style={{
                background: "#111827",
                color: "#fff",
                marginBottom: "12px",
              }}
            >
              Thực hiện kiểm định
            </button>

            {/* --- THÊM NÚT CHAT VỚI SELLER TẠI ĐÂY --- */}
            <Link
              href={chatHref}
              className="btn btn-info"
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                background: "var(--blue-color)", // Màu xanh đặc trưng của Chat
                color: "#fff",
              }}
            >
              <span className="material-symbols-outlined">chat</span>
              CHAT VỚI SELLER
            </Link>
          </aside>
        </div>
      </div>

      <style jsx>{`
        .fade-anim {
          opacity: 0.5;
        }
        .irdListingImg {
          transition: opacity 0.2s ease-in-out;
        }
      `}</style>
    </main>
  );
}
