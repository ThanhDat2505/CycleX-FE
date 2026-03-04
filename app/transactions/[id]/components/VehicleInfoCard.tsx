import { TransactionWithDetails } from '@/app/types/transaction';
import { formatPrice } from '@/app/utils/format';
import { TRANSACTION_TYPE } from '@/app/constants/transactionStatus';

interface VehicleInfoCardProps {
    transaction: TransactionWithDetails;
}

export default function VehicleInfoCard({ transaction }: VehicleInfoCardProps) {
    // Estimate listing price from total amount (simplified)
    const estimatedListingPrice = transaction.transactionType === TRANSACTION_TYPE.DEPOSIT
        ? transaction.totalAmount / 0.1
        : transaction.totalAmount;

    return (
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50 flex items-center justify-between">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                    Thông tin xe
                </h3>
                <a href={`/listings/${transaction.listingId}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 group">
                    Xem tin đăng
                    <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
            </div>
            <div className="p-6">
                <div className="flex flex-col sm:flex-row gap-6">
                    <div className="w-full sm:w-40 h-40 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200 shadow-sm relative group">
                        {transaction.listingImage ? (
                            <img
                                src={transaction.listingImage}
                                alt={transaction.listingTitle}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                        )}
                    </div>
                    <div className="flex-1 space-y-3">
                        <h3 className="font-bold text-gray-900 text-xl leading-tight">{transaction.listingTitle}</h3>
                        <div className="flex items-center gap-3">
                            <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-mono">ID: {transaction.listingId}</span>
                            <span className="text-gray-300">|</span>
                            <span className="text-sm text-gray-500">Người bán: CycleX Verified</span>
                        </div>
                        <div className="pt-3 border-t border-gray-100 flex items-baseline gap-2">
                            <span className="text-xs text-gray-500 uppercase font-semibold">Giá niêm yết:</span>
                            <span className="text-blue-600 font-bold text-lg">
                                {formatPrice(estimatedListingPrice)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
