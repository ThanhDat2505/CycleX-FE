import { AuthLayout } from '@/app/components/layout';
import { VerifyEmailForm } from './VerifyEmailForm';

/**
 * Verify Email Page
 * BR-10: User must verify email after registration
 * BR-12: Email verification using OTP
 */
export default function VerifyEmailPage() {
    return (
        <AuthLayout title="Verify Your Email">
            <VerifyEmailForm />
        </AuthLayout>
    );
}
