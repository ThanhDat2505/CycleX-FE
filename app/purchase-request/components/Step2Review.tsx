/**
 * Step2Review Component
 * S-50 Step 2: Review and confirm purchase/deposit request
 * Displays receipt-style summary of all form data, fees, and listing info
 */

import { CheckCircle, MapPin, User, AlertCircle, ShieldCheck, Ticket, Calendar, FileText } from 'lucide-react';
import { PurchaseRequestForm } from '@/app/types/transaction';
import { ListingDetail } from '@/app/types/listing';
import { PLATFORM_FEE, INSPECTION_FEE, calculateTotal } from '../../constants/fees';
import { formatPrice, formatDate } from '@/app/utils/format';
import { Button } from '@/app/components/ui';
import { MESSAGES } from '@/app/constants';

/** Style constants */
const STYLES = {
    card: 'bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-slide-up',
    header: 'bg-gradient-to-br from-gray-900 via-gray-800 to-brand-primary/20 p-8 text-white relative overflow-hidden',
    headerTitle: 'text-2xl font-black flex items-center gap-3 tracking-tight',
    headerSubtitle: 'text-blue-200/80 text-sm mt-2 font-medium max-w-md',
    content: 'p-6 md:p-10 bg-gray-50/30',
    grid: 'grid grid-cols-1 lg:grid-cols-5 gap-10',
    leftCol: 'lg:col-span-3 space-y-8',
    rightCol: 'lg:col-span-2 space-y-8',
    sectionTitle: 'text-xl font-extrabold text-gray-900 mb-5 flex items-center gap-3',
    transactionBox: 'bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden',
    transactionTitle: 'text-sm font-black uppercase tracking-widest text-gray-400 mb-5 pb-3 border-b border-gray-50 flex items-center gap-2',
    rowBetween: 'flex justify-between items-center py-1.5',
    labelText: 'text-gray-500 font-medium',
    valueText: 'font-bold text-gray-900',
    typeBadge: 'px-3 py-1 bg-blue-50 text-brand-primary rounded-full text-xs font-black shadow-sm border border-blue-100',
    noteBox: 'mt-6 pt-5 border-t border-dashed border-gray-100',
    noteLabel: 'flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider mb-2',
    noteValue: 'text-gray-700 italic bg-gray-50/50 p-4 rounded-xl border border-gray-100/50 leading-relaxed text-sm',
    listingImage: 'w-28 h-28 object-cover rounded-2xl border-2 border-white shadow-md flex-shrink-0 group-hover:scale-105 transition-transform',
    noImage: 'w-28 h-28 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 border border-gray-100',
    listingTitle: 'text-lg font-black text-gray-900 line-clamp-2 leading-snug',
    locationRow: 'flex items-center gap-1.5 text-gray-400 text-xs font-bold mt-2 uppercase tracking-wide',
    priceText: 'text-brand-primary font-black text-xl mt-3 flex items-baseline gap-1',
    sellerCard: 'flex items-center gap-4 p-4 rounded-2xl border border-gray-100/50 bg-white shadow-sm hover:shadow-md transition-shadow',
    sellerAvatar: 'w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center text-gray-800 font-black shadow-inner',
    receiverBox: 'bg-white p-6 rounded-2xl border border-blue-50/50 shadow-sm relative overflow-hidden space-y-3 before:absolute before:left-0 before:top-0 before:w-1 before:h-full before:bg-blue-400',
    feeBox: 'bg-white border-2 border-gray-100/70 border-dashed rounded-2xl p-6 shadow-sm relative',
    feeRow: 'flex justify-between items-center text-gray-500 font-medium py-1 gap-4',
    feeValue: 'text-gray-900 font-bold break-all text-right min-w-0 flex-1',
    feeTotal: 'border-t-2 border-dashed border-gray-100 mt-5 pt-5 flex justify-between items-center gap-4',
    feeTotalLabel: 'text-lg font-black text-gray-900 uppercase tracking-tighter flex-shrink-0',
    feeTotalValue: 'text-2xl sm:text-3xl font-black text-brand-primary tracking-tight break-all text-right min-w-0 flex-1',
    errorBanner: 'mt-8 p-5 bg-red-50 text-red-800 border-2 border-red-100/50 rounded-2xl flex items-center gap-3 animate-shake font-bold text-sm',
    terms: 'text-[11px] text-gray-400 mt-10 text-center max-w-lg mx-auto leading-relaxed border-t border-gray-100 pt-6 font-medium',
    termsLink: 'text-brand-primary hover:text-brand-primary-hover font-bold decoration-dotted underline underline-offset-4',
    actions: 'flex flex-col sm:flex-row justify-between gap-5 mt-10 pt-8 border-t border-gray-100/80',
    btnBack: '!w-full sm:!w-auto px-10 py-3.5 text-base font-bold text-gray-400 hover:text-gray-800 transition-colors',
    btnConfirm: '!w-full sm:!w-auto px-12 py-4 text-lg font-black bg-brand-primary hover:bg-brand-primary-hover text-white shadow-xl shadow-blue-100 hover:shadow-blue-200 hover:-translate-y-1 active:translate-y-0 transition-all rounded-2xl flex items-center justify-center gap-3',
} as const;

interface Step2ReviewProps {
    formData: PurchaseRequestForm;
    listing: ListingDetail;
    onBack: () => void;
    onConfirm: () => void;
    isSubmitting: boolean;
    error?: string | null;
}

export default function Step2Review({
    formData,
    listing,
    onBack,
    onConfirm,
    isSubmitting,
    error,
}: Step2ReviewProps) {

    const totalAmount = calculateTotal(listing.price, formData.transactionType, formData.depositAmount);

    return (
        <div className={STYLES.card}>
            {/* Receipt Header */}
            <div className={STYLES.header}>
                <div className="relative z-10">
                    <h2 className={STYLES.headerTitle}>
                        <CheckCircle size={28} className="text-brand-primary animate-pulse-slow" />
                        {MESSAGES.S50_STEP2_TITLE}
                    </h2>
                    <p className={STYLES.headerSubtitle}>
                        {MESSAGES.S50_STEP2_SUBTITLE}
                    </p>
                </div>
                {/* Decorative background element */}
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            </div>

            <div className={STYLES.content}>
                <div className={STYLES.grid}>
                    {/* Left Column: Product & Transaction Info */}
                    <div className={STYLES.leftCol}>
                        {/* Transaction Info */}
                        <div className={STYLES.transactionBox}>
                            <h3 className={STYLES.transactionTitle}>
                                <Ticket size={16} />
                                {MESSAGES.S50_REVIEW_TRANSACTION_TITLE}
                            </h3>
                            <div className="space-y-4">
                                <div className={STYLES.rowBetween}>
                                    <span className={STYLES.labelText}>
                                        <FileText size={14} className="inline mr-2 opacity-50" />
                                        {MESSAGES.S50_REVIEW_TYPE_LABEL}
                                    </span>
                                    <span className={STYLES.typeBadge}>
                                        {formData.transactionType === 'PURCHASE'
                                            ? MESSAGES.S50_REVIEW_TYPE_PURCHASE
                                            : MESSAGES.S50_REVIEW_TYPE_DEPOSIT}
                                    </span>
                                </div>
                                <div className={STYLES.rowBetween}>
                                    <span className={STYLES.labelText}>
                                        <Calendar size={14} className="inline mr-2 opacity-50" />
                                        {MESSAGES.S50_REVIEW_DATE_LABEL}
                                    </span>
                                    <span className={STYLES.valueText}>
                                        {formatDate(formData.desiredTime)}
                                    </span>
                                </div>
                                {formData.note && (
                                    <div className={STYLES.noteBox}>
                                        <span className={STYLES.noteLabel}>
                                            <FileText size={12} />
                                            {MESSAGES.S50_REVIEW_NOTE_LABEL}
                                        </span>
                                        <p className={STYLES.noteValue}>
                                            &ldquo;{formData.note}&rdquo;
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Listing Info */}
                        <div className="flex gap-6 items-center p-2 group">
                            {listing.images && listing.images[0] ? (
                                <img
                                    src={listing.images[0]}
                                    alt={listing.title}
                                    className={STYLES.listingImage}
                                />
                            ) : (
                                <div className={STYLES.noImage}>
                                    <span className="text-[10px] font-black uppercase text-gray-300 tracking-widest">{MESSAGES.DETAIL_NO_IMAGE}</span>
                                </div>
                            )}
                            <div className="flex-1">
                                <h4 className={STYLES.listingTitle}>{listing.title}</h4>
                                <div className={STYLES.locationRow}>
                                    <MapPin size={12} className="text-brand-primary" />
                                    {listing.locationCity}
                                </div>
                                <p className={STYLES.priceText}>
                                    <span className="text-sm font-black opacity-40">đ</span>
                                    {formatPrice(listing.price).replace('đ', '')}
                                </p>
                            </div>
                        </div>

                        {/* Seller Info */}
                        <div className={STYLES.sellerCard}>
                            <div className={STYLES.sellerAvatar}>
                                {listing.sellerName?.[0]?.toUpperCase() || 'S'}
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none mb-1">{MESSAGES.S50_REVIEW_SELLER_LABEL}</p>
                                <p className="font-bold text-gray-900">{listing.sellerName || MESSAGES.S50_REVIEW_SELLER_DEFAULT}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Receiver & Fees */}
                    <div className={STYLES.rightCol}>
                        {/* Receiver Info */}
                        <div>
                            <h3 className={STYLES.sectionTitle}>
                                <User size={22} className="text-brand-primary" />
                                {MESSAGES.S50_REVIEW_RECEIVER_TITLE}
                            </h3>
                            <div className={STYLES.receiverBox}>
                                <p className={STYLES.rowBetween}>
                                    <span className={STYLES.labelText}>{MESSAGES.S50_REVIEW_NAME_LABEL}</span>
                                    <span className={STYLES.valueText}>{formData.receiverName}</span>
                                </p>
                                <p className={STYLES.rowBetween}>
                                    <span className={STYLES.labelText}>{MESSAGES.S50_REVIEW_PHONE_LABEL}</span>
                                    <span className="font-mono text-sm font-black text-gray-900 tracking-wider transition-all hover:tracking-widest cursor-default">
                                        {formData.receiverPhone}
                                    </span>
                                </p>
                                <div className="pt-3 border-t border-gray-50 flex gap-3 italic">
                                    <MapPin size={14} className="text-brand-primary flex-shrink-0 mt-1" />
                                    <span className="text-gray-600 text-sm font-medium leading-relaxed">
                                        {formData.receiverAddress}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Fee Breakdown */}
                        <div>
                            <h3 className={STYLES.sectionTitle}>
                                <Ticket size={22} className="text-brand-primary" />
                                {MESSAGES.S50_REVIEW_FEE_TITLE}
                            </h3>
                            <div className={STYLES.feeBox}>
                                {/* Decorative punch holes for receipt style */}
                                <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-gray-50 rounded-full border border-gray-100 shadow-inner"></div>
                                <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-gray-50 rounded-full border border-gray-100 shadow-inner"></div>

                                <div className="space-y-4 mb-6">
                                    <div className={STYLES.feeRow}>
                                        <span>{MESSAGES.S50_REVIEW_ORDER_VALUE}</span>
                                        <span className="text-gray-900 font-bold">
                                            {formatPrice(formData.transactionType === 'PURCHASE' ? listing.price : (formData.depositAmount || 0))}
                                        </span>
                                    </div>
                                    <div className={STYLES.feeRow}>
                                        <span>{MESSAGES.S50_REVIEW_PLATFORM_FEE}</span>
                                        <span className="text-gray-900 font-bold">{formatPrice(PLATFORM_FEE)}</span>
                                    </div>
                                    {formData.transactionType === 'PURCHASE' && (
                                        <div className={STYLES.feeRow}>
                                            <span>{MESSAGES.S50_REVIEW_INSPECTION_FEE}</span>
                                            <span className="text-gray-900 font-bold">{formatPrice(INSPECTION_FEE)}</span>
                                        </div>
                                    )}
                                </div>
                                <div className={STYLES.feeTotal}>
                                    <div className="flex flex-col items-end w-full gap-1">
                                        <span className={STYLES.feeTotalLabel}>{MESSAGES.S50_REVIEW_TOTAL}</span>
                                        <span className={STYLES.feeTotalValue}>
                                            {formatPrice(totalAmount)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className={STYLES.errorBanner}>
                        <AlertCircle size={22} className="flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Terms */}
                <p className={STYLES.terms}>
                    {MESSAGES.S50_REVIEW_TERMS} <a href="#" className={STYLES.termsLink}>{MESSAGES.S50_REVIEW_TOS}</a> & <a href="#" className={STYLES.termsLink}>{MESSAGES.S50_REVIEW_PRIVACY}</a>.
                    <br />
                    <span className="opacity-80 mt-1 inline-block font-bold">{MESSAGES.S50_REVIEW_DEADLINE}</span>
                </p>

                {/* Actions */}
                <div className={STYLES.actions}>
                    <Button
                        variant="secondary"
                        onClick={onBack}
                        disabled={isSubmitting}
                        className={STYLES.btnBack}
                    >
                        {MESSAGES.S50_BTN_BACK}
                    </Button>
                    <Button
                        variant="primary"
                        onClick={onConfirm}
                        loading={isSubmitting}
                        disabled={isSubmitting}
                        className={STYLES.btnConfirm}
                    >
                        <ShieldCheck size={24} />
                        {MESSAGES.S50_BTN_CONFIRM}
                    </Button>
                </div>
            </div>
        </div>
    );
}
