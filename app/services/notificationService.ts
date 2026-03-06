import { NotificationResponse, NotificationType } from '@/app/types/notification';
import { mockNotificationsDB } from '@/app/mocks/notifications';
import { apiCallGET, apiCallPUT } from '../utils/apiHelpers';

const USE_MOCK_API = process.env.NEXT_PUBLIC_MOCK_API === 'true';

export const notificationService = {
    /**
     * S-05 Get Notifications
     */
    getNotifications: async (userId: number): Promise<NotificationResponse[]> => {
        if (USE_MOCK_API) {
            await new Promise(resolve => setTimeout(resolve, 800));

            const userNotifs = mockNotificationsDB[userId] || [];
            // Sort by newest first (BR-02 Requirement)
            return [...userNotifs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }

        try {
            const response = await apiCallGET<Record<string, unknown>[]>(`/users/${userId}/notifications`);
            if (response && Array.isArray(response)) {
                return response.map(n => ({
                    id: Number(n.id),
                    title: String(n.title || 'Thông báo'),
                    message: String(n.message || ''),
                    type: (n.type as NotificationType) || 'SYSTEM',
                    relatedId: n.relatedId ? Number(n.relatedId) : null,
                    isRead: Boolean(n.isRead),
                    createdAt: String(n.createdAt || new Date().toISOString())
                })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            }
            return [];
        } catch (error) {
            console.error(`Lỗi lấy thông báo cho user ${userId}:`, error);
            // Graceful fallback empty array
            return [];
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
            await apiCallPUT(`/users/${userId}/notifications/${notificationId}/read`, {});
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
            await apiCallPUT(`/users/${userId}/notifications/read-all`, {});
            return true;
        } catch (error) {
            console.error(`Lỗi mark all read cho user ${userId}:`, error);
            return false;
        }
    },

    /**
     * S-05 Validation object exists before routing (Mock BR-05 Guard)
     * For Mock scenario we return False randomly on certain IDs to test Error messages.
     * In Production, FE might just send a quick ping GET /api/[resource]/[id] or let the target page show 404.
     * However, requirement says "If object doesn't exist: show error, don't crash".
     */
    validateRelatedObject: async (type: string, relatedId: number): Promise<boolean> => {
        // Return true realistically, but block some specific ID to test negative flow
        if (USE_MOCK_API) {
            await new Promise(resolve => setTimeout(resolve, 300));
            if (relatedId === 9999) return false; // Mock failure id
            return true;
        }

        // Ideally BE attaches "isValid" or target route handles 404 gracefully.
        // Assuming route handles 404, we return true to let system route gracefully.
        // If system STRICTLY requires pre-check, implement API ping here.
        return true;
    }
};
