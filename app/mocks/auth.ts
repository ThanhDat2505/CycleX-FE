/**
 * Mock Data - Authentication
 * Mock users, OTP storage, and auth helper functions
 * Used when NEXT_PUBLIC_MOCK_API=true
 */

import { User } from '@/app/types/auth';

/**
 * Mock Users Database
 * Simulates registered users in the system
 * Updated to match ACTUAL API response format
 */
export const mockUsers: Record<string, User & { password: string }> = {
    'test@example.com': {
        userId: 1,
        email: 'test@example.com',
        fullName: null,
        phone: '+84123456789',
        password: 'password123',
        role: 'BUYER',
        isVerify: true,
        status: 'ACTIVE',
        cccd: '001234567890',
        avatarUrl: null,
        createdAt: '2026-01-25T16:38:24.814248',
        updatedAt: '2026-01-25T16:38:24.814248',
        lastLogin: null,
    },
    'buyer@example.com': {
        userId: 2,
        email: 'buyer@example.com',
        fullName: null,
        phone: '+84987654321',
        password: 'buyer123',
        role: 'BUYER',
        isVerify: true,
        status: null,
        cccd: '001234567891',
        avatarUrl: null,
        createdAt: '2026-01-25T16:38:24.814248',
        updatedAt: '2026-01-25T16:38:24.814248',
        lastLogin: null,
    },
    'seller@example.com': {
        userId: 3,
        email: 'seller@example.com',
        fullName: null,
        phone: '+84999888777',
        password: 'seller123',
        role: 'SELLER',
        isVerify: true,
        status: 'ACTIVE',
        cccd: '001234567892',
        avatarUrl: null,
        createdAt: '2026-01-25T16:38:24.814248',
        updatedAt: '2026-01-25T16:38:24.814248',
        lastLogin: null,
    },
    'unverified@example.com': {
        userId: 4,
        email: 'unverified@example.com',
        fullName: null,
        phone: '+84888777666',
        password: 'unverified123',
        role: 'BUYER',
        isVerify: false,
        status: null,
        cccd: '001234567893',
        avatarUrl: null,
        createdAt: '2026-01-25T16:38:24.814248',
        updatedAt: '2026-01-25T16:38:24.814248',
        lastLogin: null,
    },
    'suspended@example.com': {
        userId: 5,
        email: 'suspended@example.com',
        fullName: null,
        phone: '+84777666555',
        password: 'suspended123',
        role: 'BUYER',
        isVerify: true,
        status: 'SUSPENDED',
        cccd: '001234567894',
        avatarUrl: null,
        createdAt: '2026-01-25T16:38:24.814248',
        updatedAt: '2026-01-25T16:38:24.814248',
        lastLogin: null,
    },
    'inactive@example.com': {
        userId: 6,
        email: 'inactive@example.com',
        fullName: null,
        phone: '+84666555444',
        password: 'inactive123',
        role: 'BUYER',
        isVerify: false,
        status: 'INACTIVE',
        cccd: '001234567895',
        avatarUrl: null,
        createdAt: '2026-01-25T16:38:24.814248',
        updatedAt: '2026-01-25T16:38:24.814248',
        lastLogin: null,
    },
};

/**
 * Mock OTP Storage
 * Stores OTP codes for email verification
 */
export const mockOtpStorage: Record<string, { otp: string; expiresAt: number }> = {};

/**
 * Mock OTP Attempt Tracking
 * Tracks failed OTP verification attempts
 * After 3 failed attempts, OTP is locked (423 error)
 */
export const mockOtpAttempts: Record<string, number> = {};

/**
 * Check if email exists in mock database
 */
export const mockEmailExists = (email: string): boolean => {
    return email in mockUsers;
};

/**
 * Check if phone exists in mock database
 */
export const mockPhoneExists = (phone: string): boolean => {
    const existingPhones = ['+84123456789', '+84987654321'];
    return existingPhones.includes(phone);
};

/**
 * Generate mock OTP code
 */
export const generateMockOtp = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Store OTP for email
 * Also resets attempt counter when new OTP is generated
 */
export const storeMockOtp = (email: string): string => {
    const otp = generateMockOtp();
    const expiresAt = Date.now() + 2 * 60 * 1000; // 2 minutes

    mockOtpStorage[email] = { otp, expiresAt };
    mockOtpAttempts[email] = 0;

    console.log('📧 Mock OTP for', email, ':', otp);
    console.log('⏰ Expires at:', new Date(expiresAt).toLocaleTimeString());

    return otp;
};

/**
 * Verify OTP for email
 * Returns 423 if locked, 400 if expired/invalid
 */
export const verifyMockOtp = (email: string, otp: string): boolean => {
    const stored = mockOtpStorage[email];

    if (!stored) {
        return false;
    }

    const attempts = mockOtpAttempts[email] || 0;
    if (attempts >= 3) {
        throw {
            status: 423,
            message: 'OTP is locked. Please request a new OTP.',
        };
    }

    if (Date.now() > stored.expiresAt) {
        delete mockOtpStorage[email];
        throw {
            status: 400,
            message: 'OTP expired. Please request a new OTP.',
        };
    }

    if (stored.otp === otp) {
        delete mockOtpAttempts[email];
        delete mockOtpStorage[email];
        return true;
    } else {
        mockOtpAttempts[email] = attempts + 1;
        if (mockOtpAttempts[email] >= 3) {
            console.log(`🔒 OTP locked for ${email} after 3 failed attempts`);
        }
        return false;
    }
};

/**
 * Register new mock user
 */
export const registerMockUser = (
    email: string,
    password: string,
    phone: string,
    cccd: string,
    role: 'BUYER' | 'SELLER' | 'ADMIN' | 'INSPECTOR' | 'SHIPPER'
): User => {
    const newUser: User & { password: string } = {
        userId: Date.now(),
        email: email,
        fullName: null,
        phone: phone,
        password: password,
        role: role,
        isVerify: false,
        status: null,
        cccd: cccd,
        avatarUrl: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLogin: null,
    };

    mockUsers[email] = newUser;
    storeMockOtp(email);

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
};

/**
 * Verify user email after OTP success
 */
export const verifyMockUserEmail = (email: string): void => {
    if (mockUsers[email]) {
        mockUsers[email].isVerify = true;
    }
};

/**
 * Get mock user by email
 */
export const getMockUser = (email: string): User | null => {
    const user = mockUsers[email];
    if (!user) return null;

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

/**
 * Validate mock login credentials
 * Only checks email/password, NOT status/isVerify
 */
export const validateMockLogin = (email: string, password: string): User | null => {
    const user = mockUsers[email];

    if (!user) return null;
    if (user.password !== password) return null;

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
};
