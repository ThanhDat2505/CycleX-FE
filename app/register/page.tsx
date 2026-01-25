import { AuthLayout } from '@/app/components/layout';
import { RegisterForm } from './RegisterForm';

export default function RegisterPage() {
    return (
        <AuthLayout title="Create Account">
            <RegisterForm />
        </AuthLayout>
    );
}
