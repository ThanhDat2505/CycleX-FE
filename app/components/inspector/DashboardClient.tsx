"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Listing, ListingStatus } from "@/app/types/types";
import ListingsTable from "./ListingsTable";
import { inspectorService } from "@/app/services/inspectorService";

type Filter = "ALL" | ListingStatus;

export default function DashboardClient() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState<Filter>("ALL");
  const [active, setActive] = useState<Filter>("PENDING");

  useEffect(() => {
    let mounted = true;
    const REFRESH_INTERVAL_MS = 30000;

    const load = async (showLoading = false) => {
      try {
        if (showLoading) setLoading(true);
        setError(null);
        const rows = await inspectorService.getDashboardListings();
        if (mounted) setListings(rows);
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
    const timer = window.setInterval(() => {
      load(false);
    }, REFRESH_INTERVAL_MS);

    return () => {
      mounted = false;
      window.clearInterval(timer);
    };
  }, []);

  const statusCounts = useMemo(
    () =>
      listings.reduce(
        (acc, listing) => {
          acc[listing.status] += 1;
          return acc;
        },
        {
          PENDING: 0,
          REVIEWING: 0,
          NEED_MORE_INFO: 0,
          DISPUTE: 0,
          FLAGGED: 0,
          APPROVED: 0,
          DONE: 0,
        } as Record<ListingStatus, number>,
      ),
    [listings],
  );

  const displayCounts = useMemo(
    () => ({
      pending: statusCounts.PENDING,
      reviewing: statusCounts.REVIEWING,
      dispute: statusCounts.DISPUTE,
      flagged: statusCounts.FLAGGED,
      approved: statusCounts.APPROVED + statusCounts.DONE,
    }),
    [statusCounts],
  );

  const clickFilter = (f: Filter) => {
    setActive(f);
    setFilter(f);
  };

  const StatCard = ({
    type,
    label,
    count,
    icon,
    colorClass,
  }: {
    type: Filter;
    label: string;
    count: number;
    icon: string;
    colorClass: string;
  }) => {
    const isActive = active === type;
    return (
      <button
        onClick={() => clickFilter(type)}
        className={`relative flex flex-col items-start p-6 bg-white rounded-xl shadow-sm border transition-all text-left w-full group hover:shadow-md ${
          isActive
            ? `border-blue-500 ring-1 ring-blue-500`
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <div className="flex justify-between items-start w-full mb-4">
          <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10`}>
            <span
              className={`material-symbols-outlined text-2xl ${colorClass.replace(
                "bg-",
                "text-",
              )}`}
            >
              {icon}
            </span>
          </div>
          {isActive && (
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
          )}
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-1">{count}</div>
        <div className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
          {label}
        </div>
      </button>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Inspector Dashboard
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Chào mừng trở lại! Bạn có{" "}
            <span className="font-bold text-orange-600">
              {statusCounts.PENDING}
            </span>{" "}
            tin cần duyệt hôm nay.
          </p>
        </div>
        <Link
          href="/inspector/pending-list"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 hover:shadow-lg transition-all"
        >
          <span className="material-symbols-outlined">
            format_list_bulleted
          </span>
          Vào danh sách chờ duyệt
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          type="PENDING"
          label="Tin chờ duyệt"
          count={displayCounts.pending}
          icon="schedule"
          colorClass="bg-yellow-500 text-yellow-600"
        />
        <StatCard
          type="REVIEWING"
          label="Đang duyệt tin"
          count={displayCounts.reviewing}
          icon="article"
          colorClass="bg-blue-500 text-blue-600"
        />
        <StatCard
          type="DISPUTE"
          label="Cần xem xét"
          count={displayCounts.dispute}
          icon="warning"
          colorClass="bg-red-500 text-red-600"
        />
        <StatCard
          type="FLAGGED"
          label="Bị report"
          count={displayCounts.flagged}
          icon="flag"
          colorClass="bg-gray-500 text-gray-600"
        />
        <StatCard
          type="APPROVED"
          label="Đã duyệt"
          count={displayCounts.approved}
          icon="check_circle"
          colorClass="bg-green-500 text-green-600"
        />
      </div>

      {/* Filter Chips & Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
            Review List
          </h2>

          <div className="flex items-center gap-2">
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                active === "ALL"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              onClick={() => clickFilter("ALL")}
            >
              Tất cả
            </button>
            {active !== "ALL" && (
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 transition-all"
                onClick={() => clickFilter("ALL")}
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        </div>

        <div className="p-0">
          {loading && (
            <div className="px-6 py-8 text-gray-500">Đang tải dữ liệu...</div>
          )}
          {!loading && error && (
            <div className="px-6 py-8 text-red-600">{error}</div>
          )}
          {!loading && !error && (
            <ListingsTable rows={listings} filter={filter} />
          )}
        </div>
      </div>
    </div>
  );
}
