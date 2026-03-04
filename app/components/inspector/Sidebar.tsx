"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

// Bổ sung thêm trường 'icon' dùng Material Symbols
// Thêm tiền tố /inspector vào các đường dẫn href
const NAV = [
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
    href: "/inspector/review-required",
    label: "Tin cần xem xét",
    key: "review_required",
    icon: "assignment_late",
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

  const isActive = (item: (typeof NAV)[number]) => {
    if (item.href === "/") return pathname === "/";
    return pathname.startsWith(item.href);
  };

  return (
    <aside className="sidebar" aria-label="Thanh điều hướng">
      <div className="sidebar-top">
        <div className="brand">
          <span
            className="material-symbols-outlined icon-btn"
            title="Thu gọn/Mở rộng"
          >
            menu
          </span>
          <span className="brand-name">CycleX</span>
        </div>

        <nav className="menu" aria-label="Danh mục Inspector">
          <p className="menu-title">Danh mục</p>

          {NAV.map((item) => (
            <Link
              key={item.key}
              className={`menu-item flex items-center gap-3 ${isActive(item) ? "active" : ""}`}
              href={item.href}
              // Thêm class flex để icon và text nằm ngang nhau, có khoảng cách
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              {/* Thêm Icon */}
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "20px" }}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div
        className="user-info"
        style={{ cursor: "pointer" }}
        title="Xem thông tin cá nhân / Đăng xuất"
      >
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
        {/* Nút nhỏ góc phải để báo hiệu có menu dropdown */}
        <span
          className="material-symbols-outlined"
          style={{ marginLeft: "auto", fontSize: "18px", color: "#9ca3af" }}
        >
          more_vert
        </span>
      </div>
    </aside>
  );
}
