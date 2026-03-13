'use client';

import React, { useState, useEffect } from 'react';
import { 
    RefreshCw, 
    Users, UserCheck, UserX, UserPlus,
    AlertTriangle, ShieldAlert, CheckCircle, BellRing,
    ShoppingBag, DollarSign
} from 'lucide-react';
import TimeRangeFilter from '../../components/admin/TimeRangeFilter';
import { getAdminDashboardData } from '../../services/adminDashboardService';
import { AdminDashboardData, TimeRange } from '../../types/adminDashboard';
import { useToast } from '../../contexts/ToastContext';
import { formatNumber, formatPrice } from '../../utils/format';

const AdminDashboardPage = () => {
    useEffect(() => {
        document.title = "Admin Dashboard | CycleX";
    }, []);

    const { addToast } = useToast();
    const [data, setData] = useState<AdminDashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [timeRange, setTimeRange] = useState<TimeRange>('LAST_7_DAYS');
    const [refreshing, setRefreshing] = useState(false);
    const [customDates, setCustomDates] = useState<{start?: string, end?: string}>({});

    const fetchData = React.useCallback(async (range: TimeRange, start?: string, end?: string) => {
        setRefreshing(true);
        setError(null);
        try {
            const dashboardData = await getAdminDashboardData(range, start, end);
            if (!dashboardData) throw new Error('No data received from server.');
            setData(dashboardData);
        } catch (error: any) {
            console.error('Failed to fetch dashboard data:', error);
            setError(error.message || 'An unexpected error occurred while loading the dashboard.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        if (timeRange === 'CUSTOM') {
            if (customDates.start && customDates.end) {
                fetchData(timeRange, customDates.start, customDates.end);
            }
        } else {
            fetchData(timeRange);
        }
    }, [timeRange, customDates, fetchData]);

    const handleRefresh = () => {
        fetchData(timeRange, customDates.start, customDates.end);
    };

    const handleRangeChange = (range: TimeRange, start?: string, end?: string) => {
        if (range === 'CUSTOM') {
            if (start && end) {
                const startDate = new Date(start);
                const endDate = new Date(end);
                
                if (startDate > endDate) {
                    addToast('Start date cannot be after end date', 'error');
                    return;
                }
                
                setTimeRange(range);
                setCustomDates({ start, end });
            } else {
                setTimeRange(range);
            }
        } else {
            setTimeRange(range);
            setCustomDates({});
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600 font-bold uppercase tracking-widest text-xs animate-pulse">Loading Analytics...</p>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
                <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-gray-100 text-center animate-scale-in">
                    <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <RefreshCw size={40} />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Connection Error</h2>
                    <p className="text-gray-500 mb-8 leading-relaxed font-medium">{error || "No data exists"}</p>
                    <button 
                        onClick={() => fetchData(timeRange)}
                        className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.98]"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Helper component to display individual stat cards
    const StatCard = ({ title, value, icon: Icon, color, isCurrency = false }: { title: string, value: number, icon: any, color: string, isCurrency?: boolean }) => {
        const colors = {
            blue: 'bg-blue-50 text-blue-600 border-blue-100 ring-blue-500/20',
            green: 'bg-emerald-50 text-emerald-600 border-emerald-100 ring-emerald-500/20',
            red: 'bg-rose-50 text-rose-600 border-rose-100 ring-rose-500/20',
            orange: 'bg-orange-50 text-orange-600 border-orange-100 ring-orange-500/20',
            purple: 'bg-purple-50 text-purple-600 border-purple-100 ring-purple-500/20'
        };
        const activeColor = colors[color as keyof typeof colors] || colors.blue;
        
        return (
            <div className={`p-5 rounded-2xl border ${activeColor} bg-white shadow-sm hover:shadow-md transition-shadow`}>
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-2.5 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm`}>
                        <Icon size={20} strokeWidth={2.5} />
                    </div>
                </div>
                <div>
                    <p className="text-gray-500 text-[11px] font-black uppercase tracking-widest mb-1">{title}</p>
                    <div className="flex items-baseline gap-1.5">
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                            {isCurrency ? formatPrice(value) : formatNumber(value)}
                        </h3>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Phase */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
                        <p className="text-gray-500 mt-1">S-80 Key Performance Indicators & System Metrics.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={handleRefresh}
                            className={`p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50 transition-all ${refreshing ? 'animate-spin' : ''}`}
                            title="Refresh Data"
                        >
                            <RefreshCw size={20} />
                        </button>
                    </div>
                </div>

                {/* Filter Phase */}
                <div className="mb-8 flex justify-end">
                    <TimeRangeFilter 
                        currentRange={timeRange} 
                        onRangeChange={handleRangeChange} 
                    />
                </div>

                {/* Section 1: User Management Overview */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                            <Users size={20} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">User Management Info</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard title="Total Users" value={data.userManagement.totalUsers} icon={Users} color="blue" />
                        <StatCard title="Active Users" value={data.userManagement.activeUsers} icon={UserCheck} color="green" />
                        <StatCard title="Suspended/Banned" value={data.userManagement.bannedSuspendedUsers} icon={UserX} color="red" />
                        <StatCard title="New Users (In Range)" value={data.userManagement.newUsersInRange} icon={UserPlus} color="purple" />
                    </div>
                </div>

                {/* Section 2: Dispute Management Overview */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                            <ShieldAlert size={20} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Dispute Management Info</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard title="Total Disputes" value={data.disputeManagement.totalDisputes} icon={AlertTriangle} color="orange" />
                        <StatCard title="Pending Disputes" value={data.disputeManagement.pendingDisputes} icon={BellRing} color="red" />
                        <StatCard title="Resolved Disputes" value={data.disputeManagement.resolvedDisputes} icon={CheckCircle} color="green" />
                        <StatCard title="New Disputes (In Range)" value={data.disputeManagement.newDisputesInRange} icon={AlertTriangle} color="purple" />
                    </div>
                </div>

                {/* Section 3: Successful Transactions Overview */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                            <ShoppingBag size={20} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Successful Transactions Info</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <StatCard title="Successful Transactions" value={data.transactions.totalSuccessfulTransactions} icon={CheckCircle} color="green" />
                        <StatCard title="Total Successful Revenue" value={data.transactions.successfulRevenue} icon={DollarSign} color="green" isCurrency={true} />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboardPage;
