'use client';

import { MESSAGES } from '@/app/constants/messages';
import { Button } from '@/app/components/ui';
import { CheckCircle } from 'lucide-react';

interface DeliveryHistoryProps {
    deliveredCount: number;
    onViewHistory: () => void;
}

/** Completed delivery stats card on Shipper Dashboard */
export function DeliveryHistory({ deliveredCount, onViewHistory }: DeliveryHistoryProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center items-center text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">{MESSAGES.S60_DELIVERED_TITLE}</h3>
            <p className="text-gray-500 mt-1 mb-6">
                {MESSAGES.S60_DELIVERED_PREFIX}{' '}
                <span className="font-semibold text-gray-900">{deliveredCount}</span>{' '}
                {MESSAGES.S60_DELIVERED_SUFFIX}
            </p>
            <Button
                variant="outline"
                onClick={onViewHistory}
                className="w-full sm:w-auto"
            >
                {MESSAGES.S60_BTN_VIEW_HISTORY}
            </Button>
        </div>
    );
}
