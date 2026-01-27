"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./review-detail.module.css";
import {
  STATUS_LABEL,
  type Listing,
  type ListingStatus,
} from "@/data/inspectorListings";

const formatDate = (iso: string) => {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const formatVnd = (n: number) =>
  `${new Intl.NumberFormat("vi-VN").format(n)} đ`;

const chipVariant = (s: ListingStatus) => {
  switch (s) {
    case "PENDING":
      return styles.warn;
    case "REVIEWING":
    case "NEED_INFO":
      return styles.info;
    case "DISPUTE":
      return styles.danger;
    case "FLAGGED":
      return styles.neutral;
    case "DONE":
      return styles.success;
  }
};

const historyTagVariant = (
  v: "neutral" | "warning" | "info" | "danger" | "success",
) => {
  if (v === "warning") return styles.warn;
  if (v === "info") return styles.info;
  if (v === "danger") return styles.danger;
  if (v === "success") return styles.success;
  return styles.neutral;
};

export default function ReviewDetailClient({ listing }: { listing: Listing }) {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1600);
  };

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>
            Chi tiết tin đăng: <span>#{listing.id}</span>
          </h2>

          <div className={styles.meta}>
            <span className={`${styles.chip} ${chipVariant(listing.status)}`}>
              <span className={styles.dot} />
              {STATUS_LABEL[listing.status]}
              {listing.status === "REVIEWING" ? " (đã khóa)" : ""}
            </span>

            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Ngày gửi duyệt:</span>
              <strong>{formatDate(listing.submittedAt)}</strong>
            </div>

            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Cửa hàng:</span>
              <strong>{listing.storeName}</strong>
            </div>

            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Sản phẩm:</span>
              <strong>{listing.productName}</strong>
            </div>
          </div>
        </div>

        <div className={styles.rightActions}>
          <button
            className={styles.btnOutline}
            type="button"
            onClick={() => showToast("Đã đánh dấu flag")}
          >
            Đánh dấu flag
          </button>

          <Link className={styles.btnGhost} href="/pending-list">
            ← Quay lại danh sách
          </Link>
        </div>
      </header>

      <div className={styles.layout}>
        <section className={styles.left}>
          <section
            className={styles.gallery}
            aria-label="Khu vực ảnh (placeholder)"
          >
            <div
              className={styles.mainBox}
              aria-label="Ảnh chính (placeholder)"
            />
            <div
              className={styles.thumbGrid}
              aria-label="Ảnh phụ (placeholder)"
            >
              <div className={styles.thumbBox} />
              <div className={styles.thumbBox} />
              <div className={styles.thumbBox} />
              <div className={styles.thumbBox} />
            </div>
          </section>

          <section className={styles.box}>
            <h3 className={styles.boxTitle}>Thông số kỹ thuật</h3>
            <div className={styles.specGrid}>
              <div>
                <span>Thương hiệu:</span> <strong>{listing.specs.brand}</strong>
              </div>
              <div>
                <span>Loại xe:</span> <strong>{listing.specs.type}</strong>
              </div>
              <div>
                <span>Khung:</span> <strong>{listing.specs.frame}</strong>
              </div>
              <div>
                <span>Trọng lượng:</span>{" "}
                <strong>{listing.specs.weight}</strong>
              </div>
            </div>
          </section>

          <section className={styles.box}>
            <h3 className={styles.boxTitle}>Lịch sử xử lý</h3>
            <ul className={styles.history}>
              {listing.history.map((h, idx) => (
                <li key={`${h.at}-${idx}`}>
                  <div className={styles.historyRow}>
                    <span className={styles.hTime}>{h.at}</span>
                    <span
                      className={`${styles.tag} ${historyTagVariant(h.variant)}`}
                    >
                      {h.tag}
                    </span>
                    <div>{h.desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </section>

        <aside className={styles.card}>
          <div className={styles.price}>{formatVnd(listing.priceVnd)}</div>

          <div className={styles.seller}>
            <div className={styles.avatar} />
            <div>
              <div className={styles.sellerName}>{listing.sellerName}</div>
              <div
                style={{ color: "var(--muted)", fontWeight: 800, fontSize: 13 }}
              >
                {listing.productName}
              </div>
            </div>
          </div>

          <div className={styles.note}>
            <div className={styles.noteTitle}>Ghi chú đánh giá (nội bộ)</div>
            <textarea
              className={styles.textarea}
              placeholder="VD: xe đúng mô tả..."
            />
          </div>

          <button
            className={`${styles.actionBtn} ${styles.needInfo}`}
            type="button"
            onClick={() => showToast("Đã gửi yêu cầu bổ sung (demo)")}
          >
            YÊU CẦU BỔ SUNG
          </button>

          <button
            className={`${styles.actionBtn} ${styles.approve}`}
            type="button"
            onClick={() => showToast("Đã duyệt tin (demo)")}
          >
            DUYỆT TIN
          </button>

          <button
            className={`${styles.actionBtn} ${styles.reject}`}
            type="button"
            onClick={() => showToast("Đã từ chối (demo)")}
          >
            TỪ CHỐI
          </button>
        </aside>
      </div>

      <div
        className={`${styles.toast} ${toast ? styles.toastShow : ""}`}
        aria-live="polite"
      >
        {toast ?? ""}
      </div>
    </div>
  );
}
