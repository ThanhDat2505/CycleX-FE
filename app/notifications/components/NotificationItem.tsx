'use client';

import { NotificationResponse, NotificationType } from '@/app/types/notification';
import { MESSAGES } from '@/app/constants/messages';
import { ShoppingBag, Box, AlertOctagon, Bell } from 'lucide-react';

interface NotificationItemProps {
    notification: NotificationResponse;
    onClick: (notification: NotificationResponse) => void;
}

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
    const { title, message, type, isRead, createdAt } = notification;

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case 'LISTING_RELATED':
                return <ShoppingBag className="w-5 h-5 text-blue-600" />;
            case 'TRANSACTION_RELATED':
                return <Box className="w-5 h-5 text-green-600" />;
            case 'DISPUTE_RELATED':
                return <AlertOctagon className="w-5 h-5 text-red-600" />;
            case 'SYSTEM':
            default:
                return <Bell className="w-5 h-5 text-gray-600" />;
        }
    };

    const getIconBackground = (type: NotificationType) => {
        switch (type) {
            case 'LISTING_RELATED':
                return 'bg-blue-100';
            case 'TRANSACTION_RELATED':
                return 'bg-green-100';
            case 'DISPUTE_RELATED':
                return 'bg-red-100';
            case 'SYSTEM':
            default:
                return 'bg-gray-100';
        }
    };

    // Very simple relative time formatter
    const getRelativeTime = (isoString: string) => {
        const date = new Date(isoString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return MESSAGES.S05_TIME_JUST_NOW;
        if (diffMins < 60) return `${diffMins} ${MESSAGES.S05_TIME_MINUTES}`;
        const diffHrs = Math.floor(diffMins / 60);
        if (diffHrs < 24) return `${diffHrs} ${MESSAGES.S05_TIME_HOURS}`;
        const diffDays = Math.floor(diffHrs / 24);
        return `${diffDays} ${MESSAGES.S05_TIME_DAYS}`;
    };

    return (
        <div
            onClick={() => onClick(notification)}
            className={`
                flex items-start p-4 sm:p-5 cursor-pointer transition-all border-b border-gray-100 last:border-0 hover:bg-gray-50
                ${!isRead ? 'bg-blue-50/30' : 'opacity-80'}
            `}
        >
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 ${getIconBackground(type)}`}>
                {getIcon(type)}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                    <p className={`text-sm font-medium ${!isRead ? 'text-gray-900' : 'text-gray-700'} truncate pr-4`}>
                        {title}
                    </p>
                    <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                        {getRelativeTime(createdAt)}
                    </span>
                </div>
                <p className={`text-sm ${!isRead ? 'text-gray-600' : 'text-gray-500'} line-clamp-2`}>
                    {message}
                </p>
            </div>

            {!isRead && (
                <div className="flex-shrink-0 ml-4 self-center w-2 h-2 rounded-full bg-blue-600"></div>
            )}
        </div>
    );
}
