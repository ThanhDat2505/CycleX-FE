"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import {
  LayoutDashboard,
  PlusCircle,
  List,
  FileText,
  ArrowLeftRight,
  ClipboardList,
  Clock,
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
    href: "/seller/transactions/pending",
    label: "Chờ xử lý",
    icon: Clock,
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
  const { user } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (user?.userId) {
      const fetchPendingCount = async () => {
        try {
          const { getSellerTransactions } =
            await import("@/app/services/transactionService");
          const transactions = await getSellerTransactions(
            user.userId,
            "PENDING_SELLER_CONFIRM",
          );
          setPendingCount(transactions.length);
        } catch (error) {
          console.error("Failed to fetch pending count:", error);
        }
      };

      fetchPendingCount();

      const interval = setInterval(fetchPendingCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user?.userId]);

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
                className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-orange-50 text-[#FF8A00] shadow-sm ring-1 ring-orange-100"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 ${isActive ? "text-[#FF8A00]" : "text-gray-400"}`}
                  />
                  {item.label}
                </div>
                {item.href === "/seller/transactions/pending" && pendingCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                    {pendingCount > 99 ? "99+" : pendingCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden">
        <nav className="flex justify-around py-2">
          {NAV_ITEMS.filter(item => ["/seller/dashboard", "/seller/my-listings", "/seller/transactions/pending", "/seller/transactions", "/seller/create-listing"].includes(item.href)).map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-2 py-1 text-xs relative ${
                  isActive ? "text-[#FF8A00]" : "text-gray-500"
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.href === "/seller/transactions/pending" && pendingCount > 0 && (
                    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[8px] font-bold px-1 rounded-full text-center">
                      {pendingCount > 9 ? "9+" : pendingCount}
                    </span>
                  )}
                </div>
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
