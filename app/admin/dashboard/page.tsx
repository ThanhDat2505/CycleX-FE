'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, Download, Filter } from 'lucide-react';
import StatCards from '../../components/admin/StatCards';
import DashboardCharts from '../../components/admin/DashboardCharts';
import ActivityFeed from '../../components/admin/ActivityFeed';
import TimeRangeFilter from '../../components/admin/TimeRangeFilter';
import { getAdminDashboardData } from '../../services/adminDashboardService';
import { AdminDashboardData, TimeRange } from '../../types/adminDashboard';

const AdminDashboardPage = () => {
    const [data, setData] = useState<AdminDashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState<TimeRange>('LAST_7_DAYS');
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async (range: TimeRange) => {
        setRefreshing(true);
        try {
            const dashboardData = await getAdminDashboardData(range);
            setData(dashboardData);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData(timeRange);
    }, [timeRange]);

    const handleRefresh = () => {
        fetchData(timeRange);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
                        <p className="text-gray-500 mt-1">Review system performance and user activity.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={handleRefresh}
                            className={`p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50 transition-all ${refreshing ? 'animate-spin' : ''}`}
                            title="Refresh Data"
                        >
                            <RefreshCw size={20} />
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-all">
                            <Download size={18} />
                            <span>Export</span>
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 border border-blue-600 rounded-xl text-white font-medium hover:bg-blue-700 transition-all shadow-sm shadow-blue-200">
                            <Filter size={18} />
                            <span>Advanced</span>
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-8 flex justify-end">
                    <TimeRangeFilter 
                        currentRange={timeRange} 
                        onRangeChange={(range) => setTimeRange(range)} 
                    />
                </div>

                {/* Stats Grid */}
                <div className="mb-8">
                    <StatCards summary={data.summary} />
                </div>

                {/* Charts and Activity */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <div className="xl:col-span-2">
                        <DashboardCharts 
                            userData={data.userStats.daily} 
                            orderData={data.orderStats.orderHistory} 
                        />
                        
                        {/* Summary Details or Additional Chart */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Overview</h3>
                            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100 mb-4">
                                <div>
                                    <p className="text-emerald-700 text-sm font-medium">Completed Revenue</p>
                                    <p className="text-2xl font-bold text-emerald-900 mt-1">
                                        {(data.orderStats.completedRevenue / 1000000).toLocaleString()}M VND
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-emerald-600 text-xs uppercase font-bold tracking-wider">Target: 500M</p>
                                    <div className="w-32 h-2 bg-emerald-200 rounded-full mt-2 overflow-hidden text-transparent">
                                        <div className="bg-emerald-600 h-full" style={{ width: '82%' }}>.</div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500">
                                This reflects all orders marked as "Completed" in the selected time range.
                            </p>
                        </div>
                    </div>
                    
                    <div className="xl:col-span-1">
                        <ActivityFeed activities={data.recentActivities} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
