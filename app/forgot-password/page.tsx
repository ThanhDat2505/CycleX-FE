import { Suspense } from 'react';
import { AuthLayout } from '@/app/components/layout';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { AuthGuard } from '@/app/login/AuthGuard';

/**
 * Forgot Password Page
 */
export default function ForgotPasswordPage() {
    return (
        <AuthGuard>
            <AuthLayout title="Quên mật khẩu">
                <Suspense fallback={<div className="text-center py-4">Đang tải...</div>}>
                    <ForgotPasswordForm />
                </Suspense>
            </AuthLayout>
        </AuthGuard>
    );
}
