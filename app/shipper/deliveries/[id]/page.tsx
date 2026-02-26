'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/hooks/useAuth';
import { getDeliveryDetail } from '@/app/services/shipperService';
import { Delivery } from '@/app/types/shipper';
import { LoadingSpinner, Button } from '@/app/components/ui';
import { useToast } from '@/app/contexts/ToastContext';
import {
    ArrowLeft,
    Phone,
    Clock,
    Package,
    AlertTriangle,
    CheckCircle,
    Truck,
    MapPin,
    RefreshCw
} from 'lucide-react';
import { getStatusColor, getStatusLabel } from '@/app/utils/deliveryUtils';
import { DeliveryDetailSkeleton } from '../components/DeliverySkeleton';

interface DeliveryDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function DeliveryDetailPage({ params }: DeliveryDetailPageProps) {
    const resolvedParams = use(params);
    const { user, isLoggedIn, isLoading: isAuthLoading, role } = useAuth();
    const router = useRouter();
    const { addToast } = useToast();

    const [delivery, setDelivery] = useState<Delivery | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);

    const deliveryId = resolvedParams.id;

    useEffect(() => {
        // Auth Check
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
            } catch (error) {
                if (isMounted) addToast('Không thể tải chi tiết đơn hàng', 'error');
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        if (user?.userId && role === 'SHIPPER') {
            fetchDetail();
        }

        return () => { isMounted = false; };
    }, [deliveryId, user?.userId, role, refreshKey]);

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

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
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy đơn hàng</h2>
                    <p className="text-gray-500 mb-6">Đơn hàng bạn tìm kiếm không tồn tại hoặc bạn không có quyền truy cập.</p>
                    <Link href="/shipper/deliveries">
                        <Button variant="primary" className="w-full">
                            Quay lại danh sách
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    // getStatusColor and getStatusLabel imported from deliveryUtils

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
                                Chi tiết đơn hàng
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
                        title="Làm mới"
                    >
                        <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                {/* Bike Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="flex p-4 gap-4">
                        <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                            <img
                                src={delivery.bike.image}
                                alt={delivery.bike.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0 py-1">
                            <h3 className="text-lg font-bold text-gray-900 truncate">{delivery.bike.name}</h3>
                            <div className="mt-2 space-y-1">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Package className="w-4 h-4" />
                                    <span>COD: <span className="font-semibold text-gray-900">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(delivery.codAmount || 0)}</span></span>
                                </div>
                                {delivery.note && (
                                    <div className="flex items-start gap-2 text-sm text-amber-600 bg-amber-50 p-2 rounded-lg mt-2">
                                        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                        <span>{delivery.note}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Route Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
                    {/* Visual Connector Line */}
                    <div className="absolute left-[2.25rem] top-12 bottom-12 w-0.5 bg-gray-200 z-0"></div>

                    {/* Sender */}
                    <div className="p-6 relative z-10">
                        <div className="flex gap-4">
                            <div className="mt-1">
                                <div className="w-4 h-4 rounded-full bg-blue-500 border-4 border-blue-100 shadow-sm"></div>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Điểm lấy hàng</p>
                                <h4 className="text-base font-semibold text-gray-900">{delivery.sender.name}</h4>
                                <p className="text-sm text-gray-600 mt-1">{delivery.sender.address}</p>
                                <div className="flex items-center gap-3 mt-3">
                                    <a href={`tel:${delivery.sender.phone}`} className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full transition-colors">
                                        <Phone className="w-3.5 h-3.5" />
                                        Gọi điện
                                    </a>
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(delivery.sender.address)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 px-3 py-1.5 rounded-full transition-colors"
                                    >
                                        <MapPin className="w-3.5 h-3.5" />
                                        Bản đồ
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 mx-6"></div>

                    {/* Receiver */}
                    <div className="p-6 relative z-10">
                        <div className="flex gap-4">
                            <div className="mt-1">
                                <div className="w-4 h-4 rounded-full bg-orange-500 border-4 border-orange-100 shadow-sm"></div>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Điểm giao hàng</p>
                                <h4 className="text-base font-semibold text-gray-900">{delivery.receiver.name}</h4>
                                <p className="text-sm text-gray-600 mt-1">{delivery.receiver.address}</p>
                                <div className="flex items-center gap-3 mt-3">
                                    <a href={`tel:${delivery.receiver.phone}`} className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full transition-colors">
                                        <Phone className="w-3.5 h-3.5" />
                                        Gọi điện
                                    </a>
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(delivery.receiver.address)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 px-3 py-1.5 rounded-full transition-colors"
                                    >
                                        <MapPin className="w-3.5 h-3.5" />
                                        Bản đồ
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timeline */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-gray-500" />
                        Thời gian
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Ngày phân công</span>
                            <span className="font-medium text-gray-900">{new Date(delivery.assignedDate).toLocaleString('vi-VN')}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Dự kiến giao</span>
                            <span className="font-medium text-gray-900">{new Date(delivery.scheduledDate).toLocaleDateString('vi-VN')}</span>
                        </div>
                        {delivery.completedDate && (
                            <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-100">
                                <span className="text-gray-500">Hoàn thành lúc</span>
                                <span className="font-medium text-green-600">{new Date(delivery.completedDate).toLocaleString('vi-VN')}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-20">
                <div className="max-w-3xl mx-auto flex gap-3">
                    {delivery.status === 'ASSIGNED' && (
                        <Button
                            variant="primary"
                            className="flex-1 text-lg py-4 shadow-blue-200 shadow-lg"
                            onClick={() => {
                                // In real app, call API to start delivery
                                addToast('Đã nhận đơn hàng! Bắt đầu giao.', 'success');
                                // For mock, simulate quick update
                                router.push('/shipper/deliveries?status=IN_PROGRESS');
                            }}
                        >
                            <Truck className="w-5 h-5 mr-2" />
                            Bắt đầu giao hàng
                        </Button>
                    )}

                    {delivery.status === 'IN_PROGRESS' && (
                        <>
                            <Button
                                variant="outline"
                                className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => router.push(`/shipper/delivery-failed/${delivery.id}`)}
                            >
                                <AlertTriangle className="w-5 h-5 mr-2" />
                                Báo cáo sự cố
                            </Button>
                            <Button
                                variant="primary"
                                className="flex-1 bg-green-600 hover:bg-green-700 shadow-green-200 shadow-lg"
                                onClick={() => router.push(`/shipper/delivery-confirm/${delivery.id}`)}
                            >
                                <CheckCircle className="w-5 h-5 mr-2" />
                                Xác nhận giao hàng
                            </Button>
                        </>
                    )}

                    {(delivery.status === 'DELIVERED' || delivery.status === 'FAILED') && (
                        <div className="w-full text-center py-2 text-gray-500 text-sm">
                            Đơn hàng đã kết thúc
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
