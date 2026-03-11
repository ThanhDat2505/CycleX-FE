/**
 * Dispute Types
 * Used for S-70 (Dispute Creation)
 */

export type DisputeStatus = 'PENDING' | 'RESOLVED' | 'CANCELLED' | 'SOLVED' | 'REJECTED';

export interface DisputeReason {
    reasonId: number;
    title: string;
    description?: string;
}

export interface CreateDisputeRequest {
    orderId: number; // Linked to transactionId
    buyerId: number;
    sellerId: number;
    title: string;
    content: string;
    reasonId: number;
    evidenceUrls: string[];
}

export interface Dispute {
    disputeId: number;
    orderId: number;
    buyerId: number;
    sellerId: number;
    title: string;
    content: string;
    reason: string;
    status: DisputeStatus;
    evidenceUrls: string[];
    adminNote?: string;
    resolvedAt?: string;
    createdAt: string;
    updatedAt: string;
}
