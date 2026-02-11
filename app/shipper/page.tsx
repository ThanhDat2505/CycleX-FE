'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { getDeliverySummary } from '@/app/services/shipperService';
import { DeliverySummary } from '@/app/types/shipper';
import { LoadingSpinner, Button } from '@/app/components/ui';
import { useToast } from '@/app/contexts/ToastContext';
import {
    Package,
    Truck,
    AlertCircle,
    CheckCircle,
    ArrowRight,
    RefreshCw
} from 'lucide-react';

export default function ShipperDashboardPage() {
    const { user, isLoggedIn, isLoading: isAuthLoading, role } = useAuth();
    const router = useRouter();
    const { addToast } = useToast();

    const [summary, setSummary] = useState<DeliverySummary | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchSummary = async (showLoading = true) => {
        if (!user?.userId) return;

        try {
            if (showLoading) setIsLoading(true);
            else setIsRefreshing(true);

            const data = await getDeliverySummary(user.userId);
            setSummary(data);
        } catch (error) {
            addToast('Không thể tải thông tin tổng hợp', 'error');
        } finally {
            if (showLoading) setIsLoading(false);
            else setIsRefreshing(false);
        }
    };

    useEffect(() => {
        // Auth & Role Check
        if (!isAuthLoading) {
            if (!isLoggedIn) {
                router.push('/login?returnUrl=/shipper');
                return;
            }
            if (role !== 'SHIPPER') {
                router.push('/');
                return;
            }
        }
    }, [isAuthLoading, isLoggedIn, role, router]);

    useEffect(() => {
        if (user?.userId && role === 'SHIPPER') {
            fetchSummary();
        }
    }, [user?.userId, role]);

    const handleNavigate = (status?: string) => {
        if (status) {
            router.push(`/shipper/deliveries?status=${status}`);
        } else {
            router.push('/shipper/deliveries');
        }
    };

    if (isAuthLoading || (isLoading && !summary)) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!summary) return null;

    const stats = [
        {
            id: 'assigned',
            label: 'Được phân công',
            value: summary.assigned,
            subtext: 'Đơn hàng mới',
            icon: Package,
            color: 'blue',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600',
            borderColor: 'border-blue-100',
            statusFilter: 'ASSIGNED'
        },
        {
            id: 'inProgress',
            label: 'Đang giao',
            value: summary.inProgress,
            subtext: 'Cần hoàn thành',
            icon: Truck,
            color: 'orange',
            bgColor: 'bg-orange-50',
            textColor: 'text-orange-600',
            borderColor: 'border-orange-100',
            statusFilter: 'IN_PROGRESS'
        },
        {
            id: 'failed',
            label: 'Giao thất bại',
            value: summary.failed,
            subtext: 'Cần xử lý lại',
            icon: AlertCircle,
            color: 'red',
            bgColor: 'bg-red-50',
            textColor: 'text-red-600',
            borderColor: 'border-red-100',
            statusFilter: 'FAILED'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Modern Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <span>Xin chào, {user?.fullName || 'Shipper'}!</span>
                                <span className="text-2xl">👋</span>
                            </h1>
                            <p className="mt-1 text-gray-500 text-sm">
                                {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fetchSummary(false)}
                            disabled={isRefreshing}
                            className="self-start md:self-center flex items-center gap-2"
                        >
                            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                            Làm mới
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in-up">
                    {stats.map((stat) => (
                        <div
                            key={stat.id}
                            onClick={() => handleNavigate(stat.statusFilter)}
                            className={`bg-white rounded-xl shadow-sm border ${stat.borderColor} p-6 relative overflow-hidden group hover:shadow-md transition-all cursor-pointer`}
                        >
                            <div className={`absolute right-0 top-0 w-24 h-24 ${stat.bgColor} rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 opacity-50`}></div>

                            <div className="relative z-10 flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                                    <div className="flex items-baseline gap-2 mt-2">
                                        <p className={`text-4xl font-bold ${stat.textColor}`}>
                                            {stat.value}
                                        </p>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                        {stat.subtext}
                                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity -ml-1 group-hover:ml-0" />
                                    </p>
                                </div>
                                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center ${stat.textColor}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions / Recent (Placeholder for future) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Truck className="w-5 h-5 text-gray-500" />
                            Truy cập nhanh
                        </h2>
                        <div className="space-y-3">
                            <Button
                                variant="primary"
                                onClick={() => handleNavigate()}
                                className="w-full justify-between group"
                            >
                                <span>Xem tất cả đơn hàng</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>

                            {/* Additional placeholders for future actions */}
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-center">
                                <p className="text-sm text-gray-500">
                                    Các tính năng khác sẽ được cập nhật sớm...
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center items-center text-center">
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Đơn hàng đã giao</h3>
                        <p className="text-gray-500 mt-1 mb-6">
                            Bạn đã hoàn thành <span className="font-semibold text-gray-900">{summary.delivered}</span> đơn hàng thành công.
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => handleNavigate('DELIVERED')}
                            className="w-full sm:w-auto"
                        >
                            Xem lịch sử giao hàng
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
