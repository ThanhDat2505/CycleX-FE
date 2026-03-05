/**
 * Shared API Helpers
 * Centralized API call logic with consistent error handling
 * Used by authService and listingService
 */

export interface ApiError {
    status: number;
    message: string;
    errors?: Record<string, string[]>;
}

/**
 * Core function to handle API requests with common logic (auth, errors, etc.)
 */
async function coreFetch<T>(endpoint: string, options: RequestInit): Promise<T> {
    try {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string> || {})
        };
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`/backend/api${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            // Try to parse error from backend
            let errorPayload;
            try {
                errorPayload = await response.json(); // parse lỗi từ server thành json
            } catch (parseError) {
                // If can't parse JSON, throw generic error with status code
                throw {
                    status: response.status,
                    message: `Server error: ${response.statusText}`,
                };
            }
            throw errorPayload; // ném lỗi ra ngoài
        }

        return await response.json();
    } catch (error: any) { // ở đây là bắt lỗi mạng khi server không chạy hoặc không kết nối được
        // Handle network errors (server down, no internet, CORS, etc.)
        if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
            throw {
                status: 503,
                message: 'Cannot connect to server. Please check if backend is running or if you have internet connection.',
            };
        }

        // Re-throw other errors (from backend or parsing)
        throw error;
    }
}

/**
 * Helper for POST requests with body
 * @param endpoint - API endpoint (e.g., '/auth/login')
 * @param body - Request body object
 * @returns Promise with parsed JSON response
 */
// Ví dụ: apiCallPOST('/auth/login', {email, password}) đường dẫn API và dữ liệu gửi lên
// → Gửi đến: /backend/api/auth/login
// → Trả về: LoginResponse
export async function apiCallPOST<T>(
    endpoint: string,
    body: object
): Promise<T> {
    return coreFetch<T>(endpoint, {
        method: 'POST',
        body: JSON.stringify(body)
    });
}

/**
 * Helper for GET requests
 * @param endpoint - API endpoint (e.g., '/home')
 * @returns Promise with parsed JSON response
 */
export async function apiCallGET<T>(endpoint: string): Promise<T> {
    return coreFetch<T>(endpoint, { method: 'GET' });
}

/**
 * Helper for PUT requests with body
 * @param endpoint - API endpoint (e.g., '/seller/listings/123')
 * @param body - Request body object
 * @returns Promise with parsed JSON response
 */
export async function apiCallPUT<T>(
    endpoint: string,
    body: object
): Promise<T> {
    return coreFetch<T>(endpoint, {
        method: 'PUT',
        body: JSON.stringify(body)
    });
}

/**
 * Helper for DELETE requests
 * @param endpoint - API endpoint (e.g., '/bikelistings/123')
 * @returns Promise with parsed JSON response
 */
export async function apiCallDELETE<T>(
    endpoint: string
): Promise<T> {
    return coreFetch<T>(endpoint, { method: 'DELETE' });
}
