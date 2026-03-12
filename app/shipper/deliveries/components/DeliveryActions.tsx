'use client';

import { useRouter } from 'next/navigation';
import { MESSAGES } from '@/app/constants/messages';
import { Delivery } from '@/app/types/shipper';
import { Button } from '@/app/components/ui';
import { Truck, AlertTriangle, CheckCircle } from 'lucide-react';

interface DeliveryActionsProps {
    delivery: Delivery;
    isStarting: boolean;
    onStartDelivery: () => void;
}

/** Bottom fixed action bar for delivery detail page */
export function DeliveryActions({ delivery, isStarting, onStartDelivery }: DeliveryActionsProps) {
    const router = useRouter();

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-20">
            <div className="max-w-3xl mx-auto flex gap-3">
                {delivery.status === 'ASSIGNED' && (
                    <Button
                        variant="primary"
                        className="flex-1 text-lg py-4 shadow-blue-200 shadow-lg"
                        onClick={onStartDelivery}
                        disabled={isStarting}
                    >
                        {isStarting ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                {MESSAGES.S62_LOADING_TEXT}
                            </span>
                        ) : (
                            <>
                                <Truck className="w-5 h-5 mr-2" />
                                {MESSAGES.S62_BTN_START_DELIVERY}
                            </>
                        )}
                    </Button>
                )}

                {delivery.status === 'IN_PROGRESS' && (
                    <>
                        <Button
                            variant="outline"
                            className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => router.push(`/shipper/delivery-failed/${delivery.id}`)}
                        >
                            <AlertTriangle className="w-5 h-5 mr-2" />
                            {MESSAGES.S62_BTN_REPORT_ISSUE}
                        </Button>
                        <Button
                            variant="primary"
                            className="flex-1 bg-green-600 hover:bg-green-700 shadow-green-200 shadow-lg"
                            onClick={() => router.push(`/shipper/delivery-confirm/${delivery.id}`)}
                        >
                            <CheckCircle className="w-5 h-5 mr-2" />
                            {MESSAGES.S62_BTN_CONFIRM_DELIVERY}
                        </Button>
                    </>
                )}

                {(delivery.status === 'DELIVERED' || delivery.status === 'FAILED') && (
                    <div className="w-full text-center py-2 text-gray-500 text-sm">
                        {MESSAGES.S62_ORDER_ENDED}
                    </div>
                )}
            </div>
        </div>
    );
}
