import { API_DELAY_MS } from "../constants";

/**
 * Service to handle image uploads
 * Supports both mock mode and real API calls
 */

const USE_MOCK_API = process.env.NEXT_PUBLIC_MOCK_API === 'true';

/**
 * Upload an image file to the server
 * @param file - The image file to upload
 * @param listingId - Optional listing ID for organizing images (used by BE)
 * @returns Promise<string> - The uploaded image URL
 */
export async function uploadImage(file: File, listingId?: number | string): Promise<string> {
    if (USE_MOCK_API) {
        return mockUploadImage(file);
    }
    return realUploadImage(file, listingId);
}

/**
 * Real API upload - calls backend endpoint
 * BE will handle storing at: public/<listingId>/<number>.png
 */
async function realUploadImage(file: File, listingId?: number | string): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    if (listingId) {
        formData.append('listingId', String(listingId));
    }

    const response = await fetch('/api/listings/upload-image', {
        method: 'POST',
        body: formData,
        // Note: Don't set Content-Type header - browser will set it with boundary
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to upload image');
    }

    const data = await response.json();

    // Validate response has url field
    if (!data.url || typeof data.url !== 'string') {
        throw new Error('Invalid response from server: missing image URL');
    }

    return data.url;
}

/**
 * Mock upload - simulates network delay and returns placeholder URL
 * Used when NEXT_PUBLIC_MOCK_API=true
 */
async function mockUploadImage(file: File): Promise<string> {
    console.log(`⬆️ [MOCK] Uploading file: ${file.name} (${file.size} bytes)`);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, API_DELAY_MS * 2));

    // Return placeholder URL for visual preview
    const mockUrl = `https://placehold.co/600x400?text=${encodeURIComponent(file.name)}`;

    console.log(`✅ [MOCK] Uploaded: ${mockUrl}`);
    return mockUrl;
}

/**
 * Upload multiple images at once
 * @param files - Array of files to upload
 * @param listingId - Optional listing ID
 * @returns Promise<string[]> - Array of uploaded image URLs
 */
export async function uploadMultipleImages(files: File[], listingId?: number | string): Promise<string[]> {
    const uploadPromises = files.map(file => uploadImage(file, listingId));
    return Promise.all(uploadPromises);
}
