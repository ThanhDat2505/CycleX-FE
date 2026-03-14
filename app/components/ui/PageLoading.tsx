import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface PageLoadingProps {
    message?: string;
    className?: string;
}

/**
 * PageLoading Component
 * A consistent, full-page loading state for CycleX.
 */
export function PageLoading({ 
    message = 'Đang tải dữ liệu...', 
    className = '' 
}: PageLoadingProps) {
    return (
        <div className={`min-h-[400px] w-full flex flex-col items-center justify-center p-8 animate-fade-in ${className}`}>
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    {/* Inner spinner */}
                    <LoadingSpinner size="xl" color="primary" />
                    {/* Optional: Add a subtle glow/pulsing effect behind the spinner */}
                    <div className="absolute inset-0 bg-brand-primary/10 rounded-full blur-xl animate-pulse -z-10" />
                </div>
                
                {message && (
                    <p className="text-gray-500 font-medium animate-pulse text-sm">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}
