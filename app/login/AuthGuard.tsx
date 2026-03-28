'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/app/services/authService';

interface AuthGuardProps {
    children: React.ReactNode;
}

/**
 * AuthGuard Component
 * Redirects authenticated users away from guest-only pages (Login, Register)
 * BR-01: Only Guest can access Login/Register
 */
export function AuthGuard({ children }: AuthGuardProps) {
    const router = useRouter();

    useEffect(() => {
        if (authService.isAuthenticated()) {
            const user = authService.getUser();
            if (user?.role === 'ADMIN') {
                router.push('/admin/dashboard');
            } else {
                router.push('/');
            }
        }
    }, [router]);

    return <>{children}</>;
}
