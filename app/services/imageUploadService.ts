/**
 * Service to handle image uploads
 */

/**
 * Upload an image file to the server
 * @param file - The image file to upload
 * @param listingId - Optional listing ID for organizing images (used by BE)
 * @returns Promise<string> - The uploaded image URL
 */
export async function uploadImage(file: File, listingId?: number | string): Promise<string> {
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
 * Upload multiple images at once
 * @param files - Array of files to upload
 * @param listingId - Optional listing ID
 * @returns Promise<string[]> - Array of uploaded image URLs
 */
export async function uploadMultipleImages(files: File[], listingId?: number | string): Promise<string[]> {
    const uploadPromises = files.map(file => uploadImage(file, listingId));
    return Promise.all(uploadPromises);
}
