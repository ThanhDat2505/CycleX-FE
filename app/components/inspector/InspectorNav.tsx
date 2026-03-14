"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NAV_ITEMS = [
  {
    href: "/inspector/dashboard",
    label: "Tổng Quan",
    icon: "dashboard",
  },
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
  {
    href: "/inspector/disputes",
    label: "Danh Sách Tranh Chấp",
    icon: "gavel",
  },
];

export default function InspectorNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav className="bg-brand-bg border-b border-white/10 shadow-lg">
      <div className="container mx-auto px-4 md:px-12 lg:px-20">
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-3">
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
      </div>
    </nav>
  );
}
