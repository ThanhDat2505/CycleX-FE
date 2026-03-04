import { TransactionWithDetails } from '@/app/types/transaction';
import { Button } from '@/app/components/ui';
import { formatPrice } from '@/app/utils/format';
import { TRANSACTION_STATUS, TRANSACTION_TYPE, TRANSACTION_TYPE_LABELS } from '@/app/constants/transactionStatus';

interface InvoiceWidgetProps {
    transaction: TransactionWithDetails;
    viewerRole: 'SELLER' | 'BUYER';
    isProcessing: boolean;
    onAccept: () => void;
    onCancel: () => void;
}

export default function InvoiceWidget({ transaction, viewerRole, isProcessing, onAccept, onCancel }: InvoiceWidgetProps) {
    const isPending = transaction.status === TRANSACTION_STATUS.PENDING_SELLER_CONFIRM;
    const isConfirmed = transaction.status === TRANSACTION_STATUS.CONFIRMED;
    const isPurchase = transaction.transactionType === TRANSACTION_TYPE.PURCHASE;
    const typeLabel = TRANSACTION_TYPE_LABELS[transaction.transactionType as keyof typeof TRANSACTION_TYPE_LABELS] || transaction.transactionType;

    return (
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden sticky top-24 animate-slide-in-right">
            {/* Header */}
            <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white opacity-5 rounded-full"></div>
                <h3 className="text-lg font-bold">Thanh toán</h3>
                <p className="text-gray-400 text-xs mt-1">Chi tiết hoá đơn giao dịch</p>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
                {/* Transaction Type */}
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Loại giao dịch</span>
                    <span className={`font-bold px-3 py-1 rounded-full text-xs ${isPurchase ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                        {typeLabel.toUpperCase()}
                    </span>
                </div>

                {/* Fee Breakdown */}
                <div className="space-y-2 text-sm">
                    {(transaction.depositAmount ?? 0) > 0 && (
                        <div className="flex justify-between">
                            <span className="text-gray-500">Tiền cọc</span>
                            <span className="font-medium text-gray-900">{formatPrice(transaction.depositAmount ?? 0)}</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span className="text-gray-500">Phí nền tảng</span>
                        <span className="font-medium text-gray-900">{formatPrice(transaction.platformFee)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Phí kiểm định</span>
                        <span className="font-medium text-gray-900">{formatPrice(transaction.inspectionFee)}</span>
                    </div>
                </div>

                {/* Total */}
                <div className="pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-end">
                        <span className="text-sm font-bold text-gray-900">Tổng cộng</span>
                        <span className="text-2xl font-extrabold text-blue-600 leading-none">{formatPrice(transaction.totalAmount)}</span>
                    </div>
                    <p className="text-xs text-gray-400 text-right mt-1">Đã bao gồm VAT nếu có</p>
                </div>

                {/* Pending Actions */}
                {isPending && (
                    <div className="pt-4 mt-2 h-full">
                        {viewerRole === 'SELLER' ? (
                            <>
                                <Button
                                    onClick={onAccept}
                                    loading={isProcessing}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-200 transition-all hover:-translate-y-0.5 active:scale-95"
                                >
                                    Chấp nhận yêu cầu
                                </Button>
                                <p className="text-xs text-gray-400 text-center mt-3 leading-relaxed">
                                    Giao dịch sẽ được chuyển sang trạng thái &quot;Đã xác nhận&quot;. Bạn không thể hoàn tác hành động này.
                                </p>
                            </>
                        ) : (
                            <>
                                <Button
                                    onClick={onCancel}
                                    loading={isProcessing}
                                    className="w-full bg-red-50 hover:bg-red-100 text-red-600 border-red-200 font-bold py-3.5 rounded-xl transition-all"
                                >
                                    Hủy yêu cầu
                                </Button>
                                <p className="text-xs text-gray-400 text-center mt-3 leading-relaxed">
                                    Bạn có thể hủy yêu cầu khi người bán chưa xác nhận.
                                </p>
                            </>
                        )}
                    </div>
                )}

                {/* Confirmed State */}
                {isConfirmed && (
                    <div className="pt-4 mt-2 bg-green-50 rounded-lg p-4 border border-green-100 text-center">
                        <div className="text-green-700 font-bold flex items-center justify-center gap-2 mb-1">
                            <svg className="w-5 h-5 bg-green-200 rounded-full p-0.5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                            Đã xác nhận
                        </div>
                        <p className="text-xs text-green-600 opacity-80">
                            Vui lòng chuẩn bị xe để giao.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
