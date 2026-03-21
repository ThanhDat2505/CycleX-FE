/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Mock Data & Route Dispatcher
 * Provides static mock data for frontend testing without backend.
 * Activated by NEXT_PUBLIC_MOCK_API=true in .env.local
 */

import { API_DELAY_MS } from '../constants/pagination';

// ─── Mock Mode Check ────────────────────────────────────────────────────────

export function isMockMode(): boolean {
    return process.env.NEXT_PUBLIC_MOCK_API === 'true';
}

// ─── Mock Delay ─────────────────────────────────────────────────────────────

function mockDelay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, API_DELAY_MS));
}

// ─── Mock Listings Data ─────────────────────────────────────────────────────

const MOCK_LISTINGS = [
    {
        listingId: 1,
        productId: 101,
        title: 'Giant Escape 3 - Xe đạp đường phố',
        price: 8500000,
        brand: 'Giant',
        bikeType: 'ROAD',
        description: 'Xe đạp đường phố Giant Escape 3 tình trạng tốt, khung nhôm nhẹ, phù hợp di chuyển hàng ngày.',
        images: ['/uploads/mock/giant-escape-3.jpg'],
        imageUrl: 'https://placehold.co/600x400/1a2332/ff6b00?text=Giant+Escape+3',
        locationCity: 'Hồ Chí Minh',
        viewsCount: 152,
        status: 'APPROVED',
        condition: 'USED',
        sellerId: 10,
        sellerName: 'Nguyễn Văn A',
        videoUrl: null,
        inspectionStatus: 'PASSED',
        inspectionDate: '2026-03-10T10:00:00',
        inspectionNotes: 'Xe đạt yêu cầu chất lượng.',
        productStatus: 'AVAILABLE',
    },
    {
        listingId: 2,
        productId: 102,
        title: 'Trek Domane AL 2 - Road Bike',
        price: 15200000,
        brand: 'Trek',
        bikeType: 'ROAD',
        description: 'Trek Domane AL 2, khung nhôm cao cấp, groupset Shimano Claris. Đi được 500km.',
        images: ['/uploads/mock/trek-domane.jpg'],
        imageUrl: 'https://placehold.co/600x400/1a2332/ff6b00?text=Trek+Domane+AL2',
        locationCity: 'Hà Nội',
        viewsCount: 89,
        status: 'APPROVED',
        condition: 'USED',
        sellerId: 10,
        sellerName: 'Nguyễn Văn A',
        videoUrl: null,
        inspectionStatus: 'PASSED',
        inspectionDate: '2026-03-12T14:00:00',
        inspectionNotes: null,
        productStatus: 'AVAILABLE',
    },
    {
        listingId: 3,
        productId: 103,
        title: 'Specialized Rockhopper - Mountain Bike',
        price: 12000000,
        brand: 'Specialized',
        bikeType: 'MOUNTAIN',
        description: 'Specialized Rockhopper 29" mountain bike, phuộc giảm xóc 100mm, phù hợp offroad.',
        images: ['/uploads/mock/specialized-rockhopper.jpg'],
        imageUrl: 'https://placehold.co/600x400/1a2332/ff6b00?text=Specialized+Rockhopper',
        locationCity: 'Đà Nẵng',
        viewsCount: 210,
        status: 'APPROVED',
        condition: 'USED',
        sellerId: 11,
        sellerName: 'Trần Thị B',
        videoUrl: null,
        inspectionStatus: 'PASSED',
        inspectionDate: '2026-03-08T09:30:00',
        inspectionNotes: 'Tình trạng tốt, lốp còn 80%.',
        productStatus: 'AVAILABLE',
    },
    {
        listingId: 4,
        productId: 104,
        title: 'Merida Big Seven 100 - MTB 27.5',
        price: 9800000,
        brand: 'Merida',
        bikeType: 'MOUNTAIN',
        description: 'Merida Big Seven 100, bánh 27.5", khung nhôm, 24 tốc độ. Xe mới 95%.',
        images: ['/uploads/mock/merida-bigseven.jpg'],
        imageUrl: 'https://placehold.co/600x400/1a2332/ff6b00?text=Merida+Big+Seven',
        locationCity: 'Hồ Chí Minh',
        viewsCount: 67,
        status: 'APPROVED',
        condition: 'USED',
        sellerId: 11,
        sellerName: 'Trần Thị B',
        videoUrl: null,
        inspectionStatus: 'PASSED',
        inspectionDate: '2026-03-14T11:00:00',
        inspectionNotes: null,
        productStatus: 'AVAILABLE',
    },
    {
        listingId: 5,
        productId: 105,
        title: 'Cannondale Trail 8 - Xe đạp leo núi',
        price: 11500000,
        brand: 'Cannondale',
        bikeType: 'MOUNTAIN',
        description: 'Cannondale Trail 8 xanh lam. Groupset microSHIFT, phuộc SR Suntour XCE.',
        images: ['/uploads/mock/cannondale-trail8.jpg'],
        imageUrl: 'https://placehold.co/600x400/1a2332/ff6b00?text=Cannondale+Trail+8',
        locationCity: 'Cần Thơ',
        viewsCount: 134,
        status: 'APPROVED',
        condition: 'USED',
        sellerId: 12,
        sellerName: 'Lê Minh C',
        videoUrl: null,
        inspectionStatus: 'PASSED',
        inspectionDate: '2026-03-11T15:00:00',
        inspectionNotes: 'Xe đạt yêu cầu.',
        productStatus: 'AVAILABLE',
    },
    {
        listingId: 6,
        productId: 106,
        title: 'Java Zelo - Xe đạp Fixed Gear',
        price: 4200000,
        brand: 'Java',
        bikeType: 'FIXED_GEAR',
        description: 'Java Zelo fixed gear, khung thép Cr-Mo nhẹ, vành nhôm đôi. Mới sơn lại.',
        images: ['/uploads/mock/java-zelo.jpg'],
        imageUrl: 'https://placehold.co/600x400/1a2332/ff6b00?text=Java+Zelo',
        locationCity: 'Hồ Chí Minh',
        viewsCount: 45,
        status: 'APPROVED',
        condition: 'USED',
        sellerId: 12,
        sellerName: 'Lê Minh C',
        videoUrl: null,
        inspectionStatus: 'PASSED',
        inspectionDate: '2026-03-15T08:00:00',
        inspectionNotes: null,
        productStatus: 'AVAILABLE',
    },
];

// ─── Mock Buyer Transactions Data ───────────────────────────────────────────

const MOCK_BUYER_TRANSACTIONS = [
    {
        requestId: 1001,
        listingId: 1,
        buyerId: 1,
        sellerId: 10,
        transactionType: 'PURCHASE',
        status: 'PENDING_SELLER_CONFIRM',
        totalAmount: 8500000,
        createdAt: '2026-03-18T10:30:00',
        listingTitle: 'Giant Escape 3 - Xe đạp đường phố',
        listingImage: 'https://placehold.co/600x400/1a2332/ff6b00?text=Giant+Escape+3',
        sellerName: 'Nguyễn Văn A',
        sellerPhone: '0901234567',
    },
    {
        requestId: 1002,
        listingId: 3,
        buyerId: 1,
        sellerId: 11,
        transactionType: 'PURCHASE',
        status: 'CONFIRMED',
        totalAmount: 12000000,
        createdAt: '2026-03-15T14:00:00',
        listingTitle: 'Specialized Rockhopper - Mountain Bike',
        listingImage: 'https://placehold.co/600x400/1a2332/ff6b00?text=Specialized+Rockhopper',
        sellerName: 'Trần Thị B',
        sellerPhone: '0912345678',
    },
    {
        requestId: 1003,
        listingId: 5,
        buyerId: 1,
        sellerId: 12,
        transactionType: 'DEPOSIT',
        status: 'COMPLETED',
        totalAmount: 11500000,
        depositAmount: 2300000,
        createdAt: '2026-03-10T09:00:00',
        listingTitle: 'Cannondale Trail 8 - Xe đạp leo núi',
        listingImage: 'https://placehold.co/600x400/1a2332/ff6b00?text=Cannondale+Trail+8',
        sellerName: 'Lê Minh C',
        sellerPhone: '0923456789',
    },
    {
        requestId: 1004,
        listingId: 6,
        buyerId: 1,
        sellerId: 12,
        transactionType: 'PURCHASE',
        status: 'CANCELLED',
        totalAmount: 4200000,
        createdAt: '2026-03-08T16:45:00',
        listingTitle: 'Java Zelo - Xe đạp Fixed Gear',
        listingImage: 'https://placehold.co/600x400/1a2332/ff6b00?text=Java+Zelo',
        sellerName: 'Lê Minh C',
        sellerPhone: '0923456789',
    },
];

// ─── Dynamic Session Store (in-memory, resets on page reload) ───────────
// Stores transactions created via POST /orders during this session
const dynamicTransactions: typeof MOCK_BUYER_TRANSACTIONS = [];

// ─── Mock Buyer Transaction Detail ──────────────────────────────────────────

function getMockBuyerTransactionDetail(requestId: number): any {
    // Check dynamic (session-created) transactions first
    const dynamicTx = dynamicTransactions.find((t) => t.requestId === requestId);
    const transaction = dynamicTx ?? MOCK_BUYER_TRANSACTIONS.find((t) => t.requestId === requestId);
    if (!transaction) {
        return null;
    }

    const listing = MOCK_LISTINGS.find((l) => l.listingId === transaction.listingId);

    return {
        orderStatus: transaction.status,
        desiredTransactionTime: transaction.createdAt,
        depositAmount: transaction.depositAmount ?? null,
        note: 'Ghi chú mock giao dịch',
        platformFee: 50000,
        inspectionFee: 100000,
        listingPrice: listing?.price ?? transaction.totalAmount,
        createdAt: transaction.createdAt,
        // COMPLETED transactions: updatedAt = recently, so 24h dispute window is valid for testing
        updatedAt: transaction.status === 'COMPLETED'
            ? new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
            : transaction.createdAt,
        listing: {
            listingId: transaction.listingId,
            title: transaction.listingTitle,
            imageUrl: transaction.listingImage,
        },
        seller: {
            userId: transaction.sellerId,
            fullName: transaction.sellerName,
            phone: transaction.sellerPhone,
        },
    };
}

// ─── Route Dispatcher ───────────────────────────────────────────────────────

/**
 * Route mock responses by matching endpoint patterns.
 * Returns mock data matching the backend response format.
 *
 * @throws Error with status 404 if endpoint has no mock handler
 */
export async function getMockResponse(endpoint: string, method: string, body?: object): Promise<any> {
    await mockDelay();

    // Normalize: remove query string for pattern matching
    const cleanEndpoint = endpoint.split('?')[0];
    const queryString = endpoint.includes('?') ? endpoint.split('?')[1] : '';

    // ── GET /home → Featured bikes ────────────────────────────────────
    if (method === 'GET' && cleanEndpoint === '/home') {
        return [...MOCK_LISTINGS].sort((a, b) => b.viewsCount - a.viewsCount);
    }

    // ── GET /bikelistings → Paginated listings ────────────────────────
    if (method === 'GET' && cleanEndpoint === '/bikelistings') {
        const params = new URLSearchParams(queryString);
        const page = parseInt(params.get('page') ?? '0', 10);
        const size = parseInt(params.get('size') ?? '10', 10);

        const start = page * size;
        const paged = MOCK_LISTINGS.slice(start, start + size);

        return {
            content: paged,
            number: page,
            size,
            totalElements: MOCK_LISTINGS.length,
        };
    }

    // ── GET /bikelistings/:id → Single listing detail ─────────────────
    const listingDetailMatch = cleanEndpoint.match(/^\/bikelistings\/(\d+)$/);
    if (method === 'GET' && listingDetailMatch) {
        const listingId = parseInt(listingDetailMatch[1], 10);
        const listing = MOCK_LISTINGS.find((l) => l.listingId === listingId);
        if (!listing) {
            throw { status: 404, message: 'Listing not found' };
        }
        return { ...listing };
    }

    // ── GET /buyer/transactions → Buyer transaction list ──────────────
    if (method === 'GET' && cleanEndpoint === '/buyer/transactions') {
        return [...MOCK_BUYER_TRANSACTIONS, ...dynamicTransactions];
    }

    // ── GET /buyer/transactions/:id → Buyer transaction detail ────────
    const buyerTxDetailMatch = cleanEndpoint.match(/^\/buyer\/transactions\/(\d+)$/);
    if (method === 'GET' && buyerTxDetailMatch) {
        const requestId = parseInt(buyerTxDetailMatch[1], 10);
        const detail = getMockBuyerTransactionDetail(requestId);
        if (!detail) {
            throw { status: 404, message: 'Transaction not found' };
        }
        return detail;
    }

    // ── POST /orders?productId=* → Create order ──────────────────────
    if (method === 'POST' && cleanEndpoint === '/orders') {
        const params = new URLSearchParams(queryString);
        const productId = parseInt(params.get('productId') ?? '0', 10);
        const matchedListing = MOCK_LISTINGS.find((l) => l.productId === productId || l.listingId === productId);

        const orderId = Date.now();
        const createdAt = new Date().toISOString();

        // Persist to session store so GET detail can find it later
        dynamicTransactions.push({
            requestId: orderId,
            listingId: matchedListing?.listingId ?? productId,
            buyerId: 1,
            sellerId: matchedListing?.sellerId ?? 0,
            transactionType: (body as any)?.transactionType === 'DEPOSIT' ? 'DEPOSIT' : 'PURCHASE',
            status: 'PENDING_SELLER_CONFIRM',
            totalAmount: matchedListing?.price ?? 0,
            depositAmount: (body as any)?.depositAmount,
            createdAt,
            listingTitle: matchedListing?.title ?? `Xe #${productId}`,
            listingImage: matchedListing?.imageUrl ?? '',
            sellerName: matchedListing?.sellerName ?? 'CycleX Seller',
            sellerPhone: '0900000000',
        });

        return {
            orderId,
            requestId: orderId,
            listingId: matchedListing?.listingId ?? productId,
            buyerId: 1,
            sellerId: matchedListing?.sellerId ?? 0,
            status: 'PENDING_SELLER_CONFIRM',
            depositAmount: (body as any)?.depositAmount ?? null,
            productPrice: matchedListing?.price ?? 0,
            platformFee: 50000,
            inspectionFee: 100000,
            createdAt,
            desiredTransactionTime: (body as any)?.desiredTransactionTime ?? createdAt,
            buyerNote: (body as any)?.note ?? null,
        };
    }

    // ── POST /buyer/transactions/:id/cancel → Cancel transaction ──────
    const cancelMatch = cleanEndpoint.match(/^\/buyer\/transactions\/(\d+)\/cancel$/);
    if (method === 'POST' && cancelMatch) {
        return { status: 'CANCELLED', message: 'Transaction cancelled successfully' };
    }

    // ── Seller transaction endpoints (minimal support) ────────────────
    if (method === 'GET' && cleanEndpoint === '/seller/transactions/pending') {
        return [];
    }

    const sellerTxDetailMatch = cleanEndpoint.match(/^\/seller\/transactions\/(\d+)$/);
    if (method === 'GET' && sellerTxDetailMatch) {
        throw { status: 404, message: 'Seller transaction mock not implemented' };
    }

    const sellerConfirmMatch = cleanEndpoint.match(/^\/seller\/transactions\/(\d+)\/confirm$/);
    if (method === 'POST' && sellerConfirmMatch) {
        return { status: 'CONFIRMED', message: 'Transaction confirmed' };
    }

    // ── Fallback: unmatched endpoint ──────────────────────────────────
    console.warn(`[Mock API] No handler for ${method} ${endpoint}`);
    throw { status: 404, message: `Mock handler not found for ${method} ${endpoint}` };
}
