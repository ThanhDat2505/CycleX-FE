"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const MENU_ITEMS = [
  {
    href: "/inspector/dashboard",
    label: "Tổng quan",
    key: "dashboard",
    icon: "dashboard",
  },
  {
    href: "/inspector/pending-list",
    label: "Tin chờ duyệt",
    key: "pending",
    icon: "pending_actions",
  },
  {
    href: "/inspector/review-history",
    label: "Lịch sử duyệt",
    key: "history",
    icon: "history",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (item: (typeof MENU_ITEMS)[number]) => {
    if (item.href === "/") return pathname === "/";
    return pathname === item.href;
  };

  return (
    <aside className="sidebar" aria-label="Thanh điều hướng">
      <div className="sidebar-top">
        <div className="brand">
          <span className="brand-name">CycleX</span>
        </div>

        <nav className="menu" aria-label="Danh mục Inspector">
          <p className="menu-title">Danh mục</p>

          {MENU_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`menu-item flex items-center gap-3 ${
                pathname === item.href ? "active" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="user-info" title="Xem thông tin cá nhân / Đăng xuất">
        <Image
          src="https://ui-avatars.com/api/?name=Inspector&background=random"
          alt="avatar"
          className="user-avatar"
          width={40}
          height={40}
          unoptimized
        />
        <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
          <span className="user-email" style={{ fontWeight: 800 }}>
            Lâm
          </span>
          <span className="user-email" style={{ color: "#9ca3af" }}>
            Example@gmail.com
          </span>
        </div>

      </div>
    </aside>
  );
}
