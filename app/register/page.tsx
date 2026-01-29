'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '@/app/components/layout';
import { RegisterForm } from './RegisterForm';
import { authService } from '@/app/services/authService';

/**
 * Register Page
 * BR-01: Only Guest can access Register page
 * User đã login không được truy cập S-03
 */
export default function RegisterPage() {
    const router = useRouter();

    useEffect(() => {
        // BR-01: Check if user is already authenticated
        if (authService.isAuthenticated()) {
            router.push('/'); // Redirect to home if already logged in
        }
    }, [router]);

    return (
        <AuthLayout title="Create Account">
            <RegisterForm />
        </AuthLayout>
    );
}
