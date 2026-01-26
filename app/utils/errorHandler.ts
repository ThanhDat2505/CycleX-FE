import { AuthError } from '@/app/types/auth';

/**
 * Handle authentication errors and return user-friendly messages
 * Centralized error handling to avoid duplication across forms
 */
export const handleAuthError = (err: any): string => {
    // Handle null/undefined errors
    if (!err) {
        return 'An error occurred. Please try again.';
    }

    // Handle AuthError type with status codes
    if (err.status) {
        switch (err.status) {
            case 400:
                // Bad request - could be validation or duplicate email
                return err.message || 'Invalid request';

            case 401:
                // Unauthorized - wrong credentials
                return 'Email or password is incorrect';

            case 403:
                // Forbidden - could be not verified, suspended, or inactive
                if (err.message?.toLowerCase().includes('not verified') ||
                    err.message?.toLowerCase().includes('verify')) {
                    return 'Please verify your email before logging in';
                }
                if (err.message?.toLowerCase().includes('suspended')) {
                    return 'Your account has been suspended. Please contact Admin or Inspector.';
                }
                if (err.message?.toLowerCase().includes('inactive')) {
                    return 'Your account is inactive. Please verify your email.';
                }
                return err.message || 'Your account has been locked';

            case 404:
                // Not found - account doesn't exist
                return 'Account not found';

            case 409:
                // Conflict - duplicate email
                return 'Email already exists';

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
                return 'Validation failed. Please check your input.';

            case 500:
                // Server error
                return 'Server error. Please try again later.';

            case 503:
                // Service unavailable
                return 'Service temporarily unavailable. Please try again later.';

            default:
                // Other status codes
                return err.message || 'An error occurred. Please try again.';
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
        return 'Network error. Please check your internet connection.';
    }

    // Handle timeout errors
    if (err.name === 'AbortError' || err.message?.includes('timeout')) {
        return 'Request timeout. Please try again.';
    }

    // Default fallback
    return err.message || 'An error occurred. Please try again.';
};
