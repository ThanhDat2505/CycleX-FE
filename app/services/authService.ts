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
     */
    login: async (email: string, password: string, rememberMe: boolean = false): Promise<LoginResponse> => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, rememberMe } as LoginRequest),
            });

            if (!response.ok) {
                const error: AuthError = await response.json();
                throw error;
            }

            const data: LoginResponse = await response.json();

            // Save token if login successful
            if (data.token) {
                this.saveToken(data.token);
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
    saveToken: (token: string): void => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('authToken', token);
        }
    },

    /**
     * Get authentication token from localStorage
     * @returns Token string or null
     */
    getToken: (): string | null => {
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
        return !!authService.getToken();
    },
};
