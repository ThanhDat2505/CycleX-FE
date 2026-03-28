/* eslint-disable @typescript-eslint/no-explicit-any */

import { AuthError } from '@/app/types/auth';

/**
 * Handle authentication errors and return user-friendly messages
 * Centralized error handling to avoid duplication across forms
 */
export const handleAuthError = (err: any): string => {
    // Handle null/undefined errors
    if (!err) {
        return 'Đã có lỗi xảy ra. Vui lòng thử lại.';
    }

    // Handle AuthError type with status codes
    if (err.status) {
        switch (err.status) {
            case 400:
                // Bad request - could be validation or duplicate email
                return err.message || 'Yêu cầu không hợp lệ';

            case 401:

                return err.message;

            case 403:
                // Forbidden - could be not verified, suspended, or inactive
                if (err.message?.toLowerCase().includes('not verified') ||
                    err.message?.toLowerCase().includes('verify')) {
                    return 'Vui lòng xác minh email trước khi đăng nhập';
                }
                if (err.message?.toLowerCase().includes('suspended')) {
                    return 'Tài khoản của bạn đã bị đình chỉ. Vui lòng liên hệ Admin.';
                }
                if (err.message?.toLowerCase().includes('inactive')) {
                    return 'Tài khoản chưa kích hoạt. Vui lòng xác minh email.';
                }
                return err.message || 'Tài khoản của bạn đã bị khóa';

            case 404:
                // Not found - account doesn't exist
                return 'Không tìm thấy tài khoản';

            case 409:
                // Conflict - duplicate email
                return 'Email đã được sử dụng';

            case 422:
                // Validation errors from backend
                if (err.errors?.email) {
                    return err.errors.email[0];
                }
                if (err.errors?.password) {
                    return err.errors.password[0];
                }
                if (err.errors?.cccd) {
                    return err.errors.cccd[0];
                }
                if (err.errors?.phone) {
                    return err.errors.phone[0];
                }
                return 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.';

            case 500:
                // Server error
                return 'Lỗi máy chủ. Vui lòng thử lại sau.';

            case 503:
                // Service unavailable
                return 'Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau.';

            default:
                // Other status codes
                return err.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
        }
    }

    // Handle validation errors object (from backend)
    if (err.errors) {
        // Get first error message
        const firstError = Object.values(err.errors)[0];
        if (Array.isArray(firstError) && firstError.length > 0) {
            return firstError[0];
        }
    }

    // Handle network errors
    if (err.message === 'Failed to fetch') {
        return 'Lỗi mạng. Vui lòng kiểm tra kết nối internet.';
    }

    // Handle timeout errors
    if (err.name === 'AbortError' || err.message?.includes('timeout')) {
        return 'Hết thời gian chờ. Vui lòng thử lại.';
    }

    // Default fallback
    return err.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
};

