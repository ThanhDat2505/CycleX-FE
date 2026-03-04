/**
 * usePurchaseRequest Hook
 * Encapsulates all S-50 Purchase Request logic:
 * - Auth guard (BUYER only)
 * - Listing fetch with cleanup
 * - Form state + pre-fill from user profile
 * - Step 1 validation
 * - Submit handler with API call
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getListingDetail } from '../../services/listingService';
import { createPurchaseRequest } from '../../services/transactionService';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '@/app/contexts/ToastContext';
import { ListingDetail } from '../../types/listing';
import { PurchaseRequestForm } from '../../types/transaction';
import { normalizePhoneNumber } from '../../utils/format';
import { MESSAGES } from '../../constants';
import { DEPOSIT_MIN_AMOUNT, MIN_DAYS_AHEAD } from '../../constants/fees';

/** Phone number regex: starts with 0, 10 digits total */
const PHONE_REGEX = /^0\d{9}$/;

interface UsePurchaseRequestReturn {
    // State
    currentStep: number;
    listing: ListingDetail | null;
    isListingLoading: boolean;
    isAuthLoading: boolean;
    isLoggedIn: boolean;
    error: string | null;
    submitError: string | null;
    validationErrors: Partial<Record<keyof PurchaseRequestForm, string>>;
    isSubmitting: boolean;
    formData: PurchaseRequestForm;
    // Actions
    setFormData: (data: PurchaseRequestForm) => void;
    handleNext: () => void;
    handleBack: () => void;
    handleSubmit: () => Promise<void>;
    handleCancel: () => void;
}

export function usePurchaseRequest(): UsePurchaseRequestReturn {
    const router = useRouter();
    const { addToast } = useToast();
    const searchParams = useSearchParams();
    const { isLoggedIn, isLoading: isAuthLoading, user, requireAuth, role } = useAuth();

    const listingId = searchParams.get('listingId');

    // State
    const [currentStep, setCurrentStep] = useState(1);
    const [listing, setListing] = useState<ListingDetail | null>(null);
    const [isListingLoading, setIsListingLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof PurchaseRequestForm, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    // Auth guard: redirect if not logged in, block if not BUYER
    useEffect(() => {
        if (isAuthLoading) return;

        if (!isLoggedIn) {
            const currentUrl = window.location.href;
            requireAuth(currentUrl);
            return;
        }

        if (role && role !== 'BUYER') {
            setError(MESSAGES.S50_ERROR_ROLE);
            return;
        }

        // Pre-fill user data once
        if (user && !hasPrefilled.current) {
            setFormData(prev => ({
                ...prev,
                receiverName: prev.receiverName || user.fullName || '',
                receiverPhone: prev.receiverPhone || normalizePhoneNumber(user.phone || '') || '',
            }));
            hasPrefilled.current = true;
        }
    }, [isAuthLoading, isLoggedIn, user, requireAuth, role]);

    // Load listing data with cleanup
    useEffect(() => {
        let isMounted = true;

        async function loadListing() {
            if (!listingId) {
                if (isMounted) {
                    setError(MESSAGES.S50_ERROR_NO_LISTING);
                    setIsListingLoading(false);
                }
                return;
            }

            try {
                if (isMounted) setIsListingLoading(true);
                const data = await getListingDetail(Number(listingId));

                if (!isMounted) return;

                if (data.status !== 'APPROVED') {
                    setError(MESSAGES.S50_ERROR_NOT_AVAILABLE);
                    setIsListingLoading(false);
                    return;
                }

                setListing(data);
                setError(null);
            } catch {
                if (isMounted) setError(MESSAGES.S50_ERROR_LOAD_LISTING);
            } finally {
                if (isMounted) setIsListingLoading(false);
            }
        }

        if (isLoggedIn) {
            loadListing();
        }

        return () => {
            isMounted = false;
        };
    }, [listingId, isLoggedIn]);

    // Validate Step 1
    const validateStep1 = useCallback((): Partial<Record<keyof PurchaseRequestForm, string>> => {
        const errors: Partial<Record<keyof PurchaseRequestForm, string>> = {};

        if (!formData.transactionType) {
            errors.transactionType = MESSAGES.S50_VAL_PAYMENT_REQUIRED;
        }

        if (!formData.desiredTime) {
            errors.desiredTime = MESSAGES.S50_VAL_DATE_REQUIRED;
        } else {
            const selectedDate = new Date(formData.desiredTime);
            const minDate = new Date();
            minDate.setDate(minDate.getDate() + MIN_DAYS_AHEAD);
            minDate.setHours(0, 0, 0, 0);

            if (selectedDate < minDate) {
                errors.desiredTime = MESSAGES.S50_VAL_DATE_MIN;
            }
        }

        if (formData.transactionType === 'DEPOSIT') {
            if (!formData.depositAmount || formData.depositAmount <= 0) {
                errors.depositAmount = MESSAGES.S50_VAL_DEPOSIT_POSITIVE;
            } else if (formData.depositAmount < DEPOSIT_MIN_AMOUNT) {
                errors.depositAmount = MESSAGES.S50_VAL_DEPOSIT_MIN;
            }
        }

        if (!formData.receiverName.trim()) {
            errors.receiverName = MESSAGES.S50_VAL_NAME_REQUIRED;
        }

        if (!formData.receiverPhone.trim()) {
            errors.receiverPhone = MESSAGES.S50_VAL_PHONE_REQUIRED;
        } else if (!PHONE_REGEX.test(formData.receiverPhone.trim())) {
            errors.receiverPhone = MESSAGES.S50_VAL_PHONE_INVALID;
        }

        if (!formData.receiverAddress.trim()) {
            errors.receiverAddress = MESSAGES.S50_VAL_ADDRESS_REQUIRED;
        }

        setValidationErrors(errors);
        return errors;
    }, [formData]);

    // Step navigation
    const handleNext = useCallback(() => {
        const errors = validateStep1();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            addToast(MESSAGES.S50_ERROR_CHECK_INFO, 'error');
        } else {
            setValidationErrors({});
            setCurrentStep(2);
        }
    }, [validateStep1, addToast]);

    const handleBack = useCallback(() => {
        setCurrentStep(1);
    }, []);

    const handleCancel = useCallback(() => {
        router.back();
    }, [router]);

    // Submit purchase request
    const handleSubmit = useCallback(async () => {
        if (!listing || !user) {
            addToast(MESSAGES.S50_ERROR_SYSTEM, 'error');
            return;
        }

        const step1Errors = validateStep1();
        if (Object.keys(step1Errors).length > 0) {
            setValidationErrors(step1Errors);
            setCurrentStep(1);
            addToast(MESSAGES.S50_ERROR_CHECK_STEP1, 'error');
            return;
        }

        try {
            setIsSubmitting(true);
            setSubmitError(null);

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

            addToast(MESSAGES.S50_SUCCESS_TOAST, 'success');
            router.push(`/transactions/${transaction.transactionId}`);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : MESSAGES.S50_ERROR_SUBMIT;
            setSubmitError(errorMessage);
            addToast(errorMessage, 'error');
        } finally {
            setIsSubmitting(false);
        }
    }, [listing, user, formData, router, validateStep1, addToast]);

    return {
        currentStep,
        listing,
        isListingLoading,
        isAuthLoading,
        isLoggedIn,
        error,
        submitError,
        validationErrors,
        isSubmitting,
        formData,
        setFormData,
        handleNext,
        handleBack,
        handleSubmit,
        handleCancel,
    };
}
