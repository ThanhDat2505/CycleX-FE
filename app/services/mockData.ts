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
 * Updated to match merged User interface (fe/login + fe/register)
 */
export const mockUsers: Record<string, User & { password: string }> = {
    'test@example.com': {
        userId: 'mock-user-1',
        email: 'test@example.com',
        fullName: 'Test User',
        phone: '0123456789',
        password: 'password123',
        role: 'buyer',
        status: 'ACTIVE',
        is_verified: true,
    },
    'buyer@example.com': {
        userId: 'mock-user-2',
        email: 'buyer@example.com',
        fullName: 'Buyer User',
        phone: '0987654321',
        password: 'buyer123',
        role: 'buyer',
        status: 'ACTIVE',
        is_verified: true,
    },
    'seller@example.com': {
        userId: 'mock-user-3',
        email: 'seller@example.com',
        fullName: 'Seller User',
        phone: '0999888777',
        password: 'seller123',
        role: 'seller',
        status: 'ACTIVE',
        is_verified: true,
    },
    'unverified@example.com': {
        userId: 'mock-user-4',
        email: 'unverified@example.com',
        fullName: 'Unverified User',
        phone: '0888777666',
        password: 'unverified123',
        role: 'buyer',
        status: 'ACTIVE',
        is_verified: false, // Not verified yet
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
 */
export const registerMockUser = (email: string, password: string, cccd: string, phone?: string): User => {
    const newUser: User & { password: string } = {
        userId: 'mock-user-' + Date.now(),
        email: email,
        fullName: email.split('@')[0],
        phone: phone || '',
        password: password,
        role: 'buyer',
        status: 'ACTIVE',
        is_verified: false, // Needs email verification
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
        mockUsers[email].is_verified = true;
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
 */
export const validateMockLogin = (email: string, password: string): User | null => {
    const user = mockUsers[email];

    if (!user) return null; // User not found
    if (user.password !== password) return null; // Wrong password
    if (!user.is_verified) return null; // Not verified

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
};
