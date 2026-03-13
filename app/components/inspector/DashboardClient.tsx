/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import InspectorHeroLayout from "@/app/components/inspector/InspectorHeroLayout";
import { inspectorService } from "@/app/services/inspectorService";

type FilterKey =
  | "all"
  | "pending"
  | "needMoreInfo"
  | "dispute"
  | "flagged"
  | "approved";

interface ListingRow {
  id: string;
  name: string;
  shop: string;
  submittedAt: string;
  dateISO: string;
  rawStatus: string; // original status from API
  displayStatus: string; // Vietnamese label
}

const STATUS_BADGE: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  PENDING: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Chờ duyệt" },
  REVIEWING: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    label: "Đang xem xét",
  },
  NEED_MORE_INFO: {
    bg: "bg-orange-100",
    text: "text-orange-800",
    label: "Cần bổ sung",
  },
  DISPUTE: { bg: "bg-red-100", text: "text-red-800", label: "Tranh chấp" },
  FLAGGED: { bg: "bg-gray-200", text: "text-gray-800", label: "Bị flag" },
  APPROVED: { bg: "bg-green-100", text: "text-green-800", label: "Đã duyệt" },
  DONE: { bg: "bg-emerald-100", text: "text-emerald-800", label: "Hoàn thành" },
  UNKNOWN: { bg: "bg-gray-100", text: "text-gray-600", label: "Không rõ" },
};

function getBadge(status: string) {
  return STATUS_BADGE[status] ?? STATUS_BADGE.UNKNOWN;
}

export default function DashboardClient() {
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  useEffect(() => {
    let mounted = true;
    const REFRESH_INTERVAL_MS = 30000;

    const load = async (showLoading = false) => {
      try {
        if (showLoading) setLoading(true);
        setError(null);

        const rawListings = await inspectorService.getListingsForReview({
          status: "ALL",
          sort: "newest",
        });

        if (!mounted) return;

        setListings(
          rawListings.map((raw: any) => {
            const status = String(
              raw.status ?? raw.listingStatus ?? raw.reviewStatus ?? "UNKNOWN",
            )
              .toUpperCase()
              .trim();

            // Map to our known statuses
            let rawStatus = "UNKNOWN";
            if (["PENDING", "PENDING_APPROVAL"].includes(status))
              rawStatus = "PENDING";
            else if (["REVIEWING", "IN_REVIEW"].includes(status))
              rawStatus = "REVIEWING";
            else if (
              ["NEED_MORE_INFO", "NEED_INFO", "MISSING_INFO"].includes(status)
            )
              rawStatus = "NEED_MORE_INFO";
            else if (["DISPUTE", "UNDER_REVIEW"].includes(status))
              rawStatus = "DISPUTE";
            else if (["FLAGGED", "REPORTED", "REPORT"].includes(status))
              rawStatus = "FLAGGED";
            else if (["APPROVED", "PASSED"].includes(status))
              rawStatus = "APPROVED";
            else if (["DONE", "REJECTED"].includes(status)) rawStatus = "DONE";

            return {
              id: String(raw.id ?? raw.listingId ?? raw.bikeListingId ?? ""),
              name: String(
                raw.productName ?? raw.name ?? raw.title ?? raw.bikeName ?? "—",
              ),
              shop: String(
                raw.storeName ??
                  raw.shopName ??
                  raw.shop ??
                  raw.sellerName ??
                  "—",
              ),
              submittedAt: raw.submittedAt ?? raw.createdAt ?? "",
              dateISO: raw.submittedAt ?? raw.createdAt ?? "",
              rawStatus,
              displayStatus: getBadge(rawStatus).label,
            };
          }),
        );
      } catch (err: any) {
        if (mounted) {
          setError(err?.message || "Không tải được dữ liệu dashboard");
          if (showLoading) setListings([]);
        }
      } finally {
        if (mounted && showLoading) setLoading(false);
      }
    };

    load(true);
    const timer = window.setInterval(() => load(false), REFRESH_INTERVAL_MS);
    return () => {
      mounted = false;
      window.clearInterval(timer);
    };
  }, []);

  // Compute counts from actual data
  const counts = useMemo(() => {
    const pendingAll = listings.length;
    const needMoreInfo = listings.filter(
      (l) => l.rawStatus === "DISPUTE" || l.rawStatus === "NEED_MORE_INFO",
    ).length;
    const dispute = listings.filter((l) => l.rawStatus === "DISPUTE").length;
    const flagged = listings.filter((l) => l.rawStatus === "FLAGGED").length;
    const approved = listings.filter((l) => l.rawStatus === "APPROVED").length;
    return { pendingAll, needMoreInfo, dispute, flagged, approved };
  }, [listings]);

  // Filter listings for the table below
  const filteredListings = useMemo(() => {
    switch (activeFilter) {
      case "pending":
        return listings;
      case "needMoreInfo":
        return listings.filter(
          (l) => l.rawStatus === "DISPUTE" || l.rawStatus === "NEED_MORE_INFO",
        );
      case "dispute":
        return listings.filter((l) => l.rawStatus === "DISPUTE");
      case "flagged":
        return listings.filter((l) => l.rawStatus === "FLAGGED");
      case "approved":
        return listings.filter((l) => l.rawStatus === "APPROVED");
      default:
        return listings;
    }
  }, [listings, activeFilter]);

  const STAT_CARDS: {
    key: FilterKey;
    label: string;
    count: number;
    icon: string;
    iconWrapClass: string;
    iconClass: string;
  }[] = [
    {
      key: "pending",
      label: "Tin chờ duyệt",
      count: counts.pendingAll,
      icon: "schedule",
      iconWrapClass: "bg-[#fdf6d4]",
      iconClass: "text-[#e7b53c]",
    },
    {
      key: "needMoreInfo",
      label: "Cần bổ sung",
      count: counts.needMoreInfo,
      icon: "assignment",
      iconWrapClass: "bg-[#eaf2fb]",
      iconClass: "text-[#4a90e2]",
    },
    {
      key: "dispute",
      label: "Tranh chấp",
      count: counts.dispute,
      icon: "warning",
      iconWrapClass: "bg-[#faedf1]",
      iconClass: "text-[#e15845]",
    },
    {
      key: "flagged",
      label: "Bị flag",
      count: counts.flagged,
      icon: "outlined_flag",
      iconWrapClass: "bg-[#eef0f3]",
      iconClass: "text-[#111827]",
    },
    {
      key: "approved",
      label: "Tin đã duyệt",
      count: counts.approved,
      icon: "check_circle",
      iconWrapClass: "bg-[#e8f5e9]",
      iconClass: "text-[#388e3c]",
    },
  ];

  const filterLabel: Record<FilterKey, string> = {
    all: "Tất cả tin",
    pending: "Tin chờ duyệt",
    needMoreInfo: "Cần bổ sung",
    dispute: "Tranh chấp",
    flagged: "Bị flag",
    approved: "Tin đã duyệt",
  };

  return (
    <InspectorHeroLayout
      title="Trang"
      highlightTitle="Tổng Quan"
      description={`Chào mừng trở lại! Bạn có ${counts.pendingAll} tin cần duyệt hôm nay.`}
    >
      <div className="mb-6 grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-4 items-start">
        <div className="pt-1">
          <Link
            href="/inspector/pending-list"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#FF8A00] text-white rounded-lg font-bold hover:bg-[#FF7A00] hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <span className="material-symbols-outlined">
              format_list_bulleted
            </span>
            Vào danh sách chờ duyệt
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {loading && (
            <div className="col-span-full text-center text-gray-400 py-4 text-sm">
              Đang tải...
            </div>
          )}
          {!loading &&
            STAT_CARDS.map((card) => {
              const isActive = activeFilter === card.key;
              return (
                <button
                  key={card.key}
                  type="button"
                  onClick={() => setActiveFilter(isActive ? "all" : card.key)}
                  className={`group bg-white rounded-xl border shadow-sm p-3 flex items-center gap-3 transition-all text-left hover:border-[#FF8A00] hover:shadow-md cursor-pointer ${isActive ? "border-[#FF8A00] ring-2 ring-[#FF8A00]/30 shadow-md" : "border-gray-200"}`}
                >
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${card.iconWrapClass}`}
                  >
                    <span
                      className={`material-symbols-outlined text-[20px] ${card.iconClass}`}
                    >
                      {card.icon}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div
                      className={`text-xl font-extrabold leading-none transition-colors ${isActive ? "text-[#FF8A00]" : "text-[#0f172a] group-hover:text-[#FF8A00]"}`}
                    >
                      {card.count}
                    </div>
                    <div className="text-[11px] font-semibold text-[#5b6879] leading-tight mt-0.5 truncate">
                      {card.label}
                    </div>
                  </div>
                </button>
              );
            })}
        </div>
      </div>

      {!loading && error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Filtered listing table */}
      {!loading && !error && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-[#FF8A00] rounded-full"></span>
              {filterLabel[activeFilter]}
              <span className="text-sm font-normal text-gray-500">
                ({filteredListings.length})
              </span>
            </h2>
            {activeFilter !== "all" && (
              <button
                type="button"
                onClick={() => setActiveFilter("all")}
                className="text-xs text-[#FF8A00] hover:underline font-medium"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>

          {filteredListings.length === 0 ? (
            <div className="text-center text-gray-400 py-10 text-sm">
              Không có tin nào.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-5 py-3">ID</th>
                    <th className="px-5 py-3">Tên sản phẩm</th>
                    <th className="px-5 py-3">Cửa hàng</th>
                    <th className="px-5 py-3">Ngày gửi</th>
                    <th className="px-5 py-3">Trạng thái</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredListings.map((row) => {
                    const badge = getBadge(row.rawStatus);
                    return (
                      <tr
                        key={row.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-5 py-3 font-mono text-xs text-gray-500">
                          {row.id}
                        </td>
                        <td className="px-5 py-3 font-medium text-gray-900 max-w-[200px] truncate">
                          {row.name}
                        </td>
                        <td className="px-5 py-3 text-gray-600">{row.shop}</td>
                        <td className="px-5 py-3 text-gray-500">
                          {row.submittedAt || "—"}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}
                          >
                            {badge.label}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <Link
                            href={`/inspector/review-detail/${row.id}`}
                            className="text-[#FF8A00] hover:underline text-xs font-medium"
                          >
                            Xem chi tiết
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </InspectorHeroLayout>
  );
}
