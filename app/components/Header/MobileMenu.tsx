/**
 * MobileMenu Component
 * Responsive mobile menu for Header
 *
 * Role-based visibility:
 * - SELLER: sees "Bán Xe" only (no "Mua Xe")
 * - BUYER: sees "Mua Xe" only (no "Bán Xe")
 * - Guest: sees both
 */

'use client';

import React from 'react';
import Link from 'next/link';

interface MobileMenuProps {
    isOpen: boolean;
    isLoggedIn: boolean;
    isRestrictedRole: boolean;
    userRole?: string;
    onClose: () => void;
    onSellClick: () => void;
    isLoading?: boolean;
}

const LINK_STYLE = 'text-white hover:text-brand-primary transition-colors text-left';

export const MobileMenu: React.FC<MobileMenuProps> = ({
    isOpen,
    isLoggedIn,
    isRestrictedRole,
    userRole,
    onClose,
    onSellClick,
    isLoading,
}) => {
    if (!isOpen) return null;

    const isSeller = userRole === 'SELLER';
    const isBuyer = userRole === 'BUYER';

    return (
        <nav className="md:hidden mt-4 pb-4 border-t border-gray-700 pt-4">
            <div className="flex flex-col gap-4">
                {/* "Mua Xe" — NOT for SELLER */}
                {!isLoading && !isRestrictedRole && !isSeller && (
                    <Link href="/listings" onClick={onClose} className={LINK_STYLE}>
                        Mua Xe
                    </Link>
                )}
                {/* "Bán Xe" — NOT for BUYER */}
                {!isLoading && !isRestrictedRole && !isBuyer && (
                    <button
                        onClick={() => { onSellClick(); onClose(); }}
                        className={LINK_STYLE}
                    >
                        Bán Xe
                    </button>
                )}
                <Link href="/guide" onClick={onClose} className={LINK_STYLE}>
                    Cẩm Nang
                </Link>
                {isLoggedIn && (
                    <>
                        <Link href="/profile" onClick={onClose} className={LINK_STYLE}>
                            Profile
                        </Link>
                        <Link href="/notifications" onClick={onClose} className={LINK_STYLE}>
                            Notifications
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default MobileMenu;
