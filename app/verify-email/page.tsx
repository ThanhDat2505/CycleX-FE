import {AuthLayout} from '@/app/components/layout';
import {VerifyEmailForm} from './VerifyEmailForm';
import {Suspense} from "react";

/**
 * Verify Email Page
 * BR-10: User must verify email after registration
 * BR-12: Email verification using OTP
 */
export default function VerifyEmailPage() {
    return (
        <AuthLayout title="Verify Your Email">
            <Suspense fallback={<div>Đang xác thực...</div>}>
                <VerifyEmailForm/>
            </Suspense>
        </AuthLayout>
    );
}
