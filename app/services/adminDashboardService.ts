import { apiCallGET } from '../utils/apiHelpers';
import { AdminDashboardData, TimeRange } from '../types/adminDashboard';

export async function getAdminDashboardData(
    timeRange: TimeRange = 'LAST_7_DAYS',
    startDate?: string,
    endDate?: string
): Promise<AdminDashboardData> {
    let url = `/admin/dashboard?timeRange=${timeRange}`;
    if (startDate) url += `&startDate=${startDate}`;
    if (endDate) url += `&endDate=${endDate}`;

    return apiCallGET<AdminDashboardData>(url);
}
