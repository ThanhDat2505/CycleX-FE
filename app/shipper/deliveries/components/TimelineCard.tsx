'use client';

import { MESSAGES } from '@/app/constants/messages';
import { Delivery } from '@/app/types/shipper';
import { Clock } from 'lucide-react';

interface TimelineCardProps {
    delivery: Delivery;
}

/** Timeline card showing assignment, scheduled, and completed dates */
export function TimelineCard({ delivery }: TimelineCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-500" />
                {MESSAGES.S62_TIMELINE_TITLE}
            </h3>
            <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">{MESSAGES.S62_ASSIGNED_DATE_LABEL}</span>
                    <span className="font-medium text-gray-900">{new Date(delivery.assignedDate).toLocaleString('vi-VN')}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">{MESSAGES.S62_SCHEDULED_DATE_LABEL}</span>
                    <span className="font-medium text-gray-900">{new Date(delivery.scheduledDate).toLocaleDateString('vi-VN')}</span>
                </div>
                {delivery.completedDate && (
                    <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-100">
                        <span className="text-gray-500">{MESSAGES.S62_COMPLETED_DATE_LABEL}</span>
                        <span className="font-medium text-green-600">{new Date(delivery.completedDate).toLocaleString('vi-VN')}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
