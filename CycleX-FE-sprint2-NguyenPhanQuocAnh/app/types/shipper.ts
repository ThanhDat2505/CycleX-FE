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
