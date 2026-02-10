
'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

interface ToastContextType {
    addToast: (message: string, type: ToastType, duration?: number) => void;
    removeToast: (id: string) => void;
    toasts: Toast[];
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType = 'info', duration = 3000) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast: Toast = { id, message, type, duration };

        setToasts((prev) => [...prev, newToast]);

        if (duration > 0) {
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast, removeToast, toasts }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

// Internal Toast UI Component (to keep it self-contained in one file for simplicity, 
// or can be separated if preferred. I'll include it here for now)
const ToastContainer: React.FC<{ toasts: Toast[]; removeToast: (id: string) => void }> = ({ toasts, removeToast }) => {
    return (
        <div className="fixed top-20 right-4 z-50 flex flex-col gap-2">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`
                        min-w-[300px] bg-white rounded-lg shadow-lg border-l-4 p-4 pr-8 relative animate-slide-in-right transform transition-all duration-300 hover:scale-[1.02] cursor-pointer
                        ${toast.type === 'success' ? 'border-green-500' :
                            toast.type === 'error' ? 'border-red-500' :
                                toast.type === 'warning' ? 'border-yellow-500' : 'border-blue-500'}
                    `}
                    onClick={() => removeToast(toast.id)}
                >
                    <div className="flex items-start gap-3">
                        <div className={`flex-shrink-0 pt-0.5
                             ${toast.type === 'success' ? 'text-green-500' :
                                toast.type === 'error' ? 'text-red-500' :
                                    toast.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'}
                        `}>
                            {toast.type === 'success' && (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            )}
                            {toast.type === 'error' && (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            )}
                            {toast.type === 'warning' && (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            )}
                            {toast.type === 'info' && (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            )}
                        </div>
                        <div>
                            <h4 className={`font-semibold text-sm ${toast.type === 'success' ? 'text-green-800' :
                                    toast.type === 'error' ? 'text-red-800' :
                                        toast.type === 'warning' ? 'text-yellow-800' : 'text-blue-800'}
                            `}>
                                {toast.type === 'success' ? 'Success' :
                                    toast.type === 'error' ? 'Error' :
                                        toast.type === 'warning' ? 'Warning' : 'Info'}
                            </h4>
                            <p className="text-sm text-gray-600 mt-0.5">{toast.message}</p>
                        </div>
                        <button
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                            onClick={(e) => {
                                e.stopPropagation();
                                removeToast(toast.id);
                            }}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    {/* Progress Bar Animation (Simple CSS) */}
                    <div className="absolute bottom-0 left-0 h-1 bg-current opacity-20 w-full animate-shrink" style={{ animationDuration: `${toast.duration}ms` }}></div>
                </div>
            ))}
        </div>
    );
};
