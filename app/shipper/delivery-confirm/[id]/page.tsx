'use client';

import { use, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/hooks/useAuth';
import { getDeliveryDetail, confirmDelivery } from '@/app/services/shipperService';
import { Delivery } from '@/app/types/shipper';
import { Button } from '@/app/components/ui';
import { useToast } from '@/app/contexts/ToastContext';
import { MESSAGES } from '@/app/constants/messages';
import { getStatusColor, getStatusLabel } from '@/app/utils/deliveryUtils';
import { DeliveryDetailSkeleton } from '../../deliveries/components/DeliverySkeleton';
import { BuyerInfoSection } from '../components/BuyerInfoSection';
import { OrderInfoSection } from '../components/OrderInfoSection';
import { ConfirmForm } from '../components/ConfirmForm';
import { ArrowLeft, Package, AlertTriangle, CheckCircle } from 'lucide-react';

// ── Constants ──
const REQUIRED_DELIVERY_STATUS = 'IN_PROGRESS';
const SHIPPER_DASHBOARD_PATH = '/shipper';

interface DeliveryConfirmPageProps {
    params: Promise<{ id: string }>;
}

export default function DeliveryConfirmPage({ params }: DeliveryConfirmPageProps) {
    const resolvedParams = use(params);
    const { user, isLoggedIn, isLoading: isAuthLoading, role } = useAuth();
    const router = useRouter();
    const { addToast } = useToast();

    // ── State ──
    const [delivery, setDelivery] = useState<Delivery | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form fields — pre-filled from delivery data
    const [receiverName, setReceiverName] = useState('');
    const [receiverPhone, setReceiverPhone] = useState('');
    const [signaturePreview, setSignaturePreview] = useState<string | null>(null);

    const deliveryId = resolvedParams.id;
    const isStatusAllowed = delivery?.status === REQUIRED_DELIVERY_STATUS;

    // ── Auth Guard (S-63-BR01) ──
    useEffect(() => {
        if (!isAuthLoading) {
            if (!isLoggedIn || role !== 'SHIPPER') {
                router.push('/login');
            }
        }
    }, [isAuthLoading, isLoggedIn, role, router]);

    // ── F1: Load Delivery Info ──
    useEffect(() => {
        let isMounted = true;

        async function fetchDeliveryInfo() {
            if (!user?.userId) return;

            try {
                setIsLoading(true);
                const data = await getDeliveryDetail(deliveryId);
                if (!isMounted) return;

                setDelivery(data);
                if (data?.receiver) {
                    setReceiverName(data.receiver.name || '');
                    setReceiverPhone(data.receiver.phone || '');
                }
            } catch {
                if (isMounted) addToast(MESSAGES.S63_ERROR_LOAD, 'error');
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        if (user?.userId && role === 'SHIPPER') {
            fetchDeliveryInfo();
        }

        return () => { isMounted = false; };
    }, [deliveryId, user?.userId, role, addToast]);

    // ── Signature handler ──
    const handleSignatureUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // check file type
        if (!file.type.startsWith('image/')) {
            addToast("Chỉ được phép chọn file ảnh!", "error");
            event.target.value = "";
            return;
        }

        // check image file
        if (file.size > 5 * 1024 * 1024) {
            addToast("Kích thước ảnh quá lớn (tối đa 5MB)", "error");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setSignaturePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }, []);

    const clearSignature = useCallback(() => {
        setSignaturePreview(null);
    }, []);

    // ── F2: Confirm Delivery (S-63-BR04) ──
    const handleConfirmDelivery = useCallback(async () => {
        if (isSubmitting) return;

        // Status guard re-check (BR02 + BR07)
        if (!isStatusAllowed) {
            addToast(MESSAGES.S63_STATUS_NOT_IN_PROGRESS, 'error');
            return;
        }

        try {
            setIsSubmitting(true);

            await confirmDelivery(deliveryId, {
                receiverName: receiverName.trim(),
                receiverPhone: receiverPhone.trim(),
                signatureImage: signaturePreview || undefined,
            });

            addToast(MESSAGES.S63_SUCCESS_TOAST, 'success');
            router.push(SHIPPER_DASHBOARD_PATH);
        } catch {
            addToast(MESSAGES.S63_ERROR_CONFIRM, 'error');
        } finally {
            setIsSubmitting(false);
        }
    }, [
        isSubmitting, isStatusAllowed,
        deliveryId, receiverName, receiverPhone, signaturePreview,
        addToast, router
    ]);

    // ── Loading State ──
    if (isAuthLoading || isLoading) {
        return <DeliveryDetailSkeleton />;
    }

    // ── Not Found State ──
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
                        <Button variant="primary" className="w-full">{MESSAGES.S62_BTN_BACK_TO_LIST}</Button>
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
                            {MESSAGES.S63_PAGE_TITLE}
                            <span className={`px-2 py-0.5 rounded-full text-xs font-normal border ${getStatusColor(delivery.status)}`}>
                                {getStatusLabel(delivery.status)}
                            </span>
                        </h1>
                        <p className="text-sm text-gray-500">{delivery.orderId}</p>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                {/* Status Warning (S-63-BR02) */}
                {!isStatusAllowed && (
                    <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-amber-800 font-medium">{MESSAGES.S63_STATUS_NOT_IN_PROGRESS}</p>
                    </div>
                )}

                <BuyerInfoSection receiver={delivery.receiver} />
                <OrderInfoSection delivery={delivery} />
                <ConfirmForm
                    receiverName={receiverName}
                    receiverPhone={receiverPhone}
                    signaturePreview={signaturePreview}
                    isDisabled={!isStatusAllowed}
                    isSubmitting={isSubmitting}
                    onReceiverNameChange={setReceiverName}
                    onReceiverPhoneChange={setReceiverPhone}
                    onSignatureUpload={handleSignatureUpload}
                    onClearSignature={clearSignature}
                    onSubmit={handleConfirmDelivery}
                />
            </div>

            {/* ── Bottom Actions ── */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-20">
                <div className="max-w-3xl mx-auto flex gap-3">
                    <Link href={`/shipper/deliveries/${delivery.id}`} className="flex-1">
                        <Button variant="outline" className="w-full" disabled={isSubmitting}>
                            {MESSAGES.S63_BTN_BACK}
                        </Button>
                    </Link>
                    <button
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg h-10 shadow-green-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
                        disabled={!isStatusAllowed || isSubmitting}
                        type="submit"
                        form="confirm-form"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                {MESSAGES.S62_LOADING_TEXT}
                            </span>
                        ) : (
                            <>
                                <CheckCircle className="w-5 h-5 mr-2" />
                                {MESSAGES.S63_BTN_CONFIRM}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
