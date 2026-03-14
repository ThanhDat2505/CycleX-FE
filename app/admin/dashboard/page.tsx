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
                    addToast('Ngày bắt đầu không thể sau ngày kết thúc', 'error');
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
            <div className="flex items-center justify-center min-h-screen bg-brand-bg">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-400 font-bold uppercase tracking-widest text-xs animate-pulse">Đang tải phân tích...</p>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-brand-bg p-4">
                <div className="max-w-md w-full bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 text-center animate-scale-in">
                    <div className="w-20 h-20 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <RefreshCw size={40} />
                    </div>
                    <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Lỗi Kết Nối</h2>
                    <p className="text-gray-400 mb-8 leading-relaxed font-medium">{error || "Không có dữ liệu hệ thống"}</p>
                    <button 
                        onClick={() => fetchData(timeRange)}
                        className="w-full py-4 bg-brand-primary text-white font-black rounded-2xl shadow-lg shadow-brand-primary/20 hover:bg-brand-primary-hover transition-all active:scale-[0.98]"
                    >
                        Thử Lại
                    </button>
                </div>
            </div>
        );
    }

    const StatCard = ({ title, value, icon: Icon, color, isCurrency = false }: { title: string, value: number, icon: any, color: string, isCurrency?: boolean }) => {
        const colorStyles = {
            orange: 'text-brand-primary bg-brand-primary/10 border-brand-primary/20',
            blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
            green: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
            red: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
            purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
        };
        const colorText = {
            orange: 'text-brand-primary',
            blue: 'text-blue-400',
            green: 'text-emerald-400',
            red: 'text-rose-400',
            purple: 'text-purple-400'
        };
        
        const style = colorStyles[color as keyof typeof colorStyles] || colorStyles.orange;
        const textColor = colorText[color as keyof typeof colorText] || colorText.orange;
        
        return (
            <div className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl hover:bg-white/10 transition-all duration-300 animate-fade-in-up">
                <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-2xl border ${style}`}>
                        <Icon size={22} strokeWidth={2.5} />
                    </div>
                </div>
                <div>
                    <p className="text-gray-400 text-[11px] font-black uppercase tracking-[0.2em] mb-2">{title}</p>
                    <div className="flex items-baseline gap-1.5">
                        <h3 className={`text-3xl md:text-4xl font-black tracking-tighter group-hover:scale-110 transition-transform origin-left ${textColor}`}>
                            {isCurrency ? formatPrice(value) : formatNumber(value)}
                        </h3>
                        {isCurrency && <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">VND</span>}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-brand-bg text-white p-4 lg:p-10 selection:bg-brand-primary/30">
            <div className="max-w-7xl mx-auto">
                {/* Header Phase - Home Style */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-8 border-b border-white/5">
                    <div className="animate-slide-up">
                        <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 mb-4 shadow-xl">
                            <span className="text-brand-primary text-xs animate-pulse">●</span>
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Hệ Thống Phân Tích CycleX</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter leading-none mb-4">
                            Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-blue-400">Dashboard</span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-xl font-medium">
                            Giám sát hiệu suất hệ thống, quản lý người dùng và theo dõi khiếu nại theo thời gian thực.
                        </p>
                    </div>
                    
                    <div className="flex flex-col items-center md:items-end gap-6">
                        <TimeRangeFilter 
                            currentRange={timeRange} 
                            onRangeChange={handleRangeChange} 
                        />
                        <button 
                            onClick={handleRefresh}
                            className={`flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-gray-300 hover:text-white hover:bg-white/10 hover:border-brand-primary/50 transition-all ${refreshing ? 'animate-spin' : ''}`}
                        >
                            <RefreshCw size={16} />
                            Cập nhật dữ liệu
                        </button>
                    </div>
                </div>

                {/* Main Content Sections */}
                <div className="space-y-16">
                    {/* Section 1: User Management Overview */}
                    <div className="animate-fade-in delay-100">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary shadow-glow-orange">
                                <Users size={24} strokeWidth={2.5} />
                            </div>
                            <h2 className="text-2xl font-black tracking-tight border-l-4 border-brand-primary pl-4">Quản Lý Người Dùng</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard title="Tổng Người Dùng" value={data.userManagement.totalUsers} icon={Users} color="blue" />
                            <StatCard title="Đang Hoạt Động" value={data.userManagement.activeUsers} icon={UserCheck} color="green" />
                            <StatCard title="Đã Bị Khóa/Cấm" value={data.userManagement.bannedSuspendedUsers} icon={UserX} color="red" />
                            <StatCard title="Đăng Ký Mới" value={data.userManagement.newUsersInRange} icon={UserPlus} color="orange" />
                        </div>
                    </div>

                    {/* Section 2: Dispute Management Overview */}
                    <div className="animate-fade-in delay-200">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shadow-glow">
                                <ShieldAlert size={24} strokeWidth={2.5} />
                            </div>
                            <h2 className="text-2xl font-black tracking-tight border-l-4 border-orange-400 pl-4">Quản Lý Khiếu Nại</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard title="Tổng Khiếu Nại" value={data.disputeManagement.totalDisputes} icon={AlertTriangle} color="orange" />
                            <StatCard title="Đang Chờ Xử Lý" value={data.disputeManagement.pendingDisputes} icon={BellRing} color="red" />
                            <StatCard title="Đã Giải Quyết" value={data.disputeManagement.resolvedDisputes} icon={CheckCircle} color="green" />
                            <StatCard title="Khiếu Nại Mới" value={data.disputeManagement.newDisputesInRange} icon={AlertTriangle} color="purple" />
                        </div>
                    </div>

                    {/* Section 3: Successful Transactions Overview */}
                    <div className="animate-fade-in delay-300">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-glow">
                                <ShoppingBag size={24} strokeWidth={2.5} />
                            </div>
                            <h2 className="text-2xl font-black tracking-tight border-l-4 border-emerald-400 pl-4">Giao Dịch Thành Công</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative group overflow-hidden bg-gradient-to-br from-emerald-500/10 to-transparent border border-white/10 rounded-3xl p-8 backdrop-blur-xl transition-all hover:bg-white/5">
                                <div className="absolute top-0 right-0 p-8 text-emerald-500/10 group-hover:text-emerald-500/20 transition-colors">
                                    <ShoppingBag size={120} />
                                </div>
                                <p className="text-gray-400 text-xs font-black uppercase tracking-[0.2em] mb-4">Tổng Số Đơn Hàng Thành Công</p>
                                <h3 className="text-6xl font-black text-emerald-400 tracking-tighter mb-2 group-hover:scale-110 transition-transform origin-left">
                                    {formatNumber(data.transactions.totalSuccessfulTransactions)}
                                </h3>
                                <p className="text-sm font-medium text-emerald-500 flex items-center gap-1">
                                    <CheckCircle size={14} /> Giao dịch hoàn tất
                                </p>
                            </div>
                            
                            <div className="relative group overflow-hidden bg-gradient-to-br from-brand-primary/10 to-transparent border border-white/10 rounded-3xl p-8 backdrop-blur-xl transition-all hover:bg-white/5">
                                <div className="absolute top-0 right-0 p-8 text-brand-primary/10 group-hover:text-brand-primary/20 transition-colors">
                                    <DollarSign size={120} />
                                </div>
                                <p className="text-gray-400 text-xs font-black uppercase tracking-[0.2em] mb-4">Tổng Doanh Thu Hệ Thống</p>
                                <div className="flex items-baseline gap-2 group-hover:scale-110 transition-transform origin-left">
                                    <h3 className="text-6xl font-black text-brand-primary tracking-tighter">
                                        {formatPrice(data.transactions.successfulRevenue)}
                                    </h3>
                                    <span className="text-lg font-bold text-gray-500 uppercase tracking-widest">VND</span>
                                </div>
                                <p className="text-sm font-medium text-brand-primary flex items-center gap-1 mt-2">
                                    <CheckCircle size={14} /> Doanh thu thực nhận
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Decor */}
                <div className="mt-24 pt-12 border-t border-white/5 text-center">
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em]">
                        CycleX Analytics Module v2.0 • Premium Admin View
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
