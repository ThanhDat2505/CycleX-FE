'use client';

import { useState, useCallback } from 'react';
import { MESSAGES } from '@/app/constants/messages';
import { AlertCircle, Upload, X } from 'lucide-react';

interface FormErrors {
    reason?: string;
}

interface FailedReasonFormProps {
    reason: string;
    imagePreview: string | null;
    isDisabled: boolean;
    isSubmitting: boolean;
    onReasonChange: (value: string) => void;
    onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClearImage: () => void;
    onSubmit: () => void;
}

/** Section 1: Failed reason form with validation */
export function FailedReasonForm({
    reason, imagePreview, isDisabled, isSubmitting,
    onReasonChange, onImageUpload, onClearImage, onSubmit
}: FailedReasonFormProps) {
    const [formErrors, setFormErrors] = useState<FormErrors>({});

    const handleSubmit = useCallback(() => {
        const errors: FormErrors = {};

        if (!reason.trim()) {
            errors.reason = MESSAGES.S64_VAL_REASON_REQUIRED;
        }

        setFormErrors(errors);
        if (Object.keys(errors).length === 0) {
            onSubmit();
        }
    }, [reason, onSubmit]);

    const clearReasonError = () => {
        if (formErrors.reason) setFormErrors(prev => ({ ...prev, reason: undefined }));
    };

    return (
        <form
            id="failed-reason-form"
            onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                {MESSAGES.S64_FORM_TITLE}
            </h3>

            <div className="space-y-6">
                {/* Reason Textarea (Required) */}
                <div>
                    <label htmlFor="failedReason" className="block text-sm font-medium text-gray-700 mb-1">
                        {MESSAGES.S64_REASON_LABEL} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="failedReason"
                        value={reason}
                        onChange={(e) => {
                            if (e.target.value.length <= MESSAGES.S64_REASON_MAX_LENGTH) {
                                onReasonChange(e.target.value);
                                clearReasonError();
                            }
                        }}
                        placeholder={MESSAGES.S64_REASON_PLACEHOLDER}
                        rows={5}
                        disabled={isDisabled || isSubmitting}
                        className={`w-full px-4 py-3 border rounded-lg text-sm transition-colors resize-none focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${formErrors.reason ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                    />
                    <div className="flex justify-between items-center mt-1">
                        {formErrors.reason ? (
                            <p className="text-xs text-red-600 font-medium">{formErrors.reason}</p>
                        ) : (
                            <span /> // Spacer
                        )}
                        <span className="text-xs text-gray-400">
                            {reason.length}/{MESSAGES.S64_REASON_MAX_LENGTH}
                        </span>
                    </div>
                </div>

                {/* Optional Image Proof */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {MESSAGES.S64_IMAGE_LABEL}
                    </label>
                    {imagePreview ? (
                        <div className="relative w-full max-w-xs transition-opacity duration-200">
                            <img
                                src={imagePreview}
                                alt={MESSAGES.S64_IMAGE_ALT}
                                className="w-full h-40 object-cover border border-gray-200 rounded-lg bg-gray-50"
                            />
                            <button
                                type="button"
                                onClick={onClearImage}
                                disabled={isSubmitting}
                                className="absolute -top-2 -right-2 p-1.5 bg-white hover:bg-red-50 border shadow-sm rounded-full transition-colors group"
                            >
                                <X className="w-4 h-4 text-gray-500 group-hover:text-red-600" />
                            </button>
                        </div>
                    ) : (
                        <label
                            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${!isDisabled && !isSubmitting ? 'border-gray-300 hover:border-red-400 hover:bg-red-50' : 'border-gray-200 bg-gray-100 cursor-not-allowed'}`}
                        >
                            <Upload className="w-6 h-6 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">{MESSAGES.S64_IMAGE_UPLOAD_TEXT}</span>
                            <span className="text-xs text-gray-400 mt-1">JPG, PNG (Tối đa 5MB)</span>
                            <input
                                type="file"
                                accept="image/jpeg, image/png"
                                onChange={onImageUpload}
                                disabled={isDisabled || isSubmitting}
                                className="hidden"
                            />
                        </label>
                    )}
                </div>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end">
                <button
                    type="submit"
                    disabled={isDisabled || isSubmitting}
                    className="hidden" // Invisible proxy button if we want to submit externally
                    id="trigger-submit"
                />
            </div>
        </form>
    );
}

