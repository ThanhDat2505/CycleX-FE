/**
 * ErrorBanner Component
 * Reusable error display with optional retry button
 */

import React from 'react';

interface ErrorBannerProps {
    message: string;
    onRetry?: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onRetry }) => {
    return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                        <h3 className="text-red-800 font-semibold mb-1">Error</h3>
                        <p className="text-red-700 text-sm">{message}</p>
                    </div>
                </div>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                        Try Again
                    </button>
                )}
            </div>
        </div>
    );
};
