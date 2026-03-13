'use client';

import { ReactNode } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle, Info, HelpCircle } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string | ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'primary' | 'danger';
    isLoading?: boolean;
    iconType?: 'warning' | 'info' | 'question';
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Xác nhận',
    cancelLabel = 'Hủy bỏ',
    variant = 'primary',
    isLoading = false,
    iconType = 'warning',
}: ConfirmModalProps) {
    
    const getIcon = () => {
        switch (iconType) {
            case 'warning':
                return <AlertTriangle className={`w-12 h-12 ${variant === 'danger' ? 'text-red-500' : 'text-orange-500'}`} />;
            case 'info':
                return <Info className="w-12 h-12 text-blue-500" />;
            case 'question':
                return <HelpCircle className="w-12 h-12 text-brand-primary" />;
            default:
                return null;
        }
    };

    const footer = (
        <div className="flex gap-3 justify-end w-full">
            <Button
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 sm:flex-none min-w-[100px] rounded-xl font-bold"
            >
                {cancelLabel}
            </Button>
            <Button
                variant={variant === 'danger' ? 'danger' : 'primary'}
                onClick={onConfirm}
                loading={isLoading}
                className="flex-1 sm:flex-none min-w-[120px] rounded-xl font-bold shadow-lg active:scale-95 transition-all"
            >
                {confirmLabel}
            </Button>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="sm"
            footer={footer}
        >
            <div className="flex flex-col items-center text-center py-4 animate-fade-in">
                <div className={`mb-6 p-4 rounded-3xl ${variant === 'danger' ? 'bg-red-50' : 'bg-orange-50'} animate-bounce-subtle`}>
                    {getIcon()}
                </div>
                <div className="space-y-3">
                    <p className="text-gray-600 font-medium leading-relaxed">
                        {message}
                    </p>
                    {variant === 'danger' && (
                        <p className="text-xs text-red-500 font-bold bg-red-50 px-3 py-1.5 rounded-full inline-block">
                            Hành động này không thể hoàn tác
                        </p>
                    )}
                </div>
            </div>
        </Modal>
    );
}
