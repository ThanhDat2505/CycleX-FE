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
export async function createPurchaseRequest(
    data: CreateTransactionRequest
): Promise<Transaction> {
    if (USE_MOCK_API) {
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

    // Real API call (future implementation)
    const response = await fetch('/backend/api/transactions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to create transaction');
    }

    return response.json();
}

/**
 * Get transaction detail
 * @param transactionId - Transaction ID
 * @returns Promise<Transaction>
 */
export async function getTransactionDetail(
    transactionId: number
): Promise<Transaction> {
    if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, 500));

        // Return mock transaction
        const mockTransaction: Transaction = {
            transactionId,
            listingId: 1,
            buyerId: 1,
            sellerId: 2,
            transactionType: 'PURCHASE',
            status: 'PENDING_SELLER_CONFIRM',
            desiredTime: new Date(Date.now() + 86400000).toISOString(),
            platformFee: 50000,
            inspectionFee: 100000,
            totalAmount: 5150000,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        return mockTransaction;
    }

    // Real API call (future)
    const response = await fetch(`/backend/api/transactions/${transactionId}`);

    if (!response.ok) {
        throw new Error('Failed to fetch transaction');
    }

    return response.json();
}
