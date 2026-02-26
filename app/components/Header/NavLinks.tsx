/**
 * NavLinks Component
 * Desktop navigation links for Header
 *
 * Role-based visibility:
 * - SELLER: sees "Bán Xe" only (no "Mua Xe")
 * - BUYER: sees "Mua Xe" only (no "Bán Xe")
 * - Guest: sees both "Mua Xe" and "Bán Xe"
 * - ADMIN/SHIPPER/INSPECTOR: hidden via isRestrictedRole
 */

'use client';

import React from 'react';
import Link from 'next/link';

interface NavLinksProps {
    isRestrictedRole: boolean;
    userRole?: string;
    onSellClick: () => void;
    isLoading?: boolean;
}

const LINK_STYLE = 'text-white hover:text-brand-primary transition-colors';

export const NavLinks: React.FC<NavLinksProps> = ({ isRestrictedRole, userRole, onSellClick, isLoading }) => {
    const isSeller = userRole === 'SELLER';
    const isBuyer = userRole === 'BUYER';

    return (
        <nav className="hidden md:flex items-center gap-8">
            {/* "Mua Xe" — visible to Guest and BUYER, NOT SELLER */}
            {!isLoading && !isRestrictedRole && !isSeller && (
                <Link href="/listings" className={LINK_STYLE}>
                    Mua Xe
                </Link>
            )}
            {/* "Bán Xe" — visible to Guest and SELLER, NOT BUYER */}
            {!isLoading && !isRestrictedRole && !isBuyer && (
                <button onClick={onSellClick} className={LINK_STYLE}>
                    Bán Xe
                </button>
            )}
            <Link href="/guide" className={LINK_STYLE}>
                Cẩm Nang
            </Link>
        </nav>
    );
};

export default NavLinks;
