'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { getDeliverySummary } from '@/app/services/shipperService';
import { DeliverySummary } from '@/app/types/shipper';
import { LoadingSpinner, Button } from '@/app/components/ui';
import { useToast } from '@/app/contexts/ToastContext';
import { MESSAGES } from '@/app/constants/messages';
import { RefreshCw } from 'lucide-react';
import { StatCard, buildStatsConfig } from './components/StatCard';
import { QuickActions } from './components/QuickActions';
import { DeliveryHistory } from './components/DeliveryHistory';

export default function ShipperDashboardPage() {
    const { user, isLoggedIn, isLoading: isAuthLoading, role } = useAuth();
    const router = useRouter();
    const { addToast } = useToast();

    const [summary, setSummary] = useState<DeliverySummary | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchSummary = useCallback(async (showLoading = true) => {
        if (!user?.userId) return;

        try {
            if (showLoading) setIsLoading(true);
            else setIsRefreshing(true);

            const data = await getDeliverySummary(user.userId);
            setSummary(data);
        } catch {
            addToast(MESSAGES.S60_ERROR_LOAD_SUMMARY, 'error');
        } finally {
            if (showLoading) setIsLoading(false);
            else setIsRefreshing(false);
        }
    }, [user?.userId, addToast]);

    useEffect(() => {
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
    }, [user?.userId, role, fetchSummary]);

    const handleNavigate = useCallback((status?: string) => {
        if (status) {
            router.push(`/shipper/deliveries?status=${status}`);
        } else {
            router.push('/shipper/deliveries');
        }
    }, [router]);

    if (isAuthLoading || (isLoading && !summary)) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!summary) return null;

    const stats = buildStatsConfig(summary);

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <span>{MESSAGES.S60_GREETING} {user?.fullName || MESSAGES.S60_GREETING_DEFAULT}!</span>
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
                            {MESSAGES.S60_BTN_REFRESH}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in-up">
                    {stats.map((stat) => (
                        <StatCard
                            key={stat.id}
                            {...stat}
                            onClick={() => handleNavigate(stat.statusFilter)}
                        />
                    ))}
                </div>

                {/* Quick Actions + History */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <QuickActions onViewAll={() => handleNavigate()} />
                    <DeliveryHistory
                        deliveredCount={summary.delivered}
                        onViewHistory={() => handleNavigate('DELIVERED')}
                    />
                </div>
            </div>
        </div>
    );
}
