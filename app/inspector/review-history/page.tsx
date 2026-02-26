"use client";

import { useState } from "react";
import { listings } from "@/app/mocks/inspector/inspectorListings";
import InspectorNav from "@/app/components/inspector/InspectorNav";
import "@/app/components/inspector/inspector.css";

export default function ReviewHistoryPage() {
  const [filterId, setFilterId] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const filtered = listings.filter((item) => {
    if (item.status !== "DONE") return false;

    if (
      filterId &&
      !item.id.toLowerCase().includes(filterId.toLowerCase()) &&
      !item.productName.toLowerCase().includes(filterId.toLowerCase())
    ) {
      return false;
    }

    if (filterDate && !item.submittedAt.startsWith(filterDate)) return false;

    return true;
  });

  const renderBadge = (status: string) => {
    switch (status) {
      case "DONE":
        return <span className="badge badgeApproved">Đã xử lý</span>;
      case "NEED_INFO":
        return <span className="badge badgeInfo">Cần bổ sung</span>;
      case "DISPUTE":
        return <span className="badge badgeDanger">Tranh chấp</span>;
      case "FLAGGED":
        return <span className="badge badgeFlag">Bị flag</span>;
      case "PENDING":
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
        return <span className="badge badgeInfo">Đang xem</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <InspectorNav />
      <div className="container mx-auto px-4 py-8">
        <h1 className="page-title">Review History</h1>

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
              const lastHistory =
                row.history && row.history.length > 0
                  ? row.history[row.history.length - 1].desc
                  : "";

              return (
                <div key={row.id} className="tableRow">
                  <div className="cell font-bold">{row.id}</div>
                  <div className="cell name">{row.productName}</div>
                  <div className="cell text-muted">{row.submittedAt}</div>
                  <div className="cell center">{renderBadge(row.status)}</div>
                  <div className="cell">{row.sellerName}</div>
                  <div className="cell noteCell">{lastHistory}</div>

                  <div className="cell right">
                    <button
                      type="button"
                      className="actionLink"
                      onClick={() => console.log("Redirect logic for:", row.id)}
                    >
                      Xem
                    </button>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div style={{ padding: 30, textAlign: "center", color: "#999" }}>
                Không tìm thấy dữ liệu đã xử lý nào.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
