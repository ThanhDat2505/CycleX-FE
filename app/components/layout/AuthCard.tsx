import { ReactNode } from 'react';
import { Logo } from '../ui/Logo';

interface AuthCardProps {
    title: string;
    children: ReactNode;
}

export function AuthCard({ title, children }: AuthCardProps) {
    return (
        <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md">
            {/* Logo Section */}
            <div className="flex items-center justify-center mb-8">
                <Logo size="md" showText={true} />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">
                {title}
            </h1>

            {/* Form Content */}
            <div className="space-y-5">
                {children}
            </div>
        </div>
    );
}
