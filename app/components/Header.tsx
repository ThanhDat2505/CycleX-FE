/**
 * Header Component
 * Navigation header with dark theme matching Figma mockup
 * Features: Logo, navigation menu, search, notifications, user menu, "Đăng Tin" button
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

export default function Header() {
    const router = useRouter();
    const { isLoggedIn, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleSellClick = () => {
        if (!isLoggedIn) {
            // Redirect to login with return URL
            router.push('/login?returnUrl=/create-listing');
        } else {
            router.push('/create-listing');
        }
    };

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
                            onClick={() => router.push('/search')}
                            className="text-white hover:text-brand-primary transition-colors"
                        >
                            Mua Xe
                        </button>
                        <button
                            onClick={handleSellClick}
                            className="text-white hover:text-brand-primary transition-colors"
                        >
                            Bán Xe
                        </button>
                        <button
                            onClick={() => router.push('/guide')}
                            className="text-white hover:text-brand-primary transition-colors"
                        >
                            Cẩm Nang
                        </button>
                    </nav>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4">
                        {/* Search Icon - Global */}
                        <button
                            onClick={() => router.push('/search')}
                            className="text-white hover:text-brand-primary transition-colors"
                            aria-label="Search"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>

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

                                {/* User Icon */}
                                <button
                                    onClick={() => router.push('/profile')}
                                    className="hidden md:block text-white hover:text-brand-primary transition-colors"
                                    aria-label="Profile"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </button>

                                {/* Đăng Tin Button */}
                                <button
                                    onClick={() => router.push('/create-listing')}
                                    className="bg-brand-primary hover:bg-brand-primary-hover text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                >
                                    Đăng Tin
                                </button>

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
                                onClick={() => { router.push('/search'); setMobileMenuOpen(false); }}
                                className="text-white hover:text-brand-primary transition-colors text-left"
                            >
                                Mua Xe
                            </button>
                            <button
                                onClick={() => { handleSellClick(); setMobileMenuOpen(false); }}
                                className="text-white hover:text-brand-primary transition-colors text-left"
                            >
                                Bán Xe
                            </button>
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
