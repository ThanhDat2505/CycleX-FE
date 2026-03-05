import { TransactionWithDetails } from '@/app/types/transaction';
import { Button } from '@/app/components/ui';
import { formatPrice } from '@/app/utils/format';
import { TRANSACTION_STATUS, TRANSACTION_TYPE, TRANSACTION_TYPE_LABELS } from '@/app/constants/transactionStatus';
import { MESSAGES } from '@/app/constants';

interface InvoiceWidgetProps {
    transaction: TransactionWithDetails;
    viewerRole: 'SELLER' | 'BUYER';
    isProcessing: boolean;
    onAccept: () => void;
    onCancel: () => void;
}

/** Style constants */
const STYLES = {
    card: 'bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden sticky top-24 animate-slide-in-right',
    header: 'p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden',
    headerDecorative: 'absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white opacity-5 rounded-full',
    headerTitle: 'text-lg font-bold',
    headerSubtitle: 'text-gray-400 text-xs mt-1',
    body: 'p-6 space-y-4',
    typeRow: 'flex justify-between items-center pb-4 border-b border-gray-100',
    typeLabel: 'text-gray-600 text-sm',
    typeBadgePurchase: 'font-bold px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800',
    typeBadgeDeposit: 'font-bold px-3 py-1 rounded-full text-xs bg-orange-100 text-orange-800',
    feeList: 'space-y-2 text-sm',
    feeRow: 'flex justify-between',
    feeLabel: 'text-gray-500',
    feeValue: 'font-medium text-gray-900',
    totalSection: 'pt-4 border-t border-gray-100',
    totalRow: 'flex justify-between items-end',
    totalLabel: 'text-sm font-bold text-gray-900',
    totalValue: 'text-2xl font-extrabold text-blue-600 leading-none',
    totalNote: 'text-xs text-gray-400 text-right mt-1',
    actionsWrapper: 'pt-4 mt-2 h-full',
    btnAccept: 'w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-200 transition-all hover:-translate-y-0.5 active:scale-95',
    btnCancel: 'w-full bg-red-50 hover:bg-red-100 text-red-600 border-red-200 font-bold py-3.5 rounded-xl transition-all',
    actionHint: 'text-xs text-gray-400 text-center mt-3 leading-relaxed',
    confirmedBox: 'pt-4 mt-2 bg-green-50 rounded-lg p-4 border border-green-100 text-center',
    confirmedTitle: 'text-green-700 font-bold flex items-center justify-center gap-2 mb-1',
    confirmedIcon: 'w-5 h-5 bg-green-200 rounded-full p-0.5 text-green-700',
    confirmedText: 'text-xs text-green-600 opacity-80',
} as const;

export default function InvoiceWidget({ transaction, viewerRole, isProcessing, onAccept, onCancel }: InvoiceWidgetProps) {
    const isPending = transaction.status === TRANSACTION_STATUS.PENDING_SELLER_CONFIRM;
    const isConfirmed = transaction.status === TRANSACTION_STATUS.CONFIRMED;
    const isPurchase = transaction.transactionType === TRANSACTION_TYPE.PURCHASE;
    const typeLabel = TRANSACTION_TYPE_LABELS[transaction.transactionType as keyof typeof TRANSACTION_TYPE_LABELS] || transaction.transactionType;

    return (
        <div className={STYLES.card}>
            {/* Header */}
            <div className={STYLES.header}>
                <div className={STYLES.headerDecorative}></div>
                <h3 className={STYLES.headerTitle}>{MESSAGES.TX_INVOICE_TITLE}</h3>
                <p className={STYLES.headerSubtitle}>{MESSAGES.TX_INVOICE_SUBTITLE}</p>
            </div>

            {/* Body */}
            <div className={STYLES.body}>
                {/* Transaction Type */}
                <div className={STYLES.typeRow}>
                    <span className={STYLES.typeLabel}>{MESSAGES.TX_INVOICE_TYPE_LABEL}</span>
                    <span className={isPurchase ? STYLES.typeBadgePurchase : STYLES.typeBadgeDeposit}>
                        {typeLabel.toUpperCase()}
                    </span>
                </div>

                {/* Fee Breakdown */}
                <div className={STYLES.feeList}>
                    {(transaction.depositAmount ?? 0) > 0 && (
                        <div className={STYLES.feeRow}>
                            <span className={STYLES.feeLabel}>{MESSAGES.TX_INVOICE_DEPOSIT}</span>
                            <span className={STYLES.feeValue}>{formatPrice(transaction.depositAmount ?? 0)}</span>
                        </div>
                    )}
                    <div className={STYLES.feeRow}>
                        <span className={STYLES.feeLabel}>{MESSAGES.TX_INVOICE_PLATFORM_FEE}</span>
                        <span className={STYLES.feeValue}>{formatPrice(transaction.platformFee)}</span>
                    </div>
                    <div className={STYLES.feeRow}>
                        <span className={STYLES.feeLabel}>{MESSAGES.TX_INVOICE_INSPECTION_FEE}</span>
                        <span className={STYLES.feeValue}>{formatPrice(transaction.inspectionFee)}</span>
                    </div>
                </div>

                {/* Total */}
                <div className={STYLES.totalSection}>
                    <div className={STYLES.totalRow}>
                        <span className={STYLES.totalLabel}>{MESSAGES.TX_INVOICE_TOTAL}</span>
                        <span className={STYLES.totalValue}>{formatPrice(transaction.totalAmount)}</span>
                    </div>
                    <p className={STYLES.totalNote}>{MESSAGES.TX_INVOICE_VAT_NOTE}</p>
                </div>

                {/* Pending Actions */}
                {isPending && (
                    <div className={STYLES.actionsWrapper}>
                        {viewerRole === 'SELLER' ? (
                            <>
                                <Button
                                    onClick={onAccept}
                                    loading={isProcessing}
                                    className={STYLES.btnAccept}
                                >
                                    {MESSAGES.TX_DETAIL_BTN_ACCEPT}
                                </Button>
                                <p className={STYLES.actionHint}>
                                    {MESSAGES.TX_INVOICE_ACCEPT_HINT}
                                </p>
                            </>
                        ) : (
                            <>
                                <Button
                                    onClick={onCancel}
                                    loading={isProcessing}
                                    className={STYLES.btnCancel}
                                >
                                    {MESSAGES.TX_DETAIL_BTN_CANCEL}
                                </Button>
                                <p className={STYLES.actionHint}>
                                    {MESSAGES.TX_INVOICE_CANCEL_HINT}
                                </p>
                            </>
                        )}
                    </div>
                )}

                {/* Confirmed State */}
                {isConfirmed && (
                    <div className={STYLES.confirmedBox}>
                        <div className={STYLES.confirmedTitle}>
                            <svg className={STYLES.confirmedIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                            {MESSAGES.TX_INVOICE_CONFIRMED}
                        </div>
                        <p className={STYLES.confirmedText}>
                            {viewerRole === 'SELLER'
                                ? MESSAGES.TX_INVOICE_CONFIRMED_SELLER
                                : MESSAGES.TX_INVOICE_CONFIRMED_BUYER}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
