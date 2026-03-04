import { AuthCard } from './AuthCard';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
}

/** Style constants */
const STYLES = {
    wrapper: 'min-h-screen flex items-center justify-center px-4 bg-brand-bg',
} as const;

/**
 * AuthLayout - Reusable layout for authentication pages
 * Provides consistent background, centering, and AuthCard wrapper
 */
export function AuthLayout({ children, title }: AuthLayoutProps) {
    return (
        <div className={STYLES.wrapper}>
            <AuthCard title={title}>
                {children}
            </AuthCard>
        </div>
    );
}
