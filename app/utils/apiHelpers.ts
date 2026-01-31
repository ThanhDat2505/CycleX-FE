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
    try {
        const response = await fetch(`/backend/api${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // báo server biết dữ liệu gửi lên là JSON
            },
            body: JSON.stringify(body), // chuyển dữ liệu sang JSON
        });

        if (!response.ok) {
            // Try to parse error from backend
            try {
                const error: ApiError = await response.json(); // parse lỗi từ server thành json
                throw error; // ném lỗi ra ngoài
            } catch (parseError) {
                // If can't parse JSON, throw generic error with status code
                throw {
                    status: response.status,
                    message: `Server error: ${response.statusText}`,
                };
            }
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
 * Helper for GET requests
 * @param endpoint - API endpoint (e.g., '/home')
 * @returns Promise with parsed JSON response
 */
export async function apiCallGET<T>(endpoint: string): Promise<T> {
    try {
        const response = await fetch(`/backend/api${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            // Try to parse error from backend
            try {
                const error: ApiError = await response.json();
                throw error;
            } catch (parseError) {
                // If can't parse JSON, throw generic error with status code
                throw {
                    status: response.status,
                    message: `Server error: ${response.statusText}`,
                };
            }
        }

        return await response.json();
    } catch (error: any) {
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
