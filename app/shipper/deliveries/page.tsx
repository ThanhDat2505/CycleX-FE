'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { getAssignedDeliveries, getDeliverySummary } from '@/app/services/shipperService';
import { Delivery, DeliveryFilter, DeliverySummary } from '@/app/types/shipper';
import { LoadingSpinner, Button } from '@/app/components/ui';
import { useToast } from '@/app/contexts/ToastContext';
import { getStatusColor, getStatusLabel, parseDeliveryFilter } from '@/app/utils/deliveryUtils';
import { DeliveryListSkeleton } from './components/DeliverySkeleton';
import { Package, ArrowRight, Clock, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function DeliveryListPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner />
            </div>
        }>
            <DeliveryListContent />
        </Suspense>
    );
}

function DeliveryListContent() {
    const { user, isLoggedIn, isLoading: isAuthLoading, role } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialStatus = parseDeliveryFilter(searchParams.get('status'));

    const { addToast } = useToast();

    const [deliveries, setDeliveries] = useState<Delivery[]>([]);
    const [stats, setStats] = useState<DeliverySummary | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<DeliveryFilter>(initialStatus);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        // Simple Auth Check (Middleware should handle this ideally)
        if (!isAuthLoading) {
            if (!isLoggedIn || role !== 'SHIPPER') {
                router.push('/login');
            }
        }
    }, [isAuthLoading, isLoggedIn, role, router]);

    useEffect(() => {
        // Sync filter with URL (validated)
        const validatedFilter = parseDeliveryFilter(searchParams.get('status'));
        if (validatedFilter !== filter) {
            setFilter(validatedFilter);
        }
    }, [searchParams]);

    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
            if (!user?.userId) return;

            try {
                setIsLoading(true);
                // Fetch data and stats in parallel
                const [data, statsData] = await Promise.all([
                    getAssignedDeliveries(user.userId, filter),
                    getDeliverySummary(user.userId)
                ]);

                if (isMounted) {
                    setDeliveries(data);
                    setStats(statsData);
                }
            } catch (error) {
                if (isMounted) addToast('Không thể tải danh sách đơn hàng', 'error');
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        if (user?.userId && role === 'SHIPPER') {
            fetchData();
        }

        return () => { isMounted = false; };
    }, [filter, user?.userId, role, refreshKey]);

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    const handleFilterChange = (newFilter: DeliveryFilter) => {
        setFilter(newFilter);
        router.push(`/shipper/deliveries${newFilter === 'ALL' ? '' : `?status=${newFilter}`}`);
    };

    if (isAuthLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    const getCount = (status: string) => {
        if (!stats) return 0;
        switch (status) {
            case 'ALL': return stats.assigned + stats.inProgress + stats.delivered + stats.failed;
            case 'ASSIGNED': return stats.assigned;
            case 'IN_PROGRESS': return stats.inProgress;
            case 'DELIVERED': return stats.delivered;
            case 'FAILED': return stats.failed;
            default: return 0;
        }
    };

    // getStatusColor and getStatusLabel imported from deliveryUtils

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-4 mb-4">
                        <Link href="/shipper" className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
                            <ArrowRight className="w-5 h-5 rotate-180 text-gray-600" />
                        </Link>
                        <h1 className="text-xl font-bold text-gray-900">Danh sách đơn hàng</h1>
                        <button
                            onClick={handleRefresh}
                            className="ml-auto p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors"
                            title="Làm mới"
                        >
                            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {['ALL', 'ASSIGNED', 'IN_PROGRESS', 'FAILED', 'DELIVERED'].map((status) => {
                            const count = getCount(status);
                            return (
                                <button
                                    key={status}
                                    onClick={() => handleFilterChange(status as DeliveryFilter)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border flex items-center gap-2 ${filter === status
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    {status === 'ALL' ? 'Tất cả' : getStatusLabel(status)}
                                    <span className={`px-1.5 py-0.5 rounded-full text-xs ${filter === status ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {isLoading ? (
                    <DeliveryListSkeleton />
                ) : deliveries.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Không tìm thấy đơn hàng</h3>
                        <p className="text-gray-500 mt-1">Chưa có đơn hàng nào trong trạng thái này.</p>
                        {filter !== 'ALL' && (
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={() => handleFilterChange('ALL')}
                            >
                                Xem tất cả
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {deliveries.map((delivery) => (
                            <Link
                                key={delivery.id}
                                href={`/shipper/deliveries/${delivery.id}`}
                                className="block bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-blue-300 transition-all group"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(delivery.status)}`}>
                                            {getStatusLabel(delivery.status)}
                                        </span>
                                        <span className="text-xs text-gray-500 font-mono">{delivery.orderId}</span>
                                    </div>
                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {new Date(delivery.scheduledDate).toLocaleDateString('vi-VN')}
                                    </span>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                                        <img
                                            src={delivery.bike.image}
                                            alt={delivery.bike.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                                            {delivery.bike.name}
                                        </h3>

                                        <div className="mt-2 space-y-1.5">
                                            <div className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
                                                <p className="text-sm text-gray-600 line-clamp-1">{delivery.sender.address}</p>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0"></div>
                                                <p className="text-sm text-gray-600 line-clamp-1">{delivery.receiver.address}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center w-8 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
