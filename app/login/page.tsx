import { AuthCard } from '@/app/components/layout/AuthCard';
import { LoginForm } from './LoginForm';

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-[#1A2332]">
            <AuthCard title="Đăng nhập">
                <LoginForm />
            </AuthCard>
        </div>
    );
}