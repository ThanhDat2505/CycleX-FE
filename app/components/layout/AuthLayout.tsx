import { AuthCard } from './AuthCard';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
}

/**
 * AuthLayout - Reusable layout for authentication pages
 * Provides consistent background, centering, and AuthCard wrapper
 */
export function AuthLayout({ children, title }: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-brand-bg">
            <AuthCard title={title}>
                {children}
            </AuthCard>
        </div>
    );
}
