"use client";

import { MapPin, Star, Pencil, Trash2, Phone, User } from "lucide-react";
import { UserAddress } from "@/app/types/address";

interface AddressCardProps {
  address: UserAddress;
  onEdit: (address: UserAddress) => void;
  onDelete: (addressId: number) => void;
  onSetDefault: (addressId: number) => void;
  disabled?: boolean;
}

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  disabled = false,
}: AddressCardProps) {
  return (
    <div
      className={`relative p-4 rounded-xl border transition-all ${
        address.isDefault
          ? "border-blue-200 bg-blue-50/50 shadow-sm"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      {/* Label & Default Badge */}
      <div className="flex items-center gap-2 mb-2">
        <span
          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
            address.isDefault
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {address.label}
        </span>
        {address.isDefault && (
          <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
            <Star className="w-3 h-3 fill-amber-500" />
            Mặc định
          </span>
        )}
      </div>

      {/* Receiver info */}
      {(address.receiverName || address.receiverPhone) && (
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-1.5">
          {address.receiverName && (
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-gray-400" />
              {address.receiverName}
            </span>
          )}
          {address.receiverPhone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-gray-400" />
              {address.receiverPhone}
            </span>
          )}
        </div>
      )}

      {/* Full address */}
      <div className="flex items-start gap-2 text-sm text-gray-800">
        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
        <p className="leading-relaxed">{address.fullAddress}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
        {!address.isDefault && (
          <button
            onClick={() => onSetDefault(address.addressId)}
            disabled={disabled}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors disabled:opacity-50"
          >
            Đặt mặc định
          </button>
        )}
        <button
          onClick={() => onEdit(address)}
          disabled={disabled}
          className="text-xs text-gray-600 hover:text-gray-800 font-medium px-2 py-1 rounded hover:bg-gray-50 transition-colors flex items-center gap-1 disabled:opacity-50"
        >
          <Pencil className="w-3 h-3" />
          Sửa
        </button>
        <button
          onClick={() => onDelete(address.addressId)}
          disabled={disabled}
          className="text-xs text-red-500 hover:text-red-600 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors flex items-center gap-1 disabled:opacity-50"
        >
          <Trash2 className="w-3 h-3" />
          Xóa
        </button>
      </div>
    </div>
  );
}
