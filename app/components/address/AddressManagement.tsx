"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Plus, MapPin } from "lucide-react";
import { UserAddress, CreateAddressRequest } from "@/app/types/address";
import { addressService } from "@/app/services/addressService";
import AddressCard from "./AddressCard";
import AddressFormModal from "./AddressFormModal";

interface AddressManagementProps {
  userId: number;
  onError: (msg: string) => void;
  onSuccess: (msg: string) => void;
}

export default function AddressManagement({
  userId,
  onError,
  onSuccess,
}: AddressManagementProps) {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const errorRef = useRef<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAddresses = useCallback(async () => {
    try {
      setIsLoading(true);
      setFetchError(null);
      const data = await addressService.getAddresses(userId);
      setAddresses(data);
      errorRef.current = null; // Reset on success
    } catch {
      const msg = "Không thể tải danh sách địa chỉ";
      setFetchError(msg);
      // Only call external onError once to prevent toast spam
      if (errorRef.current !== msg) {
        onError(msg);
        errorRef.current = msg;
      }
    } finally {
      setIsLoading(false);
    }
  }, [userId, onError]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleCreate = useCallback(
    async (data: CreateAddressRequest) => {
      setIsSubmitting(true);
      try {
        await addressService.createAddress(userId, data);
        onSuccess("Thêm địa chỉ thành công");
        setIsModalOpen(false);
        fetchAddresses();
      } catch {
        onError("Không thể thêm địa chỉ");
      } finally {
        setIsSubmitting(false);
      }
    },
    [userId, fetchAddresses, onSuccess, onError],
  );

  const handleUpdate = useCallback(
    async (data: CreateAddressRequest) => {
      if (!editingAddress) return;
      setIsSubmitting(true);
      try {
        await addressService.updateAddress(
          userId,
          editingAddress.addressId,
          data,
        );
        onSuccess("Cập nhật địa chỉ thành công");
        setIsModalOpen(false);
        setEditingAddress(null);
        fetchAddresses();
      } catch {
        onError("Không thể cập nhật địa chỉ");
      } finally {
        setIsSubmitting(false);
      }
    },
    [userId, editingAddress, fetchAddresses, onSuccess, onError],
  );

  const handleDelete = useCallback(
    async (addressId: number) => {
      if (!confirm("Bạn có chắc muốn xóa địa chỉ này?")) return;
      try {
        await addressService.deleteAddress(userId, addressId);
        onSuccess("Đã xóa địa chỉ");
        fetchAddresses();
      } catch {
        onError("Không thể xóa địa chỉ");
      }
    },
    [userId, fetchAddresses, onSuccess, onError],
  );

  const handleSetDefault = useCallback(
    async (addressId: number) => {
      try {
        await addressService.setDefault(userId, addressId);
        onSuccess("Đã đặt địa chỉ mặc định");
        fetchAddresses();
      } catch {
        onError("Không thể cập nhật địa chỉ mặc định");
      }
    },
    [userId, fetchAddresses, onSuccess, onError],
  );

  const openEdit = (address: UserAddress) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const openCreate = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-brand-primary" />
          <h3 className="text-lg font-bold text-gray-900">Địa chỉ của tôi</h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {addresses.length}/10
          </span>
        </div>
        {addresses.length < 10 && (
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 text-sm text-brand-primary hover:text-brand-primary-hover font-medium px-3 py-1.5 rounded-lg hover:bg-orange-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Thêm địa chỉ
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-gray-100 animate-pulse"
            >
              <div className="h-3 bg-gray-200 rounded w-20 mb-3" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <div className="p-8 rounded-xl border-2 border-dashed border-gray-200 text-center">
          <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm mb-3">
            {fetchError ? "Không thể kết nối máy chủ" : "Bạn chưa có địa chỉ nào"}
          </p>
          <button
            onClick={fetchError ? () => fetchAddresses() : openCreate}
            className="inline-flex items-center gap-1.5 text-sm text-brand-primary hover:text-brand-primary-hover font-semibold px-4 py-2 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors"
          >
            {fetchError ? (
              <>Thử lại</>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Thêm địa chỉ đầu tiên
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <AddressCard
              key={addr.addressId}
              address={addr}
              onEdit={openEdit}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
            />
          ))}
        </div>
      )}

      <AddressFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAddress(null);
        }}
        onSubmit={editingAddress ? handleUpdate : handleCreate}
        editingAddress={editingAddress}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
