"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  List,
  FileText,
  ArrowLeftRight,
  ClipboardList,
} from "lucide-react";

const NAV_ITEMS = [
  {
    href: "/seller/dashboard",
    label: "Bảng điều khiển",
    icon: LayoutDashboard,
  },
  {
    href: "/seller/create-listing",
    label: "Đăng tin mới",
    icon: PlusCircle,
  },
  {
    href: "/seller/my-listings",
    label: "Tin đăng của tôi",
    icon: List,
  },
  {
    href: "/seller/draft-listings",
    label: "Bản nháp",
    icon: FileText,
  },
  {
    href: "/seller/transactions",
    label: "Giao dịch",
    icon: ArrowLeftRight,
  },
  {
    href: "/seller/listing-status",
    label: "Trạng thái tin",
    icon: ClipboardList,
  },
];

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="relative min-h-screen flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-gray-200 min-h-screen sticky top-0 hidden md:block">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Trung tâm người bán
          </h2>
          <p className="text-sm text-gray-500 mt-1">Quản lý bán hàng</p>
        </div>
        <nav className="p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-orange-50 text-[#FF8A00] shadow-sm ring-1 ring-orange-100"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${isActive ? "text-[#FF8A00]" : "text-gray-400"}`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden">
        <nav className="flex justify-around py-2">
          {NAV_ITEMS.slice(0, 5).map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-2 py-1 text-xs ${
                  isActive ? "text-[#FF8A00]" : "text-gray-500"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="truncate max-w-[60px]">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 md:pb-0 pb-16">{children}</div>
    </div>
  );
}
