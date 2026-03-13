/* eslint-disable @typescript-eslint/no-explicit-any */

import {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
    VerifyOtpRequest,
    VerifyOtpResponse,
    SendOtpRequest,
    SendOtpResponse,
    User,
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
} from '../mocks';
import { apiCallPOST } from '@/app/utils/apiHelpers';
import {
    validateResponse,
    validateString,
    validateUser
} from '../utils/apiValidation';

// All API calls now use /backend/api prefix (handled by next.config.ts proxy)

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
        // Mock mode for testing UI without backend
        if (process.env.NEXT_PUBLIC_MOCK_API === 'true') {
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

            const user = validateMockLogin(email, password);

            if (user) {
                const mockToken = 'mock-jwt-token-' + Date.now();
                authService.saveToken(mockToken);
                authService.saveUser(user); // Save user data for role check

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

        try {
            // sử dụng helper function apiCallPOST từ apiHelpers để gọi API
            const data = await apiCallPOST<LoginResponse>('/auth/login', { email, password, rememberMe } as LoginRequest);

            // ✅ VALIDATION: Strict check of login response
            validateResponse(data, 'login response');
            validateString(data.accessToken, 'accessToken');
            validateUser(data.user);

            if (!data.user.status || data.user.status !== 'ACTIVE') {
                throw {
                    status: 401,
                    message: 'Please verify your email',
                }
            }
            // Save token and user data if login successful
            if (data.accessToken) {
                authService.saveToken(data.accessToken, rememberMe); 
                authService.saveUser(data.user, rememberMe); 
            }

            return data;
        } catch (error: any) {
            console.error('Lỗi API Login:', error);

            if (error.response?.status === 401) {
                throw new Error('Email hoặc mật khẩu không chính xác.');
            } else if (error.response?.status === 403) {
                throw new Error('Tài khoản của bạn đã bị khóa hoặc chưa được kích hoạt.');
            }

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
     * @param role - User role (BUYER or SELLER)
     * @returns Promise with register response (no token, fullName will be null)
     */
    register: async (email: string, password: string, phone: string, cccd: string, role: 'BUYER' | 'SELLER' | 'ADMIN' | 'INSPECTOR' | 'SHIPPER'): Promise<RegisterResponse> => {
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
            // Use selected role (BUYER or SELLER)
            const user = registerMockUser(email, password, phone, cccd, role as any);

            return {
                message: 'Registration successful! Please check your email for OTP.',
                user: user
            };
        }

        try {
            const data = await apiCallPOST<RegisterResponse>('/auth/register', {
                email,
                password,
                phone,
                cccd,
                role
            } as RegisterRequest);

            // VALIDATION
            validateResponse(data, 'register response');
            validateString(data.message, 'message');
            validateUser(data.user);

            return data;
        } catch (error: any) {
            console.error('Lỗi API Register:', error);

            if (error.response?.status === 409) {
                throw new Error('Email hoặc số điện thoại này đã được đăng ký.');
            } else if (error.response?.status === 400) {
                throw new Error('Dữ liệu đăng ký không hợp lệ, vui lòng kiểm tra lại.');
            }

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
            const data = await apiCallPOST<VerifyOtpResponse>('/auth/verify-otp', { email, otp } as VerifyOtpRequest);

            // ✅ VALIDATION: Strict check of verification response
            validateResponse(data, 'verifyOtp response');
            validateString(data.message, 'message');
            validateUser(data.user);

            // ❌ DO NOT save token - verification doesn't return token
            // ❌ DO NOT auto-login
            // ✅ User must login after verification (BR-14)

            return data;
        } catch (error: any) {
            console.error('Lỗi API Verify OTP:', error);

            if (error.response?.status === 400) {
                throw new Error('Mã OTP không hợp lệ hoặc đã hết hạn.');
            } else if (error.response?.status === 404) {
                throw new Error('Tài khoản không tồn tại trên hệ thống.');
            } else if (error.response?.status === 423) {
                throw new Error('Tài khoản đã bị khoá do nhập sai quá nhiều lần.');
            }

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
            const data = await apiCallPOST<SendOtpResponse>('/auth/send-otp', { email } as SendOtpRequest);

            // ✅ VALIDATION: Strict check of sendOtp response
            validateResponse(data, 'sendOtp response');
            validateString(data.message, 'message');

            return data;
        } catch (error: any) {
            console.error('Lỗi API Send OTP:', error);

            if (error.response?.status === 404) {
                throw new Error('Không tìm thấy tài khoản để gửi OTP.');
            } else if (error.response?.status === 429) {
                throw new Error('Vui lòng đợi một lát trước khi yêu cầu mã OTP mới.');
            }

            throw error;
        }
    },

    /**
     * Save authentication token to localStorage
     * @param token - JWT token from backend
     */
    saveToken: (token: string, remember: boolean = true): void => {
        if (typeof window !== 'undefined') {
            if (remember) {
                localStorage.setItem('authToken', token);
            } else {
                sessionStorage.setItem('authToken', token);
            }
        }
    },

    /**
     * Save user data to localStorage
     * @param user - User object from login response
     */
    saveUser: (user: User, remember: boolean = true): void => {
        if (typeof window !== 'undefined') {
            const userData = JSON.stringify(user);
            if (remember) {
                localStorage.setItem('userData', userData);
            } else {
                sessionStorage.setItem('userData', userData);
            }
        }
    },

    /**
     * Get user data from localStorage
     * @returns User object or null
     */
    getUser: (): User | null => {
        if (typeof window !== 'undefined') {
            const userData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
            return userData ? JSON.parse(userData) : null;
        }
        return null;
    },

    /**
     * Get authentication token from localStorage or sessionStorage
     * @returns Token string or null
     */
    getToken: (): string | null => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        }
        return null;
    },

    /**
     * Remove authentication token and user data (logout)
     */
    logout: (): void => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            sessionStorage.removeItem('authToken');
            sessionStorage.removeItem('userData');
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

