/**
 * S-50 - Purchase/Deposit Request (Buyer) - BP5
 * 
 * Multi-step form:
 * Step 1: Input request details
 * Step 2: Review and confirm
 */

'use client';

import { use, useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getListingDetail } from '../services/listingService';
import { createPurchaseRequest } from '../services/transactionService';
import { useAuth } from '../hooks/useAuth';
import { ListingDetail } from '../types/listing';
import { PurchaseRequestForm } from '../types/transaction';
import StepIndicator from './components/StepIndicator';
import { LoadingSpinner, EmptyState } from '../components/ui';
import Step1InputForm from './components/Step1InputForm';
import Step2Review from './components/Step2Review';
import { normalizePhoneNumber } from '../utils/format';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function PurchaseRequestPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isLoggedIn, isLoading: isAuthLoading, user, requireAuth, role } = useAuth(); // rename isLoading to avoid conflict

    // Get listingId from URL
    const listingId = searchParams.get('listingId');

    // State
    const [currentStep, setCurrentStep] = useState(1);
    const [listing, setListing] = useState<ListingDetail | null>(null);
    const [isListingLoading, setIsListingLoading] = useState(true); // Renamed from isLoading
    const [error, setError] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof PurchaseRequestForm, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form data
    const [formData, setFormData] = useState<PurchaseRequestForm>({
        transactionType: 'PURCHASE',
        desiredTime: '',
        receiverName: '',
        receiverPhone: '',
        receiverAddress: '',
        depositAmount: undefined,
        note: '',
    });

    const hasPrefilled = useRef(false);

    // Check Authentication
    useEffect(() => {
        if (!isAuthLoading) {
            if (!isLoggedIn) {
                // Redirect to login if not authenticated
                const currentUrl = window.location.href; // Get full URL with query params
                requireAuth(currentUrl);
            } else {
                // Check Role
                if (role && role !== 'BUYER') {
                    setError('Chức năng này chỉ dành cho tài khoản Người mua (Buyer). Vui lòng đăng nhập với tài khoản Buyer.');
                    return;
                }

                // Pre-fill user data ONLY ONCE
                if (user && !hasPrefilled.current) {
                    setFormData(prev => ({
                        ...prev,
                        receiverName: prev.receiverName || user.fullName || '',
                        receiverPhone: prev.receiverPhone || normalizePhoneNumber(user.phone || '') || '',
                    }));
                    hasPrefilled.current = true;
                }
            }
        }
    }, [isAuthLoading, isLoggedIn, user, requireAuth, role]);

    // Load listing data
    useEffect(() => {
        let isMounted = true;

        async function loadListing() {
            if (!listingId) {
                if (isMounted) {
                    setError('Không tìm thấy mã sản phẩm');
                    setIsListingLoading(false);
                }
                return;
            }

            try {
                if (isMounted) setIsListingLoading(true);
                const data = await getListingDetail(Number(listingId));

                if (!isMounted) return;

                // Check if listing is APPROVED
                if (data.status !== 'APPROVED') {
                    setError('Sản phẩm này không còn khả dụng để đặt mua');
                    setIsListingLoading(false);
                    return;
                }

                setListing(data);
                setError(null);
            } catch (err) {
                if (isMounted) setError('Không thể tải thông tin sản phẩm');
            } finally {
                if (isMounted) setIsListingLoading(false);
            }
        }

        if (isLoggedIn) { // Only load listing if logged in
            loadListing();
        }

        return () => {
            isMounted = false;
        };
    }, [listingId, isLoggedIn]);

    // TODO: Check if user is logged in (Guest protection)
    // Will implement after AuthContext is available

    // Validate Step 1 before moving to Step 2
    const validateStep1 = useCallback((): boolean => {
        const errors: Partial<Record<keyof PurchaseRequestForm, string>> = {};

        // Validate Payment Method (Transaction Type)
        if (!formData.transactionType) {
            // This is selected via radio, so unlikely to be empty, but good to check
            errors.transactionType = 'Vui lòng chọn phương thức thanh toán';
        }

        // Validate Desired Date
        if (!formData.desiredTime) {
            errors.desiredTime = 'Vui lòng chọn ngày nhận xe dự kiến';
        } else {
            // Validate date: must be at least 3 days from now (ignoring time)
            const selectedDate = new Date(formData.desiredTime);
            const minDate = new Date();
            minDate.setDate(minDate.getDate() + 3);
            minDate.setHours(0, 0, 0, 0);

            if (selectedDate < minDate) {
                errors.desiredTime = 'Ngày nhận xe phải sau ít nhất 3 ngày kể từ hôm nay';
            }
        }

        // Validate Deposit Amount
        if (formData.transactionType === 'DEPOSIT') {
            if (!formData.depositAmount || formData.depositAmount <= 0) {
                errors.depositAmount = 'Số tiền đặt cọc phải lớn hơn 0';
            } else if (formData.depositAmount < 100000) {
                errors.depositAmount = 'Số tiền đặt cọc tối thiểu là 100,000 VND';
            }
        }

        // Validate Shipping Info
        if (!formData.receiverName.trim()) {
            errors.receiverName = 'Vui lòng nhập tên người nhận';
        }

        if (!formData.receiverPhone.trim()) {
            errors.receiverPhone = 'Vui lòng nhập số điện thoại liên hệ';
        } else if (!/^0\d{9}$/.test(formData.receiverPhone.trim())) {
            errors.receiverPhone = 'Số điện thoại không hợp lệ (cần 10 số, bắt đầu bằng số 0)';
        }

        if (!formData.receiverAddress.trim()) {
            errors.receiverAddress = 'Vui lòng nhập địa chỉ nhận hàng';
        }

        setValidationErrors(errors);

        // Return true if no errors
        return Object.keys(errors).length === 0;
    }, [formData]);

    // Handle next step
    const handleNext = useCallback(() => {
        const isValid = validateStep1();
        if (isValid) {
            setCurrentStep(2);
        }
    }, [validateStep1]);

    // Handle back to step 1
    const handleBack = useCallback(() => {
        setCurrentStep(1);
    }, []);

    // Handle form submit
    const handleSubmit = useCallback(async () => {
        if (!listing || !user) return;

        try {
            setIsSubmitting(true);

            const transaction = await createPurchaseRequest({
                listingId: listing.listingId,
                buyerId: user.userId,
                transactionType: formData.transactionType,
                desiredTime: formData.desiredTime,
                receiverName: formData.receiverName,
                receiverPhone: formData.receiverPhone,
                receiverAddress: formData.receiverAddress,
                depositAmount: formData.depositAmount,
                note: formData.note,
            });

            // Success! Redirect to S-54
            router.push(`/transactions/${transaction.transactionId}`);
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : 'Không thể tạo yêu cầu. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    }, [listing, user, formData, router]);

    // Loading state (Auth or Listing)
    if (isAuthLoading || (isLoggedIn && isListingLoading)) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner />
                <p className="ml-3 text-gray-600 font-medium">Đang tải...</p>
            </div>
        );
    }

    // If not logged in and not loading, we rendered nothing (waiting for redirect)
    if (!isLoggedIn) {
        return null;
    }

    // Error state
    if (error || !listing) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <EmptyState
                    title="Không tìm thấy sản phẩm"
                    description={error || 'Sản phẩm bạn tìm kiếm không tồn tại hoặc đã bị xóa.'}
                    action={
                        <button
                            onClick={() => router.push('/listings')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                        >
                            Quay lại danh sách
                        </button>
                    }
                />
            </div>
        );
    }

    // Main render
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
            <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in-up">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Đặt mua sản phẩm
                    </h1>
                    <p className="text-gray-600">
                        {listing.title}
                    </p>
                </div>

                {/* Step Indicator */}
                <StepIndicator currentStep={currentStep} />

                {/* Step Content */}
                <div className="mt-8">
                    {currentStep === 1 ? (
                        <Step1InputForm
                            formData={formData}
                            errors={validationErrors}
                            onFormDataChange={setFormData}
                            onNext={handleNext}
                            onCancel={() => router.back()}
                        />
                    ) : (
                        <Step2Review
                            formData={formData}
                            listing={listing}
                            onBack={handleBack}
                            onConfirm={handleSubmit}
                            isSubmitting={isSubmitting}
                            error={submitError}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
