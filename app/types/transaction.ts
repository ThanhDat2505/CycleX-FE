/**
 * Transaction Types
 * Used for S-50, S-51, S-52, S-53, S-54 (BP5 - Purchase/Deposit flow)
 */

export type TransactionType = 'PURCHASE' | 'DEPOSIT';

export type TransactionStatus =
    | 'PENDING_SELLER_CONFIRM'
    | 'CONFIRMED'
    | 'CANCELLED'
    | 'COMPLETED';

/**
 * Form data for S-50 Step 1 (Input)
 */
export interface PurchaseRequestForm {
    transactionType: TransactionType;
    desiredTime: string; // ISO datetime string
    receiverName: string;
    receiverPhone: string;
    receiverAddress: string;
    depositAmount?: number;
    note?: string;
}

/**
 * Request payload to create transaction
 */
export interface CreateTransactionRequest {
    listingId: number;
    buyerId: number;
    transactionType: TransactionType;
    desiredTime: string;
    receiverName: string;
    receiverPhone: string;
    receiverAddress: string;
    depositAmount?: number;
    note?: string;
}

/**
 * Transaction object (from backend)
 */
export interface Transaction {
    transactionId: number;
    listingId: number;
    buyerId: number;
    sellerId: number;
    transactionType: TransactionType;
    status: TransactionStatus;
    desiredTime: string;
    receiverName?: string;
    receiverPhone?: string;
    receiverAddress?: string;
    depositAmount?: number;
    note?: string;
    platformFee: number;
    inspectionFee: number;
    totalAmount: number;
    createdAt: string;
    updatedAt: string;
}

/**
 * Transaction with details for list view (S-52)
 */
export interface TransactionWithDetails extends Transaction {
    listingTitle: string;
    listingImage?: string;
    buyerName: string;
    buyerAvatar?: string;
    sellerName?: string;
    sellerPhone?: string;
    sellerAvatar?: string;
}
