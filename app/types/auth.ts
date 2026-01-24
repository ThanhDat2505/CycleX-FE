// TypeScript types for authentication

export interface LoginRequest {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface LoginResponse {
    success: boolean;
    token: string;
    user: User;
    message?: string;
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'buyer' | 'seller' | 'admin';
    avatar?: string;
}

export interface AuthError {
    status: number;
    message: string;
    errors?: Record<string, string[]>;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface ForgotPasswordRequest {
    email: string;
}
