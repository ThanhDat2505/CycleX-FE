/**
 * UserMenu Component
 * User dropdown menu for authenticated users in Header
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface UserMenuProps {
    isRestrictedRole: boolean;
    onLogout: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ isRestrictedRole, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

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

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="hidden md:block text-white hover:text-brand-primary transition-colors"
                aria-label="User Menu"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    {!isRestrictedRole && (
                        <>
                            <Link
                                href="/dashboard"
                                onClick={() => setIsOpen(false)}
                                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                            >
                                📊 Dashboard
                            </Link>
                            <Link
                                href="/my-listings"
                                onClick={() => setIsOpen(false)}
                                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                            >
                                📋 My Listings
                            </Link>
                            <Link
                                href="/draft-listings"
                                onClick={() => setIsOpen(false)}
                                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                            >
                                📝 Draft Listings
                            </Link>
                            <hr className="my-2" />
                        </>
                    )}
                    <button
                        onClick={() => {
                            onLogout();
                            setIsOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition-colors"
                    >
                        🚪 Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
