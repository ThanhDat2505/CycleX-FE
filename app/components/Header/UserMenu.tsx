/**
 * UserMenu Component
 * User dropdown menu for authenticated users in Header
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/hooks/useAuth';

interface UserMenuProps {
    isRestrictedRole: boolean;
    userRole?: string;
    onLogout: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ isRestrictedRole, userRole, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [pendingCount, setPendingCount] = useState(0);
    const menuRef = useRef<HTMLDivElement>(null);
    const { user } = useAuth(); // Need user ID for fetching transactions

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Fetch pending transactions count
    useEffect(() => {
        if (userRole === 'SELLER' && user?.userId) {
            const fetchPendingCount = async () => {
                try {
                    // Import dynamically to avoid circular dependencies if any, though here it's fine
                    const { getSellerTransactions } = await import('@/app/services/transactionService');
                    const transactions = await getSellerTransactions(user.userId, 'PENDING_SELLER_CONFIRM');
                    setPendingCount(transactions.length);
                } catch (error) {
                    console.error('Failed to fetch pending count:', error);
                }
            };

            fetchPendingCount();

            // Poll every 30 seconds to keep updated (optional but good for UX)
            const interval = setInterval(fetchPendingCount, 30000);
            return () => clearInterval(interval);
        }
    }, [userRole, user?.userId]);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="hidden md:block text-white hover:text-brand-primary transition-colors relative"
                aria-label="User Menu"
            >
                <div className="relative">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {pendingCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] flex items-center justify-center ring-2 ring-gray-900">
                            {pendingCount > 9 ? '9+' : pendingCount}
                        </span>
                    )}
                </div>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 z-50 animate-scale-in border border-gray-100 ring-1 ring-black ring-opacity-5">
                    <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user?.fullName}</p>
                        <p className="text-xs text-gray-500 truncate">{userRole}</p>
                    </div>

                    {userRole === 'SELLER' && (
                        <>
                            <Link
                                href="/dashboard"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                            >
                                📊 Dashboard
                            </Link>
                            <Link
                                href="/my-listings"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                            >
                                📋 My Listings
                            </Link>
                            <Link
                                href="/draft-listings"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                            >
                                📝 Draft Listings
                            </Link>
                            <Link
                                href="/seller/transactions/pending"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-between w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors group"
                            >
                                <div className="flex items-center gap-2">
                                    💸 Giao dịch chờ xử lý
                                </div>
                                {pendingCount > 0 && (
                                    <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full group-hover:bg-red-200 transition-colors">
                                        {pendingCount}
                                    </span>
                                )}
                            </Link>
                            <hr className="my-2 border-gray-100" />
                        </>
                    )}
                    <button
                        onClick={() => {
                            onLogout();
                            setIsOpen(false);
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                        🚪 Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
