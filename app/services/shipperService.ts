import { DeliverySummary, Delivery, DeliveryFilter, DeliveryConfirmRequest, DeliveryFailedRequest, PaginatedResponse, DeliveryConfirmationInfo, DeliveryFailureInfo } from '@/app/types/shipper';
import { apiCallGET, apiCallPOST } from '../utils/apiHelpers';
import { validateObject, validateArray, validateString } from '../utils/apiValidation';

// USE_MOCK_API can be imported or assumed globally if configured
const USE_MOCK_API = process.env.NEXT_PUBLIC_MOCK_API === 'true';

/**
 * Get delivery summary for a shipper
 * endpoint: S-60/S-61 GET /api/shipper/dashboard/summary
 */
export async function getDeliverySummary(shipperId: number): Promise<DeliverySummary> {
    if (USE_MOCK_API) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Calculate summary from MOCK_DELIVERIES to ensure consistency
        const summary: DeliverySummary = {
            assigned: 0,
            inProgress: 0,
            delivered: 0,
            failed: 0
        };

        MOCK_DELIVERIES.forEach(d => {
            if (d.status === 'ASSIGNED') summary.assigned++;
            else if (d.status === 'IN_PROGRESS') summary.inProgress++;
            else if (d.status === 'DELIVERED') summary.delivered++;
            else if (d.status === 'FAILED') summary.failed++;
        });

        return summary;
    }

    try {
        const data = await apiCallGET<any>('/shipper/dashboard/summary');
        validateObject(data, 'Shipper Delivery Summary API Response');

        // BE returns { counts: { assigned, inProgress, failed }, asOf } — handle both nested and flat
        const counts = data.counts || data;

        // Safe Fallback Parsing: Do not trust Backend completely
        return {
            assigned: typeof counts.assigned === 'number' ? counts.assigned : (typeof counts.assignedCount === 'number' ? counts.assignedCount : 0),
            inProgress: typeof counts.inProgress === 'number' ? counts.inProgress : (typeof counts.inProgressCount === 'number' ? counts.inProgressCount : 0),
            delivered: typeof counts.delivered === 'number' ? counts.delivered : (typeof counts.deliveredCount === 'number' ? counts.deliveredCount : 0),
            failed: typeof counts.failed === 'number' ? counts.failed : (typeof counts.failedCount === 'number' ? counts.failedCount : 0)
        };
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu tổng hợp Shipper: ', error);
        throw error;
    }
}

// Mock Deliveries Data
const MOCK_DELIVERIES: Delivery[] = [
    {
        id: 'DEL-001',
        orderId: 'ORD-2024-001',
        sender: {
            name: 'Nguyễn Văn A',
            phone: '0901234567',
            address: '123 Lê Lợi, Q.1, TP.HCM'
        },
        receiver: {
            name: 'Trần Thị B',
            phone: '0909876543',
            address: '456 Nguyễn Huệ, Q.1, TP.HCM'
        },
        bike: {
            name: 'Giant Escape 3',
            image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=300'
        },
        status: 'ASSIGNED',
        assignedDate: '2024-02-10T08:00:00Z',
        scheduledDate: '2024-02-12T10:00:00Z',
        codAmount: 5500000
    },
    {
        id: 'DEL-002',
        orderId: 'ORD-2024-002',
        sender: {
            name: 'Lê Văn C',
            phone: '0912345678',
            address: '789 Điện Biên Phủ, Q.3, TP.HCM'
        },
        receiver: {
            name: 'Phạm Thị D',
            phone: '0987654321',
            address: '101 Võ Văn Tần, Q.3, TP.HCM'
        },
        bike: {
            name: 'Trek Marlin 5',
            image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&q=80&w=300'
        },
        status: 'IN_PROGRESS',
        assignedDate: '2024-02-09T14:00:00Z',
        scheduledDate: '2024-02-11T09:00:00Z'
    },
    {
        id: 'DEL-003',
        orderId: 'ORD-2024-003',
        sender: {
            name: 'Hoàng Văn E',
            phone: '0934567890',
            address: '12 Hai Bà Trưng, Q.1, TP.HCM'
        },
        receiver: {
            name: 'Vũ Thị F',
            phone: '0976543210',
            address: '34 Lê Duẩn, Q.1, TP.HCM'
        },
        bike: {
            name: 'Asama TRK',
            image: 'https://images.unsplash.com/photo-1576435728678-35d01fda69e6?auto=format&fit=crop&q=80&w=300'
        },
        status: 'FAILED',
        assignedDate: '2024-02-08T10:00:00Z',
        scheduledDate: '2024-02-09T15:00:00Z',
        note: 'Người nhận không nghe máy 3 lần'
    },
    {
        id: 'DEL-004',
        orderId: 'ORD-2024-004',
        sender: {
            name: 'Shop Xe Đạp X',
            phone: '02838383838',
            address: '99 Nguyễn Thị Minh Khai, Q.1, TP.HCM'
        },
        receiver: {
            name: 'Nguyễn Văn G',
            phone: '0901122334',
            address: '88 Lý Tự Trọng, Q.1, TP.HCM'
        },
        bike: {
            name: 'Trinx M136',
            image: 'https://images.unsplash.com/photo-1507035895480-27fb4af89056?auto=format&fit=crop&q=80&w=300'
        },
        status: 'DELIVERED',
        assignedDate: '2024-02-01T08:00:00Z',
        scheduledDate: '2024-02-02T10:00:00Z',
        completedDate: '2024-02-02T11:30:00Z'
    }
];

/**
 * Get deliveries for a shipper
 * Mock implementation for S-61 list directly from query
 */
export async function getDeliveries(shipperId: number, filter: DeliveryFilter = 'ALL', page: number = 0, size: number = 20): Promise<Delivery[]> {
    if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, 600));

        if (filter === 'ALL') return MOCK_DELIVERIES;
        return MOCK_DELIVERIES.filter(d => d.status === filter);
    }

    try {
        // Build query string
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString()
        });
        if (filter !== 'ALL') {
            params.append('status', filter); // Support BE filtering like S-61.F2
        }

        const dataResponse = await apiCallGET<any>(`/shipper/deliveries?${params.toString()}`);

        // Handle pagination arrays from Response payload 
        const itemsArray = Array.isArray(dataResponse) ? dataResponse : (dataResponse?.items || []);
        validateArray(itemsArray, 'Shipper Deliveries API S-61');

        // Safe Fallback Value mappings to assure standard display for UI component:
        return itemsArray.map((d: any) => ({
            id: String(d.id || d.deliveryId || ''),
            orderId: String(d.orderId || '---'),
            status: (d.status as Delivery['status']) || 'ASSIGNED',
            assignedDate: String(d.assignedDate || d.scheduledTime || new Date().toISOString()),
            scheduledDate: String(d.scheduledDate || d.scheduledTime || new Date().toISOString()),
            completedDate: d.completedDate ? String(d.completedDate) : undefined,
            codAmount: typeof d.codAmount === 'number' ? d.codAmount : undefined,
            note: d.note ? String(d.note) : undefined,
            bike: {
                name: String(d.bike?.name || d.productName || 'Xe đạp'),
                image: String(d.bike?.image || d.productImage || '/placeholder-bike.png')
            },
            sender: {
                name: String(d.sender?.name || d.sellerName || 'Khách gửi'),
                phone: String(d.sender?.phone || d.sellerPhone || '---'),
                address: String(d.sender?.address || d.pickupAddress || '---')
            },
            receiver: {
                name: String(d.receiver?.name || d.buyerName || 'Khách nhận'),
                phone: String(d.receiver?.phone || d.buyerPhone || '---'),
                address: String(d.receiver?.address || d.dropoffAddress || '---')
            }
        }));

    } catch (error) {
        console.error('Lỗi API Shipper Deliveries List: ', error);
        throw error;
    }
}

/**
 * Get delivery detail
 * Mock/Infer implementation for S-62
 */
export async function getDeliveryDetail(deliveryId: string): Promise<Delivery | null> {
    if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const delivery = MOCK_DELIVERIES.find(d => d.id === deliveryId);
        return delivery || null;
    }

    try {
        const data = await apiCallGET<any>(`/shipper/deliveries/${deliveryId}`);
        if (!data) return null;

        validateObject(data, 'Shipper Delivery Detail API');
        validateString(data.id || data.deliveryId, 'delivery.id');
        validateString(data.status, 'delivery.status');

        return {
            id: String(data.id || data.deliveryId || deliveryId),
            orderId: String(data.orderId || '---'),
            status: (data.status as Delivery['status']) || 'ASSIGNED',
            assignedDate: String(data.assignedDate || new Date().toISOString()),
            scheduledDate: String(data.scheduledDate || new Date().toISOString()),
            completedDate: data.completedDate ? String(data.completedDate) : undefined,
            codAmount: typeof data.codAmount === 'number' ? data.codAmount : undefined,
            note: data.note ? String(data.note) : undefined,
            bike: {
                name: String(data.bike?.name || data.productName || 'Xe đạp'),
                image: String(data.bike?.image || '/placeholder-bike.png')
            },
            sender: {
                name: String(data.sender?.name || data.seller || 'Khách gửi'),
                phone: String(data.sender?.phone || '---'),
                address: String(data.sender?.address || '---')
            },
            receiver: {
                name: String(data.receiver?.name || data.buyer || 'Khách nhận'),
                phone: String(data.receiver?.phone || '---'),
                address: String(data.receiver?.address || '---')
            }
        };
    } catch (error) {
        console.error('Lỗi API Shipper Delivery Detail: ', error);
        throw error;
    }
}

/**
 * Get delivery confirmation info
 * S-63.A: GET /api/shipper/deliveries/{deliveryId}/confirmation
 */
export async function getDeliveryConfirmationInfo(deliveryId: string): Promise<DeliveryConfirmationInfo> {
    if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return { deliveryId };
    }
    const data = await apiCallGET<any>(`/shipper/deliveries/${deliveryId}/confirmation`);
    validateObject(data, 'Delivery Confirmation Info');
    return {
        deliveryId: String(data.deliveryId || deliveryId)
    };
}

/**
 * Get delivery failure report info
 * S-64.A: GET /api/shipper/deliveries/{deliveryId}/failure-report
 */
export async function getDeliveryFailureReportInfo(deliveryId: string): Promise<DeliveryFailureInfo> {
    if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            deliveryId,
            transactionId: 'TX-1',
            listingId: 'L-1',
            buyerName: 'Khách nhận',
            buyerPhone: '0901234567',
            sellerName: 'Khách gửi',
            deliveryAddress: '---',
            productName: 'Xe đạp',
            deliveryStatus: 'IN_PROGRESS',
            transactionStatus: 'IN_PROGRESS'
        };
    }
    const data = await apiCallGET<any>(`/shipper/deliveries/${deliveryId}/failure-report`);
    validateObject(data, 'Delivery Failure Report Info');

    return {
        deliveryId: String(data.deliveryId || deliveryId),
        transactionId: String(data.transactionId || ''),
        listingId: String(data.listingId || ''),
        buyerName: String(data.buyerName || ''),
        buyerPhone: String(data.buyerPhone || ''),
        sellerName: String(data.sellerName || ''),
        deliveryAddress: String(data.deliveryAddress || ''),
        productName: String(data.productName || ''),
        deliveryStatus: String(data.deliveryStatus || ''),
        transactionStatus: String(data.transactionStatus || '')
    };
}

/**
 * Start delivery (ASSIGNED → IN_PROGRESS)
 * Shipper confirms pickup and begins delivery
 * endpoint: POST /api/shipper/deliveries/{deliveryId}/start
 */
export async function startDelivery(deliveryId: string): Promise<void> {
    if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, 600));

        const mockDelivery = MOCK_DELIVERIES.find(d => d.id === deliveryId);
        if (!mockDelivery || mockDelivery.status !== 'ASSIGNED') {
            throw { status: 400, message: 'Delivery is not in ASSIGNED status' };
        }
        mockDelivery.status = 'IN_PROGRESS';
        return;
    }

    try {
        const response = await apiCallPOST<any>(`/shipper/deliveries/${deliveryId}/start`, {});

        // Strict Validation: Don't trust Backend completely
        if (response) {
            validateObject(response, 'Start Delivery Response');
            // Check if BE actually changed the state
            if (response.deliveryStatus !== 'IN_PROGRESS') {
                console.warn(`[API Warning] Received unexpectedly non-IN_PROGRESS status after starting delivery: ${response.deliveryStatus}`);
            }
        }
    } catch (error: any) {
        console.error('Lỗi API Start Delivery: ', error);

        // Enhance explicit error mapping based on Postman docs
        if (error.response?.status === 409) {
            throw new Error('Đơn hàng đã được bắt đầu giao trước đó hoặc trạng thái không hợp lệ.');
        } else if (error.response?.status === 403) {
            throw new Error('Bạn không có quyền thực hiện giao đơn hàng này.');
        } else if (error.response?.status === 404) {
            throw new Error('Không tìm thấy đơn hàng trên hệ thống.');
        }

        throw error;
    }
}

/**
 * Confirm delivery as completed (S-63 / BP6)
 * Backend will: delivery → DELIVERED, transaction → COMPLETED, listing → SOLD
 * endpoint: POST /api/shipper/deliveries/{deliveryId}/confirm
 */
export async function confirmDelivery(
    deliveryId: string,
    payload: DeliveryConfirmRequest
): Promise<void> {
    if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, 800));

        // Mock: simulate BP6 lifecycle — delivery → DELIVERED
        const mockDelivery = MOCK_DELIVERIES.find(d => d.id === deliveryId);
        if (!mockDelivery || mockDelivery.status !== 'IN_PROGRESS') {
            throw { status: 400, message: 'Delivery is not in IN_PROGRESS status' };
        }
        mockDelivery.status = 'DELIVERED';
        mockDelivery.completedDate = new Date().toISOString();
        return;
    }

    try {
        const response = await apiCallPOST<any>(`/shipper/deliveries/${deliveryId}/confirm`, payload);

        // Strict Validation: Don't trust Backend completely
        if (response) {
            validateObject(response, 'Confirm Delivery Response');
            // Check if BE actually changed the state
            if (response.deliveryStatus !== 'DELIVERED') {
                console.warn(`[API Warning] Received unexpectedly non-DELIVERED status after confirming delivery: ${response.deliveryStatus}`);
            }
        }
    } catch (error: any) {
        console.error('Lỗi API Confirm Delivery: ', error);

        // Enhance explicit error mapping based on Postman docs
        if (error.response?.status === 409) {
            throw new Error('Đơn hàng đã được xác nhận thành công trước đó.');
        } else if (error.response?.status === 400) {
            throw new Error('Dữ liệu xác nhận không hợp lệ.');
        }

        throw error;
    }
}

/**
 * S-64: Report delivery failed
 */
export async function reportDeliveryFailed(deliveryId: string, payload: DeliveryFailedRequest): Promise<void> {
    if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, 800));

        const delivery = MOCK_DELIVERIES.find(d => d.id === deliveryId);
        if (!delivery) throw new Error('Delivery not found');
        if (delivery.status !== 'IN_PROGRESS') throw new Error('Status not IN_PROGRESS');

        // S-64-BR04
        delivery.status = 'FAILED';
        delivery.note = payload.reason;
        return;
    }

    try {
        const response = await apiCallPOST<any>(`/shipper/deliveries/${deliveryId}/failure-report`, payload);

        // Strict Validation: Don't trust Backend completely
        if (response) {
            validateObject(response, 'Failure Report Response');
            // Check if BE actually changed the state
            if (response.deliveryStatus !== 'FAILED') {
                console.warn(`[API Warning] Received unexpectedly non-FAILED status after reporting failure: ${response.deliveryStatus}`);
            }
        }
    } catch (error: any) {
        console.error(`Lỗi API Report Failed Delivery ${deliveryId}:`, error);

        // Enhance explicit error mapping based on Postman docs
        if (error.response?.status === 409) {
            throw new Error('Đơn hàng đã được báo cáo thất bại trước đó.');
        } else if (error.response?.status === 400) {
            throw new Error('Lý do thất bại không hợp lệ hoặc bị trống.');
        }

        throw error;
    }
}
