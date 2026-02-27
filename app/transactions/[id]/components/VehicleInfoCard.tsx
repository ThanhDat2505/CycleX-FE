import { TransactionWithDetails } from '@/app/types/transaction';
import { formatPrice } from '@/app/utils/format';
import { TRANSACTION_TYPE } from '@/app/constants/transactionStatus';
import { MESSAGES } from '@/app/constants';

interface VehicleInfoCardProps {
    transaction: TransactionWithDetails;
}

/** Style constants */
const STYLES = {
    card: 'bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden animate-slide-up',
    header: 'px-6 py-4 border-b border-gray-50 bg-gray-50 flex items-center justify-between',
    headerTitle: 'font-bold text-gray-800 flex items-center gap-2',
    headerIcon: 'w-5 h-5 text-orange-500',
    viewLink: 'text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 group',
    viewLinkIcon: 'w-4 h-4 transform group-hover:translate-x-0.5 transition-transform',
    body: 'p-6',
    layout: 'flex flex-col sm:flex-row gap-6',
    imageWrapper: 'w-full sm:w-40 h-40 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200 shadow-sm relative group',
    image: 'w-full h-full object-cover transition-transform duration-500 group-hover:scale-110',
    noImage: 'w-full h-full flex items-center justify-center text-gray-400 text-xs',
    infoWrapper: 'flex-1 space-y-3',
    bikeTitle: 'font-bold text-gray-900 text-xl leading-tight',
    metaRow: 'flex items-center gap-3',
    idBadge: 'px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-mono',
    separator: 'text-gray-300',
    sellerText: 'text-sm text-gray-500',
    priceRow: 'pt-3 border-t border-gray-100 flex items-baseline gap-2',
    priceLabel: 'text-xs text-gray-500 uppercase font-semibold',
    priceValue: 'text-blue-600 font-bold text-lg',
} as const;

export default function VehicleInfoCard({ transaction }: VehicleInfoCardProps) {
    // Estimate listing price from total amount (simplified)
    const estimatedListingPrice = transaction.transactionType === TRANSACTION_TYPE.DEPOSIT
        ? transaction.totalAmount / 0.1
        : transaction.totalAmount;

    return (
        <div className={STYLES.card} style={{ animationDelay: '0.1s' }}>
            <div className={STYLES.header}>
                <h3 className={STYLES.headerTitle}>
                    <svg className={STYLES.headerIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                    {MESSAGES.TX_VEHICLE_TITLE}
                </h3>
                <a href={`/listings/${transaction.listingId}`} target="_blank" rel="noopener noreferrer" className={STYLES.viewLink}>
                    {MESSAGES.TX_VEHICLE_VIEW_LISTING}
                    <svg className={STYLES.viewLinkIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
            </div>
            <div className={STYLES.body}>
                <div className={STYLES.layout}>
                    <div className={STYLES.imageWrapper}>
                        {transaction.listingImage ? (
                            <img
                                src={transaction.listingImage}
                                alt={transaction.listingTitle}
                                className={STYLES.image}
                            />
                        ) : (
                            <div className={STYLES.noImage}>{MESSAGES.TX_VEHICLE_NO_IMAGE}</div>
                        )}
                    </div>
                    <div className={STYLES.infoWrapper}>
                        <h3 className={STYLES.bikeTitle}>{transaction.listingTitle}</h3>
                        <div className={STYLES.metaRow}>
                            <span className={STYLES.idBadge}>ID: {transaction.listingId}</span>
                            <span className={STYLES.separator}>|</span>
                            <span className={STYLES.sellerText}>{MESSAGES.TX_VEHICLE_SELLER_PREFIX} {transaction.sellerName || MESSAGES.TX_CONTACT_SELLER_DEFAULT}</span>
                        </div>
                        <div className={STYLES.priceRow}>
                            <span className={STYLES.priceLabel}>{MESSAGES.TX_VEHICLE_PRICE_LABEL}</span>
                            <span className={STYLES.priceValue}>
                                {formatPrice(estimatedListingPrice)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
