'use client';

import { NotificationResponse } from '@/app/types/notification';
import { NotificationItem } from './NotificationItem';
import { MESSAGES } from '@/app/constants/messages';
import { BellMinus } from 'lucide-react';

interface NotificationListProps {
    notifications: NotificationResponse[];
    onNotificationClick: (notification: NotificationResponse) => void;
}

export function NotificationList({ notifications, onNotificationClick }: NotificationListProps) {
    if (!notifications || notifications.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <BellMinus className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {MESSAGES.S05_EMPTY_TITLE}
                </h3>
                <p className="text-sm text-gray-500 max-w-sm">
                    {MESSAGES.S05_EMPTY_DESC}
                </p>
            </div>
        );
    }

    return (
        <div className="divide-y divide-gray-100">
            {notifications.map(notif => (
                <NotificationItem
                    key={notif.id}
                    notification={notif}
                    onClick={onNotificationClick}
                />
            ))}
        </div>
    );
}
