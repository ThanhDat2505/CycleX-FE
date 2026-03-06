'use client';

import { useState, useCallback, useEffect } from 'react';
import { MESSAGES } from '@/app/constants/messages';
import { UserProfileResponse, UpdateProfileRequest } from '@/app/types/user';
import { Button, Input } from '@/app/components/ui';
import { Upload, X, User } from 'lucide-react';

const PHONE_REGEX = /^0\d{9}$/;

interface ProfileInfoFormProps {
    profile: UserProfileResponse;
    isSubmitting: boolean;
    onSubmit: (data: UpdateProfileRequest) => void;
    onImageError?: (msg: string) => void;
}

interface FormErrors {
    fullName?: string;
    phone?: string;
}

export function ProfileInfoForm({ profile, isSubmitting, onSubmit, onImageError }: ProfileInfoFormProps) {
    const [fullName, setFullName] = useState(profile.fullName);
    const [phone, setPhone] = useState(profile.phone);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.avatarUrl || null);

    const [errors, setErrors] = useState<FormErrors>({});

    // Sync external props change (like when fetch finishes or submit updates state)
    useEffect(() => {
        setFullName(profile.fullName);
        setPhone(profile.phone);
        if (profile.avatarUrl) setAvatarPreview(profile.avatarUrl);
    }, [profile]);

    const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate Size (S-04-BR03: <= 2MB)
            if (file.size > 2 * 1024 * 1024) {
                if (onImageError) onImageError(MESSAGES.S04_VAL_AVATAR_SIZE);
                return;
            }

            // Validate Type (JPG/PNG)
            const validTypes = ['image/jpeg', 'image/png'];
            if (!validTypes.includes(file.type)) {
                if (onImageError) onImageError(MESSAGES.S04_VAL_AVATAR_FORMAT);
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearAvatar = () => {
        setAvatarPreview(null);
    };

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: FormErrors = {};

        // Validation S-04-BR03
        if (!fullName.trim()) {
            newErrors.fullName = MESSAGES.S04_VAL_NAME_REQUIRED;
        }

        if (!phone.trim()) {
            newErrors.phone = MESSAGES.S04_VAL_PHONE_REQUIRED;
        } else if (!PHONE_REGEX.test(phone.trim())) {
            newErrors.phone = MESSAGES.S04_VAL_PHONE_INVALID;
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            onSubmit({
                fullName: fullName.trim(),
                phone: phone.trim(),
                avatarUrl: avatarPreview
            });
        }
    }, [fullName, phone, avatarPreview, onSubmit]);

    const clearNameError = () => {
        if (errors.fullName) setErrors(prev => ({ ...prev, fullName: undefined }));
    };

    const clearPhoneError = () => {
        if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="relative">
                    {avatarPreview ? (
                        <div className="relative w-24 h-24 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
                            <img
                                src={avatarPreview}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-24 h-24 rounded-full border border-gray-200 bg-gray-100 flex items-center justify-center">
                            <User className="w-10 h-10 text-gray-400" />
                        </div>
                    )}

                    {avatarPreview && (
                        <button
                            type="button"
                            onClick={clearAvatar}
                            disabled={isSubmitting}
                            className="absolute top-0 right-0 p-1 bg-white border border-gray-200 shadow-sm rounded-full hover:bg-red-50 transition-colors z-10"
                        >
                            <X className="w-3.5 h-3.5 text-gray-500 hover:text-red-500" />
                        </button>
                    )}
                </div>

                <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 mb-1">{MESSAGES.S04_AVATAR_LABEL}</h3>
                    <p className="text-sm text-gray-500 mb-3">{MESSAGES.S04_AVATAR_HINT}</p>
                    <label className="inline-flex items-center justify-center px-4 py-2 border border-blue-600 rounded-lg text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 cursor-pointer transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <Upload className="w-4 h-4 mr-2" />
                        {MESSAGES.S04_AVATAR_UPLOAD_TEXT}
                        <input
                            type="file"
                            className="sr-only"
                            accept="image/jpeg, image/png"
                            onChange={handleAvatarUpload}
                            disabled={isSubmitting}
                        />
                    </label>
                </div>
            </div>

            <div className="border-t border-gray-200 pt-6 space-y-4">
                {/* Email (Read-only as per S-04-BR05) */}
                <Input
                    id="email"
                    type="email"
                    label={MESSAGES.S04_EMAIL_LABEL}
                    value={profile.email}
                    onChange={() => { }}
                    disabled={true}
                />

                {/* Full Name */}
                <Input
                    id="fullName"
                    type="text"
                    label={`${MESSAGES.S04_NAME_LABEL} *`}
                    value={fullName}
                    onChange={(val) => { setFullName(val); clearNameError(); }}
                    placeholder={MESSAGES.S04_NAME_PLACEHOLDER}
                    disabled={isSubmitting}
                    error={errors.fullName}
                />

                {/* Phone */}
                <Input
                    id="phone"
                    type="tel"
                    label={`${MESSAGES.S04_PHONE_LABEL} *`}
                    value={phone}
                    onChange={(val) => {
                        const numOnly = val.replace(/\D/g, ''); // Ensure only numbers
                        if (numOnly.length <= 10) {
                            setPhone(numOnly);
                            clearPhoneError();
                        }
                    }}
                    placeholder={MESSAGES.S04_PHONE_PLACEHOLDER}
                    maxLength={10}
                    disabled={isSubmitting}
                    error={errors.phone}
                />
            </div>

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
                        MESSAGES.S04_BTN_UPDATE_PROFILE
                    )}
                </Button>
            </div>
        </form>
    );
}
