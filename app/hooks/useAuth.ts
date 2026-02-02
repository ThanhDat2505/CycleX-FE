/**
 * useAuth Hook
 * Centralized authentication logic for consistent auth handling across components
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/app/types/auth';

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
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<string | null>(null);
    useEffect(() => {
        console.log("hi");
        const userData = localStorage.getItem('userData')
        console.log(userData);
        // Check for auth token and user data on mount
        const token = localStorage.getItem('authToken');

        if (token && userData) {
            const parsedUser: User = JSON.parse(userData);
            setUser(parsedUser);
            setRole(parsedUser.role);
            setIsLoggedIn(true);
        }

        setIsLoading(false);
    }, []);

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
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
