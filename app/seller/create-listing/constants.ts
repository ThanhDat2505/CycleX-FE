export const CREATE_LISTING_STEPS = {
    VEHICLE_INFO: 1,
    UPLOAD_IMAGES: 2,
    PREVIEW: 3,
} as const;

export type CreateListingStep = typeof CREATE_LISTING_STEPS[keyof typeof CREATE_LISTING_STEPS];

export const LISTING_CONFIG = {
    MIN_IMAGES: 3,
    MAX_IMAGES: 10,
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ACCEPTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'],
} as const;

export const CURRENT_YEAR = new Date().getFullYear();
export const YEAR_OPTIONS = Array.from({ length: 30 }, (_, i) => CURRENT_YEAR - i);
