import { AuthLayout } from '@/app/components/layout';
import { LoginForm } from './LoginForm';

export default function LoginPage() {
    return (
        <AuthLayout title="Login">
            <LoginForm />
        </AuthLayout>
    );
}