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
    <div className="min-h-screen bg-gray-50 animate-fade-in-up">
      <section className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-5">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap
                    ${
                      active
                        ? "bg-[#FF8A00] text-white shadow-md"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
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

          <div className="max-w-3xl animate-slide-up">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-3">
              {title} <span className="text-[#FF8A00]">{highlightTitle}</span>
            </h1>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-2xl">
              {description}
            </p>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
      </section>
    </div>
  );
}
