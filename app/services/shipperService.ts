import { DeliverySummary, Delivery, DeliveryFilter, DeliveryConfirmRequest, DeliveryFailedRequest, PaginatedResponse, DeliveryConfirmationInfo, DeliveryFailureInfo } from '@/app/types/shipper';
import { apiCallGET, apiCallPOST } from '../utils/apiHelpers';
import { validateObject, validateArray, validateString } from '../utils/apiValidation';

function resolveImageUrl(rawPath: unknown): string {
    if (typeof rawPath !== 'string') return '/placeholder-bike.png';
    const path = rawPath.trim();
    if (!path) return '/placeholder-bike.png';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    if (path.startsWith('/uploads/')) return `/backend${path}`;
    return path || '/placeholder-bike.png';
}

function safeString(value: any, fallback: string): string {
    if (typeof value === 'string' && value.trim()) return value.trim();
    return fallback;
}

function extractShipperAddress(data: any, rootFields: string[], nestedBlocks: any[]): string {
    for (const field of rootFields) {
        if (typeof data[field] === 'string' && data[field].trim()) {
            return data[field].trim();
        }
    }
    for (const block of nestedBlocks) {
        if (block && typeof block.address === 'string' && block.address.trim()) {
            return block.address.trim();
        }
    }
    return '---';
}

function mapShipperDeliveryStatus(rawStatus: any, fallbackStatus?: any): 'ASSIGNED' | 'IN_PROGRESS' | 'DELIVERED' | 'FAILED' {
    const s = String(rawStatus || fallbackStatus || '').toUpperCase();
    if (s.includes('DELIVERED') || s === 'SUCCESS' || s === 'COMPLETED') return 'DELIVERED';
    if (s.includes('FAIL') || s === 'CANCELLED') return 'FAILED';
    if (s.includes('PROGRESS') || s.includes('DELIVERING') || s === 'SHIPPING') return 'IN_PROGRESS';
    return 'ASSIGNED';
}

/**
 * Get delivery summary for a shipper
 * endpoint: S-60/S-61 GET /api/shipper/dashboard/summary
 */
export async function getDeliverySummary(shipperId: number): Promise<DeliverySummary> {
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

/**
 * Get deliveries for a shipper
 * S-61 list
 */
export async function getDeliveries(shipperId: number, filter: DeliveryFilter = 'ALL', page: number = 0, size: number = 20): Promise<Delivery[]> {
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
        const mappedDeliveries = itemsArray.map((d: any) => ({
            id: String(d.id || d.deliveryId || ''),
            orderId: String(d.orderId || '---'),
            status: mapShipperDeliveryStatus(d.status, d.deliveryStatus),
            assignedDate: String(d.assignedDate || d.scheduledTime || new Date().toISOString()),
            scheduledDate: String(d.scheduledDate || d.scheduledTime || new Date().toISOString()),
            completedDate: d.completedDate ? String(d.completedDate) : undefined,
            codAmount: typeof d.codAmount === 'number' ? d.codAmount : undefined,
            note: d.note ? String(d.note) : undefined,
            bike: {
                name: String(d.bike?.name || d.productName || 'Xe đạp'),
                image: resolveImageUrl(d.bike?.image || d.productImage)
            },
            sender: {
                name: safeString(d.sender?.name || d.sellerName, 'Người bán'),
                phone: safeString(d.sender?.phone || d.sellerPhone, '---'),
                address: extractShipperAddress(d, ['pickupAddress', 'sellerAddress', 'senderAddress'], [d.sender, d.seller, d.pickup])
            },
            receiver: {
                name: safeString(d.receiver?.name || d.buyerName, 'Người mua'),
                phone: safeString(d.receiver?.phone || d.buyerPhone, '---'),
                address: extractShipperAddress(d, ['dropoffAddress', 'deliveryAddress', 'shippingAddress', 'receiverAddress', 'buyerAddress'], [d.receiver, d.buyer, d.delivery])
            }
        }));

        // Aggressive Client-Side Filtering Fallback:
        // Ensures that even if Backend's ?status= query fails or ignores conditions, the UI remains perfectly clean.
        if (filter !== 'ALL') {
            return mappedDeliveries.filter((d: Delivery) => d.status === filter);
        }

        return mappedDeliveries;

    } catch (error) {
        console.error('Lỗi API Shipper Deliveries List: ', error);
        throw error;
    }
}

/**
 * Get delivery detail
 * S-62
 */
export async function getDeliveryDetail(deliveryId: string): Promise<Delivery | null> {
    try {
        const data = await apiCallGET<any>(`/shipper/deliveries/${deliveryId}`);
        if (!data) return null;

        validateObject(data, 'Shipper Delivery Detail API');

        return {
            id: String(data.id || data.deliveryId || deliveryId),
            orderId: String(data.orderId || '---'),
            status: mapShipperDeliveryStatus(data.status, data.deliveryStatus),
            assignedDate: String(data.timeline?.assignedTime || data.assignedDate || new Date().toISOString()),
            scheduledDate: String(data.timeline?.expectedDeliveryTime || data.scheduledDate || new Date().toISOString()),
            completedDate: data.timeline?.completedTime ? String(data.timeline.completedTime) : undefined,
            codAmount: typeof data.codAmount === 'number' ? data.codAmount : (data.codAmount != null ? Number(data.codAmount) : undefined),
            note: data.note ? String(data.note) : undefined,
            bike: {
                name: String(data.bike?.name || data.productName || 'Xe đạp'),
                image: resolveImageUrl(data.bike?.image || data.productImage)
            },
            sender: {
                name: safeString(data.seller?.fullName || data.pickup?.contactName || data.sellerName || data.sender?.name, 'Người bán'),
                phone: safeString(data.seller?.phone || data.pickup?.contactPhone || data.sellerPhone || data.sender?.phone, '---'),
                address: extractShipperAddress(data, ['pickupAddress', 'sellerAddress', 'senderAddress'], [data.pickup, data.seller, data.sender])
            },
            receiver: {
                name: safeString(data.buyer?.fullName || data.delivery?.contactName || data.buyerName || data.receiver?.name, 'Người mua'),
                phone: safeString(data.buyer?.phone || data.delivery?.contactPhone || data.buyerPhone || data.receiver?.phone, '---'),
                address: extractShipperAddress(data, ['deliveryAddress', 'dropoffAddress', 'shippingAddress', 'receiverAddress', 'buyerAddress'], [data.delivery, data.buyer, data.receiver])
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
    try {
        // To match Postman Collection (S-63.B), the Backend API does NOT accept a JSON body.
        // Sending large base64 signatureImages or unrecognized fields will cause 400 or 413 Payload Too Large errors.
        const response = await apiCallPOST<any>(`/shipper/deliveries/${deliveryId}/confirm`, {});

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
