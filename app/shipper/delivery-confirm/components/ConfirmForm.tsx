'use client';

import { useCallback, useState } from 'react';
import { MESSAGES } from '@/app/constants/messages';
import { CheckCircle, Upload, X } from 'lucide-react';

// ── Constants ──
const PHONE_REGEX = /^0\d{9}$/;

interface FormErrors {
    receiverName?: string;
    receiverPhone?: string;
}

interface ConfirmFormProps {
    receiverName: string;
    receiverPhone: string;
    signaturePreview: string | null;
    isDisabled: boolean;
    isSubmitting: boolean;
    onReceiverNameChange: (value: string) => void;
    onReceiverPhoneChange: (value: string) => void;
    onSignatureUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClearSignature: () => void;
    onSubmit: () => void;
}

/** Section 3: Confirm delivery form with validation */
export function ConfirmForm({
    receiverName, receiverPhone, signaturePreview,
    isDisabled, isSubmitting,
    onReceiverNameChange, onReceiverPhoneChange,
    onSignatureUpload, onClearSignature, onSubmit
}: ConfirmFormProps) {
    const [formErrors, setFormErrors] = useState<FormErrors>({});

    const handleSubmit = useCallback(() => {
        const errors: FormErrors = {};

        if (!receiverName.trim()) {
            errors.receiverName = MESSAGES.S63_VAL_NAME_REQUIRED;
        }
        if (!receiverPhone.trim()) {
            errors.receiverPhone = MESSAGES.S63_VAL_PHONE_REQUIRED;
        } else if (!PHONE_REGEX.test(receiverPhone.trim())) {
            errors.receiverPhone = MESSAGES.S63_VAL_PHONE_INVALID;
        }

        setFormErrors(errors);
        if (Object.keys(errors).length === 0) {
            onSubmit();
        }
    }, [receiverName, receiverPhone, onSubmit]);

    const clearNameError = () => {
        if (formErrors.receiverName) setFormErrors(prev => ({ ...prev, receiverName: undefined }));
    };

    const clearPhoneError = () => {
        if (formErrors.receiverPhone) setFormErrors(prev => ({ ...prev, receiverPhone: undefined }));
    };

    return (
        <form
            id="confirm-form"
            onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                {MESSAGES.S63_CONFIRM_FORM_TITLE}
            </h3>

            <div className="space-y-4">
                {/* Receiver Name */}
                <div>
                    <label htmlFor="receiverName" className="block text-sm font-medium text-gray-700 mb-1">
                        {MESSAGES.S63_RECEIVER_NAME_LABEL} <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="receiverName"
                        type="text"
                        value={receiverName}
                        onChange={(e) => { onReceiverNameChange(e.target.value); clearNameError(); }}
                        placeholder={MESSAGES.S63_RECEIVER_NAME_PLACEHOLDER}
                        disabled={isDisabled || isSubmitting}
                        className={`w-full px-4 py-2.5 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${formErrors.receiverName ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                    />
                    {formErrors.receiverName && (
                        <p className="mt-1 text-xs text-red-600">{formErrors.receiverName}</p>
                    )}
                </div>

                {/* Receiver Phone */}
                <div>
                    <label htmlFor="receiverPhone" className="block text-sm font-medium text-gray-700 mb-1">
                        {MESSAGES.S63_RECEIVER_PHONE_LABEL} <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="receiverPhone"
                        type="tel"
                        value={receiverPhone}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            if (value.length <= MESSAGES.S63_PHONE_MAX_LENGTH) {
                                onReceiverPhoneChange(value);
                                clearPhoneError();
                            }
                        }}
                        placeholder={MESSAGES.S63_RECEIVER_PHONE_PLACEHOLDER}
                        maxLength={MESSAGES.S63_PHONE_MAX_LENGTH}
                        disabled={isDisabled || isSubmitting}
                        className={`w-full px-4 py-2.5 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${formErrors.receiverPhone ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                    />
                    {formErrors.receiverPhone && (
                        <p className="mt-1 text-xs text-red-600">{formErrors.receiverPhone}</p>
                    )}
                </div>

                {/* Signature Image (optional) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {MESSAGES.S63_SIGNATURE_LABEL}
                    </label>
                    {signaturePreview ? (
                        <div className="relative w-full max-w-xs">
                            <img
                                src={signaturePreview}
                                alt={MESSAGES.S63_SIGNATURE_ALT}
                                className="w-full h-32 object-contain border border-gray-200 rounded-lg bg-white"
                            />
                            <button
                                type="button"
                                onClick={onClearSignature}
                                disabled={isSubmitting}
                                className="absolute top-1 right-1 p-1 bg-red-100 hover:bg-red-200 rounded-full transition-colors"
                            >
                                <X className="w-4 h-4 text-red-600" />
                            </button>
                        </div>
                    ) : (
                        <label
                            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${!isDisabled && !isSubmitting ? 'border-gray-300 hover:border-blue-400 hover:bg-blue-50' : 'border-gray-200 bg-gray-100 cursor-not-allowed'}`}
                        >
                            <Upload className="w-6 h-6 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">{MESSAGES.S63_SIGNATURE_UPLOAD_TEXT}</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={onSignatureUpload}
                                disabled={isDisabled || isSubmitting}
                                className="hidden"
                            />
                        </label>
                    )}
                </div>
            </div>

            {/* Hidden submit button to allow external trigger via form attribute */}
            <button type="submit" className="hidden" id="trigger-submit-confirm" />
        </form>
    );
}
