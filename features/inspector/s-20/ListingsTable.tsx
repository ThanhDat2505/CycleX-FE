import type { Listing } from "./types";

export default function ListingsTable({
  rows,
  filter,
}: {
  rows: Listing[];
  filter: "ALL" | Listing["status"];
}) {
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

        <tbody id="listingTbody">
          {rows.map((r) => {
            const show = filter === "ALL" ? true : r.status === filter;

            return (
              <tr
                key={r.id}
                className="row-clickable"
                data-status={r.status}
                data-href="#"
                style={{ display: show ? undefined : "none" }}
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
