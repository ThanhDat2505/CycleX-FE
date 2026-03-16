"use client";

import Link from "next/link";
import { Delivery } from "@/app/types/shipper";
import { getStatusColor, getStatusLabel } from "@/app/utils/deliveryUtils";
import { ArrowRight, Clock } from "lucide-react";

interface DeliveryCardProps {
  delivery: Delivery;
}

/** Single delivery item card in the list */
export function DeliveryCard({ delivery }: DeliveryCardProps) {
  return (
    <Link
      href={`/shipper/deliveries/${delivery.id}`}
      className="block bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-blue-300 transition-all group"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(delivery.status)}`}
          >
            {getStatusLabel(delivery.status)}
          </span>
          <span className="text-xs text-gray-500 font-mono">
            {delivery.orderId}
          </span>
        </div>
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {new Date(delivery.scheduledDate).toLocaleDateString("vi-VN")}
        </span>
      </div>

      <div className="flex gap-4">
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
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
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
            {delivery.bike.name}
          </h3>

          <div className="mt-2 space-y-1.5">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
              <p className="text-sm text-gray-600 line-clamp-1">
                {delivery.sender.address}
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
              <p className="text-sm text-gray-600 line-clamp-1">
                {delivery.receiver.address}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center w-8 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all">
          <ArrowRight className="w-5 h-5" />
        </div>
      </div>
    </Link>
  );
}
