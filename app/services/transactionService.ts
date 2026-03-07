/* eslint-disable @typescript-eslint/no-explicit-any, prefer-const */


/**
 * Transaction Service
 * Handles API calls for transaction operations (BP5)
 * Currently in mock mode - will connect to real API later
 */

import { CreateTransactionRequest, Transaction } from '../types/transaction';
import { validateObject, validateNumber, validateString, validateEnum, validateArray } from '../utils/apiValidation';
import { apiCallPOST, apiCallGET, apiCallPUT } from '../utils/apiHelpers';

// Mock mode for development
const USE_MOCK_API = process.env.NEXT_PUBLIC_MOCK_API === 'true';

/**
 * Create purchase or deposit request
 * Endpoint: POST /api/transactions (future)
 * 
 * @param data - Transaction request data
 * @returns Promise<Transaction> - Created transaction

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

    // Real API call: S-50
    // Maps frontend formData fields to what the Postman API expects.
    // We ignore buyerId, receiverName, receiverPhone, receiverAddress as backend doesn't take them.
    const payload: Record<string, any> = {
        transactionType: data.transactionType,
        desiredTransactionTime: data.desiredTime, // maps from input desiredTime
        note: data.note,
    };

    if (data.transactionType === 'DEPOSIT' && data.depositAmount) {
        payload.depositAmount = data.depositAmount;
    }

    const dataResponse = await apiCallPOST<Transaction>(`/products/${data.listingId}/purchase-requests`, payload);

    // Validate backend response since we should not strictly trust it
    if (!dataResponse || typeof dataResponse !== 'object') {
        throw new Error('Invalid backend response: Expected a transaction object');
    }

    if (!dataResponse.transactionId) {
        throw new Error('Invalid backend response: Missing transactionId');
    }

    return dataResponse;
}

/**
 * Get transaction detail
 * @param transactionId - Transaction ID
 * @param role - Differentiate whether buyer or seller is fetching
 * @returns Promise<Transaction>
 */
export async function getTransactionDetail(
    transactionId: number,
    role: 'BUYER' | 'SELLER' = 'BUYER'
): Promise<import('../types/transaction').TransactionWithDetails> {
    if (USE_MOCK_API) {
        // ... existing mock logic ...
        await new Promise(resolve => setTimeout(resolve, 500));

        // Return mock transaction with details
        const mockTransaction: import('../types/transaction').TransactionWithDetails = {
            transactionId,
            listingId: 1,
            // Dynamic Owner: Set buyerId to current user so they can access it in testing
            buyerId: (() => {
                try {
                    if (typeof window !== 'undefined') {
                        const u = localStorage.getItem('userData');
                        if (u) return JSON.parse(u).userId;
                    }
                } catch { }
                return 2; // Fallback
            })(),
            sellerId: 3, // Mock Seller (seller@example.com)
            transactionType: 'PURCHASE',
            status: 'PENDING_SELLER_CONFIRM',
            desiredTime: new Date(Date.now() + 86400000).toISOString(),
            platformFee: 50000,
            inspectionFee: 100000,
            totalAmount: 5150000,
            listingTitle: 'Trek Marlin 7 2022 (Mock Detail)',
            listingImage: 'https://images.unsplash.com/photo-1576435728678-be95d398b646?auto=format&fit=crop&q=80&w=500',
            buyerName: 'Nguyễn Văn A',
            sellerName: 'CycleX Verified Seller',
            sellerPhone: '0912345678',
            receiverName: 'Nguyễn Văn A',
            receiverPhone: '0987654321',
            receiverAddress: '123 Đường Láng, Hà Nội',
            note: 'Giao hàng vào buổi sáng giúp mình nhé.',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        return mockTransaction;
    }

    // Real API call: Differentiate endpoints by role
    const prefix = role === 'SELLER' ? '/seller' : '/buyer';
    const dataResponse = await apiCallGET<import('../types/transaction').TransactionWithDetails>(`${prefix}/transactions/${transactionId}`);

    // Validate backend response
    if (!dataResponse || typeof dataResponse !== 'object') {
        throw new Error('Invalid backend response: Expected a transaction detail object');
    }

    const ctx = 'Transaction Detail API Response';

    validateObject(dataResponse, ctx);
    validateNumber(dataResponse.transactionId, `${ctx}.transactionId`);
    validateNumber(dataResponse.listingId, `${ctx}.listingId`);
    validateString(dataResponse.createdAt, `${ctx}.createdAt`);
    validateEnum<import('../types/transaction').TransactionType>(dataResponse.transactionType, ['PURCHASE', 'DEPOSIT'], `${ctx}.transactionType`);

    // Allow displaying correctly if some data is accidentally dropped
    return {
        ...dataResponse,
        listingTitle: dataResponse.listingTitle || 'Unknown Listing'
    };
}

// In-memory mock storage
let mockTransactions: import('../types/transaction').TransactionWithDetails[] = [
    {
        transactionId: 101,
        listingId: 1,
        buyerId: 2, // Default mock buyer
        sellerId: 3, // Default mock seller
        transactionType: 'PURCHASE',
        status: 'PENDING_SELLER_CONFIRM',
        desiredTime: new Date(Date.now() + 86400000 * 2).toISOString(),
        listingTitle: 'Trek Marlin 7 2022',
        listingImage: 'https://images.unsplash.com/photo-1576435728678-be95d398b646?auto=format&fit=crop&q=80&w=500',
        buyerName: 'Nguyễn Văn A',
        sellerName: 'CycleX Verified Seller',
        platformFee: 50000,
        inspectionFee: 100000,
        totalAmount: 5500000,
        receiverName: 'Nguyễn Văn A',
        receiverPhone: '0987654321',
        receiverAddress: '123 Đường Láng, Hà Nội',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        transactionId: 105,
        listingId: 5,
        buyerId: 2,
        sellerId: 3,
        transactionType: 'DEPOSIT',
        status: 'CONFIRMED',
        desiredTime: new Date(Date.now() + 86400000 * 3).toISOString(),
        listingTitle: 'Honda Wave Alpha',
        listingImage: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=500',
        buyerName: 'Nguyễn Văn A',
        sellerName: 'Another Seller',
        depositAmount: 500000,
        platformFee: 50000,
        inspectionFee: 0,
        totalAmount: 550000,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

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

        // Use in-memory mock data
        let results = mockTransactions.filter(t => t.sellerId === sellerId);

        if (status) {
            results = results.filter(t => t.status === status);
        }

        return results;
    }

    // Real API call
    let endpoint = `/seller/transactions`;
    // Map the status to the specific endpoint according to Postman
    if (status === 'PENDING_SELLER_CONFIRM') {
        endpoint = `/seller/transactions/pending`;
    }

    const dataResponse = await apiCallGET<any>(endpoint);

    // Handle pagination wrapper if backend returns { items: [], pagination: {} } 
    // Postman indicates sizes, so it might be paginated. Let's safely extract array:
    const itemsArray = Array.isArray(dataResponse) ? dataResponse : (dataResponse?.items || []);

    validateArray(itemsArray, 'Seller Transactions API Response');

    // Strict validation inside the loop: Do not trust BE
    itemsArray.forEach((t: any, i: number) => {
        const ctx = `sellerTransactions[${i}]`;
        validateObject(t, ctx);
        validateNumber(t.transactionId, `${ctx}.transactionId`);
        validateNumber(t.listingId, `${ctx}.listingId`);
        validateNumber(t.totalAmount, `${ctx}.totalAmount`);
        validateString(t.createdAt, `${ctx}.createdAt`);
        validateEnum(t.transactionType, ['PURCHASE', 'DEPOSIT'] as const, `${ctx}.transactionType`);
    });

    return itemsArray.map((t: any) => ({
        ...t,
        listingTitle: t.listingTitle || `Xe đạp #${t.listingId}`,
        buyerName: t.buyerName || 'Khách hàng',
    }));
}

/**
 * Get transactions for buyer (S-54/List)
 * @param buyerId - Buyer ID
 * @returns Promise<TransactionWithDetails[]>
 */
export async function getBuyerTransactions(
    buyerId: number
): Promise<import('../types/transaction').TransactionWithDetails[]> {
    if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, 800));

        // Use in-memory mock data
        // For testing purposes, we might just return all mock transactions 
        // OR filtering by buyerId if we were strictly following the mock user logic.
        // Given previous dynamic buyerId fix, let's just return all to ensure visibility.
        // In a real mock, we would filter: mockTransactions.filter(t => t.buyerId === buyerId);
        // But to make it easy for the user to see "their" transactions regardless of ID drift:
        return mockTransactions.map(t => ({
            ...t,
            // Dynamically set buyerId to current user to prevent access issues
            buyerId: (() => {
                try {
                    if (typeof window !== 'undefined') {
                        const u = localStorage.getItem('userData');
                        if (u) return JSON.parse(u).userId;
                    }
                } catch { }
                return t.buyerId;
            })(),
        }));
    }

    // Real API call: GET /buyer/transactions
    const dataResponse = await apiCallGET<import('../types/transaction').TransactionWithDetails[]>(`/buyer/${buyerId}/transactions`);

    validateArray(dataResponse, 'Buyer Transactions API Response');

    // Strict validation inside the loop: Do not trust BE
    dataResponse.forEach((t, i) => {
        const ctx = `buyerTransactions[${i}]`;
        validateObject(t, ctx);
        validateNumber(t.transactionId, `${ctx}.transactionId`);
        validateNumber(t.listingId, `${ctx}.listingId`);
        validateNumber(t.totalAmount, `${ctx}.totalAmount`);
        validateString(t.createdAt, `${ctx}.createdAt`);
        validateEnum(t.transactionType, ['PURCHASE', 'DEPOSIT'] as const, `${ctx}.transactionType`);
        // We know missing text/image fields can crash the UI component renderer
    });

    // Mapped fallback data just in case Backend doesn't fully join table or misses visual fields
    return dataResponse.map(t => ({
        ...t,
        listingTitle: t.listingTitle || `Xe đạp #${t.listingId}`,
        sellerName: t.sellerName || 'CycleX Seller',
    }));
}

/**
 * Accept transaction (S-52 Action)
 * @param transactionId - Transaction ID
 */
export async function acceptTransaction(transactionId: number): Promise<boolean> {
    if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, 800));

        const tx = mockTransactions.find(t => t.transactionId === transactionId);
        if (tx) {
            tx.status = 'CONFIRMED';
        }

        return true;
    }

    // Real API: POST /seller/transactions/{id}/confirm
    await apiCallPOST(`/seller/transactions/${transactionId}/confirm`, { note: 'Đã xác nhận từ phía người bán' });
    return true;
}

/**
 * Reject transaction (S-53 Action - REMOVED per user request)
 * Keeping logic commented out or removing if needed.
 */
// export async function rejectTransaction... // Removed

/**
 * Cancel transaction (S-54 Action)
 * @param transactionId - Transaction ID
 */
export async function cancelTransaction(transactionId: number): Promise<boolean> {
    if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, 800));
        console.log(`Transaction ${transactionId} cancelled.`);

        const tx = mockTransactions.find(t => t.transactionId === transactionId);
        if (tx) {
            tx.status = 'CANCELLED';
        }

        return true;
    }

    // Real API: POST /buyer/transactions/{id}/cancel
    await apiCallPOST(`/buyer/transactions/${transactionId}/cancel`, {});
    return true;
}

