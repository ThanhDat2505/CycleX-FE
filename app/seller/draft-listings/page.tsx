// app/seller/draft-listings/page.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import {
  getDrafts,
  deleteDraft,
  type Listing,
} from "@/app/services/myListingsService";

const PRICE_LOCALE = "vi-VN";
const PRICE_CURRENCY = "VND";

function formatPrice(price: number): string {
  return new Intl.NumberFormat(PRICE_LOCALE, {
    style: "currency",
    currency: PRICE_CURRENCY,
    maximumFractionDigits: 0,
  }).format(price);
}

const DraftListingsPage: React.FC = () => {
  const router = useRouter();
  const { isLoggedIn, isLoading: isAuthLoading, user } = useAuth();

  const [draftListings, setDraftListings] = useState<Listing[]>([]);
  const [isFetchingDrafts, setIsFetchingDrafts] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !isLoggedIn) {
      router.push("/login?returnUrl=/seller/draft-listings");
    }
  }, [isLoggedIn, isAuthLoading, router]);

  const loadDrafts = useCallback(async (sellerId: number) => {
    setIsFetchingDrafts(true);
    setFetchError(null);
    try {
      const response = await getDrafts({ sellerId });
      setDraftListings(response.items);
    } catch (error) {
      setFetchError(
        error instanceof Error
          ? error.message
          : "Không thể tải danh sách tin nháp."
      );
    } finally {
      setIsFetchingDrafts(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthLoading && isLoggedIn && user?.userId) {
      loadDrafts(user.userId);
    }
  }, [isAuthLoading, isLoggedIn, user?.userId, loadDrafts]);

  const handleDeleteDraft = async (draftId: number) => {
    if (!user?.userId) return;
    if (!Number.isFinite(draftId) || draftId <= 0) {
      alert("Không tìm thấy mã tin nháp hợp lệ để xóa.");
      return;
    }
    const confirmed = window.confirm(
      "Bạn có chắc muốn xóa tin nháp này không?"
    );
    if (!confirmed) return;

    setDeletingId(draftId);
    try {
      await deleteDraft(user.userId, draftId);
      setDraftListings((prev) => prev.filter((item) => item.id !== draftId));
    } catch {
      alert("Xóa tin nháp thất bại. Vui lòng thử lại.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleContinueDraft = (draftId: number) => {
    if (!Number.isFinite(draftId) || draftId <= 0) {
      alert("Không tìm thấy mã tin nháp hợp lệ để tiếp tục.");
      return;
    }
    router.push(`/seller/create-listing?draft=${draftId}`);
  };

  if (isAuthLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center">
        <p className="text-gray-600">Đang tải...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center">
        <p className="text-gray-600">Đang chuyển hướng đến trang đăng nhập...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Tin nháp</h1>
      <p className="text-gray-600 mb-8">
        Quản lý các tin đăng chưa lưu và đang chờ xử lý
      </p>

      {isFetchingDrafts && (
        <div className="text-center py-12">
          <p className="text-gray-500">Đang tải tin nháp...</p>
        </div>
      )}

      {!isFetchingDrafts && fetchError && (
        <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
          <p className="text-red-600 mb-4">{fetchError}</p>
          <button
            onClick={() => user?.userId && loadDrafts(user.userId)}
            className="px-4 py-2 bg-[#FF8A00] text-white rounded-lg font-medium hover:bg-[#FF7A00] transition"
          >
            Thử lại
          </button>
        </div>
      )}

      {!isFetchingDrafts && !fetchError && draftListings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {draftListings.map((listing, index) => {
            const draftId = Number(listing.id);
            const hasValidDraftId = Number.isFinite(draftId) && draftId > 0;

            return (
              <div
                key={hasValidDraftId ? draftId : `${listing.brand}-${listing.model}-${index}`}
                className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition overflow-hidden"
              >
              {/* Thumbnail */}
              <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                {listing.mainImageUrl ? (
                  <img
                    src={listing.mainImageUrl}
                    alt={`${listing.brand} ${listing.model}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                )}
              </div>

              {/* Card body */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1">
                  {listing.brand} {listing.model}
                </h3>
                <p className="text-sm text-[#FF8A00] font-semibold mb-4">
                  {formatPrice(listing.price)}
                </p>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleContinueDraft(draftId)}
                    disabled={!hasValidDraftId}
                    className="flex-1 px-3 py-2 bg-[#FF8A00] text-white rounded text-sm font-medium hover:bg-[#FF7A00] transition text-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Tiếp tục
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteDraft(draftId)}
                    disabled={!hasValidDraftId || deletingId === draftId}
                    className="flex-1 px-3 py-2 border border-red-300 text-red-600 rounded text-sm font-medium hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === draftId ? "Đang xóa..." : "Xóa"}
                  </button>
                </div>
              </div>
              </div>
            );
          })}
        </div>
      )}

      {!isFetchingDrafts && !fetchError && draftListings.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-600 text-lg mb-4">Chưa có tin nháp nào</p>
          <Link
            href="/seller/create-listing"
            className="inline-block px-6 py-3 bg-[#FF8A00] text-white rounded-lg font-semibold hover:bg-[#FF7A00] transition"
          >
            Đăng tin mới
          </Link>
        </div>
      )}
    </div>
  );
};

export default DraftListingsPage;
