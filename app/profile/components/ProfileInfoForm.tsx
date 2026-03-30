"use client";

import { useState, useCallback, useEffect } from "react";
import { MESSAGES } from "@/app/constants/messages";
import { UserProfileResponse, UpdateProfileRequest } from "@/app/types/user";
import { Button, Input } from "@/app/components/ui";

const PHONE_REGEX = /^0\d{9}$/;

interface ProfileInfoFormProps {
  profile: UserProfileResponse;
  isSubmitting: boolean;
  onSubmit: (data: UpdateProfileRequest) => void;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
}

export function ProfileInfoForm({
  profile,
  isSubmitting,
  onSubmit,
}: ProfileInfoFormProps) {
  const [fullName, setFullName] = useState(profile.fullName);
  const [phone, setPhone] = useState(profile.phone);
  const [address, setAddress] = useState(profile.address || "");

  const [errors, setErrors] = useState<FormErrors>({});

  // Sync external props change (like when fetch finishes or submit updates state)
  useEffect(() => {
    setFullName(profile.fullName);
    setPhone(profile.phone);
    setAddress(profile.address || "");
  }, [profile]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
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
          address: address.trim() || undefined,
        });
      }
    },
    [fullName, phone, address, onSubmit],
  );

  const clearNameError = () => {
    if (errors.fullName)
      setErrors((prev) => ({ ...prev, fullName: undefined }));
  };

  const clearPhoneError = () => {
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border-t border-gray-200 pt-6 space-y-4">
        {/* Email (Read-only as per S-04-BR05) */}
        <Input
          id="email"
          type="email"
          label={MESSAGES.S04_EMAIL_LABEL}
          value={profile.email}
          onChange={() => {}}
          disabled={true}
        />

        {/* Full Name */}
        <Input
          id="fullName"
          type="text"
          label={`${MESSAGES.S04_NAME_LABEL} *`}
          value={fullName}
          onChange={(val) => {
            setFullName(val);
            clearNameError();
          }}
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
            const numOnly = val.replace(/\D/g, ""); // Ensure only numbers
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

        {/* Address - Now managed in separate tab */}
        {address && (
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
            <label className="block text-gray-700 font-medium mb-1 text-sm">
              {MESSAGES.S04_ADDRESS_LABEL}
            </label>
            <p className="text-sm text-gray-600">{address}</p>
            <p className="text-xs text-gray-400 mt-1">
              Quản lý địa chỉ tại tab &quot;Địa chỉ&quot;
            </p>
          </div>
        )}
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
