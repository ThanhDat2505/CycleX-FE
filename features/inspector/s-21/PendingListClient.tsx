"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "./pending-list.module.css";
import { listings, STATUS_LABEL, type ListingStatus } from "@/data/inspectorListings";

const statusClass = (s: ListingStatus) => {
  switch (s) {
    case "PENDING":
      return styles.isPending;
    case "REVIEWING":
      return styles.isReviewing;
    case "NEED_INFO":
      return styles.isNeedInfo;
    case "DISPUTE":
      return styles.isDispute;
    case "FLAGGED":
      return styles.isFlagged;
    case "DONE":
      return styles.isDone;
  }
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

export default function PendingListClient() {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"new" | "old">("new");

  const rows = useMemo(() => {
    const keyword = q.trim().toLowerCase();

    const filtered = listings.filter((x) => {
      if (!keyword) return true;
      return (
        x.productName.toLowerCase().includes(keyword) ||
        x.storeName.toLowerCase().includes(keyword) ||
        x.id.toLowerCase().includes(keyword)
      );
    });

    const sorted = [...filtered].sort((a, b) => {
      const at = new Date(a.submittedAt).getTime();
      const bt = new Date(b.submittedAt).getTime();
      return sort === "new" ? bt - at : at - bt;
    });

    return sorted;
  }, [q, sort]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Listings to Review</h1>
      </header>

      <div className={styles.toolbar}>
        <div className={`${styles.field} ${styles.fieldGrow}`}>
          <label className={styles.label}>Tìm kiếm</label>
          <input
            className={styles.input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm theo tên sản phẩm, cửa hàng, #ID..."
          />
        </div>

        <div className={`${styles.field} ${styles.fieldSort}`}>
          <label className={styles.label}>Sắp xếp</label>
          <select
            className={styles.select}
            value={sort}
            onChange={(e) => setSort(e.target.value as "new" | "old")}
          >
            <option value="new">Mới nhất</option>
            <option value="old">Cũ nhất</option>
          </select>
        </div>
      </div>

      <div className={styles.chips}>
        <div className={styles.chip}>
          <span className="material-symbols-outlined" aria-hidden="true">
            grid_view
          </span>
          Tất cả
        </div>
      </div>

      <section className={styles.tableCard}>
        <table className={styles.table}>
          <colgroup>
            <col style={{ width: "52%" }} />
            <col style={{ width: "24%" }} />
            <col style={{ width: "160px" }} />
            <col style={{ width: "200px" }} />
          </colgroup>

          <thead className={styles.thead}>
            <tr>
              <th>Tên sản phẩm</th>
              <th>Cửa hàng</th>
              <th>Ngày gửi duyệt</th>
              <th style={{ textAlign: "right" }}>Hành động</th>
            </tr>
          </thead>

          <tbody className={styles.tbody}>
            {rows.map((x) => (
              <tr key={x.id}>
                <td>
                  <div className={styles.productCell}>
                    <div className={styles.productName}>{x.productName}</div>

                    <div className={`${styles.statusBadge} ${statusClass(x.status)}`}>
                      {STATUS_LABEL[x.status]}
                    </div>

                    <div className={styles.productId}>#{x.id}</div>
                  </div>
                </td>

                <td>
                  <div className={styles.storeName}>{x.storeName}</div>
                </td>

                <td>
                  <div className={styles.dateText}>{formatDate(x.submittedAt)}</div>
                </td>

                <td className={styles.actionCell}>
                  <Link
                    className={styles.viewBtn}
                    href={`/review-detail?id=${encodeURIComponent(x.id)}`}
                  >
                    <span className="material-symbols-outlined" aria-hidden="true">
                      north_east
                    </span>
                    Xem chi tiết
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
