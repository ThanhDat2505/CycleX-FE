'use client';

import { use, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/hooks/useAuth';
import { getDeliveryDetail, startDelivery } from '@/app/services/shipperService';
import { Delivery } from '@/app/types/shipper';
import { Button } from '@/app/components/ui';
import { useToast } from '@/app/contexts/ToastContext';
import { MESSAGES } from '@/app/constants/messages';
import { getStatusColor, getStatusLabel } from '@/app/utils/deliveryUtils';
import { ArrowLeft, Package, RefreshCw } from 'lucide-react';
import { DeliveryDetailSkeleton } from '../components/DeliverySkeleton';
import { BikeInfoCard } from '../components/BikeInfoCard';
import { RouteInfoCard } from '../components/RouteInfoCard';
import { TimelineCard } from '../components/TimelineCard';
import { DeliveryActions } from '../components/DeliveryActions';

interface DeliveryDetailPageProps {
    params: Promise<{ id: string }>;
}

export default function DeliveryDetailPage({ params }: DeliveryDetailPageProps) {
    const resolvedParams = use(params);
    const { user, isLoggedIn, isLoading: isAuthLoading, role } = useAuth();
    const router = useRouter();
    const { addToast } = useToast();

    const [delivery, setDelivery] = useState<Delivery | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);
    const [isStarting, setIsStarting] = useState(false);

    const deliveryId = resolvedParams.id;

    useEffect(() => {
        if (!isAuthLoading) {
            if (!isLoggedIn || role !== 'SHIPPER') {
                router.push('/login');
            }
        }
    }, [isAuthLoading, isLoggedIn, role, router]);

    useEffect(() => {
        let isMounted = true;

        async function fetchDetail() {
            if (!user?.userId) return;

            try {
                setIsLoading(true);
                const data = await getDeliveryDetail(deliveryId);
                if (isMounted) setDelivery(data);
            } catch {
                if (isMounted) addToast(MESSAGES.S62_ERROR_LOAD_DETAIL, 'error');
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        if (user?.userId && role === 'SHIPPER') {
            fetchDetail();
        }

        return () => { isMounted = false; };
    }, [deliveryId, user?.userId, role, refreshKey, addToast]);

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    const handleStartDelivery = useCallback(async () => {
        if (isStarting || !delivery) return;

        try {
            setIsStarting(true);
            await startDelivery(delivery.id);
            addToast(MESSAGES.S62_START_SUCCESS, 'success');
            setRefreshKey(prev => prev + 1);
        } catch {
            addToast(MESSAGES.S62_START_ERROR, 'error');
        } finally {
            setIsStarting(false);
        }
    }, [isStarting, delivery, addToast]);

    if (isAuthLoading || isLoading) {
        return <DeliveryDetailSkeleton />;
    }

    if (!delivery) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center max-w-md w-full">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8 text-gray-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{MESSAGES.S62_NOT_FOUND_TITLE}</h2>
                    <p className="text-gray-500 mb-6">{MESSAGES.S62_NOT_FOUND_DESC}</p>
                    <Link href="/shipper/deliveries">
                        <Button variant="primary" className="w-full">
                            {MESSAGES.S62_BTN_BACK_TO_LIST}
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/shipper/deliveries" className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </Link>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                {MESSAGES.S62_PAGE_TITLE}
                                <span className={`px-2 py-0.5 rounded-full text-xs font-normal border ${getStatusColor(delivery.status)}`}>
                                    {getStatusLabel(delivery.status)}
                                </span>
                            </h1>
                            <p className="text-sm text-gray-500">{delivery.orderId}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleRefresh}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors"
                        title={MESSAGES.S62_BTN_REFRESH}
                    >
                        <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                <BikeInfoCard delivery={delivery} />
                <RouteInfoCard sender={delivery.sender} receiver={delivery.receiver} />
                <TimelineCard delivery={delivery} />
            </div>

            <DeliveryActions
                delivery={delivery}
                isStarting={isStarting}
                onStartDelivery={handleStartDelivery}
            />
        </div>
    );
}
