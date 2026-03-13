/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  inspectorService,
  type InspectorDashboardStats,
} from "@/app/services/inspectorService";
import { PageLoading } from "@/app/components/ui";

export default function DashboardClient() {
  const [stats, setStats] = useState<InspectorDashboardStats>({
    pendingCount: 0,
    reviewingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
    disputeCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const REFRESH_INTERVAL_MS = 30000;

    const load = async (showLoading = false) => {
      try {
        if (showLoading) setLoading(true);
        setError(null);
        const result = await inspectorService.getDashboardStats();
        if (!mounted) return;
        setStats(result);
      } catch (err: any) {
        if (mounted) {
          setError(err?.message || "Không tải được dữ liệu dashboard");
          if (showLoading) {
            setStats({
              pendingCount: 0,
              reviewingCount: 0,
              approvedCount: 0,
              rejectedCount: 0,
              disputeCount: 0,
            });
          }
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

  const pendingTotal =
    Number(stats.pendingCount) + Number(stats.reviewingCount);

  const StatCard = ({
    label,
    count,
    icon,
    iconColorClass,
  }: {
    label: string;
    count: number;
    icon: string;
    iconColorClass: string;
  }) => (
    <div className="relative flex flex-col items-start p-6 bg-white rounded-xl shadow-sm border border-gray-200 w-full">
      <div className="flex justify-between items-start w-full mb-4">
        <div>
          <span
            className={`material-symbols-outlined text-2xl ${iconColorClass}`}
          >
            {icon}
          </span>
        </div>
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{count}</div>
      <div className="text-sm font-medium text-gray-600">{label}</div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header Section - Refined to match Shipper style */}
      <div className="bg-white border-b border-gray-200 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 -mt-8 py-6 mb-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span>Chào mừng trở lại, Inspector!</span>
              <span className="text-2xl">👋</span>
            </h1>
            <p className="mt-1 text-gray-500 text-sm">
              {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p className="mt-2 text-gray-600">
              Bạn có <span className="font-bold text-brand-primary">{pendingTotal}</span> tin cần duyệt hôm nay.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
              Làm mới
            </button>
            <Link
              href="/inspector/pending-list"
              className="flex items-center justify-center gap-2 px-6 py-2 bg-brand-primary text-white rounded-lg font-bold hover:shadow-lg transition-all"
            >
              <span className="material-symbols-outlined">format_list_bulleted</span>
              Vào danh sách
            </Link>
          </div>
        </div>
      </div>

      {loading && <PageLoading message="Đang tải số liệu thống kê..." />}
      {!loading && error && <div className="text-red-600">{error}</div>}

      {/* Stats Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatCard
            label="Tin chờ duyệt"
            count={pendingTotal}
            icon="schedule"
            iconColorClass="text-yellow-600"
          />
          <StatCard
            label="Đang xem xét"
            count={Number(stats.reviewingCount)}
            icon="article"
            iconColorClass="text-blue-600"
          />
          <StatCard
            label="Tranh chấp"
            count={Number(stats.disputeCount)}
            icon="warning"
            iconColorClass="text-red-600"
          />
          <StatCard
            label="Đã từ chối"
            count={Number(stats.rejectedCount)}
            icon="cancel"
            iconColorClass="text-gray-600"
          />
          <StatCard
            label="Đã duyệt"
            count={Number(stats.approvedCount)}
            icon="check_circle"
            iconColorClass="text-green-600"
          />
        </div>
      )}
    </div>
  );
}
