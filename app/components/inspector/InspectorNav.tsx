"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { 
    LayoutDashboard, ClipboardList, AlertCircle, 
    History, Gavel, Fingerprint 
} from "lucide-react";

const NAV_ITEMS = [
  {
    href: "/inspector/dashboard",
    label: "Tổng Quan",
    icon: LayoutDashboard,
  },
  {
    href: "/inspector/pending-list",
    label: "Tin Chờ Duyệt",
    icon: ClipboardList,
  },
  {
    href: "/inspector/review-required",
    label: "Tin Cần Xem Xét",
    icon: AlertCircle,
  },
  {
    href: "/inspector/review-history",
    label: "Lịch Sử Duyệt",
    icon: History,
  },
  {
    href: "/inspector/disputes",
    label: "Danh Sách Tranh Chấp",
    icon: Gavel,
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
                <Icon size={16} className={active ? "text-white" : "text-gray-600 group-hover:text-brand-primary transition-colors"} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
