import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export function Textarea({
    label,
    error,
    className = '',
    ...props
}: TextareaProps) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-gray-700 font-medium mb-2">
                    {label}
                </label>
            )}
            <textarea
                className={`
                    w-full px-4 py-3 border rounded-lg 
                    focus:ring-2 focus:ring-orange-500 focus:border-orange-500 
                    transition-all duration-200
                    disabled:bg-gray-100 disabled:text-gray-500
                    ${error ? 'border-red-500 bg-red-50' : 'border-gray-200'}
                    ${className}
                `}
                {...props}
            />
            {error && (
                <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );
}
