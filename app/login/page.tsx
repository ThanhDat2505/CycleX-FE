import { Suspense } from 'react';
import { AuthLayout } from '@/app/components/layout';
import { LoginForm } from './LoginForm';
import { AuthGuard } from './AuthGuard';

/**
 * Login Page
 * BR-01: Only Guest can access Login page
 */
export default function LoginPage() {
    return (
        <AuthGuard>
            <AuthLayout title="Login">
                <Suspense fallback={<div className="text-center py-4">Loading...</div>}>
                    <LoginForm />
                </Suspense>
            </AuthLayout>
        </AuthGuard>
    );
}
