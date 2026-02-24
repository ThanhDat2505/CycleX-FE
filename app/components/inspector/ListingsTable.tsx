"use client";

import type { Listing } from "@/app/types/types";
import { useRouter } from "next/navigation";

export default function ListingsTable({
  rows,
  filter,
}: {
  rows: Listing[];
  filter: "ALL" | Listing["status"];
}) {
  const router = useRouter();

  const badgeClass = (status: Listing["status"]) => {
    switch (status) {
      case "PENDING":
        return "badge badge-warning";
      case "NEED_MORE_INFO":
        return "badge badge-info";
      case "DISPUTE":
        return "badge badge-danger";
      case "FLAGGED":
        return "badge badge-flag";
      case "DONE":
        return "badge badge-success";
      default:
        return "badge";
    }
  };

  const badgeText = (status: Listing["status"]) => {
    switch (status) {
      case "PENDING":
        return "Đang chờ duyệt";
      case "NEED_MORE_INFO":
        return "Cần bổ sung";
      case "DISPUTE":
        return "Cần xem xét";
      case "FLAGGED":
        return "Bị flag";
      case "DONE":
        return "Đã duyệt";
      default:
        return status;
    }
  };

  // Lọc dữ liệu trước khi hiển thị để tối ưu hiệu năng
  const filteredRows = rows.filter(
    (r) => filter === "ALL" || r.status === filter,
  );

  return (
    <div className="table-wrapper">
      <table className="styled-table">
        <thead>
          <tr>
            <th style={{ width: 120 }}>Hình ảnh</th>
            <th>Tên xe</th>
            <th>Cửa hàng</th>
            <th style={{ width: 160 }}>Ngày gửi duyệt</th>
            <th style={{ width: 170 }}>Thời gian chờ duyệt</th>
            <th style={{ width: 160 }}>Trạng thái</th>
          </tr>
        </thead>

        <tbody>
          {filteredRows.map((r) => (
            <tr
              key={r.id}
              className="row-clickable"
              onClick={() => router.push(`/inspector/review-detail?id=${r.id}`)}
              style={{ cursor: "pointer" }}
            >
              <td>
                <div className="img-placeholder">80 x 55</div>
              </td>
              <td>
                <div className="product-name">{r.name}</div>
              </td>
              <td>{r.shop}</td>
              <td>{r.submittedAt}</td>
              <td>
                <span className="meta">{r.waitingTime}</span>
              </td>
              <td>
                <span className={badgeClass(r.status)}>
                  {badgeText(r.status)}
                </span>
              </td>
            </tr>
          ))}

          {filteredRows.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", padding: "20px" }}>
                Không tìm thấy tin đăng nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
