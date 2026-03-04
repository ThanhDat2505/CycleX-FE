/**
 * Category Constants
 * Bike categories data used across the application
 */

export interface Category {
    name: string;
    icon: string;
    count: number;
    slug: string;
}

/**
 * Bike categories with static placeholder counts.
 * NOTE: `count` values are UI placeholders only — NOT from backend API.
 * If backend provides real counts in the future, replace these values.
 */
export const BIKE_CATEGORIES: Category[] = [
    { name: 'Xe Đạp Địa Hình', icon: '🏔️', count: 245, slug: 'dia-hinh' },
    { name: 'Xe Đạp Đường Trường', icon: '🚴', count: 189, slug: 'duong-truong' },
    { name: 'Xe Đạp Thể Thao', icon: '⚡', count: 312, slug: 'the-thao' },
    { name: 'Xe Đạp Touring', icon: '🗺️', count: 156, slug: 'touring' },
    { name: 'Xe Đạp Đua', icon: '🏁', count: 98, slug: 'dua' },
    { name: 'Xe Đạp Gấp', icon: '📦', count: 127, slug: 'gap' },
    { name: 'Xe Đạp Điện', icon: '🔋', count: 203, slug: 'dien' },
    { name: 'Xe Đạp Trẻ Em', icon: '👶', count: 178, slug: 'tre-em' },
] as const;
