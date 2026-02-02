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

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

// Sub-components (explicit imports to avoid circular reference)
import { NavLinks } from './Header/NavLinks';
import { SearchBar } from './Header/SearchBar';
import { UserMenu } from './Header/UserMenu';
import { MobileMenu } from './Header/MobileMenu';

export default function Header() {
    const router = useRouter();
    const { isLoggedIn, logout, user } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Role restrictions
    const isRestrictedRole = user && ['ADMIN', 'SHIPPER', 'INSPECTOR'].includes(user.role);

    // Handle sell button click with auth check
    const handleSellClick = () => {
        if (!isLoggedIn) {
            router.push('/login?returnUrl=/create-listing');
        } else if (!isRestrictedRole) {
            router.push('/create-listing');
        }
    };

    console.log('User role: ' + (user && user.role) + '');

    return (
        <header className="bg-brand-bg text-white sticky top-0 z-50 shadow-lg">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
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

                    {/* Desktop Navigation */}
                    <NavLinks
                        isRestrictedRole={!!isRestrictedRole}
                        onSellClick={handleSellClick}
                    />

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4">
                        {/* Search */}
                        <div className="relative">
                            <SearchBar />
                        </div>

                        {isLoggedIn ? (
                            <>
                                {/* Notification Bell */}
                                <button
                                    className="hidden md:block relative text-white hover:text-brand-primary transition-colors"
                                    aria-label="Notifications"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
                                </button>

                                {/* User Menu */}
                                <UserMenu
                                    isRestrictedRole={!!isRestrictedRole}
                                    onLogout={logout}
                                />

                                {/* Đăng Tin Button */}
                                {!isRestrictedRole && (
                                    <Link
                                        href="/create-listing"
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
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <MobileMenu
                    isOpen={mobileMenuOpen}
                    isLoggedIn={isLoggedIn}
                    isRestrictedRole={!!isRestrictedRole}
                    onClose={() => setMobileMenuOpen(false)}
                    onSellClick={handleSellClick}
                />
            </div>
        </header>
    );
}
