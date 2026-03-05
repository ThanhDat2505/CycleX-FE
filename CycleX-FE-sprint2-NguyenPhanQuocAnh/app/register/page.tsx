'use client';

import { AuthLayout } from '@/app/components/layout';
import { RegisterForm } from './RegisterForm';
import { AuthGuard } from '@/app/login/AuthGuard';

/**
 * Register Page
 * BR-01: Only Guest can access Register page
 */
export default function RegisterPage() {
    return (
        <AuthGuard>
            <AuthLayout title="Create Account">
                <RegisterForm />
            </AuthLayout>
        </AuthGuard>
    );
}
