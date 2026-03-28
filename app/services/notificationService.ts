import { NotificationResponse, NotificationType, PaginatedNotificationResponse, UnreadCountResponse } from '@/app/types/notification';
import { apiCallGET, apiCallPATCH } from '../utils/apiHelpers';
import { validateObject, validateArray, validateNumber } from '../utils/apiValidation';
import { authService } from './authService';
import { inspectorService } from './inspectorService';
import { getMyListings } from './myListingsService';

const INSPECTOR_NOTIFICATION_ID_OFFSET = 900000000;
const INSPECTOR_READ_STORAGE_KEY = 'cyclex.inspector.readNotifications';
const SELLER_NOTIFICATION_ID_OFFSET = 800000000;
const SELLER_READ_STORAGE_KEY = 'cyclex.seller.readNotifications';

function getCurrentUserRole(): string | undefined {
    const user = authService.getUser() as { role?: string } | null;
    return typeof user?.role === 'string' ? user.role.toUpperCase() : undefined;
}

function isInspectorRole(): boolean {
    return getCurrentUserRole() === 'INSPECTOR';
}

function isSellerRole(): boolean {
    return getCurrentUserRole() === 'SELLER';
}

function getStoredInspectorReadIds(): number[] {
    if (typeof window === 'undefined') {
        return [];
    }

    try {
        const raw = window.localStorage.getItem(INSPECTOR_READ_STORAGE_KEY);
        if (!raw) {
            return [];
        }

        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed
            .map((value) => Number(value))
            .filter((value) => Number.isFinite(value) && value > 0);
    } catch {
        return [];
    }
}

function setStoredInspectorReadIds(ids: number[]): void {
    if (typeof window === 'undefined') {
        return;
    }

    const normalized = Array.from(new Set(ids.filter((value) => Number.isFinite(value) && value > 0)));
    window.localStorage.setItem(INSPECTOR_READ_STORAGE_KEY, JSON.stringify(normalized));
}

function getStoredSellerReadIds(): number[] {
    if (typeof window === 'undefined') {
        return [];
    }

    try {
        const raw = window.localStorage.getItem(SELLER_READ_STORAGE_KEY);
        if (!raw) {
            return [];
        }

        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed
            .map((value) => Number(value))
            .filter((value) => Number.isFinite(value) && value > 0);
    } catch {
        return [];
    }
}

function setStoredSellerReadIds(ids: number[]): void {
    if (typeof window === 'undefined') {
        return;
    }

    const normalized = Array.from(new Set(ids.filter((value) => Number.isFinite(value) && value > 0)));
    window.localStorage.setItem(SELLER_READ_STORAGE_KEY, JSON.stringify(normalized));
}

function toInspectorNotificationId(listingId: string): number {
    const numericId = Number(listingId);
    if (Number.isFinite(numericId) && numericId > 0) {
        return INSPECTOR_NOTIFICATION_ID_OFFSET + numericId;
    }

    let hash = 0;
    for (const char of listingId) {
        hash = ((hash << 5) - hash) + char.charCodeAt(0);
        hash |= 0;
    }

    return INSPECTOR_NOTIFICATION_ID_OFFSET + Math.abs(hash);
}

function isSyntheticInspectorNotification(notificationId: number): boolean {
    return notificationId >= INSPECTOR_NOTIFICATION_ID_OFFSET;
}

function toSellerNotificationId(listingId: number, status: 'APPROVE' | 'REJECT'): number {
    return SELLER_NOTIFICATION_ID_OFFSET + (listingId * 10) + (status === 'APPROVE' ? 1 : 2);
}

function isSyntheticSellerNotification(notificationId: number): boolean {
    return notificationId >= SELLER_NOTIFICATION_ID_OFFSET && notificationId < INSPECTOR_NOTIFICATION_ID_OFFSET;
}

async function getBackendNotifications(
    page: number,
    size: number,
    isRead?: boolean,
    type?: NotificationType,
): Promise<PaginatedNotificationResponse> {
    const params = new URLSearchParams({
        page: String(page),
        size: String(size)
    });
    if (isRead !== undefined) params.append('isRead', String(isRead));
    if (type !== undefined) params.append('type', type);

    const response = await apiCallGET<any>(`/notifications?${params.toString()}`);

    validateObject(response, 'Notification API Paginated Response');
    const itemsArray = Array.isArray(response.items) ? response.items : [];

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
}

async function getBackendUnreadCount(): Promise<number> {
    const res = await apiCallGET<any>(`/notifications/unread-count`);
    validateObject(res, 'Unread Count Response');
    return typeof res.unreadCount === 'number' ? res.unreadCount : 0;
}

async function getInspectorSyntheticNotifications(): Promise<NotificationResponse[]> {
    if (!isInspectorRole()) {
        return [];
    }

    const readIds = getStoredInspectorReadIds();
    const rows = await inspectorService.getPendingListings();

    return rows
        .filter((row) => row.status === 'PENDING' || row.status === 'REVIEWING')
        .map((row) => {
            const notificationId = toInspectorNotificationId(row.id);
            const relatedId = Number(row.id);
            const isReviewing = row.status === 'REVIEWING';

            return {
                id: notificationId,
                title: isReviewing ? 'Tin đăng đang chờ inspector xử lý' : 'Có tin đăng mới cần duyệt',
                message: isReviewing
                    ? `${row.name} hiện đang ở hàng chờ kiểm định. Mở để tiếp tục xử lý.`
                    : `${row.name} vừa được gửi duyệt và cần inspector xem xét.`,
                type: 'INSPECTOR_PENDING_REVIEW' as NotificationType,
                relatedId: Number.isFinite(relatedId) && relatedId > 0 ? relatedId : null,
                isRead: readIds.includes(notificationId),
                createdAt: row.dateISO || new Date().toISOString(),
            };
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

async function getSellerSyntheticNotifications(userId: number): Promise<NotificationResponse[]> {
    if (!isSellerRole() || !userId) {
        return [];
    }

    const readIds = getStoredSellerReadIds();
    const response = await getMyListings({
        sellerId: userId,
        page: 1,
        pageSize: 100,
        sortBy: 'recent',
    });

    return response.listings
        .filter((listing) => listing.status === 'APPROVE' || listing.status === 'REJECT')
        .map((listing) => {
            const isApproved = listing.status === 'APPROVE';
            const notificationId = toSellerNotificationId(listing.id, isApproved ? 'APPROVE' : 'REJECT');
            const listingName = `${listing.brand} ${listing.model}`.trim();

            return {
                id: notificationId,
                title: isApproved ? 'Tin đăng đã được duyệt' : 'Tin đăng bị từ chối',
                message: isApproved
                    ? `${listingName || 'Tin đăng của bạn'} đã được duyệt và có thể hiển thị trên hệ thống.`
                    : `${listingName || 'Tin đăng của bạn'} đã bị từ chối.${listing.rejectionReason ? ` Lý do: ${listing.rejectionReason}` : ''}`,
                type: isApproved ? 'LISTING_APPROVED' as NotificationType : 'LISTING_REJECTED' as NotificationType,
                relatedId: listing.id,
                isRead: readIds.includes(notificationId),
                createdAt: listing.updatedDate || listing.createdDate || new Date().toISOString(),
            };
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

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
            const backendPromise = type === 'INSPECTOR_PENDING_REVIEW' || type === 'LISTING_APPROVED' || type === 'LISTING_REJECTED'
                ? Promise.resolve({ items: [], page, size, totalElements: 0, totalPages: 0 })
                : getBackendNotifications(page, size, isRead, type);

            const syntheticPromise = isInspectorRole() && (type === undefined || type === 'INSPECTOR_PENDING_REVIEW')
                ? getInspectorSyntheticNotifications()
                : Promise.resolve([]);

            const sellerSyntheticPromise = isSellerRole() && (type === undefined || type === 'LISTING_APPROVED' || type === 'LISTING_REJECTED')
                ? getSellerSyntheticNotifications(userId)
                : Promise.resolve([]);

            const [backendResponse, inspectorSyntheticItems, sellerSyntheticItems] = await Promise.all([
                backendPromise,
                syntheticPromise,
                sellerSyntheticPromise,
            ]);

            const mergedItems = [...inspectorSyntheticItems, ...sellerSyntheticItems, ...backendResponse.items]
                .filter((item) => isRead === undefined ? true : item.isRead === isRead)
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            const pagedItems = mergedItems.slice(page * size, page * size + size);

            return {
                items: pagedItems,
                page,
                size,
                totalElements: mergedItems.length,
                totalPages: mergedItems.length === 0 ? 0 : Math.ceil(mergedItems.length / size)
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
            const [backendUnreadCount, inspectorSyntheticItems, sellerSyntheticItems] = await Promise.all([
                getBackendUnreadCount().catch(() => 0),
                isInspectorRole() ? getInspectorSyntheticNotifications().catch(() => []) : Promise.resolve([]),
                isSellerRole() ? getSellerSyntheticNotifications(userId).catch(() => []) : Promise.resolve([]),
            ]);

            return backendUnreadCount
                + inspectorSyntheticItems.filter((item) => !item.isRead).length
                + sellerSyntheticItems.filter((item) => !item.isRead).length;
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
        let syntheticMarked = false;

        if (isSyntheticInspectorNotification(notificationId)) {
            const current = getStoredInspectorReadIds();
            if (!current.includes(notificationId)) {
                setStoredInspectorReadIds([...current, notificationId]);
            }
            syntheticMarked = true;
        }

        if (isSyntheticSellerNotification(notificationId)) {
            const current = getStoredSellerReadIds();
            if (!current.includes(notificationId)) {
                setStoredSellerReadIds([...current, notificationId]);
            }
            syntheticMarked = true;
        }

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
            return syntheticMarked;
        }
    },

    /**
     * S-05 Mark All Unread Notifications As Read
     */
    markAllAsRead: async (userId: number): Promise<boolean> => {
        let syntheticMarked = false;

        if (isInspectorRole()) {
            const syntheticItems = await getInspectorSyntheticNotifications().catch(() => []);
            if (syntheticItems.length > 0) {
                setStoredInspectorReadIds(syntheticItems.map((item) => item.id));
                syntheticMarked = true;
            }
        }

        if (isSellerRole()) {
            const syntheticItems = await getSellerSyntheticNotifications(userId).catch(() => []);
            if (syntheticItems.length > 0) {
                setStoredSellerReadIds(syntheticItems.map((item) => item.id));
                syntheticMarked = true;
            }
        }

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
            return syntheticMarked;
        }
    },

    /**
     * S-05 Validation object exists before routing
     */
    validateRelatedObject: async (type: string, relatedId: number): Promise<boolean> => {
        if (type === 'INSPECTOR_PENDING_REVIEW' || type === 'LISTING_APPROVED' || type === 'LISTING_REJECTED') {
            return relatedId > 0;
        }
        return true;
    }
};
