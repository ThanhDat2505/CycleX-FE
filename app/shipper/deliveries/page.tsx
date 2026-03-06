'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/hooks/useAuth';
import { getAssignedDeliveries, getDeliverySummary } from '@/app/services/shipperService';
import { Delivery, DeliveryFilter, DeliverySummary } from '@/app/types/shipper';
import { LoadingSpinner, Button } from '@/app/components/ui';
import { useToast } from '@/app/contexts/ToastContext';
import { MESSAGES } from '@/app/constants/messages';
import { parseDeliveryFilter } from '@/app/utils/deliveryUtils';
import { DeliveryListSkeleton } from './components/DeliverySkeleton';
import { DeliveryFilterBar } from './components/DeliveryFilterBar';
import { DeliveryCard } from './components/DeliveryCard';
import { Package, ArrowRight, RefreshCw } from 'lucide-react';

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
        if (!isAuthLoading) {
            if (!isLoggedIn || role !== 'SHIPPER') {
                router.push('/login');
            }
        }
    }, [isAuthLoading, isLoggedIn, role, router]);

    useEffect(() => {
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
                const [data, statsData] = await Promise.all([
                    getAssignedDeliveries(user.userId, filter),
                    getDeliverySummary(user.userId)
                ]);

                if (isMounted) {
                    setDeliveries(data);
                    setStats(statsData);
                }
            } catch {
                if (isMounted) addToast(MESSAGES.S61_ERROR_LOAD_LIST, 'error');
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        if (user?.userId && role === 'SHIPPER') {
            fetchData();
        }

        return () => { isMounted = false; };
    }, [filter, user?.userId, role, refreshKey, addToast]);

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

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-4 mb-4">
                        <Link href="/shipper" className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
                            <ArrowRight className="w-5 h-5 rotate-180 text-gray-600" />
                        </Link>
                        <h1 className="text-xl font-bold text-gray-900">{MESSAGES.S61_PAGE_TITLE}</h1>
                        <button
                            onClick={handleRefresh}
                            className="ml-auto p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors"
                            title={MESSAGES.S60_BTN_REFRESH}
                        >
                            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>

                    <DeliveryFilterBar
                        currentFilter={filter}
                        stats={stats}
                        onFilterChange={handleFilterChange}
                    />
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
                        <h3 className="text-lg font-medium text-gray-900">{MESSAGES.S61_EMPTY_TITLE}</h3>
                        <p className="text-gray-500 mt-1">{MESSAGES.S61_EMPTY_DESC}</p>
                        {filter !== 'ALL' && (
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={() => handleFilterChange('ALL')}
                            >
                                {MESSAGES.S61_BTN_VIEW_ALL}
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {deliveries.map((delivery) => (
                            <DeliveryCard key={delivery.id} delivery={delivery} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
