'use client';

import { ReactNode, useEffect } from 'react';
import { Button } from './Button';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    footer?: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'md',
}: ModalProps) {
    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-md animate-fade-in transition-all"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className={`relative bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] w-full ${sizeClasses[size]} overflow-hidden animate-zoom-in border border-white/20`}>
                {/* Header */}
                <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                    <div>
                        <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">{title}</h3>
                        <div className="h-1 w-12 bg-brand-primary rounded-full mt-1.5"></div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2.5 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-gray-900 group"
                    >
                        <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {children}
                </div>

                {/* Footer */}
                {footer ? (
                    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                        {footer}
                    </div>
                ) : (
                    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
                        <Button variant="secondary" onClick={onClose}>
                            Đóng
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
