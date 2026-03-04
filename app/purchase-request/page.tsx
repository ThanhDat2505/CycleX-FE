/**
 * S-50 - Purchase/Deposit Request (Buyer) - BP5
 *
 * Multi-step form:
 * Step 1: Input request details
 * Step 2: Review and confirm
 */

'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { usePurchaseRequest } from './hooks/usePurchaseRequest';
import { MESSAGES } from '../constants';
import StepIndicator from './components/StepIndicator';
import { LoadingSpinner, EmptyState } from '../components/ui';
import Step1InputForm from './components/Step1InputForm';
import Step2Review from './components/Step2Review';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

/** Style constants */
const STYLES = {
    loadingWrapper: 'min-h-screen bg-gray-50 flex items-center justify-center',
    loadingText: 'ml-3 text-gray-600 font-medium',
    errorWrapper: 'min-h-screen bg-gray-50 flex items-center justify-center',
    errorButton: 'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium',
    pageWrapper: 'min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 relative overflow-hidden',
    container: 'max-w-4xl mx-auto px-4 py-12 relative z-10',
    headerPart: 'mb-12 animate-slide-up',
    pageTitle: 'text-4xl font-black text-gray-900 mb-3 tracking-tight',
    pageSubtitle: 'text-lg text-gray-500 font-medium flex items-center gap-2',
    bikeIcon: 'w-8 h-8 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center',
    stepContent: 'mt-12',
    bgDecorative1: 'fixed -top-24 -left-24 w-96 h-96 bg-brand-primary/5 rounded-full blur-[120px] -z-0',
    bgDecorative2: 'fixed top-1/2 -right-24 w-80 h-80 bg-blue-400/5 rounded-full blur-[100px] -z-0',
} as const;

export default function PurchaseRequestPage() {
    return (
        <Suspense fallback={
            <div className={STYLES.loadingWrapper}>
                <LoadingSpinner />
                <p className={STYLES.loadingText}>{MESSAGES.S50_LOADING}</p>
            </div>
        }>
            <PurchaseRequestContent />
        </Suspense>
    );
}

function PurchaseRequestContent() {
    const router = useRouter();
    const {
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
    } = usePurchaseRequest();

    // Loading state
    if (isAuthLoading || (isLoggedIn && isListingLoading)) {
        return (
            <div className={STYLES.loadingWrapper}>
                <LoadingSpinner />
                <p className={STYLES.loadingText}>{MESSAGES.S50_LOADING}</p>
            </div>
        );
    }

    // Not logged in — waiting for redirect
    if (!isLoggedIn) {
        return null;
    }

    // Error state
    if (error || !listing) {
        return (
            <div className={STYLES.errorWrapper}>
                <EmptyState
                    title={MESSAGES.S50_EMPTY_TITLE}
                    description={error || MESSAGES.S50_EMPTY_DESC}
                    action={
                        <button
                            onClick={() => router.push('/listings')}
                            className={STYLES.errorButton}
                        >
                            {MESSAGES.S50_EMPTY_ACTION}
                        </button>
                    }
                />
            </div>
        );
    }

    // Main render
    return (
        <div className={STYLES.pageWrapper}>
            {/* Decorative Background Elements */}
            <div className={STYLES.bgDecorative1}></div>
            <div className={STYLES.bgDecorative2}></div>

            <div className={STYLES.container}>
                {/* Header */}
                <div className={STYLES.headerPart}>
                    <h1 className={STYLES.pageTitle}>
                        {MESSAGES.S50_PAGE_TITLE}
                    </h1>
                    <div className={STYLES.pageSubtitle}>
                        <span className={STYLES.bikeIcon}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </span>
                        {listing.title}
                    </div>
                </div>

                {/* Step Indicator */}
                <div className="animate-slide-up [animation-delay:100ms]">
                    <StepIndicator currentStep={currentStep} />
                </div>

                {/* Step Content */}
                <div className={`${STYLES.stepContent} animate-slide-up [animation-delay:200ms]`}>
                    {currentStep === 1 ? (
                        <Step1InputForm
                            formData={formData}
                            errors={validationErrors}
                            onFormDataChange={setFormData}
                            onNext={handleNext}
                            onCancel={handleCancel}
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
