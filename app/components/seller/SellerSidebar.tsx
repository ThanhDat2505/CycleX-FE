"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSellerNav } from "@/app/contexts/SellerNavContext";
import { useAuth } from "@/app/hooks/useAuth";
import "../../seller/seller-drawer.css";

const NAV_ITEMS = [
  {
    href: "/seller/dashboard",
    label: "Tổng Quan",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    href: "/seller/create-listing",
    label: "Đăng tin mới",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
    ),
  },
  {
    href: "/seller/my-listings",
    label: "Quản lý của tôi",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
      </svg>
    ),
  },
  {
    href: "/seller/listing-status",
    label: "Trạng thái tin",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    href: "/seller/draft-listings",
    label: "Tin nháp",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
  {
    href: "/seller/transactions/pending",
    label: "Giao dịch",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
];

export default function SellerSidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, closeSidebar } = useSellerNav();
  const { user, logout } = useAuth();

  // Close sidebar on navigation
  useEffect(() => {
    closeSidebar();
  }, [pathname, closeSidebar]);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSidebar();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [closeSidebar]);

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {/* Backdrop */}
      {isSidebarOpen && (
        <div
          className="seller-drawer-overlay opacity-100 pointer-events-auto"
          onClick={closeSidebar}
        />
      )}

      {/* Drawer */}
      <aside
        className={`seller-drawer ${isSidebarOpen ? "seller-drawer-open" : "seller-drawer-closed"}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold text-white">
                Kênh Người Bán
              </span>
            </div>
            <button
              onClick={closeSidebar}
              title="Đóng menu"
              className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 py-6 overflow-y-auto no-scrollbar space-y-2">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`seller-nav-item ${active ? "active" : ""}`}
                >
                  <span className="seller-nav-icon">{item.icon}</span>
                  <span className="font-semibold text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-6 border-t border-white/10 bg-white/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold shadow-lg shadow-brand-primary/20">
                {user?.fullName?.charAt(0) || (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">
                  {user?.fullName || "Seller"}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  Người Bán Chuyên Nghiệp
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-400/10 transition-all active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
