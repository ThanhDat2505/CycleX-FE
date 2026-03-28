"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

// Inline SVG icons — no external dependencies
const IconDashboard = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const IconClipboardList = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <line x1="9" y1="12" x2="15" y2="12" />
    <line x1="9" y1="16" x2="13" y2="16" />
  </svg>
);

const IconHistory = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </svg>
);

const IconGavel = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14 13L4 3l-1 1 9 10" />
    <path d="m14.5 13.5 5 5a2.12 2.12 0 0 1-3 3l-5-5" />
    <path d="m5 8-1.5-1.5A2 2 0 0 1 6.34 3.66L8 5" />
    <line x1="3" y1="21" x2="21" y2="21" />
  </svg>
);

const NAV_ITEMS = [
  {
    href: "/inspector/dashboard",
    label: "Tổng Quan",
    icon: IconDashboard,
  },
  {
    href: "/inspector/pending-list",
    label: "Tin Chờ Duyệt",
    icon: IconClipboardList,
  },
  {
    href: "/inspector/review-history",
    label: "Lịch Sử Duyệt",
    icon: IconHistory,
  },
  {
    href: "/inspector/disputes",
    label: "Danh Sách Tranh Chấp",
    icon: IconGavel,
  },
];

export default function InspectorNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav className="bg-brand-bg border-b border-white/5 shadow-2xl sticky top-[72px] z-40 backdrop-blur-xl bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-4">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] transition-all whitespace-nowrap group
                  ${
                    active
                      ? "bg-brand-primary text-white shadow-lg shadow-orange-500/20 scale-105"
                      : "text-gray-500 hover:text-white hover:bg-white/5"
                  }`}
              >
                <Icon
                  size={16}
                  className={
                    active
                      ? "text-white"
                      : "text-gray-600 group-hover:text-brand-primary transition-colors"
                  }
                />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
