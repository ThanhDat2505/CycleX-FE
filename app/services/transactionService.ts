
/**
 * Transaction Service
 * Handles API calls for transaction operations (BP5)
 * Currently in mock mode - will connect to real API later
 */

import { CreateTransactionRequest, Transaction } from '../types/transaction';

// Mock mode for development
const USE_MOCK_API = process.env.NEXT_PUBLIC_MOCK_API === 'true';

/**
 * Create purchase or deposit request
 * Endpoint: POST /api/transactions (future)
 * 
 * @param data - Transaction request data
 * @returns Promise<Transaction> - Created transaction
 */
import { apiCallPOST, apiCallGET, apiCallPUT } from '../utils/apiHelpers';

/**
 * Create purchase or deposit request
 * Endpoint: POST /api/transactions (future)
 * 
 * @param data - Transaction request data
 * @returns Promise<Transaction> - Created transaction
 */
export async function createPurchaseRequest(
    data: CreateTransactionRequest
): Promise<Transaction> {
    if (USE_MOCK_API) {
        // ... existing mock logic ...
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock fees calculation
        const platformFee = 50000; // 50k VND
        const inspectionFee = 100000; // 100k VND

        // Calculate total
        const listingPrice = 5000000; // Will get from listing data
        const totalAmount = data.transactionType === 'PURCHASE'
            ? listingPrice + platformFee + inspectionFee
            : (data.depositAmount || 0) + platformFee;

        // Return mock transaction
        const mockTransaction: Transaction = {
            transactionId: Math.floor(Math.random() * 10000),
            listingId: data.listingId,
            buyerId: data.buyerId,
            sellerId: 1, // Mock seller ID
            transactionType: data.transactionType,
            status: 'PENDING_SELLER_CONFIRM',
            desiredTime: data.desiredTime,
            receiverName: data.receiverName,
            receiverPhone: data.receiverPhone,
            receiverAddress: data.receiverAddress,
            depositAmount: data.depositAmount,
            note: data.note,
            platformFee,
            inspectionFee,
            totalAmount,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        return mockTransaction;
    }

    // Real API call
    return apiCallPOST<Transaction>('/transactions', data);
}

/**
 * Get transaction detail
 * @param transactionId - Transaction ID
 * @returns Promise<Transaction>
 */
export async function getTransactionDetail(
    transactionId: number
): Promise<import('../types/transaction').TransactionWithDetails> {
    if (USE_MOCK_API) {
        // ... existing mock logic ...
        await new Promise(resolve => setTimeout(resolve, 500));

        // Return mock transaction with details
        const mockTransaction: import('../types/transaction').TransactionWithDetails = {
            transactionId,
            listingId: 1,
            buyerId: 10,
            sellerId: 2,
            transactionType: 'PURCHASE',
            status: 'PENDING_SELLER_CONFIRM',
            desiredTime: new Date(Date.now() + 86400000).toISOString(),
            platformFee: 50000,
            inspectionFee: 100000,
            totalAmount: 5150000,
            listingTitle: 'Trek Marlin 7 2022 (Mock Detail)',
            listingImage: 'https://images.unsplash.com/photo-1576435728678-be95d398b646?auto=format&fit=crop&q=80&w=500',
            buyerName: 'Nguyễn Văn A',
            receiverName: 'Nguyễn Văn A',
            receiverPhone: '0987654321',
            receiverAddress: '123 Đường Láng, Hà Nội',
            note: 'Giao hàng vào buổi sáng giúp mình nhé.',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        return mockTransaction;
    }

    // Real API call
    return apiCallGET<import('../types/transaction').TransactionWithDetails>(`/transactions/${transactionId}`);
}

/**
 * Get transactions for seller (S-52)
 * @param sellerId - Seller ID
 * @param status - Filter by status
 * @returns Promise<TransactionWithDetails[]>
 */
export async function getSellerTransactions(
    sellerId: number,
    status?: string
): Promise<import('../types/transaction').TransactionWithDetails[]> {
    if (USE_MOCK_API) {
        // ... existing mock logic ...
        await new Promise(resolve => setTimeout(resolve, 800));

        // Mock data
        const mockTransactions: import('../types/transaction').TransactionWithDetails[] = [
            {
                transactionId: 101,
                listingId: 1,
                buyerId: 10,
                sellerId: sellerId,
                transactionType: 'PURCHASE',
                status: 'PENDING_SELLER_CONFIRM',
                desiredTime: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days later
                listingTitle: 'Trek Marlin 7 2022',
                listingImage: 'https://images.unsplash.com/photo-1576435728678-be95d398b646?auto=format&fit=crop&q=80&w=500',
                buyerName: 'Nguyễn Văn A',
                platformFee: 50000,
                inspectionFee: 100000,
                totalAmount: 5500000,
                receiverName: 'Nguyễn Văn A',
                receiverPhone: '0987654321',
                receiverAddress: '123 Đường Láng, Hà Nội',
                createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
                updatedAt: new Date().toISOString(),
            },
            {
                transactionId: 102,
                listingId: 2,
                buyerId: 11,
                sellerId: sellerId,
                transactionType: 'DEPOSIT',
                status: 'PENDING_SELLER_CONFIRM',
                desiredTime: new Date(Date.now() + 86400000 * 5).toISOString(),
                listingTitle: 'Giant Escape 3',
                listingImage: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=500',
                buyerName: 'Trần Thị B',
                depositAmount: 500000,
                platformFee: 50000,
                inspectionFee: 0,
                totalAmount: 550000,
                receiverName: 'Trần Thị B',
                receiverPhone: '0901234567',
                receiverAddress: '456 Lê Lợi, TP.HCM',
                createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                updatedAt: new Date().toISOString(),
            },
        ];

        if (status) {
            return mockTransactions.filter(t => t.status === status);
        }

        return mockTransactions;
    }

    // Real API call
    const queryParams = status ? `?status=${status}` : '';
    return apiCallGET<import('../types/transaction').TransactionWithDetails[]>(`/seller/${sellerId}/transactions${queryParams}`);
}

/**
 * Accept transaction (S-52 Action)
 * @param transactionId - Transaction ID
 */
export async function acceptTransaction(transactionId: number): Promise<boolean> {
    if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, 800));
        return true;
    }
    // Real API: usually PUT /transactions/{id}/status or similar
    // Assuming endpoint for now
    await apiCallPUT(`/transactions/${transactionId}/accept`, {});
    return true;
}

/**
 * Reject transaction (S-53 Action)
 * @param transactionId - Transaction ID
 * @param reason - Rejection reason
 */
export async function rejectTransaction(transactionId: number, reason: string): Promise<boolean> {
    if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, 800));
        console.log(`Transaction ${transactionId} rejected. Reason: ${reason}`);
        return true;
    }
    await apiCallPUT(`/transactions/${transactionId}/reject`, { reason });
    return true;
}
