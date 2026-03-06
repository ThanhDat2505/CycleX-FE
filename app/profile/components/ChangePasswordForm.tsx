'use client';

import { useState, useCallback } from 'react';
import { MESSAGES } from '@/app/constants/messages';
import { ChangePasswordRequest } from '@/app/types/user';
import { Button, Input } from '@/app/components/ui';

interface ChangePasswordFormProps {
    isSubmitting: boolean;
    onSubmit: (data: ChangePasswordRequest) => void;
}

interface FormErrors {
    oldPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
}

export function ChangePasswordForm({ isSubmitting, onSubmit }: ChangePasswordFormProps) {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [errors, setErrors] = useState<FormErrors>({});

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: FormErrors = {};

        // Validation S-04-BR04
        if (!oldPassword.trim()) newErrors.oldPassword = MESSAGES.S04_VAL_PASS_REQUIRED;

        if (!newPassword.trim()) {
            newErrors.newPassword = MESSAGES.S04_VAL_PASS_REQUIRED;
        } else if (newPassword.length < 6 || newPassword.length > 20) {
            newErrors.newPassword = MESSAGES.S04_VAL_PASS_LENGTH;
        } else if (newPassword === oldPassword) {
            newErrors.newPassword = MESSAGES.S04_VAL_PASS_SAME;
        }

        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = MESSAGES.S04_VAL_PASS_REQUIRED;
        } else if (confirmPassword !== newPassword) {
            newErrors.confirmPassword = MESSAGES.S04_VAL_PASS_MISMATCH;
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            onSubmit({
                oldPassword: oldPassword,
                newPassword: newPassword,
                confirmPassword: confirmPassword
            });
        }
    }, [oldPassword, newPassword, confirmPassword, onSubmit]);

    const clearError = (field: keyof FormErrors) => {
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <Input
                id="oldPassword"
                type="password"
                label={`${MESSAGES.S04_OLD_PASSWORD_LABEL} *`}
                value={oldPassword}
                onChange={(val) => { setOldPassword(val); clearError('oldPassword'); }}
                placeholder={MESSAGES.S04_OLD_PASSWORD_PLACEHOLDER}
                disabled={isSubmitting}
                error={errors.oldPassword}
            />

            <Input
                id="newPassword"
                type="password"
                label={`${MESSAGES.S04_NEW_PASSWORD_LABEL} *`}
                value={newPassword}
                onChange={(val) => { setNewPassword(val); clearError('newPassword'); }}
                placeholder={MESSAGES.S04_NEW_PASSWORD_PLACEHOLDER}
                disabled={isSubmitting}
                error={errors.newPassword}
            />

            <Input
                id="confirmPassword"
                type="password"
                label={`${MESSAGES.S04_CONFIRM_PASSWORD_LABEL} *`}
                value={confirmPassword}
                onChange={(val) => { setConfirmPassword(val); clearError('confirmPassword'); }}
                placeholder={MESSAGES.S04_CONFIRM_PASSWORD_PLACEHOLDER}
                disabled={isSubmitting}
                error={errors.confirmPassword}
            />

            <div className="pt-4 flex justify-end">
                <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto min-w-[160px]"
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Đang xử lý...
                        </span>
                    ) : (
                        MESSAGES.S04_BTN_CHANGE_PASSWORD
                    )}
                </Button>
            </div>
        </form>
    );
}
