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
        fullName: 'Test User',
        phone: '0123456789',
        password: 'password123',
        role: 'USER',
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
        fullName: 'Buyer User',
        phone: '0987654321',
        password: 'buyer123',
        role: 'USER',
        isVerify: true,
        status: 'ACTIVE',
        cccd: '001234567891',
        avatarUrl: null,
        createdAt: '2026-01-25T16:38:24.814248',
        updatedAt: '2026-01-25T16:38:24.814248',
        lastLogin: null,
    },
    'seller@example.com': {
        userId: 3,
        email: 'seller@example.com',
        fullName: 'Seller User',
        phone: '0999888777',
        password: 'seller123',
        role: 'ADMIN',
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
        fullName: 'Unverified User',
        phone: '0888777666',
        password: 'unverified123',
        role: 'USER',
        isVerify: false, // Not verified yet
        status: 'ACTIVE',
        cccd: '001234567893',
        avatarUrl: null,
        createdAt: '2026-01-25T16:38:24.814248',
        updatedAt: '2026-01-25T16:38:24.814248',
        lastLogin: null,
    },
    'suspended@example.com': {
        userId: 5,
        email: 'suspended@example.com',
        fullName: 'Suspended User',
        phone: '0777666555',
        password: 'suspended123',
        role: 'USER',
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
        fullName: 'Inactive User',
        phone: '0666555444',
        password: 'inactive123',
        role: 'USER',
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
    const existingPhones = ['0123456789', '0987654321'];
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
 */
export const storeMockOtp = (email: string): string => {
    const otp = generateMockOtp();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes from now

    mockOtpStorage[email] = { otp, expiresAt };

    // Log to console for testing (in real app, this would be sent via email)
    console.log('📧 Mock OTP for', email, ':', otp);
    console.log('⏰ Expires at:', new Date(expiresAt).toLocaleTimeString());

    return otp;
};

/**
 * Verify OTP for email
 */
export const verifyMockOtp = (email: string, otp: string): boolean => {
    const stored = mockOtpStorage[email];

    if (!stored) {
        return false; // No OTP found
    }

    if (Date.now() > stored.expiresAt) {
        delete mockOtpStorage[email]; // Clean up expired OTP
        return false; // OTP expired
    }

    return stored.otp === otp;
};

/**
 * Register new mock user
 * Per API Document: all fields required
 */
export const registerMockUser = (
    email: string,
    password: string,
    phone: string,      // Required per API doc
    cccd: string,
    fullName: string    // Required per API doc
): User => {
    const newUser: User & { password: string } = {
        userId: Date.now(), // Use timestamp as number ID
        email: email,
        fullName: fullName,  // Use provided fullName
        phone: phone,        // Required
        password: password,
        role: 'USER',
        isVerify: false, // Needs email verification
        status: 'ACTIVE',
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
 */
export const verifyMockUserEmail = (email: string): void => {
    if (mockUsers[email]) {
        mockUsers[email].isVerify = true; // Use correct field name from API
        delete mockOtpStorage[email]; // Clean up OTP
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
