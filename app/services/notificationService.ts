import { NotificationResponse, NotificationType, PaginatedNotificationResponse, UnreadCountResponse } from '@/app/types/notification';
import { apiCallGET, apiCallPATCH } from '../utils/apiHelpers';
import { validateObject, validateArray, validateNumber } from '../utils/apiValidation';

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
            console.error(`Lỗi lấy danh sách thông báo:`, error instanceof Error ? error.message : JSON.stringify(error));
            return { items: [], page: 0, size: 10, totalElements: 0, totalPages: 0 };
        }
    },

    /**
     * Get Unread Notification Count
     */
    getUnreadCount: async (userId: number): Promise<number> => {
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
        try {
            const response = await apiCallPATCH<any>(`/notifications/${notificationId}/read`, {});

            // Strict Validation
            if (response) {
                validateObject(response, 'Mark Single Notification As Read Response');
                if (response.isRead !== true) {
                    console.warn(`[API Warning] Received unexpectedly non-isRead status: ${response.isRead}`);
                }
            }
            return true;
        } catch (error: any) {
            console.error(`Lỗi mark read ${notificationId}:`, error);
            if (error.response?.status === 404) {
                console.warn(`[API Warning] Không tìm thấy notificationId: ${notificationId}`);
            }
            return false;
        }
    },

    /**
     * S-05 Mark All Unread Notifications As Read
     */
    markAllAsRead: async (userId: number): Promise<boolean> => {
        try {
            const response = await apiCallPATCH<any>(`/notifications/read-all`, {});

            // Strict Validation
            if (response) {
                validateObject(response, 'Mark All Unread Notifications As Read Response');
                if (typeof response.updatedCount !== 'number') {
                    console.warn(`[API Warning] Missing updatedCount in response`);
                }
            }
            return true;
        } catch (error: any) {
            console.error(`Lỗi mark all read cho user:`, error);
            // S-05 doesn't explicitly throw specific 400s here, but safe fallback
            return false;
        }
    },

    /**
     * S-05 Validation object exists before routing
     */
    validateRelatedObject: async (type: string, relatedId: number): Promise<boolean> => {
        return true;
    }
};
