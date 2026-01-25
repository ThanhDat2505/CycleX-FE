import { AuthCard } from '@/app/components/layout';
import RegisterForm from './RegisterForm';

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-[#1A2332]">
            <AuthCard title="Create Account">
                <RegisterForm />
            </AuthCard>
        </div>
    );
}
