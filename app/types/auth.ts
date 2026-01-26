// TypeScript types for authentication
// interface định nghĩa cấu trúc
export interface LoginRequest {
    email: string;
    password: string;
    rememberMe?: boolean; // optional
}

export interface LoginResponse {
    accessToken: string;
    tokenType: string;
    user: User;
    message?: string;
}

/**
 * User Interface
 * Updated to match ACTUAL API response from backend
 * API Document: /backend/api/auth/login
 */
export interface User {
    userId: number;                    // ⚠️ API returns number, not string
    email: string;
    fullName: string;
    phone: string;
    role: 'USER' | 'ADMIN' | 'INSPECTOR' | 'SHIPPER';  // ⚠️ API uses uppercase 'USER', not 'buyer'
    isVerify: boolean;                 // ⚠️ API uses 'isVerify', not 'is_verified'
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';  // ⚠️ BR-L04: Support all statuses
    cccd: string;                      // ⚠️ CCCD field from API
    avatarUrl: string | null;          // ⚠️ Can be null
    createdAt: string;                 // ⚠️ ISO string, not Date object
    updatedAt: string;                 // ⚠️ ISO string, not Date object
    lastLogin: string | null;          // ⚠️ ISO string or null
}

export interface AuthError {
    status: number;
    message: string;
    errors?: Record<string, string[]>; // object và key là string, value là array string
}

export interface RegisterRequest {
    email: string;
    password: string;
    phone: string;        // Required per API doc
    cccd: string;
    fullName: string;     // New field per API doc
}

/**
 * RegisterResponse Interface
 * Per API Document: /api/auth/register
 * Response contains message and user object only
 */
export interface RegisterResponse {
    message: string;      // "Registration successful"
    user: User;           // User object with all fields
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
