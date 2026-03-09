import { NotificationResponse, NotificationType, PaginatedNotificationResponse, UnreadCountResponse } from '@/app/types/notification';
import { mockNotificationsDB } from '@/app/mocks/notifications';
import { apiCallGET, apiCallPATCH } from '../utils/apiHelpers';
import { validateObject, validateArray, validateNumber } from '../utils/apiValidation';

const USE_MOCK_API = process.env.NEXT_PUBLIC_MOCK_API === 'true';

export const notificationService = {
    /**
     * S-05 Get Notifications (Paginated)
     */
    getNotifications: async (
        userId: number,
        page: number = 0,
        size: number = 10,
        isRead?: boolean,
        type?: NotificationType
    ): Promise<PaginatedNotificationResponse> => {
        if (USE_MOCK_API) {
            await new Promise(resolve => setTimeout(resolve, 800));

            let userNotifs = mockNotificationsDB[userId] || [];
            if (isRead !== undefined) userNotifs = userNotifs.filter(n => n.isRead === isRead);
            if (type !== undefined) userNotifs = userNotifs.filter(n => n.type === type);

            // Sort by newest first (BR-02 Requirement)
            userNotifs = [...userNotifs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            return {
                items: userNotifs.slice(page * size, (page + 1) * size),
                page,
                size,
                totalElements: userNotifs.length,
                totalPages: Math.ceil(userNotifs.length / size)
            };
        }

        try {
            const params = new URLSearchParams({
                page: String(page),
                size: String(size)
            });
            if (isRead !== undefined) params.append('isRead', String(isRead));
            if (type !== undefined) params.append('type', type);

            const response = await apiCallGET<any>(`/notifications?${params.toString()}`);

            // Validate BE structure
            validateObject(response, 'Notification API Paginated Response');
            const itemsArray = Array.isArray(response.items) ? response.items : [];

            // Map standard 
            const items = itemsArray.map((n: any) => ({
                id: Number(n.id || n.notificationId),
                title: String(n.title || 'Thông báo'),
                message: String(n.message || ''),
                type: (n.type as NotificationType) || 'SYSTEM',
                relatedId: n.relatedId ? Number(n.relatedId) : null,
                isRead: Boolean(n.isRead),
                createdAt: String(n.createdAt || new Date().toISOString())
            }));

            return {
                items,
                page: typeof response.page === 'number' ? response.page : page,
                size: typeof response.size === 'number' ? response.size : size,
                totalElements: typeof response.totalElements === 'number' ? response.totalElements : items.length,
                totalPages: typeof response.totalPages === 'number' ? response.totalPages : 1
            };
        } catch (error) {
            console.error(`Lỗi lấy danh sách thông báo:`, error);
            return { items: [], page: 0, size: 10, totalElements: 0, totalPages: 0 };
        }
    },

    /**
     * Get Unread Notification Count
     */
    getUnreadCount: async (userId: number): Promise<number> => {
        if (USE_MOCK_API) {
            await new Promise(resolve => setTimeout(resolve, 300));
            const userNotifs = mockNotificationsDB[userId] || [];
            return userNotifs.filter(n => !n.isRead).length;
        }

        try {
            const res = await apiCallGET<any>(`/notifications/unread-count`);
            validateObject(res, 'Unread Count Response');
            return typeof res.unreadCount === 'number' ? res.unreadCount : 0;
        } catch (error) {
            console.error('Lỗi lấy số lượng chưa đọc:', error);
            return 0; // fallback to 0 instead of crashing hook
        }
    },

    /**
     * Get Single Notification Detail
     */
    getNotificationDetail: async (userId: number, notificationId: number): Promise<NotificationResponse | null> => {
        if (USE_MOCK_API) {
            await new Promise(resolve => setTimeout(resolve, 400));
            const userNotifs = mockNotificationsDB[userId] || [];
            return userNotifs.find(n => n.id === notificationId) || null;
        }

        try {
            const n = await apiCallGET<any>(`/notifications/${notificationId}`);
            if (!n) return null;
            validateObject(n, 'Notification Detail API');

            return {
                id: Number(n.id || n.notificationId || notificationId),
                title: String(n.title || 'Thông báo'),
                message: String(n.message || ''),
                type: (n.type as NotificationType) || 'SYSTEM',
                relatedId: n.relatedId ? Number(n.relatedId) : null,
                isRead: Boolean(n.isRead),
                createdAt: String(n.createdAt || new Date().toISOString())
            };
        } catch (error) {
            console.error(`Lỗi lấy chi tiết notification ${notificationId}:`, error);
            return null;
        }
    },

    /**
     * S-05 Mark Single Notification As Read
     */
    markAsRead: async (userId: number, notificationId: number): Promise<boolean> => {
        if (USE_MOCK_API) {
            await new Promise(resolve => setTimeout(resolve, 300));
            const userNotifs = mockNotificationsDB[userId];
            if (userNotifs) {
                const notif = userNotifs.find(n => n.id === notificationId);
                if (notif) notif.isRead = true;
                return true;
            }
            return false;
        }

        try {
            await apiCallPATCH(`/notifications/${notificationId}/read`, {});
            return true;
        } catch (error) {
            console.error(`Lỗi mark read ${notificationId}:`, error);
            return false;
        }
    },

    /**
     * S-05 Mark All Unread Notifications As Read
     */
    markAllAsRead: async (userId: number): Promise<boolean> => {
        if (USE_MOCK_API) {
            await new Promise(resolve => setTimeout(resolve, 600));
            const userNotifs = mockNotificationsDB[userId];
            if (userNotifs) {
                userNotifs.forEach(n => { n.isRead = true; });
                return true;
            }
            return false;
        }

        try {
            await apiCallPATCH(`/notifications/read-all`, {});
            return true;
        } catch (error) {
            console.error(`Lỗi mark all read cho user:`, error);
            return false;
        }
    },

    /**
     * S-05 Validation object exists before routing (Mock BR-05 Guard)
     */
    validateRelatedObject: async (type: string, relatedId: number): Promise<boolean> => {
        // Return true realistically, but block some specific ID to test negative flow
        if (USE_MOCK_API) {
            await new Promise(resolve => setTimeout(resolve, 300));
            if (relatedId === 9999) return false; // Mock failure id
            return true;
        }
        return true;
    }
};
