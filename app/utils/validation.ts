/**
 * Validation utilities for forms
 * Shared validation functions to avoid code duplication
 */

/**
 * Validate email format
 * @param email - Email string to validate
 * @returns true if valid email format, false otherwise
 */
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate password for Login (minimum 6 characters)
 * @param password - Password string to validate
 * @returns true if password is at least 6 characters, false otherwise
 */
export const validatePasswordLogin = (password: string): boolean => {
    return password.length >= 6;
};

/**
 * Validate password for Register (8-20 characters)
 * @param password - Password string to validate
 * @returns true if password is 8-20 characters, false otherwise
 */
export const validatePasswordRegister = (password: string): boolean => {
    return password.length >= 8 && password.length <= 20;
};

/**
 * Validate CCCD (12 digits)
 * @param cccd - CCCD string to validate
 * @returns true if CCCD is exactly 12 digits, false otherwise
 */
export const validateCccd = (cccd: string): boolean => {
    const cccdRegex = /^\d{12}$/;
    return cccdRegex.test(cccd);
};

/**
 * Validate phone number (10 digits, starts with 0)
 * @param phone - Phone string to validate
 * @returns true if phone is valid or empty (optional field), false otherwise
 */
export const validatePhone = (phone: string): boolean => {
    if (!phone) return true; // Optional field
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(phone);
};

/**
 * Validate OTP (6 digits)
 * BR-12: OTP verification for email
 * @param otp - OTP string to validate
 * @returns true if OTP is exactly 6 digits, false otherwise
 */
export const validateOtp = (otp: string): boolean => {
    const otpRegex = /^\d{6}$/;
    return otpRegex.test(otp);
};
