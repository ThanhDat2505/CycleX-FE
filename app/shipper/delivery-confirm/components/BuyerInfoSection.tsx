'use client';

import { MESSAGES } from '@/app/constants/messages';
import { Delivery } from '@/app/types/shipper';
import { User, Phone, MapPin } from 'lucide-react';

interface BuyerInfoSectionProps {
    receiver: Delivery['receiver'];
}

/** Section 1: Display buyer/receiver contact info */
export function BuyerInfoSection({ receiver }: BuyerInfoSectionProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" />
                {MESSAGES.S63_BUYER_INFO_TITLE}
            </h3>
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                        <p className="text-xs text-gray-500">{MESSAGES.S63_RECEIVER_NAME_LABEL}</p>
                        <p className="text-sm font-medium text-gray-900">{receiver.name}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div>
                        <p className="text-xs text-gray-500">{MESSAGES.S63_RECEIVER_PHONE_INFO_LABEL}</p>
                        <p className="text-sm font-medium text-gray-900">{receiver.phone}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                        <p className="text-xs text-gray-500">{MESSAGES.S63_RECEIVER_ADDRESS_LABEL}</p>
                        <p className="text-sm font-medium text-gray-900">{receiver.address}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
