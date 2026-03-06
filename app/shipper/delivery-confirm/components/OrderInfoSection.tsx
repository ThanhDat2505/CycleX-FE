'use client';

import { MESSAGES } from '@/app/constants/messages';
import { Delivery } from '@/app/types/shipper';
import { ShoppingBag } from 'lucide-react';

interface OrderInfoSectionProps {
    delivery: Delivery;
}

/** Section 2: Display order/product info */
export function OrderInfoSection({ delivery }: OrderInfoSectionProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-green-500" />
                {MESSAGES.S63_ORDER_INFO_TITLE}
            </h3>
            <div className="flex gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                    <img
                        src={delivery.bike.image}
                        alt={delivery.bike.name}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                    <div>
                        <p className="text-xs text-gray-500">{MESSAGES.S63_ORDER_ID_LABEL}</p>
                        <p className="text-sm font-semibold text-gray-900">{delivery.orderId}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">{MESSAGES.S63_PRODUCT_LABEL}</p>
                        <p className="text-sm font-medium text-gray-900">{delivery.bike.name}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">{MESSAGES.S63_SENDER_LABEL}</p>
                        <p className="text-sm font-medium text-gray-900">{delivery.sender.name}</p>
                    </div>
                    {typeof delivery.codAmount === 'number' && delivery.codAmount > 0 && (
                        <div>
                            <p className="text-xs text-gray-500">{MESSAGES.S63_COD_LABEL}</p>
                            <p className="text-sm font-semibold text-blue-600">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(delivery.codAmount)}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
