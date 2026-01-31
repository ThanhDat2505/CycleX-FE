/**
 * Mock Data for Testing UI without Backend
 * 
 * This file contains mock data and helper functions for simulating
 * backend responses when NEXT_PUBLIC_MOCK_API=true
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
        fullName: null,  // API returns null for fullName
        phone: '+84123456789',
        password: 'password123',
        role: 'BUYER',
        isVerify: true,
        status: 'ACTIVE',  // API returns null for status initially
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
        status: 'ACTIVE',  // ✅ ACTIVE status for seller testing
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
        isVerify: false, // Not verified yet
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
        status: 'SUSPENDED', // Account suspended
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
        status: 'INACTIVE', // Account inactive
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
    // In real app, check against database
    // For mock, just simulate some existing phones
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
    const expiresAt = Date.now() + 2 * 60 * 1000; // 2 minutes from now

    mockOtpStorage[email] = { otp, expiresAt };

    // Reset attempt counter when new OTP is generated
    mockOtpAttempts[email] = 0;

    // Log to console for testing (in real app, this would be sent via email)
    console.log('📧 Mock OTP for', email, ':', otp);
    console.log('⏰ Expires at:', new Date(expiresAt).toLocaleTimeString());

    return otp;
};

/**
 * Verify OTP for email
 * Official API behavior:
 * - Returns 423 if locked (3+ failed attempts)
 * - Returns 400 "OTP expired" if past expiresAt
 * - Returns 400 "Invalid OTP" if code doesn't match
 * - Increments attempt counter on failure
 * - Resets attempt counter on success
 */
export const verifyMockOtp = (email: string, otp: string): boolean => {
    const stored = mockOtpStorage[email];

    if (!stored) {
        return false; // No OTP found (400 error handled in service)
    }

    // Check if OTP is locked (3+ failed attempts)
    const attempts = mockOtpAttempts[email] || 0;
    if (attempts >= 3) {
        throw {
            status: 423,
            message: 'OTP is locked. Please request a new OTP.',
        };
    }

    // Check if OTP expired
    if (Date.now() > stored.expiresAt) {
        delete mockOtpStorage[email]; // Clean up expired OTP
        throw {
            status: 400,
            message: 'OTP expired. Please request a new OTP.',
        };
    }

    // Check if OTP matches
    if (stored.otp === otp) {
        // Success: reset attempts and clean up
        delete mockOtpAttempts[email];
        delete mockOtpStorage[email];
        return true;
    } else {
        // Failed: increment attempts
        mockOtpAttempts[email] = attempts + 1;

        if (mockOtpAttempts[email] >= 3) {
            console.log(`🔒 OTP locked for ${email} after 3 failed attempts`);
        } else {
            console.log(`❌ Invalid OTP for ${email}. Attempt ${mockOtpAttempts[email]}/3`);
        }

        return false;
    }
};

/**
 * Register new mock user
 * Per Official API: all fields required, role defaults to BUYER
 */
export const registerMockUser = (
    email: string,
    password: string,
    phone: string,      // Required per API doc
    cccd: string,       // 12 characters
    role: 'BUYER' | 'SELLER' | 'ADMIN' | 'INSPECTOR' | 'SHIPPER'  // Role from official API
): User => {
    const newUser: User & { password: string } = {
        userId: Date.now(), // Use timestamp as number ID
        email: email,
        fullName: null,      // API returns null per official spec
        phone: phone,        // Required
        password: password,
        role: role,          // Use provided role
        isVerify: false,     // Needs email verification
        status: null,        // API returns null per official spec
        cccd: cccd,
        avatarUrl: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLogin: null,
    };

    mockUsers[email] = newUser;

    // Generate and store OTP
    storeMockOtp(email);

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
};

/**
 * Verify user email
 * Called after successful OTP verification
 */
export const verifyMockUserEmail = (email: string): void => {
    if (mockUsers[email]) {
        mockUsers[email].isVerify = true; // Use correct field name from API
        // Cleanup is done in verifyMockOtp after successful verification
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
 * IMPORTANT: Only validates email/password
 * Does NOT check isVerify or status - let LoginForm handle that!
 */
export const validateMockLogin = (email: string, password: string): User | null => {
    const user = mockUsers[email];

    if (!user) return null; // User not found
    if (user.password !== password) return null; // Wrong password

    // Return user object regardless of isVerify/status
    // LoginForm will handle business logic (BR-L05, BR-L06, BR-L07)
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
};
