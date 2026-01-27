import { Suspense } from 'react';
import { AuthLayout } from '@/app/components/layout';
import { LoginForm } from './LoginForm';

export default function LoginPage() {
    return (
        <AuthLayout title="Login">
            <Suspense fallback={<div className="text-center py-4">Loading...</div>}>
                <LoginForm />
            </Suspense>
        </AuthLayout>
    );
}
