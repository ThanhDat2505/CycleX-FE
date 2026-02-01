import { API_DELAY_MS } from "../constants";

/**
 * Service to handle image uploads
 * Mock implementation until backend API is ready
 */

/**
 * Upload an image file
 * Returns a promise that resolves to the uploaded image URL
 */
export async function uploadImage(file: File): Promise<string> {
    console.log(`⬆️ Uploading file: ${file.name} (${file.size} bytes)`);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, API_DELAY_MS * 2)); // Slightly longer delay for uploads

    // Mock: Return a fake URL based on file name or random ID
    // In a real app, this would return the URL from the cloud storage (e.g. AWS S3, Cloudinary)
    const mockUrl = `https://placehold.co/600x400?text=${encodeURIComponent(file.name)}`;

    return mockUrl;
}
