
import React from 'react';
import { formatDate } from '@/app/utils/format';
import { TRANSACTION_STATUS } from '@/app/constants/transactionStatus';
import { MESSAGES } from '@/app/constants';

interface OrderTimelineProps {
    status: string;
    createdAt: string;
    updatedAt: string;
}

const STEPS = [
    { id: 'created', label: MESSAGES.TX_TIMELINE_STEP_CREATED, status: TRANSACTION_STATUS.PENDING_SELLER_CONFIRM },
    { id: 'pending', label: MESSAGES.TX_TIMELINE_STEP_PENDING, status: TRANSACTION_STATUS.PENDING_SELLER_CONFIRM },
    { id: 'confirmed', label: MESSAGES.TX_TIMELINE_STEP_CONFIRMED, status: TRANSACTION_STATUS.CONFIRMED },
    { id: 'completed', label: MESSAGES.TX_TIMELINE_STEP_COMPLETED, status: TRANSACTION_STATUS.COMPLETED },
];

/** Style constants */
const STYLES = {
    // Cancelled state
    cancelledWrapper: 'w-full bg-red-50 border border-red-100 rounded-xl p-6 text-center',
    cancelledContent: 'flex flex-col items-center gap-2',
    cancelledIcon: 'w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-2',
    cancelledTitle: 'text-lg font-bold text-red-700',
    cancelledDate: 'text-sm text-red-600',
    // Normal timeline
    wrapper: 'w-full bg-white border border-gray-100 rounded-xl p-6 mb-8 shadow-sm',
    title: 'text-sm font-bold text-gray-900 uppercase tracking-wider mb-6',
    stepsContainer: 'relative flex items-center justify-between w-full',
    lineBg: 'absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-0 transform -translate-y-1/2 rounded-full',
    lineActive: 'absolute top-1/2 left-0 h-1 bg-blue-600 -z-0 transform -translate-y-1/2 rounded-full transition-all duration-700 ease-out',
    stepGroup: 'relative z-10 flex flex-col items-center group',
    dotBase: 'w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300',
    dotCompleted: 'bg-blue-600 border-blue-600 text-white scale-110 shadow-lg shadow-blue-200',
    dotIncomplete: 'bg-white border-gray-200 text-gray-300',
    dotCurrent: 'ring-4 ring-blue-100',
    checkIcon: 'w-4 h-4 md:w-5 md:h-5',
    stepNumber: 'text-xs font-bold',
    labelWrapper: 'absolute top-12 left-1/2 transform -translate-x-1/2 w-32 text-center',
    labelCompleted: 'text-xs md:text-sm font-bold transition-colors text-gray-900',
    labelIncomplete: 'text-xs md:text-sm font-bold transition-colors text-gray-400',
    dateText: 'text-[10px] text-gray-500 mt-1',
    currentText: 'text-[10px] text-blue-600 mt-1 font-medium',
    spacer: 'h-12 md:h-14',
} as const;

export default function OrderTimeline({ status, createdAt, updatedAt }: OrderTimelineProps) {
    // Determine current step index
    let currentStepIndex = 0;

    if (status === TRANSACTION_STATUS.CANCELLED) {
        return (
            <div className={STYLES.cancelledWrapper}>
                <div className={STYLES.cancelledContent}>
                    <div className={STYLES.cancelledIcon}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </div>
                    <h3 className={STYLES.cancelledTitle}>{MESSAGES.TX_TIMELINE_CANCELLED}</h3>
                    <p className={STYLES.cancelledDate}>{MESSAGES.TX_TIMELINE_CANCELLED_AT} {formatDate(updatedAt)}</p>
                </div>
            </div>
        );
    }

    switch (status) {
        case TRANSACTION_STATUS.PENDING_SELLER_CONFIRM:
            currentStepIndex = 1;
            break;
        case TRANSACTION_STATUS.CONFIRMED:
            currentStepIndex = 2;
            break;
        case TRANSACTION_STATUS.COMPLETED:
            currentStepIndex = 3;
            break;
        default:
            currentStepIndex = 0;
    }

    return (
        <div className={STYLES.wrapper}>
            <h3 className={STYLES.title}>{MESSAGES.TX_TIMELINE_TITLE}</h3>
            <div className={STYLES.stepsContainer}>
                {/* Connecting Line background */}
                <div className={STYLES.lineBg}></div>

                {/* Active Line (Progress) */}
                <div
                    className={STYLES.lineActive}
                    style={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
                ></div>

                {STEPS.map((step, index) => {
                    const isCompleted = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;

                    return (
                        <div key={step.id} className={STYLES.stepGroup}>
                            <div
                                className={`
                                    ${STYLES.dotBase}
                                    ${isCompleted ? STYLES.dotCompleted : STYLES.dotIncomplete}
                                    ${isCurrent ? STYLES.dotCurrent : ''}
                                `}
                            >
                                {isCompleted ? (
                                    <svg className={STYLES.checkIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                ) : (
                                    <span className={STYLES.stepNumber}>{index + 1}</span>
                                )}
                            </div>
                            <div className={STYLES.labelWrapper}>
                                <p className={isCompleted ? STYLES.labelCompleted : STYLES.labelIncomplete}>
                                    {step.label}
                                </p>
                                {index === 0 && <p className={STYLES.dateText}>{formatDate(createdAt).split(' ')[0]}</p>}
                                {index === currentStepIndex && index !== 0 && <p className={STYLES.currentText}>{MESSAGES.TX_TIMELINE_CURRENT}</p>}
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* Spacing for labels */}
            <div className={STYLES.spacer}></div>
        </div>
    );
}
