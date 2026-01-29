import {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
    VerifyOtpRequest,
    VerifyOtpResponse,
    SendOtpRequest,
    SendOtpResponse,
    AuthError
} from '@/app/types/auth';
import {
    validateMockLogin,
    mockEmailExists,
    mockPhoneExists,
    registerMockUser,
    verifyMockOtp,
    verifyMockUserEmail,
    storeMockOtp,
    getMockUser,
} from './mockData';

// All API calls now use /backend/api prefix (handled by next.config.ts proxy)

/**
 * Helper function to make API calls with consistent error handling
 * @param endpoint - API endpoint (e.g., '/auth/login')
 * @param body - Request body object
 * @returns Promise with parsed JSON response
 */
async function apiCall<T>(endpoint: string, body: object): Promise<T> {
    const response = await fetch(`/backend/api${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const error: AuthError = await response.json();
        throw error;
    }

    return await response.json();
}

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
        // Mock mode for testing UI without backend
        if (process.env.NEXT_PUBLIC_MOCK_API === 'true') {
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

            const user = validateMockLogin(email, password);

            if (user) {
                const mockToken = 'mock-jwt-token-' + Date.now();
                authService.saveToken(mockToken);

                return {
                    accessToken: mockToken,
                    tokenType: 'Bearer',
                    user: user,
                    message: 'Login successful!'
                };
            } else {
                // User not found OR wrong password
                // BR-L11: Generic error message for security
                throw {
                    status: 401,
                    message: 'Email or password is incorrect',
                };
            }
        }

        // gọi API mất thời gian, nên dùng promise kiểu dữ liệu là LoginResponse
        try {
            // sử dụng helper function apiCall để gọi API
            const data = await apiCall<LoginResponse>('/auth/login', { email, password, rememberMe } as LoginRequest);
            if (!data.user.status || data.user.status !== 'ACTIVE') {
                throw {
                    status: 401,
                    message: 'Please verify your email',
                }
            }
            // Save token if login successful
            if (data.accessToken) {
                authService.saveToken(data.accessToken); // nếu có token thì lưu vào localStorage
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Register new user
     * Per Official API: POST /api/auth/register
     * @param email - User email
     * @param password - User password (6-20 chars)
     * @param phone - User phone (required, 10 digits starting with 0)
     * @param cccd - User CCCD (12 characters)
     * @returns Promise with register response (no token, fullName will be null)
     */
    register: async (email: string, password: string, phone: string, cccd: string): Promise<RegisterResponse> => {
        // Mock mode for testing UI without backend
        if (process.env.NEXT_PUBLIC_MOCK_API === 'true') {
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

            // Check for duplicate email
            if (mockEmailExists(email)) {
                throw {
                    status: 409,
                    message: 'Email already exists',
                };
            }

            // Check for duplicate phone
            if (mockPhoneExists(phone)) {
                throw {
                    status: 409,
                    message: 'Phone number already exists',
                };
            }

            // Register new user and generate OTP
            // Default role is BUYER per user requirement
            const user = registerMockUser(email, password, phone, cccd, 'BUYER');

            return {
                message: 'Registration successful! Please check your email for OTP.',
                user: user
            };
        }

        try {
            const data = await apiCall<RegisterResponse>('/auth/register', {
                email,
                password,
                phone,
                cccd,
                role: 'BUYER'  // Default role per user requirement
            } as RegisterRequest);

            // ❌ DO NOT save token - register doesn't return token
            // ❌ DO NOT auto-login
            // ✅ Just return data for redirect to verify email

            return data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Verify OTP for email verification
     * BR-12: Email verification using OTP
     * BR-14: Verify thành công → BE set is_verified = TRUE
     * @param email - User email
     * @param otp - 6-digit OTP code
     * @returns Promise with verification response (no token)
     */
    verifyOtp: async (email: string, otp: string): Promise<VerifyOtpResponse> => {
        // Mock mode for testing UI without backend
        if (process.env.NEXT_PUBLIC_MOCK_API === 'true') {
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

            try {
                // Verify OTP using mock data system
                // verifyMockOtp throws errors for locked (423) and expired (400)
                if (verifyMockOtp(email, otp)) {
                    // Mark user as verified
                    verifyMockUserEmail(email);

                    // Get updated user object
                    const user = getMockUser(email);
                    if (!user) {
                        throw {
                            status: 404,
                            message: 'User not found',
                        };
                    }

                    return {
                        message: 'Email verified successfully!',
                        user: user,
                    };
                } else {
                    // Invalid OTP
                    throw {
                        status: 400,
                        message: 'Invalid OTP',
                    };
                }
            } catch (err: any) {
                // Re-throw errors from verifyMockOtp (423 locked, 400 expired)
                throw err;
            }
        }

        try {
            const data = await apiCall<VerifyOtpResponse>('/auth/verify-otp', { email, otp } as VerifyOtpRequest);

            // ❌ DO NOT save token - verification doesn't return token
            // ❌ DO NOT auto-login
            // ✅ User must login after verification (BR-14)

            return data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Send OTP for email verification
     * Official API: POST /api/auth/send-otp
     * @param email - User email
     * @returns Promise with send response
     */
    sendOtp: async (email: string): Promise<SendOtpResponse> => {
        // Mock mode for testing UI without backend
        if (process.env.NEXT_PUBLIC_MOCK_API === 'true') {
            await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network delay

            // Generate and store new OTP
            storeMockOtp(email);

            return {
                message: 'OTP has been resent to your email',
            };
        }

        try {
            const data = await apiCall<SendOtpResponse>('/auth/send-otp', { email } as SendOtpRequest);
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
            console.log(`Saving token to localStorage: ${token}`);
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
