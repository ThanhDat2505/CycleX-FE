import { DeliverySummary, Delivery, DeliveryFilter } from '@/app/types/shipper';
import { apiCallGET } from '@/app/utils/apiHelpers';

const USE_MOCK_API = process.env.NEXT_PUBLIC_MOCK_API === 'true';

/**
 * Get delivery summary for a shipper
 * GET /api/shipper/dashboard/summary
 * Real API endpoint from S-60.F1
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

    // Real API call: GET /api/shipper/dashboard/summary
    try {
        return await apiCallGET<DeliverySummary>('/shipper/dashboard/summary');
    } catch (error) {
        console.error('Error fetching delivery summary:', error);
        throw error;
    }
}

/**
 * Get assigned deliveries for a shipper
 * GET /api/shipper/deliveries/assigned
 * Real API endpoint from S-60.F2
 */
export async function getAssignedDeliveries(
    shipperId: number, 
    filter: DeliveryFilter = 'ALL',
    page: number = 0,
    pageSize: number = 10
): Promise<Delivery[]> {
    if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, 600));

        if (filter === 'ALL') return MOCK_DELIVERIES;

        return MOCK_DELIVERIES.filter(d => d.status === filter);
    }

    // Real API call: GET /api/shipper/deliveries/assigned
    try {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('pageSize', pageSize.toString());
        if (filter !== 'ALL') {
            params.append('status', filter);
        }

        const response = await apiCallGET<{ items: Delivery[] }>(
            `/shipper/deliveries/assigned?${params.toString()}`
        );
        return response.items || [];
    } catch (error) {
        console.error('Error fetching assigned deliveries:', error);
        throw error;
    }
}

// Mock Deliveries Data (used when NEXT_PUBLIC_MOCK_API=true)
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
 * Get delivery detail (mock only - not in API spec)
 */
export async function getDeliveryDetail(deliveryId: string): Promise<Delivery | null> {
    if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const delivery = MOCK_DELIVERIES.find(d => d.id === deliveryId);
        return delivery || null;
    }
    return null;
}
