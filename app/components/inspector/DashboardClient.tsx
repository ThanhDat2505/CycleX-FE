/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  inspectorService,
  type InspectorDashboardStats,
} from "@/app/services/inspectorService";

const NAV_ITEMS = [
  { href: "/inspector/dashboard", label: "Tổng Quan", icon: "dashboard" },
  {
    href: "/inspector/pending-list",
    label: "Tin Chờ Duyệt",
    icon: "pending_actions",
  },
  {
    href: "/inspector/review-required",
    label: "Tin Cần Xem Xét",
    icon: "assignment_late",
  },
  {
    href: "/inspector/review-history",
    label: "Lịch Sử Duyệt",
    icon: "history",
  },
  { href: "/inspector/disputes", label: "Danh Sách Tranh Chấp", icon: "gavel" },
];

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

  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="animate-fade-in-up">
      {/* Hero Header with integrated nav */}
      <section className="relative bg-brand-bg text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-bg via-brand-bg/95 to-brand-bg/80" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]" />

        <div className="relative z-10 container mx-auto px-6 md:px-12 lg:px-20 pt-10 pb-8">
          {/* Nav tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-10">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap
                    ${
                      active
                        ? "bg-brand-primary text-white shadow-glow-orange"
                        : "text-gray-300 hover:text-white hover:bg-white/10"
                    }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Dashboard heading + CTA */}
          <div className="max-w-3xl animate-slide-up">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight tracking-tight">
              Trang{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-amber-400">
                Tổng Quan
              </span>
            </h1>

            <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-xl">
              Chào mừng trở lại! Bạn có{" "}
              <span className="font-bold text-brand-primary">
                {pendingTotal}
              </span>{" "}
              tin cần duyệt hôm nay.
            </p>

            <Link
              href="/inspector/pending-list"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-primary-hover hover:shadow-glow-orange transition-all"
            >
              <span className="material-symbols-outlined">
                format_list_bulleted
              </span>
              Vào danh sách chờ duyệt
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section — matches Home FeaturesSection/StatsCard style */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          {loading && (
            <div className="text-center text-gray-500 py-8">
              Đang tải dữ liệu...
            </div>
          )}
          {!loading && error && (
            <div className="text-center text-brand-error py-8">{error}</div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {STAT_CARDS.map((card) => {
                const inner = (
                  <div
                    key={card.label}
                    className={`group relative bg-white rounded-2xl p-6 border border-gray-200 shadow-card transition-all hover:shadow-card-hover ${card.href ? "hover:border-brand-primary cursor-pointer" : ""}`}
                  >
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} mb-4 shadow-lg`}
                    >
                      <span className="material-symbols-outlined text-white text-xl">
                        {card.icon}
                      </span>
                    </div>
                    <div className="text-3xl font-extrabold text-brand-text mb-1 group-hover:text-brand-primary transition-colors">
                      {card.count}
                    </div>
                    <div className="text-sm font-semibold text-brand-text-light uppercase tracking-wide">
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
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
