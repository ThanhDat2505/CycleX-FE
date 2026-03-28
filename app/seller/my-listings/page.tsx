/* eslint-disable react-hooks/set-state-in-effect */

// app/seller/my-listings/page.tsx
"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { useMyListings } from "@/app/hooks/useMyListings";
import { deleteDraft, getDrafts, type Listing } from "@/app/services/myListingsService";
import { ErrorBanner } from "@/app/components/ErrorBanner";
import { MyListingCard } from "./components/MyListingCard";
import Pagination from "../../listings/components/Pagination";
import { ITEMS_PER_PAGE } from "@/app/constants";
import { PageLoading } from "@/app/components/ui";

// Force dynamic rendering
export const dynamic = "force-dynamic";

const ListingsPage: React.FC = () => {
  return (
    <Suspense fallback={<MyListingsSkeleton />}>
      <MyListingsContent />
    </Suspense>
  );
};

function MyListingsSkeleton() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-64 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-80 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MyListingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isLoggedIn, isLoading: authLoading } = useAuth();

  // BR-S11: Restrict access to BUYER and SELLER only
  useEffect(() => {
    if (!authLoading) {
      if (!isLoggedIn) {
        router.push("/login?returnUrl=/seller/my-listings");
      } else if (
        user &&
        ["ADMIN", "SHIPPER", "INSPECTOR"].includes(user.role)
      ) {
        router.push("/");
      }
    }
  }, [isLoggedIn, authLoading, router, user]);

  // Initialize filter from URL params with mapping
  const rawStatus = searchParams.get("status");
  const initialStatus = (() => {
    const s = rawStatus?.toLowerCase();
    if (s === "active") return "approve";
    if (s === "rejected") return "reject";
    return s || "";
  })();

  const [filterStatus, setFilterStatus] = useState(initialStatus);
  const [sortBy, setSortBy] = useState<
    "recent" | "views" | "price-high" | "price-low"
  >("recent");

  // BR-S11-F01: Pagination state
  const [page, setPage] = useState(1);

  // Delete state
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Draft listings state — loaded when filterStatus === "draft"
  // Reason: /listings/search endpoint does NOT return DRAFT listings (served by /drafts endpoint)
  const [draftListings, setDraftListings] = useState<Listing[]>([]);
  const [draftLoading, setDraftLoading] = useState(false);
  const [draftError, setDraftError] = useState<string | null>(null);

  const isShowingDrafts = filterStatus === "draft";

  useEffect(() => {
    if (!isShowingDrafts || !user?.userId) {
      setDraftListings([]);
      return;
    }
    const controller = new AbortController();
    const loadDrafts = async () => {
      setDraftLoading(true);
      setDraftError(null);
      try {
        const response = await getDrafts({ sellerId: user.userId });
        if (!controller.signal.aborted) {
          setDraftListings(response.items);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setDraftError(err instanceof Error ? err.message : "Không thể tải bản nháp.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setDraftLoading(false);
        }
      }
    };
    loadDrafts();
    return () => controller.abort();
  }, [isShowingDrafts, user?.userId]);

  // Use custom hook for data fetching and state management
  const { listings, totalItems, totalPages, loading, error, retry } =
    useMyListings({
      sellerId: user?.userId,
      page,
      pageSize: ITEMS_PER_PAGE,
      status: filterStatus || undefined,
      sortBy,
    });

  // Reset to page 1 when filter/sort changes
  useEffect(() => {
    setPage(1);
  }, [filterStatus, sortBy]);

  const handleDelete = async (listingId: number) => {
    if (!user?.userId) return;
    const confirmed = window.confirm("Bạn có chắc muốn xóa tin đăng này không?");
    if (!confirmed) return;

    setDeletingId(listingId);
    try {
      await deleteDraft(user.userId, listingId);
      if (isShowingDrafts) {
        setDraftListings((prev) => prev.filter((l) => l.id !== listingId));
      } else {
        retry();
      }
    } catch {
      alert("Xóa tin đăng thất bại. Vui lòng thử lại.");
    } finally {
      setDeletingId(null);
    }
  };

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  // Resolve display data: draft view uses dedicated API data
  const displayListings = isShowingDrafts ? draftListings : listings;
  const displayLoading = isShowingDrafts ? draftLoading : loading;
  const displayError = isShowingDrafts ? draftError : error;
  const displayTotal = isShowingDrafts ? draftListings.length : totalItems;

  if (authLoading) {
    return <PageLoading message="Đang xác thực tài khoản..." />;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Quản lý tin đăng</h1>
          <p className="text-gray-600 mt-2">Quản lý tất cả danh sách xe đạp của bạn</p>
        </div>
        <Link
          href="/seller/create-listing"
          className="px-6 py-3 bg-[#FF8A00] text-white rounded-lg font-semibold hover:bg-[#FF7A00] transition"
        >
          Đăng tin mới
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-8 flex-wrap">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Trạng thái:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="draft">Bản nháp</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approve">Đang hiển thị</option>
            <option value="reject">Bị từ chối</option>
            <option value="sold">Đã bán</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">
            Sắp xếp theo:
          </label>
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(
                e.target.value as
                  | "recent"
                  | "views"
                  | "price-high"
                  | "price-low",
              )
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
          >
            <option value="recent">Mới nhất</option>
            <option value="views">Xem nhiều nhất</option>
            <option value="price-high">Giá (Cao đến Thấp)</option>
            <option value="price-low">Giá (Thấp đến Cao)</option>
          </select>
        </div>
      </div>

      {/* Error Banner */}
      {displayError && <ErrorBanner message={displayError} onRetry={isShowingDrafts ? () => { setDraftListings([]); setDraftError(null); } : retry} />}

      {/* Listings Grid */}
      {displayLoading ? (
        <PageLoading message="Đang tải danh sách tin đăng..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayListings.map((listing) => (
            <MyListingCard
                key={listing.id}
                listing={listing}
                onDelete={handleDelete}
                isDeleting={deletingId === listing.id}
              />
          ))}
        </div>
      )}

      {/* BR-S11-F01: Pagination Controls (hidden for draft view) */}
      {!isShowingDrafts && totalItems > 0 && totalPages > 1 && (
        <div className="mt-8">
          {/* Page Info */}
          <div className="text-sm text-gray-600 text-center mb-4">
            Đang hiển thị {startIndex + 1}-{Math.min(endIndex, totalItems)} trên tổng số{" "}
            {totalItems} tin đăng
          </div>

          {/* Pagination Component */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      {!displayLoading && displayTotal === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Không tìm thấy tin đăng nào</p>
        </div>
      )}
    </div>
  );
}

export default ListingsPage;
