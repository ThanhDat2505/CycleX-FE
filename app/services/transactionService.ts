/**
 * Transaction Service
 * Maps current backend contracts to FE transaction view models.
 */

import { CreateTransactionRequest, Transaction, TransactionWithDetails, TransactionType } from '../types/transaction';
import { apiCallPOST, apiCallGET } from '../utils/apiHelpers';
import { validateObject, validateArray } from '../utils/apiValidation';

const USE_MOCK_API = process.env.NEXT_PUBLIC_MOCK_API === 'true';

import { authService } from './authService';

type CurrentUserSnapshot = {
    userId?: number;
    role?: string;
};

function getCurrentUserSnapshot(): CurrentUserSnapshot {
    const userData = authService.getUser();
    if (!userData) {
        return {};
    }

    return {
        userId: userData.userId,
        role: userData.role,
    };
}

function toNumber(value: unknown): number | undefined {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
    }

    if (typeof value === 'string' && value.trim().length > 0) {
        const parsed = Number(value);
        if (Number.isFinite(parsed)) {
            return parsed;
        }
    }

    return undefined;
}

function resolveImageUrl(rawPath: unknown): string | undefined {
    if (typeof rawPath !== 'string') {
        return undefined;
    }

    const path = rawPath.trim();
    if (path.length === 0) {
        return undefined;
    }

    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    if (path.startsWith('/uploads/')) {
        return `/backend${path}`;
    }

    if (path.startsWith('/')) {
        return path;
    }

    return `/${path}`;
}

function mapStatusToFrontend(status: unknown): Transaction['status'] {
    const normalized = typeof status === 'string' ? status.toUpperCase() : '';

    if (normalized === 'SELLER_CONFIRMED' || normalized === 'BUYER_CONFIRMED' || normalized === 'CONFIRMED') {
        return 'CONFIRMED';
    }
    if (normalized === 'COMPLETED') {
        return 'COMPLETED';
    }
    if (normalized === 'CANCELLED') {
        return 'CANCELLED';
    }

    return 'PENDING_SELLER_CONFIRM';
}

function calculateTotalAmount(source: Record<string, unknown>): number {
    const directTotal = toNumber(source.totalAmount);
    if (directTotal !== undefined) {
        return directTotal;
    }

    const deposit = toNumber(source.depositAmount) ?? 0;
    const platformFee = toNumber(source.platformFee) ?? 0;
    const inspectionFee = toNumber(source.inspectionFee) ?? 0;
    return deposit + platformFee + inspectionFee;
}

function toBackendDateTime(value: string): string {
    if (value.includes('T')) {
        return value;
    }

    // FE date input returns yyyy-mm-dd; backend expects LocalDateTime.
    return `${value}T09:00:00`;
}

async function fetchListingPrimaryImage(listingId?: number): Promise<string | undefined> {
    if (!listingId) {
        return undefined;
    }

    try {
        const listing = await apiCallGET<any>(`/bikelistings/${listingId}`);

        if (typeof listing?.imageUrl === 'string') {
            return resolveImageUrl(listing.imageUrl);
        }

        const imageCollection = Array.isArray(listing?.images)
            ? listing.images
            : (Array.isArray(listing?.imageUrls) ? listing.imageUrls : []);

        if (imageCollection.length === 0) {
            return undefined;
        }

        const first = imageCollection[0];
        if (typeof first === 'string') {
            return resolveImageUrl(first);
        }

        if (first && typeof first === 'object') {
            return resolveImageUrl(first.imageUrl ?? first.url ?? first.imagePath);
        }

        return undefined;
    } catch {
        return undefined;
    }
}

async function resolveBuyerTransactionType(requestId: number): Promise<TransactionType> {
    try {
        const list = await apiCallGET<any[]>('/buyer/transactions');
        const matched = Array.isArray(list)
            ? list.find((item) => toNumber(item?.requestId) === requestId)
            : null;

        const type = typeof matched?.transactionType === 'string' ? matched.transactionType.toUpperCase() : '';
        return type === 'DEPOSIT' ? 'DEPOSIT' : 'PURCHASE';
    } catch {
        return 'PURCHASE';
    }
}

async function normalizeBuyerTransactionDetail(response: any, requestId: number): Promise<TransactionWithDetails> {
    if (response) validateObject(response, 'Buyer Transaction Detail Response');
    const source = (response && typeof response === 'object') ? response : {};
    const listing = (source.listing && typeof source.listing === 'object') ? source.listing : {};
    const seller = (source.seller && typeof source.seller === 'object') ? source.seller : {};

    const listingId = toNumber(listing.listingId) ?? 0;
    const listingImage = (await fetchListingPrimaryImage(listingId)) || undefined;
    const user = getCurrentUserSnapshot();

    const transactionType = await resolveBuyerTransactionType(requestId);

    const transaction: TransactionWithDetails = {
        transactionId: requestId,
        listingId,
        buyerId: user.userId ?? 0,
        sellerId: toNumber(seller.userId) ?? 0,
        transactionType,
        status: mapStatusToFrontend(source.status),
        desiredTime: typeof source.desiredTransactionTime === 'string' ? source.desiredTransactionTime : new Date().toISOString(),
        receiverName: undefined,
        receiverPhone: undefined,
        receiverAddress: undefined,
        depositAmount: toNumber(source.depositAmount),
        note: typeof source.note === 'string' ? source.note : undefined,
        platformFee: toNumber(source.platformFee) ?? 0,
        inspectionFee: toNumber(source.inspectionFee) ?? 0,
        totalAmount: calculateTotalAmount(source),
        createdAt: typeof source.createdAt === 'string' ? source.createdAt : new Date().toISOString(),
        updatedAt: typeof source.updatedAt === 'string' ? source.updatedAt : (typeof source.createdAt === 'string' ? source.createdAt : new Date().toISOString()),
        listingTitle: typeof listing.title === 'string' ? listing.title : `Xe #${listingId}`,
        listingImage,
        buyerName: 'Bạn',
        sellerName: typeof seller.fullName === 'string' ? seller.fullName : 'CycleX Seller',
        sellerPhone: typeof seller.phone === 'string' ? seller.phone : undefined,
    };

    return transaction;
}

async function normalizeSellerTransactionDetail(response: any, requestId: number): Promise<TransactionWithDetails> {
    if (response) validateObject(response, 'Seller Transaction Detail Response');
    const source = (response && typeof response === 'object') ? response : {};
    const listingId = toNumber(source.listingId) ?? 0;
    const listingImage = (await fetchListingPrimaryImage(listingId)) || undefined;
    const user = getCurrentUserSnapshot();

    const transactionType = typeof source.transactionType === 'string' && source.transactionType.toUpperCase() === 'DEPOSIT'
        ? 'DEPOSIT'
        : 'PURCHASE';

    const productPrice = toNumber(source.productPrice);
    const totalAmount = productPrice ?? toNumber(source.totalAmount) ?? calculateTotalAmount(source);

    return {
        transactionId: requestId,
        listingId,
        buyerId: 0,
        sellerId: user.userId ?? 0,
        transactionType,
        status: mapStatusToFrontend(source.status),
        desiredTime: typeof source.desiredTransactionTime === 'string' ? source.desiredTransactionTime : new Date().toISOString(),
        receiverName: undefined,
        receiverPhone: typeof source.buyerPhone === 'string' ? source.buyerPhone : undefined,
        receiverAddress: undefined,
        depositAmount: toNumber(source.depositAmount),
        note: typeof source.note === 'string' ? source.note : undefined,
        platformFee: toNumber(source.platformFee) ?? 0,
        inspectionFee: toNumber(source.inspectionFee) ?? 0,
        totalAmount,
        createdAt: typeof source.createdAt === 'string' ? source.createdAt : new Date().toISOString(),
        updatedAt: typeof source.updatedAt === 'string' ? source.updatedAt : (typeof source.createdAt === 'string' ? source.createdAt : new Date().toISOString()),
        listingTitle: typeof source.listingTitle === 'string' ? source.listingTitle : `Xe #${listingId}`,
        listingImage,
        buyerName: typeof source.buyerName === 'string' ? source.buyerName : 'Khach hang',
        sellerName: 'Ban',
        sellerPhone: undefined,
    };
}

export async function createPurchaseRequest(data: CreateTransactionRequest): Promise<Transaction> {
    if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const platformFee = 50000;
        const inspectionFee = 100000;
        const listingPrice = 5000000;
        const totalAmount = data.transactionType === 'PURCHASE'
            ? listingPrice + platformFee + inspectionFee
            : (data.depositAmount || 0) + platformFee;

        return {
            transactionId: Math.floor(Math.random() * 10000),
            listingId: data.listingId,
            buyerId: data.buyerId,
            sellerId: 1,
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
    }

    const productId = data.productId ?? data.listingId;
    if (!productId) {
        throw new Error('Missing productId for purchase request');
    }

    try {
        const payload: Record<string, unknown> = {
            transactionType: data.transactionType,
            desiredTransactionTime: toBackendDateTime(data.desiredTime),
            note: data.note,
            receiverName: data.receiverName,
            receiverPhone: data.receiverPhone,
            receiverAddress: data.receiverAddress,
        };

        const dataResponse = await apiCallPOST<any>(`/orders?productId=${productId}`, payload);

        if (dataResponse) {
            validateObject(dataResponse, 'Order Response');
        } else {
            throw new Error('Invalid backend response: Expected order object');
        }

        const orderId = toNumber(dataResponse.orderId) ?? toNumber(dataResponse.requestId);
        if (!orderId) {
            throw new Error('Invalid backend response: Missing orderId');
        }

        return {
            transactionId: orderId,
            listingId: toNumber(dataResponse.listingId) ?? data.listingId,
            buyerId: toNumber(dataResponse.buyerId) ?? data.buyerId,
            sellerId: toNumber(dataResponse.sellerId) ?? 0,
            transactionType: data.transactionType,
            status: mapStatusToFrontend(dataResponse.status),
            desiredTime: typeof dataResponse.desiredTransactionTime === 'string'
                ? dataResponse.desiredTransactionTime
                : toBackendDateTime(data.desiredTime),
            receiverName: data.receiverName,
            receiverPhone: data.receiverPhone,
            receiverAddress: data.receiverAddress,
            depositAmount: toNumber(dataResponse.depositAmount) ?? data.depositAmount,
            note: typeof dataResponse.buyerNote === 'string' ? dataResponse.buyerNote : data.note,
            platformFee: toNumber(dataResponse.platformFee) ?? 0,
            inspectionFee: toNumber(dataResponse.inspectionFee) ?? 0,
            totalAmount: toNumber(dataResponse.productPrice) ?? toNumber(dataResponse.totalAmount) ?? calculateTotalAmount(dataResponse),
            createdAt: typeof dataResponse.createdAt === 'string' ? dataResponse.createdAt : new Date().toISOString(),
            updatedAt: typeof dataResponse.createdAt === 'string' ? dataResponse.createdAt : new Date().toISOString(),
        };
    } catch (error: any) {
        console.error('Lỗi API Create Purchase Request:', error);
        const status = error?.status ?? error?.response?.status;
        if (status === 401) {
            throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else if (status === 403) {
            throw new Error('Bạn không có quyền thực hiện thao tác này. Vui lòng đăng nhập bằng tài khoản Người mua.');
        } else if (status === 409) {
            throw new Error('Rất tiếc, xe này vừa có người đặt giữ và đang chờ người bán xác nhận. Vui lòng quay lại sau!');
        } else if (status === 400) {
            throw new Error('Dữ liệu yêu cầu đặt mua không hợp lệ, vui lòng kiểm tra lại.');
        } else if (status === 404) {
            throw new Error('Không tìm thấy tin đăng hoặc sản phẩm không còn tồn tại.');
        }
        throw error;
    }
}

export async function getTransactionDetail(
    transactionId: number,
    role: 'BUYER' | 'SELLER' = 'BUYER'
): Promise<TransactionWithDetails> {
    if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const user = getCurrentUserSnapshot();

        return {
            transactionId,
            listingId: 1,
            buyerId: user.userId ?? 2,
            sellerId: 3,
            transactionType: 'PURCHASE',
            status: 'PENDING_SELLER_CONFIRM',
            desiredTime: new Date(Date.now() + 86400000).toISOString(),
            platformFee: 50000,
            inspectionFee: 100000,
            totalAmount: 5150000,
            listingTitle: 'Trek Marlin 7 2022 (Mock Detail)',
            listingImage: 'https://images.unsplash.com/photo-1576435728678-be95d398b646?auto=format&fit=crop&q=80&w=500',
            buyerName: 'Nguyen Van A',
            sellerName: 'CycleX Verified Seller',
            sellerPhone: '0912345678',
            receiverName: 'Nguyen Van A',
            receiverPhone: '0987654321',
            receiverAddress: '123 Duong Lang, Ha Noi',
            note: 'Giao hang vao buoi sang giup minh nhe.',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
    }

    const prefix = role === 'SELLER' ? '/seller' : '/buyer';
    const dataResponse = await apiCallGET<any>(`${prefix}/transactions/${transactionId}`);

    // Ensure BE returns data before normalizing
    validateObject(dataResponse, 'Transaction Detail GET Response');

    if (role === 'SELLER') {
        return normalizeSellerTransactionDetail(dataResponse, transactionId);
    }

    return normalizeBuyerTransactionDetail(dataResponse, transactionId);
}

let mockTransactions: TransactionWithDetails[] = [
    {
        transactionId: 101,
        listingId: 1,
        buyerId: 2,
        sellerId: 3,
        transactionType: 'PURCHASE',
        status: 'PENDING_SELLER_CONFIRM',
        desiredTime: new Date(Date.now() + 86400000 * 2).toISOString(),
        listingTitle: 'Trek Marlin 7 2022',
        listingImage: 'https://images.unsplash.com/photo-1576435728678-be95d398b646?auto=format&fit=crop&q=80&w=500',
        buyerName: 'Nguyen Van A',
        sellerName: 'CycleX Verified Seller',
        platformFee: 50000,
        inspectionFee: 100000,
        totalAmount: 5500000,
        receiverName: 'Nguyen Van A',
        receiverPhone: '0987654321',
        receiverAddress: '123 Duong Lang, Ha Noi',
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
        buyerName: 'Nguyen Van A',
        sellerName: 'Another Seller',
        depositAmount: 500000,
        platformFee: 50000,
        inspectionFee: 0,
        totalAmount: 550000,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        transactionId: 108,
        listingId: 8,
        buyerId: 2,
        sellerId: 3,
        transactionType: 'PURCHASE',
        status: 'COMPLETED',
        desiredTime: new Date(Date.now() - 86400000).toISOString(),
        listingTitle: 'Giant Escape 3 2023',
        listingImage: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=500',
        buyerName: 'Nguyen Van A',
        sellerName: 'CycleX Verified Seller',
        platformFee: 50000,
        inspectionFee: 100000,
        totalAmount: 8500000,
        receiverName: 'Nguyen Van A',
        receiverPhone: '0987654321',
        receiverAddress: '456 Le Loi, Da Nang',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(), // Completed 1h ago
    },
];

export async function getSellerTransactions(
    sellerId: number,
    status?: string
): Promise<TransactionWithDetails[]> {
    if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, 800));
        let results = mockTransactions.filter(t => t.sellerId === sellerId);

        if (status) {
            results = results.filter(t => t.status === status);
        }

        return results;
    }

    try {
        const dataResponse = await apiCallGET<any>('/seller/transactions/pending?page=0&size=50');
        const itemsArray = Array.isArray(dataResponse)
            ? dataResponse
            : (Array.isArray(dataResponse?.content) ? dataResponse.content : []);

        validateArray(itemsArray, 'Seller Transactions Array');

        const mapped = await Promise.all(itemsArray.map(async (item: any) => {
            const orderId = toNumber(item?.orderId) ?? toNumber(item?.requestId);
            if (!orderId) {
                return null;
            }

            try {
                const detail = await apiCallGET<any>(`/seller/transactions/${orderId}`);
                const normalized = await normalizeSellerTransactionDetail(detail, orderId);
                return {
                    ...normalized,
                    sellerId,
                    buyerName: typeof item?.buyerName === 'string' ? item.buyerName : normalized.buyerName,
                };
            } catch {
                const listingId = toNumber(item?.listingId) ?? 0;
                const productPrice = toNumber(item?.productPrice) ?? 0;
                return {
                    transactionId: orderId,
                    listingId,
                    buyerId: 0,
                    sellerId,
                    transactionType: (typeof item?.transactionType === 'string' && item.transactionType.toUpperCase() === 'DEPOSIT') ? 'DEPOSIT' : 'PURCHASE',
                    status: mapStatusToFrontend(item?.status),
                    desiredTime: new Date().toISOString(),
                    platformFee: 0,
                    inspectionFee: 0,
                    totalAmount: productPrice,
                    createdAt: typeof item?.createdAt === 'string' ? item.createdAt : new Date().toISOString(),
                    updatedAt: typeof item?.createdAt === 'string' ? item.createdAt : new Date().toISOString(),
                    listingTitle: typeof item?.listingTitle === 'string' ? item.listingTitle : `Xe #${listingId}`,
                    listingImage: await fetchListingPrimaryImage(listingId),
                    buyerName: typeof item?.buyerName === 'string' ? item.buyerName : 'Khach hang',
                    sellerName: 'Ban',
                } as TransactionWithDetails;
            }
        }));

        const safe = mapped.filter((item): item is TransactionWithDetails => item !== null);
        if (!status) {
            return safe;
        }

        return safe.filter(item => item.status === mapStatusToFrontend(status));
    } catch (error) {
        console.error('Lỗi API Get Seller Transactions:', error);
        return [];
    }
}

export async function getBuyerTransactions(
    buyerId: number
): Promise<TransactionWithDetails[]> {
    if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, 800));
        return mockTransactions.map(t => ({ ...t, buyerId }));
    }

    try {
        const dataResponse = await apiCallGET<any[]>('/buyer/transactions');

        const itemsArray = Array.isArray(dataResponse)
            ? dataResponse
            : (Array.isArray((dataResponse as any)?.content) ? (dataResponse as any).content : []);

        validateArray(itemsArray, 'Buyer Transactions Array');

        const mapped = await Promise.all(dataResponse.map(async (item) => {
            const transactionId = toNumber(item?.requestId);
            const listingId = toNumber(item?.listingId) ?? 0;
            if (!transactionId) {
                return null;
            }

            const explicitImage = resolveImageUrl(item?.listingImage);
            const fallbackImage = explicitImage ? undefined : await fetchListingPrimaryImage(listingId);

            return {
                transactionId,
                listingId,
                buyerId: toNumber(item?.buyerId) ?? buyerId,
                sellerId: toNumber(item?.sellerId) ?? 0,
                transactionType: (typeof item?.transactionType === 'string' && item.transactionType.toUpperCase() === 'DEPOSIT') ? 'DEPOSIT' : 'PURCHASE',
                status: mapStatusToFrontend(item?.status),
                desiredTime: typeof item?.createdAt === 'string' ? item.createdAt : new Date().toISOString(),
                platformFee: 0,
                inspectionFee: 0,
                totalAmount: toNumber(item?.totalAmount) ?? 0,
                createdAt: typeof item?.createdAt === 'string' ? item.createdAt : new Date().toISOString(),
                updatedAt: typeof item?.createdAt === 'string' ? item.createdAt : new Date().toISOString(),
                listingTitle: typeof item?.listingTitle === 'string' ? item.listingTitle : `Xe #${listingId}`,
                listingImage: explicitImage || fallbackImage,
                buyerName: 'Ban',
                sellerName: typeof item?.sellerName === 'string' ? item.sellerName : 'CycleX Seller',
                sellerPhone: typeof item?.sellerPhone === 'string' ? item.sellerPhone : undefined,
            } as TransactionWithDetails;
        }));

        return mapped.filter((item): item is TransactionWithDetails => item !== null);
    } catch (error) {
        console.error('Lỗi API Get Buyer Transactions:', error);
        return [];
    }
}

export async function acceptTransaction(transactionId: number): Promise<boolean> {
    if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, 800));

        const tx = mockTransactions.find(t => t.transactionId === transactionId);
        if (tx) {
            tx.status = 'CONFIRMED';
        }

        return true;
    }

    try {
        const response = await apiCallPOST<any>(`/seller/transactions/${transactionId}/confirm`, { note: 'Da xac nhan tu phia nguoi ban' });

        if (response) {
            validateObject(response, 'Accept Transaction Response');
            if (response.status !== 'CONFIRMED' && response.status !== 'SELLER_CONFIRMED' && response.status !== 'BUYER_CONFIRMED') {
                console.warn(`[API Warning] Received unexpectedly non-CONFIRMED status after accepting transaction: ${response.status}`);
            }
        }
        return true;
    } catch (error: any) {
        console.error(`Lỗi API Accept Transaction ${transactionId}:`, error);

        if (error.response?.status === 409) {
            throw new Error('Giao dịch đã được xác nhận hoặc không thể xác nhận ở trạng thái hiện tại.');
        } else if (error.response?.status === 404) {
            throw new Error('Không tìm thấy giao dịch trên hệ thống.');
        }

        throw error;
    }
}

export async function cancelTransaction(transactionId: number): Promise<boolean> {
    if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, 800));

        const tx = mockTransactions.find(t => t.transactionId === transactionId);
        if (tx) {
            tx.status = 'CANCELLED';
        }

        return true;
    }

    try {
        const response = await apiCallPOST<any>(`/buyer/transactions/${transactionId}/cancel`, {});

        if (response) {
            validateObject(response, 'Cancel Transaction Response');
            if (response.status !== 'CANCELLED') {
                console.warn(`[API Warning] Received unexpectedly non-CANCELLED status after cancelling transaction: ${response.status}`);
            }
        }
        return true;
    } catch (error: any) {
        console.error(`Lỗi API Cancel Transaction ${transactionId}:`, error);

        if (error.response?.status === 409) {
            throw new Error('Giao dịch đã được huỷ trước đó hoặc không thể huỷ ở trạng thái hiện tại.');
        } else if (error.response?.status === 404) {
            throw new Error('Không tìm thấy giao dịch trên hệ thống.');
        }

        throw error;
    }
}
