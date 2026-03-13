"use client";

import { useState, useEffect } from "react";
import { MapPin, Check, Star } from "lucide-react";
import { UserAddress } from "@/app/types/address";
import { addressService } from "@/app/services/addressService";

interface AddressSelectorProps {
  userId: number;
  onSelect: (address: UserAddress | null) => void;
  selectedAddressId?: number | null;
  disabled?: boolean;
}

export default function AddressSelector({
  userId,
  onSelect,
  selectedAddressId,
  disabled = false,
}: AddressSelectorProps) {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    addressService
      .getAddresses(userId)
      .then((data) => {
        if (!cancelled) {
          setAddresses(data);
          // Auto-select default address if none selected
          if (!selectedAddressId) {
            const defaultAddr = data.find((a) => a.isDefault);
            if (defaultAddr) onSelect(defaultAddr);
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return (
      <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <div className="p-6 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-center">
        <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-500 mb-2">Bạn chưa có địa chỉ nào.</p>
        <p className="text-xs text-gray-400">
          Vui lòng thêm địa chỉ trong phần{" "}
          <a
            href="/profile"
            className="text-blue-600 underline hover:text-blue-700"
          >
            Hồ sơ cá nhân
          </a>{" "}
          trước khi đặt hàng.
        </p>
      </div>
    );
  }

  const displayAddresses = showAll ? addresses : addresses.slice(0, 3);

  return (
    <div className="space-y-3">
      {displayAddresses.map((addr) => {
        const isSelected = selectedAddressId === addr.addressId;
        return (
          <div
            key={addr.addressId}
            role="button"
            tabIndex={0}
            onClick={() => !disabled && onSelect(addr)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                !disabled && onSelect(addr);
              }
            }}
            className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
              isSelected
                ? "border-blue-500 bg-blue-50/60 shadow-md"
                : "border-gray-100 bg-white hover:border-blue-200 hover:shadow-sm"
            } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {/* Selected check */}
            {isSelected && (
              <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}

            <div className="flex items-center gap-2 mb-1.5">
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  isSelected
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {addr.label}
              </span>
              {addr.isDefault && (
                <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  <Star className="w-3 h-3 fill-amber-500" />
                  Mặc định
                </span>
              )}
            </div>

            {addr.receiverName && (
              <p className="text-sm font-medium text-gray-800 mb-0.5">
                {addr.receiverName}
                {addr.receiverPhone && (
                  <span className="text-gray-500 ml-2">
                    · {addr.receiverPhone}
                  </span>
                )}
              </p>
            )}

            <div className="flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600 leading-relaxed">
                {addr.fullAddress}
              </p>
            </div>
          </div>
        );
      })}

      {addresses.length > 3 && (
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium py-2 hover:bg-blue-50 rounded-lg transition-colors"
        >
          {showAll ? "Thu gọn" : `Xem thêm ${addresses.length - 3} địa chỉ`}
        </button>
      )}
    </div>
  );
}
