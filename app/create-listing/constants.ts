export const CREATE_LISTING_STEPS = {
    VEHICLE_INFO: 1,
    UPLOAD_IMAGES: 2,
    PREVIEW: 3,
} as const;

export type CreateListingStep = typeof CREATE_LISTING_STEPS[keyof typeof CREATE_LISTING_STEPS];

export const LISTING_CONFIG = {
    MIN_IMAGES: 3,
    MAX_IMAGES: 10,
} as const;
