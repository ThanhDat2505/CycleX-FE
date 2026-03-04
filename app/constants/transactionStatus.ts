/**
 * Transaction Status Constants
 * Centralized transaction status values to avoid magic strings
 * 
 * Usage:
 * import { TRANSACTION_STATUS, TRANSACTION_STATUS_LABELS } from '@/app/constants/transactionStatus';
 */

export const TRANSACTION_STATUS = {
    PENDING_SELLER_CONFIRM: 'PENDING_SELLER_CONFIRM',
    CONFIRMED: 'CONFIRMED',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
} as const;

export type TransactionStatus = typeof TRANSACTION_STATUS[keyof typeof TRANSACTION_STATUS];

export const TRANSACTION_STATUS_LABELS: Record<TransactionStatus, string> = {
    [TRANSACTION_STATUS.PENDING_SELLER_CONFIRM]: 'Chờ xác nhận',
    [TRANSACTION_STATUS.CONFIRMED]: 'Đã xác nhận',
    [TRANSACTION_STATUS.COMPLETED]: 'Hoàn thành',
    [TRANSACTION_STATUS.CANCELLED]: 'Đã hủy',
};

export const TRANSACTION_TYPE = {
    PURCHASE: 'PURCHASE',
    DEPOSIT: 'DEPOSIT',
} as const;

export type TransactionType = typeof TRANSACTION_TYPE[keyof typeof TRANSACTION_TYPE];

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
    [TRANSACTION_TYPE.PURCHASE]: 'Mua ngay',
    [TRANSACTION_TYPE.DEPOSIT]: 'Đặt cọc',
};
