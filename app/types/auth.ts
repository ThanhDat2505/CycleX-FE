// TypeScript types for authentication
// interface định nghĩa cấu trúc
export interface LoginRequest {
    email: string;
    password: string;
    rememberMe?: boolean; // optional
}

export interface LoginResponse {
    success: boolean;
    token: string;
    user: User;
    message?: string;
}

/**
 * User Interface
 * BR-03: Must include role, status, is_verified
 */
export interface User {
    id: string;
    email: string;
    name: string;
    role: 'BUYER' | 'SELLER' | 'ADMIN' | 'INSPECTOR' | 'SHIPPER'; // BR-03: Uppercase
    status: 'ACTIVE' | 'INACTIVE'; // BR-03: Required field
    is_verified: boolean; // BR-03: Required field (email verification status)
    avatar?: string;
}

export interface AuthError {
    status: number;
    message: string;
    errors?: Record<string, string[]>; // object và key là string, value là array string
}

export interface RegisterRequest {
    email: string;
    password: string;
    cccd: string;
    phone?: string; // optional
}

/**
 * RegisterResponse Interface
 * BR-08: Register API does not return token
 * BR-08: Must include user object with role, status, is_verified
 */
export interface RegisterResponse {
    success: boolean; // Added for consistency
    message: string;
    user: User; // User object includes role, status, is_verified
    // ❌ No token - register doesn't return token (BR-08)
}

export interface ForgotPasswordRequest {
    email: string;
}

/**
 * OTP Verification Interfaces (BR-12, BR-13, BR-14)
 */
export interface VerifyOtpRequest {
    email: string;
    otp: string; // 6-digit OTP code
}

export interface VerifyOtpResponse {
    success: boolean;
    message: string;
    // BR-14: Verify thành công → BE set is_verified = TRUE
    // User vẫn chưa login, không có token
}

export interface ResendOtpRequest {
    email: string;
}

export interface ResendOtpResponse {
    success: boolean;
    message: string;
    expiresIn?: number; // OTP expiration time in seconds (optional)
}

/**
 * 1. LoginRequest Interface
 * - User nhập email, password
 * - Tạo object LoginRequest
 * - Gửi lên backend qua authService.login()
 * 
 * 2. LoginResponse Interface
 * - Server trả về LoginResponse
 * - Parse JSON thành LoginResponse
 * - Lưu token vào localStorage
 * - Return LoginResponse
 * 
 * 3. User Interface
 - Backend trả về user info
 - Lưu vào state/context
 - Hiển thị tên, avatar
 - Kiểm tra role để phân quyền
 * 
 * 4. AuthError Interface
 * - Login thất bại
 * - Backend trả về AuthError
 * - Frontend parse error
 * - Hiển thị message cho user
 * 
 * 5. RegisterRequest Interface
 * - User điền form register
 * - Tạo RegisterRequest object
 * - Gửi lên backend
 * - Backend tạo account mới
 * 
 * 6. ForgotPasswordRequest Interface
 * - User nhập email
 * - Gửi ForgotPasswordRequest
 * - Backend gửi email reset link
 * - User click link để reset password
 */
