/**
 * MobileMenu Component
 * Responsive mobile menu for Header
 */

'use client';

import React from 'react';
import Link from 'next/link';

interface MobileMenuProps {
    isOpen: boolean;
    isLoggedIn: boolean;
    isRestrictedRole: boolean;
    onClose: () => void;
    onSellClick: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
    isOpen,
    isLoggedIn,
    isRestrictedRole,
    onClose,
    onSellClick,
}) => {
    if (!isOpen) return null;

    return (
        <nav className="md:hidden mt-4 pb-4 border-t border-gray-700 pt-4">
            <div className="flex flex-col gap-4">
                <Link
                    href="/listings"
                    onClick={onClose}
                    className="text-white hover:text-brand-primary transition-colors text-left"
                >
                    Mua Xe
                </Link>
                {!isRestrictedRole && (
                    <button
                        onClick={() => { onSellClick(); onClose(); }}
                        className="text-white hover:text-brand-primary transition-colors text-left"
                    >
                        Bán Xe
                    </button>
                )}
                <Link
                    href="/guide"
                    onClick={onClose}
                    className="text-white hover:text-brand-primary transition-colors text-left"
                >
                    Cẩm Nang
                </Link>
                {isLoggedIn && (
                    <>
                        <Link
                            href="/profile"
                            onClick={onClose}
                            className="text-white hover:text-brand-primary transition-colors text-left"
                        >
                            Profile
                        </Link>
                        <Link
                            href="/notifications"
                            onClick={onClose}
                            className="text-white hover:text-brand-primary transition-colors text-left"
                        >
                            Notifications
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default MobileMenu;
