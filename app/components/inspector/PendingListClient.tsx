/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { inspectorService } from "@/app/services/inspectorService";
import type { PendingStatus } from "@/app/types/pendingTypes";

const STATUS_LABEL: Record<PendingStatus | "DONE", string> = {
  PENDING: "Đang chờ duyệt",
  REVIEWING: "Đang review",
  NEED_MORE_INFO: "Cần bổ sung",
  DISPUTE: "Tranh chấp",
  FLAGGED: "Bị flag",
  DONE: "Đã duyệt",
};

const statusClass = (s: PendingStatus | "DONE") => {
  switch (s) {
    case "PENDING":
      return "isPending";
    case "REVIEWING":
      return "isReviewing";
    case "NEED_MORE_INFO":
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
  const [listings, setListings] = useState<
    Array<{
      id: string;
      productName: string;
      storeName: string;
      submittedAt: string;
      dateISO: string;
      status: PendingStatus | "DONE";
    }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"new" | "old">("new");

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const rows = await inspectorService.getPendingListings();
        if (!mounted) return;

        setListings(
          rows.map((x) => ({
            id: x.id,
            productName: x.name,
            storeName: x.shop,
            submittedAt: x.submittedAt,
            dateISO: x.dateISO,
            status: x.status,
          })),
        );
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.message || "Không tải được danh sách chờ duyệt");
        setListings([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

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
      const at = new Date(a.dateISO).getTime();
      const bt = new Date(b.dateISO).getTime();
      return sort === "new" ? bt - at : at - bt;
    });
  }, [listings, q, sort]);

  return (
    <div className="page">
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
        {loading && <div style={{ padding: 20 }}>Đang tải dữ liệu...</div>}
        {!loading && error && (
          <div style={{ padding: 20, color: "#b91c1c" }}>{error}</div>
        )}
        {!loading && !error && (
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
                    <div className="dateText">{formatDate(x.dateISO)}</div>
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

              {rows.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: 20, textAlign: "center" }}>
                    Không có listing nào trong danh sách chờ duyệt.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
