/**
 * Dispute Types
 * Used for S-70 (Dispute Creation)
 */

// Match BE DisputeStatus enum: OPEN, IN_PROGRESS, RESOLVED, REJECTED
export type DisputeStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';

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

/**
 * BE DisputeDetailResponse shape (matches backend exactly)
 */
export interface DisputeDetailResponse {
    id: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    reasonCode: string;
    reasonText: string;
    description: string;
    resolutionNote?: string;
    resolutionAction?: string;
    resolvedAt?: string;
    assignee?: ActorDTO;
    requester?: ActorDTO;
    buyer?: ActorDTO;
    seller?: ActorDTO;
    listing?: {
        id: number;
        title: string;
        imageUrl?: string;
        priceVnd: number;
        status: string;
    };
    transaction?: {
        id: number;
        status: string;
        amountVnd: number;
        createdAt: string;
        updatedAt: string;
    };
    evidence?: EvidenceDTO[];
}

export interface ActorDTO {
    id: number;
    name: string;
    email: string;
    phone?: string;
}

export interface EvidenceDTO {
    type: string;
    url: string;
    text?: string;
    name?: string;
    uploaderRole: string;
}

/**
 * Flattened Dispute type used by buyer-side UI
 * Mapped from DisputeDetailResponse in buyerDisputeService
 */
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
    isOverridden?: boolean;
    createdAt: string;
    updatedAt: string;
}
