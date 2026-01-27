"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/inspector-dashboard", label: "Tổng quan" },
  { href: "/pending-list", label: "Tin chờ duyệt" },
  { href: "/pending-list#need-more-info", label: "Yêu cầu bổ sung" },
  { href: "/pending-list#dispute", label: "Tin cần xem xét" },
  { href: "/pending-list#flagged", label: "Tin bị gắn cờ" },
  { href: "/s-24", label: "Lịch sử duyệt" },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    const base = href.split("#")[0];
    return pathname === base;
  };

  return (
    <aside className="sidebar" aria-label="Thanh điều hướng">
      <div className="sidebar-top">
        <div className="brand">
          <span className="material-symbols-outlined icon-btn">menu</span>
          <span className="brand-name">CycleX</span>
        </div>

        <div className="search-box" role="search" aria-label="Tìm kiếm sidebar">
          <span className="placeholder">Search</span>
          <span className="material-symbols-outlined search-icon">search</span>
        </div>

        <nav className="menu" aria-label="Danh mục Inspector">
          <p className="menu-title">Danh mục</p>
          {NAV.map((item) => (
            <Link
              key={item.href}
              className={`menu-item ${isActive(item.href) ? "active" : ""}`}
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="user-info">
        <img
          src="https://ui-avatars.com/api/?name=Inspector&background=random"
          alt="avatar"
          className="user-avatar"
        />
        <span className="user-email">Example@gmail.com</span>
      </div>
    </aside>
  );
}
