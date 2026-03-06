import { DeliverySummary, Delivery, DeliveryFilter, DeliveryConfirmRequest, DeliveryFailedRequest } from '@/app/types/shipper';
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

        // Safe Fallback Parsing: Do not trust Backend completely
        return {
            assigned: typeof data.assigned === 'number' ? data.assigned : 0,
            inProgress: typeof data.inProgress === 'number' ? data.inProgress : 0,
            delivered: typeof data.delivered === 'number' ? data.delivered : 0,
            failed: typeof data.failed === 'number' ? data.failed : 0
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
 * Get assigned deliveries for a shipper
 * Mock implementation for S-61
 */
export async function getAssignedDeliveries(shipperId: number, filter: DeliveryFilter = 'ALL'): Promise<Delivery[]> {
    if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, 600));

        if (filter === 'ALL') return MOCK_DELIVERIES;
        return MOCK_DELIVERIES.filter(d => d.status === filter);
    }

    try {
        // E.g. /api/shipper/deliveries/assigned?page=0&pageSize=10
        const dataResponse = await apiCallGET<any>(`/shipper/deliveries/assigned?page=0&pageSize=20`);

        // Handle pagination arrays from Response payload 
        const itemsArray = Array.isArray(dataResponse) ? dataResponse : (dataResponse?.items || []);
        validateArray(itemsArray, 'Shipper Deliveries Assigned API');

        // Apply local filter since BE endpoint only supports assigned
        let filteredItems = itemsArray;
        if (filter !== 'ALL') {
            filteredItems = itemsArray.filter((d: any) => d.status === filter);
        }

        // Deep loop validation 
        filteredItems.forEach((d: any, i: number) => {
            const ctx = `shipperDeliveries[${i}]`;
            validateObject(d, ctx);
            validateString(d.id || d.deliveryId, `${ctx}.id`);
            validateString(d.status, `${ctx}.status`);
        });

        // Safe Fallback Value mappings to assure standard display for UI component:
        return filteredItems.map((d: any) => ({
            id: String(d.id || d.deliveryId || ''),
            orderId: String(d.orderId || '---'),
            status: (d.status as Delivery['status']) || 'ASSIGNED',
            assignedDate: String(d.assignedDate || new Date().toISOString()),
            scheduledDate: String(d.scheduledDate || new Date().toISOString()),
            completedDate: d.completedDate ? String(d.completedDate) : undefined,
            codAmount: typeof d.codAmount === 'number' ? d.codAmount : undefined,
            note: d.note ? String(d.note) : undefined,
            bike: {
                name: String(d.bike?.name || 'Xe đạp'),
                image: String(d.bike?.image || '/placeholder-bike.png')
            },
            sender: {
                name: String(d.sender?.name || 'Khách gửi'),
                phone: String(d.sender?.phone || '---'),
                address: String(d.sender?.address || '---')
            },
            receiver: {
                name: String(d.receiver?.name || 'Khách nhận'),
                phone: String(d.receiver?.phone || '---'),
                address: String(d.receiver?.address || '---')
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
                name: String(data.bike?.name || 'Xe đạp'),
                image: String(data.bike?.image || '/placeholder-bike.png')
            },
            sender: {
                name: String(data.sender?.name || 'Khách gửi'),
                phone: String(data.sender?.phone || '---'),
                address: String(data.sender?.address || '---')
            },
            receiver: {
                name: String(data.receiver?.name || 'Khách nhận'),
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
        await apiCallPOST(`/shipper/deliveries/${deliveryId}/start`, {});
    } catch (error) {
        console.error('Lỗi API Start Delivery: ', error);
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
        await apiCallPOST(`/shipper/deliveries/${deliveryId}/confirm`, payload);
    } catch (error) {
        console.error('Lỗi API Confirm Delivery: ', error);
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
        await apiCallPOST(`/shipper/deliveries/${deliveryId}/fail`, payload);
    } catch (error) {
        console.error(`Lỗi API Report Failed Delivery ${deliveryId}:`, error);
        throw error;
    }
}
