/* eslint-disable react-hooks/set-state-in-effect */

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/app/types/auth';
import { authService } from '@/app/services/authService';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUserState] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Load user from localStorage on mount
    useEffect(() => {
        const token = authService.getToken();
        if (token) {
            const storedUser = authService.getUser();
            if (storedUser) {
                // Check if user is suspended/banned
                if (storedUser.status === 'SUSPENDED') {
                    authService.logout();
                    setUserState(null);
                    setIsAuthenticated(false);
                    return;
                }
                setUserState(storedUser);
            }
            setIsAuthenticated(true);
        }
    }, []);

    const setUser = (newUser: User | null) => {
        // Block suspended users
        if (newUser && newUser.status === 'SUSPENDED') {
            authService.logout();
            setUserState(null);
            setIsAuthenticated(false);
            return;
        }
        setUserState(newUser);
        setIsAuthenticated(!!newUser);
    };

    const logout = () => {
        authService.logout();
        setUserState(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

