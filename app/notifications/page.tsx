'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { useToast } from '@/app/contexts/ToastContext';
import { notificationService } from '@/app/services/notificationService';
import { NotificationResponse } from '@/app/types/notification';
import { MESSAGES } from '@/app/constants/messages';
import { NotificationHeader } from './components/NotificationHeader';
import { NotificationList } from './components/NotificationList';

export default function NotificationsPage() {
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();
    const { addToast } = useToast();

    const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    // BR-01: Permission Check
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    // BR-02 & BR-06: Fetch on Mount
    useEffect(() => {
        let isMounted = true;
        const fetchNotifications = async () => {
            if (!user?.userId) return;
            try {
                setIsLoading(true);
                const data = await notificationService.getNotifications(user.userId);
                if (isMounted) setNotifications(data);
            } catch {
                if (isMounted) addToast(MESSAGES.S05_ERROR_LOAD, 'error');
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        if (user) {
            fetchNotifications();
        }

        return () => { isMounted = false; };
    }, [user, addToast]);

    const unreadCount = useMemo(() =>
        notifications.filter(n => !n.isRead).length
        , [notifications]);

    // BR-04: Mark All As Read
    const handleMarkAllAsRead = async () => {
        if (!user?.userId || unreadCount === 0) return;

        // Optimistic UI Update
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));

        try {
            setIsUpdating(true);
            const success = await notificationService.markAllAsRead(user.userId);
            if (!success) {
                // Revert if failed
                addToast(MESSAGES.S05_ERROR_MARK_READ, 'error');
                const data = await notificationService.getNotifications(user.userId);
                setNotifications(data);
            }
        } catch {
            addToast(MESSAGES.S05_ERROR_MARK_READ, 'error');
        } finally {
            setIsUpdating(false);
        }
    };

    // BR-03 & BR-05: Click Notification
    const handleNotificationClick = useCallback(async (notif: NotificationResponse) => {
        if (!user?.userId) return;

        // BR-03: Mark as Read instantly without reload
        if (!notif.isRead) {
            setNotifications(prev =>
                prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n)
            );
            // Fire API in background
            notificationService.markAsRead(user.userId, notif.id).catch(() => {
                // Ignore rollback on failure to keep UI smooth, or show silent warning
                console.warn("Failed to mark notification as read in background.");
            });
        }

        // BR-05: Navigation Logic
        if (!notif.relatedId) return; // SYSTEM type might not have relatedId

        try {
            // Guard: Check if object exists
            const isValid = await notificationService.validateRelatedObject(notif.type, notif.relatedId);

            if (!isValid) {
                addToast(MESSAGES.S05_ERROR_INVALID_OBJECT, 'error');
                return;
            }

            // Route mapping
            switch (notif.type) {
                case 'LISTING_RELATED':
                    router.push(`/listings/${notif.relatedId}`);
                    break;
                case 'TRANSACTION_RELATED':
                case 'DISPUTE_RELATED':
                    router.push(`/transactions/${notif.relatedId}`);
                    break;
                default:
                    break;
            }
        } catch {
            addToast(MESSAGES.S05_ERROR_INVALID_OBJECT, 'error');
        }
    }, [user?.userId, router, addToast]);

    if (authLoading || isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex justify-center items-center">
                <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    Đang tải...
                </span>
            </div>
        );
    }

    if (!user) return null;

    return (
        <main className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
                    <NotificationHeader
                        unreadCount={unreadCount}
                        onMarkAllAsRead={handleMarkAllAsRead}
                        isUpdating={isUpdating}
                    />

                    <div className="max-h-[700px] overflow-y-auto">
                        <NotificationList
                            notifications={notifications}
                            onNotificationClick={handleNotificationClick}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
