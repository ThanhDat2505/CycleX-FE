import { TRANSACTION_STATUS } from '@/app/constants/transactionStatus';

interface MiniTimelineProps {
    status: string;
    /** Dot size in pixels, defaults to 8 (w-2 h-2) */
    size?: 'sm' | 'md';
}

const STEP_COUNT = 3;

/**
 * MiniTimeline — compact 3-dot progress indicator for transaction status.
 * Reusable across table rows and mobile card views.
 */
export default function MiniTimeline({ status, size = 'md' }: MiniTimelineProps) {
    const dotClass = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2';

    if (status === TRANSACTION_STATUS.CANCELLED) {
        return (
            <div className="flex items-center gap-1">
                <div className={`${dotClass} rounded-full bg-red-400`}></div>
            </div>
        );
    }

    const getActiveStepCount = (): number => {
        switch (status) {
            case TRANSACTION_STATUS.PENDING_SELLER_CONFIRM: return 1;
            case TRANSACTION_STATUS.CONFIRMED: return 2;
            case TRANSACTION_STATUS.COMPLETED: return 3;
            default: return 0;
        }
    };

    const activeSteps = getActiveStepCount();

    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: STEP_COUNT }, (_, i) => (
                <div
                    key={i}
                    className={`${dotClass} rounded-full transition-colors ${i < activeSteps ? 'bg-green-500' : 'bg-gray-200'}`}
                ></div>
            ))}
        </div>
    );
}
