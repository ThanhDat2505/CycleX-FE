/**
 * useAuth Hook
 * Centralized authentication logic for consistent auth handling across components
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuthState {
    isLoggedIn: boolean;
    isLoading: boolean;
}

interface UseAuthReturn extends AuthState {
    logout: () => void;
    requireAuth: (returnUrl?: string) => boolean;
}

export const useAuth = (): UseAuthReturn => {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for auth token on mount
        const token = localStorage.getItem('authToken');
        setIsLoggedIn(!!token);
        setIsLoading(false);
    }, []);

    const logout = () => {
        localStorage.removeItem('authToken');
        setIsLoggedIn(false);
        router.push('/');
    };

    /**
     * Check if user is authenticated, redirect to login if not
     * @param returnUrl - URL to return to after login
     * @returns true if authenticated, false if redirected to login
     */
    const requireAuth = (returnUrl?: string): boolean => {
        if (!isLoggedIn) {
            const loginUrl = returnUrl
                ? `/login?returnUrl=${encodeURIComponent(returnUrl)}`
                : '/login';
            router.push(loginUrl);
            return false;
        }
        return true;
    };

    return {
        isLoggedIn,
        isLoading,
        logout,
        requireAuth,
    };
};
