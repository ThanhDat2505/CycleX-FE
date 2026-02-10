
import React from 'react';
import { formatDate } from '@/app/utils/format';
import { TRANSACTION_STATUS } from '@/app/constants/transactionStatus';

interface OrderTimelineProps {
    status: string;
    createdAt: string;
    updatedAt: string;
}

const STEPS = [
    { id: 'created', label: 'Đã đặt hàng', status: TRANSACTION_STATUS.PENDING_SELLER_CONFIRM },
    { id: 'pending', label: 'Chờ xác nhận', status: TRANSACTION_STATUS.PENDING_SELLER_CONFIRM },
    { id: 'confirmed', label: 'Đã xác nhận', status: TRANSACTION_STATUS.CONFIRMED },
    { id: 'completed', label: 'Hoàn thành', status: TRANSACTION_STATUS.COMPLETED },
];

export default function OrderTimeline({ status, createdAt, updatedAt }: OrderTimelineProps) {
    // Determine current step index
    let currentStepIndex = 0;

    if (status === TRANSACTION_STATUS.CANCELLED) {
        return (
            <div className="w-full bg-red-50 border border-red-100 rounded-xl p-6 text-center">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </div>
                    <h3 className="text-lg font-bold text-red-700">Đơn hàng đã bị hủy</h3>
                    <p className="text-sm text-red-600">Vào lúc: {formatDate(updatedAt)}</p>
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
        <div className="w-full bg-white border border-gray-100 rounded-xl p-6 mb-8 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Tiến độ đơn hàng</h3>
            <div className="relative flex items-center justify-between w-full">
                {/* Connecting Line background */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-0 transform -translate-y-1/2 rounded-full"></div>

                {/* Active Line (Progress) */}
                <div
                    className="absolute top-1/2 left-0 h-1 bg-blue-600 -z-0 transform -translate-y-1/2 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
                ></div>

                {STEPS.map((step, index) => {
                    const isCompleted = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;

                    return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center group">
                            <div
                                className={`
                                    w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300
                                    ${isCompleted
                                        ? 'bg-blue-600 border-blue-600 text-white scale-110 shadow-lg shadow-blue-200'
                                        : 'bg-white border-gray-200 text-gray-300'}
                                    ${isCurrent ? 'ring-4 ring-blue-100' : ''}
                                `}
                            >
                                {isCompleted ? (
                                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                ) : (
                                    <span className="text-xs font-bold">{index + 1}</span>
                                )}
                            </div>
                            <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-32 text-center">
                                <p className={`text-xs md:text-sm font-bold transition-colors ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {step.label}
                                </p>
                                {/* Show timestamp for current/completed steps if available - Logic simplified for now */}
                                {index === 0 && <p className="text-[10px] text-gray-500 mt-1">{formatDate(createdAt).split(' ')[0]}</p>}
                                {index === currentStepIndex && index !== 0 && <p className="text-[10px] text-blue-600 mt-1 font-medium">Hiện tại</p>}
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* Spacing for labels */}
            <div className="h-12 md:h-14"></div>
        </div>
    );
}
