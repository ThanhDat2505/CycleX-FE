export type NotificationType =
    | 'DELIVERY_SUCCESS'
    | 'DELIVERY_FAILED'
    | 'PURCHASE_REQUEST'
    | 'SELLER_CONFIRMED'
    | 'BUYER_CONFIRMED'
    | 'INSPECTION_COMPLETE'
    | 'SYSTEM';

export interface NotificationResponse {
    id: number;
    title: string;
    message: string;
    type: NotificationType;
    relatedId: number | null;
    isRead: boolean;
    createdAt: string;
}

export interface PaginatedNotificationResponse {
    items: NotificationResponse[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export interface UnreadCountResponse {
    unreadCount: number;
}
