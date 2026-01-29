/**
 * Navigation Constants
 * Centralized navigation configuration
 */

export interface NavItem {
    label: string;
    path: string;
    requiresAuth?: boolean;
}

export const MAIN_NAV_ITEMS: NavItem[] = [
    { label: 'Mua Xe', path: '/search', requiresAuth: false },
    { label: 'Bán Xe', path: '/create-listing', requiresAuth: true },
    { label: 'Cẩm Nang', path: '/guide', requiresAuth: false },
] as const;

export const FOOTER_LINKS: NavItem[] = [
    { label: 'Trang Chủ', path: '/', requiresAuth: false },
    { label: 'Mua Xe', path: '/search', requiresAuth: false },
    { label: 'Bán Xe', path: '/sell', requiresAuth: true },
    { label: 'Cẩm Nang', path: '/guide', requiresAuth: false },
] as const;

export const ELEMENT_IDS = {
    HERO_SECTION: 'hero-section',
    LISTINGS_SECTION: 'listings-section',
} as const;
