import { apiCallGET } from '../utils/apiHelpers';
import { AdminDashboardData, TimeRange } from '../types/adminDashboard';
import { API_DELAY_MS } from '../constants';

export async function getAdminDashboardData(
    timeRange: TimeRange = 'LAST_7_DAYS',
    startDate?: string,
    endDate?: string
): Promise<AdminDashboardData> {
    const USE_MOCK_API = process.env.NEXT_PUBLIC_MOCK_API === 'true';

    if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, API_DELAY_MS));

        // Let's implement dynamic mock behavior to simulate "0 when no data"
        // If they pick CUSTOM but put an invalid or very old date, return 0
        const isZeroData = false; // Mock switch: change to true if you want to see all zeros

        if (isZeroData) {
            return {
                userManagement: { totalUsers: 0, activeUsers: 0, bannedSuspendedUsers: 0, newUsersInRange: 0 },
                disputeManagement: { totalDisputes: 0, pendingDisputes: 0, resolvedDisputes: 0, newDisputesInRange: 0 },
                transactions: { totalSuccessfulTransactions: 0, successfulRevenue: 0 }
            };
        }

        // Return rich mock data based on mock logic
        let multiplier = 1;
        if (timeRange === 'TODAY') multiplier = 0.1;
        if (timeRange === 'LAST_7_DAYS') multiplier = 1;
        if (timeRange === 'LAST_30_DAYS') multiplier = 4;
        if (timeRange === 'CUSTOM') multiplier = 2; // Arbitrary

        return {
            userManagement: {
                totalUsers: 1450, // "Dữ liệu của toàn bộ hệ thống khi admin mở Dashboard"
                activeUsers: 1300,
                bannedSuspendedUsers: 150,
                newUsersInRange: Math.floor(54 * multiplier) // Lọc dữ liệu theo khoảng thời gian
            },
            disputeManagement: {
                totalDisputes: 120, // Toàn bộ hệ thống
                pendingDisputes: 15,
                resolvedDisputes: 105,
                newDisputesInRange: Math.floor(12 * multiplier) // Lọc theo thời gian
            },
            transactions: {
                totalSuccessfulTransactions: Math.floor(328 * multiplier),
                successfulRevenue: Math.floor(450000000 * multiplier)
            }
        };
    }

    let url = `/admin/dashboard?timeRange=${timeRange}`;
    if (startDate) url += `&startDate=${startDate}`;
    if (endDate) url += `&endDate=${endDate}`;

    return apiCallGET<AdminDashboardData>(url);
}
