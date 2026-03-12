'use client';

import { MESSAGES } from '@/app/constants/messages';
import { Button } from '@/app/components/ui';
import { CheckCheck } from 'lucide-react';

interface NotificationHeaderProps {
    unreadCount: number;
    onMarkAllAsRead: () => void;
    isUpdating: boolean;
}

export function NotificationHeader({ unreadCount, onMarkAllAsRead, isUpdating }: NotificationHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b border-gray-100 bg-white sticky top-0 z-10">
            <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
                    {MESSAGES.S05_PAGE_TITLE}
                    {unreadCount > 0 && (
                        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {unreadCount} mới
                        </span>
                    )}
                </h1>
            </div>

            {unreadCount > 0 && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onMarkAllAsRead}
                    disabled={isUpdating}
                    className="text-gray-600 hover:text-gray-900 border-gray-200"
                >
                    <CheckCheck className="w-4 h-4 mr-2" />
                    {MESSAGES.S05_MARK_ALL_READ}
                </Button>
            )}
        </div>
    );
}
