export type NotificationType =
    | 'LISTING_RELATED'
    | 'TRANSACTION_RELATED'
    | 'DISPUTE_RELATED'
    | 'SYSTEM';

export interface NotificationResponse {
    id: number;
    title: string;
    message: string;
    type: NotificationType;
    relatedId: number | null; // ID of the listing/transaction/dispute. Null for SYSTEM.
    isRead: boolean;
    createdAt: string;
}
