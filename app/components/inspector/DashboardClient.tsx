/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  rawStatus: string;
  displayStatus: string;
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

function formatDateToVN(isoString: string) {
  if (!isoString) return "—";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}



function SkeletonTableRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-5 py-3"><div className="h-4 w-12 bg-gray-200 rounded" /></td>
      <td className="px-5 py-3"><div className="h-4 w-28 bg-gray-200 rounded" /></td>
      <td className="px-5 py-3 hidden md:table-cell"><div className="h-4 w-20 bg-gray-200 rounded" /></td>
      <td className="px-5 py-3 hidden lg:table-cell"><div className="h-4 w-16 bg-gray-100 rounded" /></td>
      <td className="px-5 py-3"><div className="h-5 w-20 bg-gray-200 rounded-full" /></td>
    </tr>
  );
}



function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">

      <svg
        className="w-32 h-32 mb-6 text-gray-300"
        viewBox="0 0 128 128"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="20" y="30" width="88" height="70" rx="8" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="2" />
        <rect x="32" y="46" width="40" height="4" rx="2" fill="#d1d5db" />
        <rect x="32" y="56" width="56" height="4" rx="2" fill="#e5e7eb" />
        <rect x="32" y="66" width="48" height="4" rx="2" fill="#e5e7eb" />
        <rect x="32" y="76" width="30" height="4" rx="2" fill="#e5e7eb" />
        <circle cx="96" cy="88" r="20" fill="#fff7ed" stroke="#FB923C" strokeWidth="2" />
        <path d="M90 88h12M96 82v12" stroke="#FB923C" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <p className="text-gray-500 font-medium text-base mb-1">
        Không có tin nào trong danh mục
      </p>
      <p className="text-gray-400 text-sm">
        &quot;{label}&quot; hiện đang trống. Các tin đăng mới sẽ xuất hiện ở đây.
      </p>
    </div>
  );
}



function ListingCard({
  row,
  onClick,
}: {
  row: ListingRow;
  onClick: () => void;
}) {
  const badge = getBadge(row.rawStatus);
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:border-[#FF8A00]/40 hover:shadow-md transition-all active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="font-medium text-gray-900 text-sm leading-snug line-clamp-2 flex-1">
          {row.name}
        </span>
        <span
          className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${badge.bg} ${badge.text}`}
        >
          {badge.label}
        </span>
      </div>
      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span className="font-mono">#{row.id}</span>
        <span className="text-gray-300">•</span>
        <span>{row.shop}</span>
        <span className="text-gray-300">•</span>
        <span>{row.submittedAt || "—"}</span>
      </div>
    </button>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 animate-pulse">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
        <div className="h-5 w-16 bg-gray-200 rounded-full" />
      </div>
      <div className="flex items-center gap-3">
        <div className="h-3 w-10 bg-gray-100 rounded" />
        <div className="h-3 w-16 bg-gray-100 rounded" />
        <div className="h-3 w-14 bg-gray-100 rounded" />
      </div>
    </div>
  );
}



export default function DashboardClient() {
  const router = useRouter();
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  function getTargetUrl(row: ListingRow): string {
    switch (row.rawStatus) {
      case "PENDING":
        return `/inspector/pending-list`;
      case "REVIEWING":
      case "NEED_MORE_INFO":
      case "FLAGGED":
        return `/inspector/review-required`;
      case "DISPUTE":
        return `/inspector/disputes`;
      case "APPROVED":
      case "DONE":
        return `/inspector/review-history`;
      default:
        return `/inspector/review-detail?id=${encodeURIComponent(row.id)}`;
    }
  }

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
              submittedAt: formatDateToVN(raw.submittedAt ?? raw.createdAt ?? ""),
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


  const counts = useMemo(() => {
    const activeListings = listings.filter((l) => l.rawStatus !== "DONE");
    const pendingAll = activeListings.length;
    const pending = activeListings.filter((l) => l.rawStatus === "PENDING").length;
    const needMoreInfo = activeListings.filter((l) => l.rawStatus === "NEED_MORE_INFO").length;
    const dispute = activeListings.filter((l) => l.rawStatus === "DISPUTE").length;
    const approved = activeListings.filter((l) => l.rawStatus === "APPROVED").length;
    const flagged = activeListings.filter((l) => l.rawStatus === "FLAGGED").length;
    return { pendingAll, pending, needMoreInfo, dispute, flagged, approved, activeListings };
  }, [listings]);


  const filteredListings = useMemo(() => {
    switch (activeFilter) {
      case "pending":
        return counts.activeListings.filter((l) => l.rawStatus === "PENDING");
      case "needMoreInfo":
        return counts.activeListings.filter((l) => l.rawStatus === "NEED_MORE_INFO");
      case "dispute":
        return counts.activeListings.filter((l) => l.rawStatus === "DISPUTE");
      case "flagged":
        return counts.activeListings.filter((l) => l.rawStatus === "FLAGGED");
      case "approved":
        return counts.activeListings.filter((l) => l.rawStatus === "APPROVED");
      case "all":
      default:
        return counts.activeListings;
    }
  }, [counts.activeListings, activeFilter]);



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


      {!loading && error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-semibold text-black uppercase tracking-wider">
                  <th className="px-5 py-3">ID</th>
                  <th className="px-5 py-3">Tên sản phẩm</th>
                  <th className="px-5 py-3">Cửa hàng</th>
                  <th className="px-5 py-3">Ngày gửi</th>
                  <th className="px-5 py-3">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[...Array(5)].map((_, i) => (
                  <SkeletonTableRow key={i} />
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden flex flex-col gap-3 p-4">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      )}

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
            <EmptyState label={filterLabel[activeFilter]} />
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left text-xs font-semibold text-black uppercase tracking-wider">
                      <th className="px-5 py-3 w-[10%]">ID</th>
                      <th className="px-5 py-3 w-[30%]">Tên sản phẩm</th>
                      <th className="px-5 py-3 w-[20%]">Cửa hàng</th>
                      <th className="px-5 py-3 w-[20%]">Ngày gửi</th>
                      <th className="px-5 py-3 w-[20%]">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredListings.map((row) => {
                      const badge = getBadge(row.rawStatus);
                      return (
                        <tr
                          key={row.id}
                          className="hover:bg-orange-50 transition-colors cursor-pointer"
                          onClick={() => router.push(getTargetUrl(row))}
                          title={`Nhấn để xem chi tiết — ${badge.label}`}
                        >
                          <td className="px-5 py-3 font-mono text-xs text-gray-500">
                            {row.id}
                          </td>
                          <td className="px-5 py-3 font-medium text-gray-900 max-w-[250px] truncate">
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
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden flex flex-col gap-3 p-4">
                {filteredListings.map((row) => (
                  <ListingCard
                    key={row.id}
                    row={row}
                    onClick={() => router.push(getTargetUrl(row))}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </InspectorHeroLayout>
  );
}
