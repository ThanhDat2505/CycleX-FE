import { apiCallGET } from '../utils/apiHelpers';
import { AdminDashboardData, TimeRange } from '../types/adminDashboard';
import { API_DELAY_MS } from '../constants';

/**
 * Get Admin Dashboard data including metrics and activities.
 * 
 * API Endpoint: GET /api/admin/dashboard
 * @param timeRange The range to filter data (TODAY, LAST_7_DAYS, etc.)
 * @param startDate Optional custom start date
 * @param endDate Optional custom end date
 */
export async function getAdminDashboardData(
    timeRange: TimeRange = 'LAST_7_DAYS',
    startDate?: string,
    endDate?: string
): Promise<AdminDashboardData> {
    const USE_MOCK_API = process.env.NEXT_PUBLIC_MOCK_API === 'true';

    if (USE_MOCK_API) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, API_DELAY_MS));

        return {
            summary: {
                totalUsers: 1250,
                totalOrders: 328,
                totalDisputes: 15,
                totalRevenue: 450000000,
                userTrend: 12.5,
                orderTrend: -5.2,
                disputeTrend: 2.1,
                revenueTrend: 8.7,
            },
            userStats: {
                daily: Array.from({ length: 7 }, (_, i) => ({
                    date: new Date(Date.now() - (6 - i) * 86400000).toISOString().split('T')[0],
                    value: Math.floor(Math.random() * 50) + 10
                })),
                weekly: Array.from({ length: 4 }, (_, i) => ({
                    date: `Week ${i + 1}`,
                    value: Math.floor(Math.random() * 200) + 50
                }))
            },
            orderStats: {
                totalOrders: 328,
                completedRevenue: 410000000,
                orderHistory: Array.from({ length: 7 }, (_, i) => ({
                    date: new Date(Date.now() - (6 - i) * 86400000).toISOString().split('T')[0],
                    value: Math.floor(Math.random() * 20) + 5
                })),
                revenueHistory: Array.from({ length: 7 }, (_, i) => ({
                    date: new Date(Date.now() - (6 - i) * 86400000).toISOString().split('T')[0],
                    value: (Math.floor(Math.random() * 50) + 10) * 1000000
                }))
            },
            recentActivities: [
                { id: '1', type: 'USER_REGISTER', description: 'New user "Nguyen Van A" registered', timestamp: new Date().toISOString(), user: 'Nguyen Van A' },
                { id: '2', type: 'ORDER_CREATE', description: 'Order #ORD-2024-001 created', timestamp: new Date(Date.now() - 3600000).toISOString(), user: 'Tran Thi B' }
            ],
            recentDisputes: [
                { id: 'd1', type: 'SYSTEM', description: 'Dispute #DISP-101: Item not as described', timestamp: new Date(Date.now() - 10800000).toISOString(), user: 'Nguyen Van C' },
                { id: 'd2', type: 'SYSTEM', description: 'Dispute #DISP-102: Late delivery', timestamp: new Date(Date.now() - 86400000).toISOString(), user: 'Pham Van D' },
                { id: 'd3', type: 'SYSTEM', description: 'Dispute #DISP-103: Damage during shipping', timestamp: new Date(Date.now() - 172800000).toISOString(), user: 'Le Thi E' }
            ],
            recentUsers: [
                { id: 'u1', type: 'USER_REGISTER', description: 'Hoang Van F joined CycleX', timestamp: new Date().toISOString() },
                { id: 'u2', type: 'USER_REGISTER', description: 'Bui Thi G joined CycleX', timestamp: new Date(Date.now() - 3600000).toISOString() },
                { id: 'u3', type: 'USER_REGISTER', description: 'Vo Van H joined CycleX', timestamp: new Date(Date.now() - 7200000).toISOString() },
                { id: 'u4', type: 'USER_REGISTER', description: 'Dang Van I joined CycleX', timestamp: new Date(Date.now() - 10800000).toISOString() },
                { id: 'u5', type: 'USER_REGISTER', description: 'Ngo Thi K joined CycleX', timestamp: new Date(Date.now() - 14400000).toISOString() }
            ]
        };
    }

    // REAL API CALL
    let url = `/admin/dashboard?timeRange=${timeRange}`;
    if (startDate) url += `&startDate=${startDate}`;
    if (endDate) url += `&endDate=${endDate}`;

    return apiCallGET<AdminDashboardData>(url);
}
