/**
 * Header Component
 * Navigation header with dark theme matching Figma mockup
 * Features: Logo, navigation menu, search, notifications, user menu, "Đăng Tin" button
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

export default function Header() {
    const router = useRouter();
    const { isLoggedIn, logout, user } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState('');
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setUserMenuOpen(false);
            }
        };

        if (userMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [userMenuOpen]);

    const handleSellClick = () => {
        if (!isLoggedIn) {
            // Redirect to login with return URL
            router.push('/login?returnUrl=/create-listing');
        } else if (user && ['ADMIN', 'SHIPPER', 'INSPECTOR'].includes(user.role)) {
            // Do nothing or show notification (optional) - for now just prevent navigation
            return;
        } else {
            router.push('/create-listing');
        }
    };

    const isRestrictedRole = user && ['ADMIN', 'SHIPPER', 'INSPECTOR'].includes(user.role);

    return (
        <header className="bg-brand-bg text-white sticky top-0 z-50 shadow-lg">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div
                        onClick={() => router.push('/')}
                        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                    >
                        <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-xl">C</span>
                        </div>
                        <span className="text-2xl font-bold">CycleX</span>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <button
                            onClick={() => router.push('/listings')}
                            className="text-white hover:text-brand-primary transition-colors"
                        >
                            Mua Xe
                        </button>
                        {!isRestrictedRole && (
                            <button
                                onClick={handleSellClick}
                                className="text-white hover:text-brand-primary transition-colors"
                            >
                                Bán Xe
                            </button>
                        )}
                        <button
                            onClick={() => router.push('/guide')}
                            className="text-white hover:text-brand-primary transition-colors"
                        >
                            Cẩm Nang
                        </button>
                    </nav>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4">
                        {/* Search - Expandable Input */}
                        <div className="relative">
                            {searchOpen ? (
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        const keyword = searchKeyword.trim();

                                        // ✅ Validation: Minimum 3 characters
                                        if (keyword.length < 3) {
                                            setSearchError('Vui lòng nhập ít nhất 3 ký tự');
                                            return;
                                        }

                                        // Clear error and set loading
                                        setSearchError('');
                                        setSearchLoading(true);

                                        // Navigate to search results
                                        router.push(`/listings?keyword=${encodeURIComponent(keyword)}`);

                                        // Reset states
                                        setSearchOpen(false);
                                        setSearchKeyword('');

                                        // Clear loading after navigation starts
                                        setTimeout(() => setSearchLoading(false), 1000);
                                    }}
                                    className="flex flex-col gap-1"
                                >
                                    <div className="relative flex items-center gap-2">
                                        <input
                                            type="text"
                                            placeholder="Tìm kiếm xe... (3 ký tự trở lên)"
                                            value={searchKeyword}
                                            onChange={(e) => {
                                                setSearchKeyword(e.target.value);
                                                setSearchError(''); // Clear error on type
                                            }}
                                            className={`w-48 md:w-64 px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 ${searchError
                                                ? 'ring-2 ring-red-500 focus:ring-red-500'
                                                : 'focus:ring-brand-primary'
                                                }`}
                                            autoFocus
                                            disabled={searchLoading}
                                            onBlur={() => {
                                                // Delay to allow form submission
                                                setTimeout(() => {
                                                    if (!searchLoading) {
                                                        setSearchOpen(false);
                                                        setSearchKeyword('');
                                                        setSearchError('');
                                                    }
                                                }, 200);
                                            }}
                                        />
                                        {searchLoading && (
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                <svg className="animate-spin h-5 w-5 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    {searchError && (
                                        <p className="text-red-400 text-sm px-1 absolute -bottom-6 left-0 whitespace-nowrap">
                                            {searchError}
                                        </p>
                                    )}
                                </form>
                            ) : (
                                <button
                                    onClick={() => setSearchOpen(true)}
                                    className="text-white hover:text-brand-primary transition-colors"
                                    aria-label="Search"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                            )}
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

                                {/* User Icon with Dropdown */}
                                <div className="relative" ref={userMenuRef}>
                                    <button
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        className="hidden md:block text-white hover:text-brand-primary transition-colors"
                                        aria-label="User Menu"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </button>

                                    {/* Dropdown Menu */}
                                    {userMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                                            {!isRestrictedRole && (
                                                <>
                                                    <button
                                                        onClick={() => {
                                                            router.push('/dashboard');
                                                            setUserMenuOpen(false);
                                                        }}
                                                        className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                                                    >
                                                        📊 Dashboard
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            router.push('/my-listings');
                                                            setUserMenuOpen(false);
                                                        }}
                                                        className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                                                    >
                                                        📋 My Listings
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            router.push('/draft-listings');
                                                            setUserMenuOpen(false);
                                                        }}
                                                        className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                                                    >
                                                        📝 Draft Listings
                                                    </button>
                                                    <hr className="my-2" />
                                                </>
                                            )}
                                            <button
                                                onClick={() => {
                                                    logout();
                                                    setUserMenuOpen(false);
                                                }}
                                                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition-colors"
                                            >
                                                🚪 Logout
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Đăng Tin Button */}
                                {!isRestrictedRole && (
                                    <button
                                        onClick={() => router.push('/create-listing')}
                                        className="bg-brand-primary hover:bg-brand-primary-hover text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                    >
                                        Đăng Tin
                                    </button>
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
                                <button
                                    onClick={() => router.push('/login')}
                                    className="hidden md:block text-white hover:text-brand-primary transition-colors font-medium"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => router.push('/register')}
                                    className="bg-brand-primary hover:bg-brand-primary-hover text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                >
                                    Register
                                </button>
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
                {mobileMenuOpen && (
                    <nav className="md:hidden mt-4 pb-4 border-t border-gray-700 pt-4">
                        <div className="flex flex-col gap-4">
                            <button
                                onClick={() => { router.push('/listings'); setMobileMenuOpen(false); }}
                                className="text-white hover:text-brand-primary transition-colors text-left"
                            >
                                Mua Xe
                            </button>
                            {!isRestrictedRole && (
                                <button
                                    onClick={() => { handleSellClick(); setMobileMenuOpen(false); }}
                                    className="text-white hover:text-brand-primary transition-colors text-left"
                                >
                                    Bán Xe
                                </button>
                            )}
                            <button
                                onClick={() => { router.push('/guide'); setMobileMenuOpen(false); }}
                                className="text-white hover:text-brand-primary transition-colors text-left"
                            >
                                Cẩm Nang
                            </button>
                            {isLoggedIn && (
                                <>
                                    <button
                                        onClick={() => { router.push('/profile'); setMobileMenuOpen(false); }}
                                        className="text-white hover:text-brand-primary transition-colors text-left"
                                    >
                                        Profile
                                    </button>
                                    <button
                                        onClick={() => { router.push('/notifications'); setMobileMenuOpen(false); }}
                                        className="text-white hover:text-brand-primary transition-colors text-left"
                                    >
                                        Notifications
                                    </button>
                                </>
                            )}
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
}
