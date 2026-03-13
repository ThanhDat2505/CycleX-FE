export interface SummaryMetrics {
    totalUsers: number;
    totalOrders: number;
    totalDisputes: number;
    totalRevenue: number;
    userTrend: number;
    orderTrend: number;
    disputeTrend: number;
    revenueTrend: number;
}

export interface ChartDataPoint {
    date: string;
    value: number;
}

export interface UserStats {
    daily: ChartDataPoint[];
    weekly: ChartDataPoint[];
}

export interface OrderStats {
    totalOrders: number;
    completedRevenue: number;
    orderHistory: ChartDataPoint[];
    revenueHistory: ChartDataPoint[];
}

export type ActivityType = 'USER_REGISTER' | 'ORDER_CREATE' | 'DATA_UPDATE' | 'SYSTEM';

export interface RecentActivity {
    id: string;
    type: ActivityType;
    description: string;
    timestamp: string;
    user?: string;
}

export interface AdminDashboardData {
    summary: SummaryMetrics;
    userStats: UserStats;
    orderStats: OrderStats;
    recentActivities: RecentActivity[];
    recentDisputes: RecentActivity[];
    recentUsers: RecentActivity[];
}

export type TimeRange = 'TODAY' | 'LAST_7_DAYS' | 'LAST_30_DAYS' | 'CUSTOM';
