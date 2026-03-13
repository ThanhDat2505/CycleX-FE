/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import InspectorHeroLayout from "@/app/components/inspector/InspectorHeroLayout";
import "@/app/components/inspector/inspector.css";
import {
  inspectorService,
  type ReviewHistoryRow,
} from "@/app/services/inspectorService";

export default function ReviewHistoryPage() {
  const [rows, setRows] = useState<ReviewHistoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterId, setFilterId] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    let mounted = true;
    const today = new Date();
    const yearStart = `${today.getFullYear()}-01-01`;
    const yearEnd = `${today.getFullYear()}-12-31`;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await inspectorService.getReviewHistory(
          yearStart,
          yearEnd,
        );
        if (mounted) setRows(data);
      } catch (err: any) {
        if (mounted) {
          setError(err?.message || "Không tải được lịch sử review");
          setRows([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(
    () =>
      rows.filter((item) => {
        if (
          filterId &&
          !item.id.toLowerCase().includes(filterId.toLowerCase()) &&
          !item.productName.toLowerCase().includes(filterId.toLowerCase())
        ) {
          return false;
        }

        if (filterDate) {
          const [dd, mm, yyyy] = item.submittedAt.split("/");
          const normalized =
            dd && mm && yyyy ? `${yyyy}-${mm}-${dd}` : item.submittedAt;
          if (normalized !== filterDate) return false;
        }

        return true;
      }),
    [rows, filterDate, filterId],
  );

  const renderBadge = (status: string) => {
    const normalizedStatus = String(status ?? "")
      .trim()
      .toUpperCase();

    switch (normalizedStatus) {
      case "APPROVED":
        return <span className="badge badgeApproved">Đã duyệt</span>;
      case "DONE":
        return <span className="badge badgeApproved">Hoàn tất</span>;
      case "REJECTED":
        return <span className="badge badgeDanger">Đã từ chối</span>;
      case "NEED_INFO":
      case "NEED_MORE_INFO":
        return <span className="badge badgeInfo">Cần bổ sung</span>;
      case "DISPUTE":
      case "UNDER_REVIEW":
        return <span className="badge badgeDanger">Tranh chấp</span>;
      case "FLAGGED":
      case "REPORT":
      case "REPORTED":
        return <span className="badge badgeFlag">Bị flag</span>;
      case "PENDING":
      case "PENDING_APPROVAL":
        return (
          <span
            className="badge"
            style={{
              background: "#fff7cc",
              color: "#f4b400",
              borderColor: "#fff7cc",
            }}
          >
            Chờ duyệt
          </span>
        );
      case "REVIEWING":
      case "IN_REVIEW":
        return <span className="badge badgeInfo">Đang xem</span>;
      default:
        return <span className="badge">{normalizedStatus || status}</span>;
    }
  };

  return (
    <InspectorHeroLayout
      title="Lịch Sử"
      highlightTitle="Duyệt"
      description="Xem lại toàn bộ lịch sử kiểm định và phê duyệt tin đăng."
    >
      <div className="filterCard">
        <div className="filterRow">
          <div className="filterField filterGrow">
            <label className="filterLabel">Tìm kiếm (ID / Tên)</label>
            <input
              type="text"
              className="filterInput"
              placeholder="Nhập mã hoặc tên xe..."
              value={filterId}
              onChange={(e) => setFilterId(e.target.value)}
            />
          </div>

          <div className="filterField">
            <label className="filterLabel">Ngày gửi</label>
            <input
              type="date"
              className="filterInput"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
        </div>

        <div className="filterActions">
          <button
            className="btn btnGhost"
            type="button"
            onClick={() => {
              setFilterId("");
              setFilterDate("");
            }}
          >
            Xóa bộ lọc
          </button>
        </div>
      </div>

      <div className="dataTable">
        {loading && <div style={{ padding: 20 }}>Đang tải dữ liệu...</div>}
        {!loading && error && (
          <div style={{ padding: 20, color: "#b91c1c" }}>{error}</div>
        )}
        {!loading && !error && (
          <div className="historyTable">
            <div className="tableHeader">
              <span>Mã tin</span>
              <span>Tên sản phẩm</span>
              <span>Thời gian gửi</span>
              <span className="center">Trạng thái</span>
              <span>Người bán</span>
              <span>Ghi chú</span>
              <span className="right">Hành động</span>
            </div>

            {filtered.map((row) => {
              return (
                <div key={row.id} className="tableRow">
                  <div className="cell font-bold">{row.id}</div>
                  <div className="cell name">{row.productName}</div>
                  <div className="cell text-muted">{row.submittedAt}</div>
                  <div className="cell center">{renderBadge(row.status)}</div>
                  <div className="cell">{row.sellerName}</div>
                  <div className="cell noteCell">{row.note}</div>

                  <div className="cell right">
                    <Link
                      href={`/inspector/review-detail?id=${encodeURIComponent(row.id)}`}
                      className="actionLink"
                    >
                      Xem
                    </Link>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div style={{ padding: 30, textAlign: "center", color: "#999" }}>
                Không tìm thấy dữ liệu đã duyệt nào.
              </div>
            )}
          </div>
        )}
      </div>
    </InspectorHeroLayout>
  );
}
