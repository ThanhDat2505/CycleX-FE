"use client";

import { useState, useCallback } from "react";
import { X } from "lucide-react";
import { Button, Input } from "@/app/components/ui";
import VietnameseAddressPicker from "./VietnameseAddressPicker";
import { UserAddress, CreateAddressRequest } from "@/app/types/address";

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAddressRequest) => Promise<void>;
  editingAddress?: UserAddress | null;
  isSubmitting?: boolean;
}

const PHONE_REGEX = /^0\d{9}$/;

const LABEL_OPTIONS = ["Nhà riêng", "Công ty", "Khác"];

export default function AddressFormModal({
  isOpen,
  onClose,
  onSubmit,
  editingAddress,
  isSubmitting = false,
}: AddressFormModalProps) {
  const [label, setLabel] = useState(editingAddress?.label || "Nhà riêng");
  const [receiverName, setReceiverName] = useState(
    editingAddress?.receiverName || "",
  );
  const [receiverPhone, setReceiverPhone] = useState(
    editingAddress?.receiverPhone || "",
  );
  const [isDefault, setIsDefault] = useState(
    editingAddress?.isDefault || false,
  );
  const [addressData, setAddressData] = useState({
    province: editingAddress?.province || "",
    district: editingAddress?.district || "",
    ward: editingAddress?.ward || "",
    streetAddress: editingAddress?.streetAddress || "",
    fullAddress: editingAddress?.fullAddress || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!addressData.province)
      newErrors.province = "Vui lòng chọn tỉnh/thành phố";
    if (!addressData.district) newErrors.district = "Vui lòng chọn quận/huyện";
    if (!addressData.ward) newErrors.ward = "Vui lòng chọn phường/xã";
    if (!addressData.streetAddress.trim())
      newErrors.streetAddress = "Vui lòng nhập địa chỉ chi tiết";

    if (receiverPhone && !PHONE_REGEX.test(receiverPhone)) {
      newErrors.receiverPhone =
        "Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [addressData, receiverPhone]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;

      await onSubmit({
        label,
        province: addressData.province,
        district: addressData.district,
        ward: addressData.ward,
        streetAddress: addressData.streetAddress.trim(),
        receiverName: receiverName.trim() || undefined,
        receiverPhone: receiverPhone.trim() || undefined,
        isDefault,
      });
    },
    [
      validate,
      onSubmit,
      label,
      addressData,
      receiverName,
      receiverPhone,
      isDefault,
    ],
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {editingAddress ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
          </h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Label */}
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm">
              Loại địa chỉ
            </label>
            <div className="flex gap-2">
              {LABEL_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setLabel(opt)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                    label === opt
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Receiver Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="receiverName"
              label="Tên người nhận"
              value={receiverName}
              onChange={setReceiverName}
              placeholder="Họ tên người nhận hàng"
              disabled={isSubmitting}
            />
            <div>
              <Input
                id="receiverPhone"
                label="SĐT người nhận"
                type="tel"
                value={receiverPhone}
                onChange={(val) => {
                  const numOnly = val.replaceAll(/\D/g, "");
                  if (numOnly.length <= 10) setReceiverPhone(numOnly);
                }}
                placeholder="0912345678"
                maxLength={10}
                disabled={isSubmitting}
                error={errors.receiverPhone}
              />
            </div>
          </div>

          {/* Vietnamese Address Picker */}
          <VietnameseAddressPicker
            province={editingAddress?.province}
            district={editingAddress?.district}
            ward={editingAddress?.ward}
            streetAddress={editingAddress?.streetAddress}
            onChange={setAddressData}
            disabled={isSubmitting}
            errors={{
              province: errors.province,
              district: errors.district,
              ward: errors.ward,
              streetAddress: errors.streetAddress,
            }}
          />

          {/* Default checkbox */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              disabled={isSubmitting}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 font-medium">
              Đặt làm địa chỉ mặc định
            </span>
          </label>

          {/* Preview */}
          {addressData.fullAddress && (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">
                Xem trước địa chỉ đầy đủ:
              </p>
              <p className="text-sm text-gray-800 font-medium">
                {addressData.fullAddress}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
              className="!w-auto px-6"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="!w-auto px-6"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang lưu...
                </span>
              ) : editingAddress ? (
                "Cập nhật"
              ) : (
                "Thêm địa chỉ"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
