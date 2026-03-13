/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import InspectorHeroLayout from "@/app/components/inspector/InspectorHeroLayout";
import {
  inspectorService,
  type InspectorDashboardStats,
} from "@/app/services/inspectorService";

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

  const STAT_CARDS = [
    {
      label: "Tin chờ duyệt",
      count: pendingTotal,
      icon: "schedule",
      color: "from-amber-500 to-orange-500",
      href: "/inspector/pending-list",
    },
    {
      label: "Đang xem xét",
      count: Number(stats.reviewingCount),
      icon: "article",
      color: "from-blue-500 to-cyan-500",
      href: "/inspector/review-required",
    },
    {
      label: "Tranh chấp",
      count: Number(stats.disputeCount),
      icon: "warning",
      color: "from-red-500 to-pink-500",
      href: "/inspector/disputes",
    },
    {
      label: "Đã từ chối",
      count: Number(stats.rejectedCount),
      icon: "cancel",
      color: "from-gray-500 to-slate-500",
    },
    {
      label: "Đã duyệt",
      count: Number(stats.approvedCount),
      icon: "check_circle",
      color: "from-emerald-500 to-green-500",
      href: "/inspector/review-history",
    },
  ];

  return (
    <InspectorHeroLayout
      title="Trang"
      highlightTitle="Tổng Quan"
      description={`Chào mừng trở lại! Bạn có ${pendingTotal} tin cần duyệt hôm nay.`}
    >
      <div className="mb-6">
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

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="w-2 h-6 bg-[#FF8A00] rounded-full"></span>
          Tổng quan kiểm định
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {loading && (
            <div className="col-span-full text-center text-gray-500 py-8">
              Đang tải dữ liệu...
            </div>
          )}
          {!loading && error && (
            <div className="col-span-full text-center text-red-600 py-8">
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              {STAT_CARDS.map((card) => {
                const inner = (
                  <div
                    key={card.label}
                    className={`group relative bg-white rounded-xl p-6 border border-gray-200 shadow-sm transition-all ${card.href ? "hover:border-[#FF8A00] hover:shadow-md cursor-pointer" : ""}`}
                  >
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} mb-4 shadow-lg`}
                    >
                      <span className="material-symbols-outlined text-white text-xl">
                        {card.icon}
                      </span>
                    </div>
                    <div className="text-3xl font-extrabold text-gray-900 mb-1 group-hover:text-[#FF8A00] transition-colors">
                      {card.count}
                    </div>
                    <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      {card.label}
                    </div>
                  </div>
                );

                return card.href ? (
                  <Link key={card.label} href={card.href}>
                    {inner}
                  </Link>
                ) : (
                  <div key={card.label}>{inner}</div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </InspectorHeroLayout>
  );
}
