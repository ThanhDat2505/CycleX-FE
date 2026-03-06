'use client';

import { use, useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/contexts/ToastContext';
import { Delivery } from '@/app/types/shipper';
import { getDeliveryDetail, reportDeliveryFailed } from '@/app/services/shipperService';
import { MESSAGES } from '@/app/constants/messages';
import { ArrowLeft, AlertTriangle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/app/components/ui';
import { getStatusColor, getStatusLabel } from '@/app/utils/deliveryUtils';
import { BikeInfoCard } from '@/app/shipper/deliveries/components/BikeInfoCard';
import { RouteInfoCard } from '@/app/shipper/deliveries/components/RouteInfoCard';
import { FailedReasonForm } from '../components/FailedReasonForm';

export default function DeliveryFailedPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { isLoggedIn, role, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();
    const { addToast } = useToast();

    const [delivery, setDelivery] = useState<Delivery | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [reason, setReason] = useState('');
    const [imageProofPreview, setImageProofPreview] = useState<string | null>(null);

    // Base data fetch
    useEffect(() => {
        if (!isAuthLoading) {
            if (!isLoggedIn) {
                router.push(`/login?returnUrl=/shipper/delivery-failed/${id}`);
                return;
            }
            if (role !== 'SHIPPER') {
                router.push('/');
                return;
            }
        }
    }, [isAuthLoading, isLoggedIn, role, router, id]);

    useEffect(() => {
        const fetchDelivery = async () => {
            try {
                const data = await getDeliveryDetail(id);
                setDelivery(data);
            } catch (err) {
                console.error(err);
                addToast(MESSAGES.S63_ERROR_LOAD, 'error');
            } finally {
                setIsLoading(false);
            }
        };

        if (isLoggedIn && role === 'SHIPPER') {
            fetchDelivery();
        }
    }, [id, isLoggedIn, role, addToast]);

    // Derived states
    const isStatusAllowed = delivery?.status === 'IN_PROGRESS';

    // Form handlers
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                addToast('Kích thước ảnh không được vượt quá 5MB', 'warning');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageProofPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearImage = () => {
        setImageProofPreview(null);
    };

    const handleReportFailed = useCallback(async () => {
        if (!delivery || !isStatusAllowed || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await reportDeliveryFailed(delivery.id, {
                reason: reason.trim(),
                imageProof: imageProofPreview || undefined
            });

            addToast(MESSAGES.S64_SUCCESS_TOAST, 'success');
            router.push('/shipper'); // S-64-BR06 (redirect dashboard)
        } catch (error: any) {
            console.error('Lỗi khi báo cáo thất bại:', error);
            const errReason = error?.response?.data?.message || MESSAGES.S64_ERROR_SUBMIT;
            addToast(errReason, 'error');
        } finally {
            setIsSubmitting(false);
        }
    }, [delivery, isStatusAllowed, isSubmitting, reason, imageProofPreview, router, addToast]);


    if (isAuthLoading || isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!delivery) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
                <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">{MESSAGES.S61_EMPTY_TITLE}</h2>
                <div className="mt-6 w-full max-w-xs">
                    <Link href="/shipper/deliveries">
                        <Button variant="primary" className="w-full">{MESSAGES.S60_BTN_VIEW_ALL}</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* ── Header ── */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
                    <Link
                        href={`/shipper/deliveries/${delivery.id}`}
                        className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            {MESSAGES.S64_PAGE_TITLE}
                            <span className={`px-2 py-0.5 rounded-full text-xs font-normal border ${getStatusColor(delivery.status)}`}>
                                {getStatusLabel(delivery.status)}
                            </span>
                        </h1>
                        <p className="text-sm text-gray-500">{delivery.orderId}</p>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                {/* Status Warning (BR02) */}
                {!isStatusAllowed && (
                    <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-amber-800 font-medium">{MESSAGES.S64_STATUS_NOT_IN_PROGRESS}</p>
                    </div>
                )}

                <RouteInfoCard sender={delivery.sender} receiver={delivery.receiver} />
                <BikeInfoCard delivery={delivery} />

                <FailedReasonForm
                    reason={reason}
                    imagePreview={imageProofPreview}
                    isDisabled={!isStatusAllowed}
                    isSubmitting={isSubmitting}
                    onReasonChange={setReason}
                    onImageUpload={handleImageUpload}
                    onClearImage={clearImage}
                    onSubmit={handleReportFailed}
                />
            </div>

            {/* ── Bottom Actions ── */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-20">
                <div className="max-w-3xl mx-auto flex gap-3">
                    <Link href={`/shipper/deliveries/${delivery.id}`} className="flex-1">
                        <Button variant="outline" className="w-full" disabled={isSubmitting}>
                            {MESSAGES.S64_BTN_BACK}
                        </Button>
                    </Link>

                    <button
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg h-10 shadow-red-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
                        disabled={!isStatusAllowed || isSubmitting}
                        type="submit"
                        form="failed-reason-form"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Đang xử lý...
                            </span>
                        ) : (
                            <>
                                <AlertCircle className="w-5 h-5 mr-2" />
                                {MESSAGES.S64_BTN_SUBMIT}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
