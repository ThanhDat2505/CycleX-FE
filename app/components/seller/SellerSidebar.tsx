"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  PlusSquare, 
  ListOrdered, 
  Activity, 
  FileText, 
  History,
  X,
  User,
  LogOut
} from "lucide-react";
import { useSellerNav } from "@/app/contexts/SellerNavContext";
import { useAuth } from "@/app/hooks/useAuth";
import "../../seller/seller-drawer.css";

const NAV_ITEMS = [
  {
    href: "/seller/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/seller/create-listing",
    label: "Đăng tin mới",
    icon: PlusSquare,
  },
  {
    href: "/seller/my-listings",
    label: "Quản lý của tôi",
    icon: ListOrdered,
  },
  {
    href: "/seller/listing-status",
    label: "Trạng thái tin",
    icon: Activity,
  },
  {
    href: "/seller/draft-listings",
    label: "Tin nháp",
    icon: FileText,
  },
  {
    href: "/seller/transactions/pending",
    label: "Giao dịch",
    icon: History,
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
      <aside className={`seller-drawer ${isSidebarOpen ? "seller-drawer-open" : "seller-drawer-closed"}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold text-white">Seller Center</span>
            </div>
            <button 
              onClick={closeSidebar}
              className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 py-6 overflow-y-auto no-scrollbar space-y-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`seller-nav-item ${active ? "active" : ""}`}
                >
                  <Icon size={20} className="seller-nav-icon" />
                  <span className="font-semibold text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-6 border-t border-white/10 bg-white/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold shadow-lg shadow-brand-primary/20">
                {user?.fullName?.charAt(0) || <User size={20} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{user?.fullName || "Seller"}</p>
                <p className="text-xs text-gray-400 truncate">Professional Seller</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-400/10 transition-all active:scale-95"
            >
              <LogOut size={18} />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
