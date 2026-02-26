import { ReactNode } from 'react';
import Link from 'next/link';
import { Logo } from '../ui/Logo';

interface AuthCardProps {
    title: string;
    children: ReactNode;
}

/** Style constants */
const STYLES = {
    card: 'bg-white/80 backdrop-blur-xl shadow-2xl rounded-[2rem] p-8 md:p-12 w-full max-w-md border border-white/40 animate-slide-up relative z-10',
    logoWrapper: 'flex items-center justify-center mb-10 transform hover:scale-105 transition-transform duration-500',
    title: 'text-3xl font-black text-center mb-10 text-gray-900 tracking-tight',
    content: 'space-y-6',
} as const;

/**
 * AuthCard - Container for auth forms
 * Uses Glassmorphism and entrance animations for a premium feel
 */
export function AuthCard({ title, children }: AuthCardProps) {
    return (
        <div className={STYLES.card}>
            {/* Logo Section - Linked to Home for easy exit */}
            <div className={STYLES.logoWrapper}>
                <Link href="/" className="hover:opacity-80 transition-opacity">
                    <Logo size="md" showText={true} />
                </Link>
            </div>

            {/* Title */}
            <h1 className={STYLES.title}>{title}</h1>

            {/* Form Content */}
            <div className={STYLES.content}>
                {children}
            </div>
        </div>
    );
}
