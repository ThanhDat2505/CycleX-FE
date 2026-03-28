/**
 * MyListingCard Component
 * Displays a single listing card in My Listings page
 *
 * Features:
 * - Status badge (Draft/Pending/Active/Rejected)
 * - Listing info (brand, model, type, condition, price, location)
 * - Stats (views, inquiries, shipping)
 * - Action buttons (Edit for DRAFT/PENDING, View always)
 * - Rejection reason display for REJECT status
 */

import React from "react";
import Link from "next/link";
import { formatPrice } from "../../../utils/format";
import { StatusBadge } from "@/app/components/ui/StatusBadge";

export interface MyListingCardProps {
  listing: {
    id: number;
    mainImageUrl?: string;
    brand: string;
    model: string;
    type: string;
    condition: string;
    price: number;
    location: string;
    views: number;
    inquiries: number;
    shipping: boolean;
    status:
      | "DRAFT"
      | "PENDING"
      | "APPROVE"
      | "REJECT"
      | "NEED_MORE_INFO"
      | "HELD"
      | "SOLD";
    rejectionReason?: string;
  };
  onDelete?: (id: number) => void;
  isDeleting?: boolean;
}

export function MyListingCard({ listing, onDelete, isDeleting }: MyListingCardProps) {
  const editHref = `/seller/create-listing?draft=${listing.id}`;
  const viewHref =
    listing.status === "APPROVE" || listing.status === "SOLD"
      ? `/listings/${listing.id}`
      : `/seller/create-listing?draft=${listing.id}&mode=view`;

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition">
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
        {listing.mainImageUrl ? (
          <img
            src={listing.mainImageUrl}
            alt={`${listing.brand} ${listing.model}`}
            className="h-full w-full object-cover"
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
        <div className="absolute top-3 right-3">
          <StatusBadge status={listing.status} showLabel />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-2">
          {listing.brand} {listing.model}
        </h3>
        {(listing.type || listing.condition) && (
          <div className="text-sm text-gray-600 mb-3">
            {listing.type && <span>{listing.type}</span>}
            {listing.type && listing.condition && <span> • </span>}
            {listing.condition && <span>{listing.condition}</span>}
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-[#FF8A00]">
            {formatPrice(listing.price)}
          </span>
          {listing.location && (
            <span className="text-xs text-gray-500">{listing.location}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {/* BR-S11-F05: Edit button only for DRAFT and NEED_MORE_INFO status */}
          {(listing.status === "DRAFT" ||
            listing.status === "NEED_MORE_INFO") && (
            <Link
              href={editHref}
              className="flex-1 px-3 py-2 bg-[#FF8A00] text-white rounded text-sm font-medium hover:bg-[#FF7A00] transition text-center"
            >
              Sửa
            </Link>
          )}
          <Link
            href={viewHref}
            className="flex-1 px-3 py-2 border border-gray-300 text-gray-900 rounded text-sm font-medium hover:bg-gray-50 transition text-center"
          >
            Xem
          </Link>
          {/* Delete button */}
          {onDelete && (
            <button
              onClick={() => onDelete(listing.id)}
              disabled={isDeleting}
              className="flex-1 px-3 py-2 border border-red-300 text-red-600 rounded text-sm font-medium hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </button>
          )}
        </div>

        {/* BR-S11-F06: Rejection Reason Display */}
        {listing.status === "REJECT" && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="text-red-600 font-semibold text-sm">
                ❌ Lý do từ chối:
              </span>
            </div>
            <p className="text-sm text-gray-700 mt-1">
              {listing.rejectionReason}
            </p>
            <p className="text-sm text-gray-600 mt-2 italic">
              Mọi thắc mắc thì vui lòng liên hệ qua gmail{" "}
              <a
                href="mailto:inspector@gmail.com"
                className="text-blue-600 underline hover:text-blue-800"
              >
                inspector@gmail.com
              </a>{" "}
              của chúng tôi
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
