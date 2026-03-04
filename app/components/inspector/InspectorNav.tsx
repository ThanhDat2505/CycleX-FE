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
];

export default function InspectorNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-8 overflow-x-auto no-scrollbar py-4">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
                  ${
                    active
                      ? "bg-blue-50 text-blue-600 ring-1 ring-blue-200"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
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
