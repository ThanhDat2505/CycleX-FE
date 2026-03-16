"use client";

import { MESSAGES } from "@/app/constants/messages";
import { Delivery } from "@/app/types/shipper";
import { Package, AlertTriangle } from "lucide-react";

interface BikeInfoCardProps {
  delivery: Delivery;
}

/** Bike image, COD amount, and notes card */
export function BikeInfoCard({ delivery }: BikeInfoCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex p-4 gap-4">
        <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
          <img
            src={delivery.bike.image}
            alt={delivery.bike.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "/placeholder-bike.png";
            }}
          />
        </div>
        <div className="flex-1 min-w-0 py-1">
          <h3 className="text-lg font-bold text-gray-900 truncate">
            {delivery.bike.name}
          </h3>
          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Package className="w-4 h-4" />
              <span>
                {MESSAGES.S62_COD_LABEL}{" "}
                <span className="font-semibold text-gray-900">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(delivery.codAmount || 0)}
                </span>
              </span>
            </div>
            {delivery.note && (
              <div className="flex items-start gap-2 text-sm text-amber-600 bg-amber-50 p-2 rounded-lg mt-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{delivery.note}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
