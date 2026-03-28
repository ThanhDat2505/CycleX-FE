// app/seller/listing-status/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { StatusBadge } from "@/app/components/ui/StatusBadge";
import { useAuth } from "@/app/hooks/useAuth";
import {
  getMyListings,
  getDrafts,
  Listing,
} from "@/app/services/myListingsService";

const ListingStatusPage: React.FC = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthLoading) return;

    if (!user?.userId) {
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchListings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [listingResult, draftResult] = await Promise.all([
          getMyListings({
            sellerId: user.userId,
            pageSize: 200,
            sortBy: "recent",
          }),
          getDrafts({
            sellerId: user.userId,
            pageSize: 200,
            sort: "newest",
          }),
        ]);

        const mergedListings = [...listingResult.listings];
        const existingIds = new Set(mergedListings.map((listing) => listing.id));

        draftResult.items.forEach((draft) => {
          if (!existingIds.has(draft.id)) {
            mergedListings.push(draft);
          }
        });

        mergedListings.sort(
          (a, b) =>
            new Date(b.updatedDate || b.createdDate).getTime() -
            new Date(a.updatedDate || a.createdDate).getTime(),
        );

        if (!controller.signal.aborted) {
          setListings(mergedListings);
        }
      } catch (err: any) {
        if (!controller.signal.aborted) {
          setError(err?.message || "Không thể tải dữ liệu. Vui lòng thử lại.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchListings();
    return () => controller.abort();
  }, [user?.userId, isAuthLoading]);

  const stats = {
    active: listings.filter((listing: Listing) => listing.status === "APPROVE").length,
    pending: listings.filter(
      (listing: Listing) => ["PENDING", "NEED_MORE_INFO", "HELD"].includes(listing.status),
    ).length,
    sold: listings.filter((listing: Listing) => listing.status === "SOLD").length,
    draft: listings.filter((listing: Listing) => listing.status === "DRAFT").length,
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <p className="text-gray-600">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">
        Trạng Thái Tin Đăng
      </h1>
      <p className="text-gray-600 mb-8">
        Theo dõi trạng thái tất cả tin đăng của bạn
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <p className="text-gray-600 text-sm font-semibold mb-2">Đang bán</p>
          <p className="text-3xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <p className="text-gray-600 text-sm font-semibold mb-2">Chờ duyệt</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <p className="text-gray-600 text-sm font-semibold mb-2">Đã bán</p>
          <p className="text-3xl font-bold text-red-600">{stats.sold}</p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <p className="text-gray-600 text-sm font-semibold mb-2">Nháp</p>
          <p className="text-3xl font-bold text-gray-600">{stats.draft}</p>
        </div>
      </div>

      {/* Listings Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-6 py-4 font-semibold text-gray-700">
                  Tên Xe
                </th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">
                  Giá
                </th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">
                  Trạng thái
                </th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">
                  Lượt xem
                </th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">
                  Ngày đăng
                </th>
              </tr>
            </thead>
            <tbody>
              {listings.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    Chưa có tin đăng nào.
                  </td>
                </tr>
              ) : (
                listings.map((listing) => (
                  <tr
                    key={listing.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {listing.brand} {listing.model}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {listing.price.toLocaleString("vi-VN")}đ
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={listing.status} showLabel />
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {listing.views}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(listing.createdDate).toLocaleDateString(
                        "vi-VN"
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListingStatusPage;
