export type TimeRange = 'TODAY' | 'LAST_7_DAYS' | 'LAST_30_DAYS' | 'CUSTOM';

export interface UserManagementStats {
    totalUsers: number;
    activeUsers: number;
    bannedSuspendedUsers: number;
    newUsersInRange: number; // users created in the selected time range
}

export interface DisputeManagementStats {
    totalDisputes: number;
    pendingDisputes: number;
    resolvedDisputes: number;
    newDisputesInRange: number; // disputes created in the selected time range
}

export interface TransactionStats {
    totalSuccessfulTransactions: number;
    successfulRevenue: number;
}

export interface WeeklyDataPoint {
    week: string;
    count: number;
}

export interface WeeklyStats {
    listings: WeeklyDataPoint[];
    products: WeeklyDataPoint[];
    orders: WeeklyDataPoint[];
}

export interface AdminDashboardData {
    userManagement: UserManagementStats;
    disputeManagement: DisputeManagementStats;
    transactions: TransactionStats;
    weeklyStats: WeeklyStats;
}
