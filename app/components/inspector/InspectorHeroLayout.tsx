"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

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

interface InspectorHeroLayoutProps {
  title: string;
  highlightTitle: string;
  description: string;
  children: React.ReactNode;
}

export default function InspectorHeroLayout({
  title,
  highlightTitle,
  description,
  children,
}: InspectorHeroLayoutProps) {
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

          {/* Page heading */}
          <div className="max-w-3xl animate-slide-up">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight tracking-tight">
              {title}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-amber-400">
                {highlightTitle}
              </span>
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed max-w-xl">
              {description}
            </p>
          </div>
        </div>
      </section>

      {/* Page content */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          {children}
        </div>
      </section>
    </div>
  );
}
