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

  const getBadgeStyles = (status: Listing["status"]) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "NEED_MORE_INFO":
        return "bg-blue-100 text-blue-800";
      case "DISPUTE":
        return "bg-red-100 text-red-800";
      case "FLAGGED":
        return "bg-gray-100 text-gray-800";
      case "DONE":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getBadgeText = (status: Listing["status"]) => {
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

  const filteredRows = rows.filter(
    (r) => filter === "ALL" || r.status === filter,
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-gray-500 font-medium border-b border-gray-200 bg-gray-50">
          <tr>
            <th className="px-6 py-4 font-semibold">Hình ảnh</th>
            <th className="px-6 py-4 font-semibold">Tên xe</th>
            <th className="px-6 py-4 font-semibold">Cửa hàng</th>
            <th className="px-6 py-4 font-semibold">Ngày gửi duyệt</th>
            <th className="px-6 py-4 font-semibold">Thời gian chờ</th>
            <th className="px-6 py-4 font-semibold">Trạng thái</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {filteredRows.map((r) => (
            <tr
              key={r.id}
              className="hover:bg-gray-50 transition-colors cursor-pointer group"
              onClick={() => router.push(`/inspector/review-detail?id=${r.id}`)}
            >
              <td className="px-6 py-4">
                <div className="w-20 h-14 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-400 font-medium overflow-hidden shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">
                    image
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 font-medium text-gray-900">
                <div className="group-hover:text-blue-600 transition-colors text-base font-semibold">
                  {r.name}
                </div>
                <div className="text-xs text-gray-400 mt-1">ID: {r.id}</div>
              </td>
              <td className="px-6 py-4 text-gray-600">{r.shop}</td>
              <td className="px-6 py-4 text-gray-600">{r.submittedAt}</td>
              <td className="px-6 py-4 text-gray-600 font-medium">
                {r.waitingTime}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getBadgeStyles(
                    r.status,
                  )}`}
                >
                  {getBadgeText(r.status)}
                </span>
              </td>
            </tr>
          ))}

          {filteredRows.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                <div className="flex flex-col items-center justify-center">
                  <span className="material-symbols-outlined text-4xl mb-2 text-gray-300">
                    inbox
                  </span>
                  <p>Không tìm thấy tin đăng nào.</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
