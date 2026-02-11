/**
 * NavLinks Component
 * Desktop navigation links for Header
 */

'use client';

import React from 'react';
import Link from 'next/link';

interface NavLinksProps {
    isRestrictedRole: boolean;
    onSellClick: () => void;
    isLoading?: boolean;
}

export const NavLinks: React.FC<NavLinksProps> = ({ isRestrictedRole, onSellClick, isLoading }) => {
    return (
        <nav className="hidden md:flex items-center gap-8">
            {!isLoading && !isRestrictedRole && (
                <Link
                    href="/listings"
                    className="text-white hover:text-brand-primary transition-colors"
                >
                    Mua Xe
                </Link>
            )}
            {!isLoading && !isRestrictedRole && (
                <button
                    onClick={onSellClick}
                    className="text-white hover:text-brand-primary transition-colors"
                >
                    Bán Xe
                </button>
            )}
            <Link
                href="/guide"
                className="text-white hover:text-brand-primary transition-colors"
            >
                Cẩm Nang
            </Link>
        </nav>
    );
};

export default NavLinks;
