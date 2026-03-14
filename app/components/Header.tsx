/**
 * Header Component
 * Navigation header with dark theme matching Figma mockup
 *
 * Refactored to use sub-components:
 * - NavLinks: Desktop navigation
 * - SearchBar: Expandable search
 * - UserMenu: User dropdown
 * - MobileMenu: Mobile navigation
 */

"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { useSellerNav } from "../contexts/SellerNavContext";
import { Menu } from "lucide-react";

// Sub-components (explicit imports to avoid circular reference)
import { NavLinks } from "./Header/NavLinks";
import { SearchBar } from "./Header/SearchBar";
import { UserMenu } from "./Header/UserMenu";
import { MobileMenu } from "./Header/MobileMenu";

const AUTH_ROUTES = ["/login", "/register", "/verify-email"];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, logout, user, isLoading } = useAuth();
  const { toggleSidebar } = useSellerNav();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Role restrictions:
  // Keep navigator visible for INSPECTOR (only restrict ADMIN/SHIPPER here)
  const isRestrictedRole = !!user && ["ADMIN", "SHIPPER"].includes(user.role);
  const isBuyer = user?.role === "BUYER";

  // Handle sell button click with auth check — blocks BUYER and restricted roles
  const handleSellClick = useCallback(() => {
    if (!isLoggedIn) {
      router.push("/login?returnUrl=/seller/create-listing");
    } else if (!isRestrictedRole && !isBuyer) {
      router.push("/seller/create-listing");
    }
  }, [isLoggedIn, isRestrictedRole, isBuyer, router]);

  // Hidden header on auth pages
  if (AUTH_ROUTES.includes(pathname)) {
    return null;
  }

  return (
    <header className="w-full shrink-0 bg-brand-bg text-white sticky top-0 z-50 shadow-lg">
      <div className="w-full max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Seller Hamburger (Visible after login, except on Homepage) - Far Left */}
            {isLoggedIn && pathname !== "/" && (
              <button
                onClick={toggleSidebar}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white hover:text-brand-primary"
                aria-label="Toggle Seller Menu"
              >
                <Menu size={24} />
              </button>
            )}

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="text-2xl font-bold">CycleX</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <NavLinks
            isRestrictedRole={isRestrictedRole}
            userRole={user?.role}
            onSellClick={handleSellClick}
            isLoading={isLoading}
          />

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">{!isRestrictedRole && <SearchBar />}</div>

            {isLoading ? (
              <div className="w-32 h-10 animate-pulse rounded-lg bg-gray-600" />
            ) : isLoggedIn ? (
              <>


                {/* User Menu */}
                <UserMenu
                  isRestrictedRole={isRestrictedRole}
                  userRole={user?.role}
                  onLogout={logout}
                />

                {/* Đăng Tin Button — only SELLER and Guest, NOT BUYER */}
                {!isRestrictedRole && !isBuyer && (
                  <Link
                    href="/seller/create-listing"
                    className="bg-brand-primary hover:bg-brand-primary-hover text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Đăng Tin
                  </Link>
                )}

                {/* Logout (mobile only) */}
                <button
                  onClick={logout}
                  className="md:hidden text-white hover:text-brand-primary transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Login/Register for guests */}
                <Link
                  href="/login"
                  className="hidden md:block text-white hover:text-brand-primary transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-brand-primary hover:bg-brand-primary-hover text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Register
                </Link>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white"
              aria-label="Menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <MobileMenu
          isOpen={mobileMenuOpen}
          isLoggedIn={isLoggedIn}
          isRestrictedRole={isRestrictedRole}
          userRole={user?.role}
          onClose={() => setMobileMenuOpen(false)}
          onSellClick={handleSellClick}
          isLoading={isLoading}
        />
      </div>
    </header>
  );
}
