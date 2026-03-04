"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { mockPendingRows } from "@/app/mocks/inspector/mockPending";
// Đảm bảo đường dẫn types này chính xác với cấu trúc bạn đã gộp
import type { PendingStatus } from "@/app/types/pendingTypes";

type FilterKey = "ALL" | "DISPUTE" | "NEED_MORE_INFO";

type RowVM = {
  id: string;
  req: string;
  name: string;
  shop: string;
  submittedAt: string;
  status: PendingStatus;
};

function makeReq(id: string) {
  const digits = id.replace(/\D/g, "");
  const n = digits ? Number(digits) % 100000 : 0;
  return `REQ-${20000 + n}`;
}

// Chuyển sang dùng Class để đồng bộ với inspector.css
function StatusPill({ status }: { status: PendingStatus }) {
  const isNeed = status === "NEED_MORE_INFO";
  const label = isNeed ? "Cần bổ sung" : "Cần xem xét";
  const className = isNeed ? "badge badge-info" : "badge badge-danger";

  return <span className={className}>{label}</span>;
}

export default function ReviewRequiredList() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<FilterKey>("ALL");

  const rows = useMemo<RowVM[]>(() => {
    return mockPendingRows
      .filter((x) => x.status === "DISPUTE" || x.status === "NEED_MORE_INFO")
      .map((x) => ({
        id: x.id,
        req: makeReq(x.id),
        name: x.name,
        shop: x.shop,
        submittedAt: x.submittedAt,
        status: x.status,
      }));
  }, []);

  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();

    return rows.filter((x) => {
      if (filter !== "ALL" && x.status !== filter) return false;
      if (!keyword) return true;
      const hay =
        `${x.id} ${x.req} ${x.name} ${x.shop} ${x.submittedAt}`.toLowerCase();
      return hay.includes(keyword);
    });
  }, [rows, q, filter]);

  return (
    <div className="page">
      <header className="pageHeader">
        <h1 className="page-title">Listings to review</h1>
      </header>

      <div className="toolbar">
        <div className="field fieldGrow">
          <label className="label">Tìm kiếm</label>
          <input
            className="input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Nhập mã tin / cửa hàng / tên sản phẩm..."
          />
        </div>

        <div className="field fieldSort">
          <label className="label">{`Số lượng: ${filtered.length}`}</label>
          <select
            className="select"
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterKey)}
          >
            <option value="ALL">Tất cả</option>
            <option value="DISPUTE">Cần xem xét</option>
            <option value="NEED_MORE_INFO">Cần bổ sung</option>
          </select>
        </div>
      </div>

      <section className="tableCard">
        <table className="table">
          <thead className="thead">
            <tr>
              <th>Tên sản phẩm</th>
              <th>Cửa hàng</th>
              <th>Ngày gửi duyệt</th>
              <th>Trạng thái</th>
              <th style={{ textAlign: "right" }}>Hành động</th>
            </tr>
          </thead>

          <tbody className="tbody">
            {filtered.map((row) => {
              const href = `/inspector/inspector-request-detail?req=${encodeURIComponent(row.req)}&id=${encodeURIComponent(row.id)}`;
              return (
                <tr key={`${row.req}-${row.id}`}>
                  <td>
                    <div className="productCell">
                      <div className="productName">{row.name}</div>
                      <div className="productId">#{row.id}</div>
                    </div>
                  </td>
                  <td>
                    <div className="storeName">{row.shop}</div>
                  </td>
                  <td>
                    <div className="dateText">{row.submittedAt}</div>
                  </td>
                  <td>
                    <StatusPill status={row.status} />
                  </td>
                  <td className="actionCell">
                    <Link className="viewBtn" href={href}>
                      <span className="material-symbols-outlined">
                        north_east
                      </span>
                      Xem chi tiết
                    </Link>
                  </td>
                </tr>
              );
            })}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: 20, textAlign: "center" }}>
                  Không có tin cần xem xét/bổ sung.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
