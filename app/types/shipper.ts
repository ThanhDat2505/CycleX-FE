/**
 * Shipper Types
 * Used for S-60, S-61 (BP6 - Delivery flow)
 */

export type DeliveryStatus = 'ASSIGNED' | 'IN_PROGRESS' | 'DELIVERED' | 'FAILED';

export interface DeliverySummary {
    assigned: number;
    inProgress: number;
    delivered: number;
    failed: number;
}

export interface Delivery {
    id: string; // e.g. "DEL-001"
    orderId: string;
    sender: {
        name: string;
        phone: string;
        address: string;
    };
    receiver: {
        name: string;
        phone: string;
        address: string;
    };
    bike: {
        name: string;
        image: string;
    };
    status: DeliveryStatus;
    assignedDate: string; // ISO date
    scheduledDate: string; // ISO date
    completedDate?: string; // ISO date
    codAmount?: number; // Cash on delivery if any
    note?: string;
}

export type DeliveryFilter = 'ALL' | 'ASSIGNED' | 'IN_PROGRESS' | 'DELIVERED' | 'FAILED';

/**
 * S-63: Delivery Confirmation request payload
 * receiverName & receiverPhone are required (BR05)
 * signatureImage is optional
 */
export interface DeliveryConfirmRequest {
    receiverName: string;
    receiverPhone: string;
    signatureImage?: string;
}

/**
 * S-64: Delivery Failed Report request payload
 * reason is required (BR03)
 * imageProof is optional
 */
export interface DeliveryFailedRequest {
    reason: string;
    imageProof?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    page: number;
    totalElements: number;
}

export interface DeliveryConfirmationInfo {
    deliveryId: string;
}

export interface DeliveryFailureInfo {
    deliveryId: string;
    transactionId: string;
    listingId: string;
    buyerName: string;
    buyerPhone: string;
    sellerName: string;
    deliveryAddress: string;
    productName: string;
    deliveryStatus: string;
    transactionStatus: string;
}
