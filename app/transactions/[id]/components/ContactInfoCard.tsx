import { TransactionWithDetails } from '@/app/types/transaction';
import { useToast } from '@/app/contexts/ToastContext';
import { MESSAGES } from '@/app/constants';

interface ContactInfoCardProps {
    transaction: TransactionWithDetails;
    viewerRole: 'SELLER' | 'BUYER';
}

/** Style constants */
const STYLES = {
    card: 'bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden animate-slide-up',
    header: 'px-6 py-4 border-b border-gray-50 bg-gray-50 flex items-center justify-between',
    headerTitle: 'font-bold text-gray-800 flex items-center gap-2',
    headerIcon: 'w-5 h-5 text-blue-500',
    headerBadge: 'text-xs font-semibold text-gray-400 uppercase tracking-wider',
    body: 'p-6',
    grid: 'grid grid-cols-1 md:grid-cols-2 gap-6',
    fieldGroup: 'space-y-1',
    fieldGroupFull: 'md:col-span-2 space-y-1',
    label: 'text-xs text-gray-500 font-medium uppercase',
    value: 'font-semibold text-gray-900 text-lg',
    valueWithAction: 'font-semibold text-gray-900 text-lg flex items-center gap-2',
    copyButton: 'text-gray-400 hover:text-blue-500 transition-colors',
    copyIcon: 'w-4 h-4',
    addressBox: 'font-medium text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100 border-dashed',
    noteBox: 'bg-yellow-50 p-4 rounded-lg border border-yellow-100 text-yellow-800 text-sm italic',
} as const;

export default function ContactInfoCard({ transaction, viewerRole }: ContactInfoCardProps) {
    const { addToast } = useToast();

    const handleCopyPhone = (phone: string) => {
        navigator.clipboard.writeText(phone);
        addToast(MESSAGES.TX_CONTACT_COPIED, 'success', 2000);
    };

    return (
        <div className={STYLES.card}>
            <div className={STYLES.header}>
                <h3 className={STYLES.headerTitle}>
                    <svg className={STYLES.headerIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    {viewerRole === 'SELLER' ? MESSAGES.TX_CONTACT_BUYER_TITLE : MESSAGES.TX_CONTACT_SELLER_TITLE}
                </h3>
                <span className={STYLES.headerBadge}>{MESSAGES.TX_CONTACT_BADGE}</span>
            </div>
            <div className={STYLES.body}>
                <div className={STYLES.grid}>
                    {viewerRole === 'SELLER' ? (
                        <>
                            <div className={STYLES.fieldGroup}>
                                <p className={STYLES.label}>{MESSAGES.TX_CONTACT_FULLNAME}</p>
                                <p className={STYLES.value}>{transaction.buyerName}</p>
                            </div>
                            <div className={STYLES.fieldGroup}>
                                <p className={STYLES.label}>{MESSAGES.TX_CONTACT_PHONE}</p>
                                <p className={STYLES.valueWithAction}>
                                    {transaction.receiverPhone || '---'}
                                    {transaction.receiverPhone && (
                                        <button
                                            onClick={() => handleCopyPhone(transaction.receiverPhone || '')}
                                            className={STYLES.copyButton}
                                            title={MESSAGES.TX_CONTACT_COPY}
                                        >
                                            <svg className={STYLES.copyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                        </button>
                                    )}
                                </p>
                            </div>
                            <div className={STYLES.fieldGroupFull}>
                                <p className={STYLES.label}>{MESSAGES.TX_CONTACT_ADDRESS}</p>
                                <p className={STYLES.addressBox}>
                                    {transaction.receiverAddress || MESSAGES.TX_CONTACT_ADDRESS_DEFAULT}
                                </p>
                            </div>
                            {transaction.note && (
                                <div className={STYLES.fieldGroupFull}>
                                    <p className={STYLES.label}>{MESSAGES.TX_CONTACT_NOTE}</p>
                                    <div className={STYLES.noteBox}>
                                        &quot;{transaction.note}&quot;
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <div className={STYLES.fieldGroup}>
                                <p className={STYLES.label}>{MESSAGES.TX_CONTACT_SELLER_LABEL}</p>
                                <p className={STYLES.value}>{transaction.sellerName || MESSAGES.TX_CONTACT_SELLER_DEFAULT}</p>
                            </div>
                            <div className={STYLES.fieldGroup}>
                                <p className={STYLES.label}>{MESSAGES.TX_CONTACT_PHONE}</p>
                                <p className={STYLES.valueWithAction}>
                                    {transaction.sellerPhone || MESSAGES.TX_CONTACT_PHONE_DEFAULT}
                                    {transaction.sellerPhone && (
                                        <button
                                            onClick={() => handleCopyPhone(transaction.sellerPhone || '')}
                                            className={STYLES.copyButton}
                                            title={MESSAGES.TX_CONTACT_COPY}
                                        >
                                            <svg className={STYLES.copyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                        </button>
                                    )}
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
