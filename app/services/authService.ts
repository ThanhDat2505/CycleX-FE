import { LoginRequest, LoginResponse, AuthError } from '@/app/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4491';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
export const authService = {
    /**
     * Login user with email and password
     * @param email - User email
     * @param password - User password
     * @param rememberMe - Whether to remember the user
     * @returns Promise with login response
     * async báo hiệu có thể dùng await, gọi APi mất thời gian, không block code khác, đợi kết quả rồi mới chạy
     */
    login: async (email: string, password: string, rememberMe: boolean = false): Promise<LoginResponse> => {
        // gọi API mất thời gian, nên dùng promise kiểu dữ liệu là LoginResponse
        try {
            // chờ việc gọi API
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // báo cho sever biết gửi data kiểu json
                },
                body: JSON.stringify({ email, password, rememberMe } as LoginRequest),
                // chuyển object thành json rồi ép kiểu loginRequest
            });

            if (!response.ok) {
                const error: AuthError = await response.json(); // đợi parse JSON body thành kiểu AuthError
                throw error; // ném lỗi, nhảy và catch
            }

            const data: LoginResponse = await response.json(); // đợi parse JSON body thành kiểu LoginResponse

            // Save token if login successful
            if (data.token) {
                authService.saveToken(data.token); // nếu có token thì lưu vào localStorage
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Save authentication token to localStorage
     * @param token - JWT token from backend
     */
    saveToken: (token: string): void => { // hàm không return
        if (typeof window !== 'undefined') { //next render code ở server nên không có window, chỉ browser mới có window
            localStorage.setItem('authToken', token);
        }
    },

    /**
     * Get authentication token from localStorage
     * @returns Token string or null
     */
    getToken: (): string | null => { // return string or null
        if (typeof window !== 'undefined') {
            return localStorage.getItem('authToken');
        }
        return null;
    },

    /**
     * Remove authentication token (logout)
     */
    logout: (): void => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
        }
    },

    /**
     * Check if user is authenticated
     * @returns boolean
     */
    isAuthenticated: (): boolean => {
        return !!authService.getToken(); // nếu có token thì return true, không có thì return false
    },
};
