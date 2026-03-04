import { TransactionWithDetails } from '@/app/types/transaction';
import { useToast } from '@/app/contexts/ToastContext';

interface ContactInfoCardProps {
    transaction: TransactionWithDetails;
    viewerRole: 'SELLER' | 'BUYER';
}

export default function ContactInfoCard({ transaction, viewerRole }: ContactInfoCardProps) {
    const { addToast } = useToast();

    const handleCopyPhone = (phone: string) => {
        navigator.clipboard.writeText(phone);
        addToast('Đã sao chép số điện thoại', 'success', 2000);
    };

    return (
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden animate-slide-up">
            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50 flex items-center justify-between">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    {viewerRole === 'SELLER' ? 'Thông tin người mua' : 'Thông tin người bán'}
                </h3>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Thông tin liên hệ</span>
            </div>
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {viewerRole === 'SELLER' ? (
                        <>
                            <div className="space-y-1">
                                <p className="text-xs text-gray-500 font-medium uppercase">Họ và tên</p>
                                <p className="font-semibold text-gray-900 text-lg">{transaction.buyerName}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-gray-500 font-medium uppercase">Số điện thoại</p>
                                <p className="font-semibold text-gray-900 text-lg flex items-center gap-2">
                                    {transaction.receiverPhone || '---'}
                                    {transaction.receiverPhone && (
                                        <button
                                            onClick={() => handleCopyPhone(transaction.receiverPhone || '')}
                                            className="text-gray-400 hover:text-blue-500 transition-colors"
                                            title="Sao chép"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                        </button>
                                    )}
                                </p>
                            </div>
                            <div className="md:col-span-2 space-y-1">
                                <p className="text-xs text-gray-500 font-medium uppercase">Địa chỉ nhận xe</p>
                                <p className="font-medium text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100 border-dashed">
                                    {transaction.receiverAddress || 'Nhận tại cửa hàng'}
                                </p>
                            </div>
                            {transaction.note && (
                                <div className="md:col-span-2 space-y-1">
                                    <p className="text-xs text-gray-500 font-medium uppercase">Lời nhắn từ người mua</p>
                                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 text-yellow-800 text-sm italic">
                                        &quot;{transaction.note}&quot;
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="space-y-1">
                                <p className="text-xs text-gray-500 font-medium uppercase">Người bán</p>
                                <p className="font-semibold text-gray-900 text-lg">{transaction.sellerName || 'CycleX Seller'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-gray-500 font-medium uppercase">Số điện thoại</p>
                                <p className="font-semibold text-gray-900 text-lg">
                                    {transaction.sellerPhone || 'Liên hệ qua CycleX'}
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
