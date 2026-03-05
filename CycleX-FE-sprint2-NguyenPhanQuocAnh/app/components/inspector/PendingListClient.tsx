"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  listings,
  STATUS_LABEL,
  type ListingStatus,
} from "@/app/mocks/inspector/inspectorListings";

const statusClass = (s: ListingStatus) => {
  switch (s) {
    case "PENDING":
      return "isPending";
    case "REVIEWING":
      return "isReviewing";
    case "NEED_INFO":
      return "isNeedInfo";
    case "DISPUTE":
      return "isDispute";
    case "FLAGGED":
      return "isFlagged";
    case "DONE":
      return "isDone";
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

    return [...filtered].sort((a, b) => {
      const at = new Date(a.submittedAt).getTime();
      const bt = new Date(b.submittedAt).getTime();
      return sort === "new" ? bt - at : at - bt;
    });
  }, [q, sort]);

  return (
    <div className="page">
      <header className="pageHeader">
        <h1 className="page-title">Pending Approved</h1>
      </header>

      <div className="toolbar">
        <div className="field fieldGrow">
          <label className="label">Tìm kiếm</label>
          <input
            className="input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm theo tên sản phẩm, cửa hàng, #ID..."
          />
        </div>

        <div className="field fieldSort">
          <label className="label">Sắp xếp</label>
          <select
            className="select"
            value={sort}
            onChange={(e) => setSort(e.target.value as "new" | "old")}
          >
            <option value="new">Mới nhất</option>
            <option value="old">Cũ nhất</option>
          </select>
        </div>
      </div>

      <section className="tableCard">
        <table className="table">
          <colgroup>
            <col style={{ width: "52%" }} />
            <col style={{ width: "24%" }} />
            <col style={{ width: "160px" }} />
            <col style={{ width: "200px" }} />
          </colgroup>

          <thead className="thead">
            <tr>
              <th>Tên sản phẩm</th>
              <th>Cửa hàng</th>
              <th>Ngày gửi duyệt</th>
              <th style={{ textAlign: "right" }}>Hành động</th>
            </tr>
          </thead>

          <tbody className="tbody">
            {rows.map((x) => (
              <tr key={x.id}>
                <td>
                  <div className="productCell">
                    <div className="productName">{x.productName}</div>

                    <div className={`statusBadge ${statusClass(x.status)}`}>
                      {STATUS_LABEL[x.status]}
                    </div>

                    <div className="productId">#{x.id}</div>
                  </div>
                </td>

                <td>
                  <div className="storeName">{x.storeName}</div>
                </td>

                <td>
                  <div className="dateText">{formatDate(x.submittedAt)}</div>
                </td>

                <td className="actionCell">
                  <Link
                    className="viewBtn"
                    href={`/inspector/review-detail?id=${encodeURIComponent(x.id)}`}
                  >
                    <span
                      className="material-symbols-outlined"
                      aria-hidden="true"
                    >
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
