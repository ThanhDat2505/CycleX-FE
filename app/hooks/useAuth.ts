/* eslint-disable react-hooks/set-state-in-effect */

/**
 * useAuth Hook
 * Centralized authentication logic for consistent auth handling across components
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User } from '@/app/types/auth';
import { authService } from '@/app/services/authService';

interface AuthState {
    isLoggedIn: boolean;
    isLoading: boolean;
    user: User | null;
    role: string | null;
}

interface UseAuthReturn extends AuthState {
    logout: () => void;
    requireAuth: (returnUrl?: string) => boolean;
}

export const useAuth = (): UseAuthReturn => {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<string | null>(null);
    useEffect(() => {
        const userData = authService.getUser();
        const token = authService.getToken();

        if (token && userData) {
            setUser(userData);
            setRole(userData.role);
            setIsLoggedIn(true);
        } else {
            // No auth data - reset state
            setUser(null);
            setRole(null);
            setIsLoggedIn(false);
        }

        setIsLoading(false);
    }, [pathname]);

    const logout = () => {
        authService.logout();
        setUser(null);
        setRole(null);
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
        user,
        role,
        logout,
        requireAuth,
    };
};

