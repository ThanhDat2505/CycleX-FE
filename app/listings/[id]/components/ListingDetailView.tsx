'use client';

import Link from 'next/link';
import { Eye, MapPin, ChevronRight, Home, Bike, Tag, ShieldCheck, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { ListingDetail } from '../../../types/listing';
import { MESSAGES } from '../../../constants';
import { formatPrice, formatNumber } from '../../../utils/format';
import ImageGallery from './ImageGallery';

interface ListingDetailViewProps {
    listing: ListingDetail;
    userRole?: string;
}

/** Style constants */
const STYLES = {
    wrapper: 'space-y-8 animate-fade-in',
    // Breadcrumbs
    breadcrumb: 'flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap',
    breadcrumbLink: 'hover:text-brand-primary transition-colors flex items-center gap-1',
    breadcrumbCurrent: 'text-gray-900 font-medium truncate max-w-[200px]',
    // Main Content
    grid: 'grid grid-cols-1 lg:grid-cols-2 gap-10',
    infoSection: 'space-y-8',
    title: 'text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight',
    price: 'text-4xl font-extrabold text-brand-primary',
    metaRow: 'flex flex-wrap gap-4 items-center',
    badgeNew: 'px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-green-100 text-green-700 border border-green-200',
    badgeUsed: 'px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-200',
    badgeType: 'px-4 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-xs font-bold uppercase tracking-wider',
    metaItem: 'flex items-center gap-1.5 text-gray-500 text-sm font-medium',
    // Spec Grid
    specSection: 'border-t border-gray-100 pt-8',
    specTitle: 'text-lg font-bold text-gray-900 mb-6 flex items-center gap-2',
    specGrid: 'grid grid-cols-2 sm:grid-cols-3 gap-4',
    specCard: 'bg-gray-50/50 border border-gray-100 p-4 rounded-2xl flex flex-col items-center text-center gap-2 hover:bg-white hover:shadow-sm transition-all duration-300 group',
    specIcon: 'p-2 bg-white rounded-xl text-brand-primary shadow-sm group-hover:scale-110 transition-transform',
    specLabel: 'text-[10px] uppercase tracking-widest text-gray-400 font-bold',
    specValue: 'text-sm font-bold text-gray-900',
    // CTA
    ctaSection: 'border-t border-gray-100 pt-8 hidden lg:block',
    ctaButton: 'block w-full px-8 py-5 bg-brand-primary text-white text-center font-bold rounded-2xl hover:bg-brand-primary-hover transition-all shadow-xl shadow-brand-primary/20 active:scale-[0.98]',
    ctaHint: 'text-sm text-gray-400 text-center mt-3 font-medium',
    // Mobile Sticky CTA
    mobileStickyCta: 'lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 z-40 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]',
    mobileCtaButton: 'w-full py-4 bg-brand-primary text-white text-center font-bold rounded-xl active:scale-[0.98] transition-transform shadow-lg shadow-brand-primary/20',
    // Description
    descSection: 'border-t border-gray-100 pt-10',
    descTitle: 'text-2xl font-bold text-gray-900 mb-6',
    descContent: 'prose prose-blue max-w-none text-gray-600 leading-relaxed bg-gray-50/30 p-8 rounded-3xl border border-gray-100',
    descText: 'whitespace-pre-wrap',
    descEmpty: 'text-gray-400 italic py-4',
    // Inspection (Verified Style)
    inspectionSection: 'border-t border-gray-100 pt-10',
    inspectionTitle: 'text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2',
    inspectionCard: 'relative overflow-hidden bg-gradient-to-br from-green-50 to-white border-2 border-green-100 rounded-3xl p-8 shadow-sm',
    inspectionStamp: 'absolute -right-6 -top-6 text-green-100 opacity-50 rotate-12',
    inspectionBadge: 'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-green-600 text-white shadow-lg shadow-green-600/20 mb-6',
    inspectionGrid: 'grid grid-cols-1 md:grid-cols-2 gap-8',
    inspectionItem: 'flex items-start gap-4',
    inspectionItemIcon: 'p-3 bg-white rounded-2xl text-green-600 shadow-sm border border-green-50',
    inspectionItemLabel: 'text-xs font-bold text-gray-400 uppercase tracking-widest mb-1',
    inspectionItemValue: 'text-gray-900 font-bold',
    inspectionBadgeFailed: 'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-red-600 text-white shadow-lg shadow-red-600/20 mb-6',
    inspectionBadgeOther: 'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-amber-500 text-white shadow-lg shadow-amber-500/20 mb-6',
    inspectionNoteValue: 'text-gray-900 flex-1 font-medium leading-relaxed',
    // Seller Coming Soon
    sellerSection: 'border-t border-gray-100 pt-10 pb-20',
    sellerCard: 'bg-brand-bg rounded-3xl p-8 text-center border-2 border-brand-primary/5',
    sellerTitle: 'text-xl font-bold text-white mb-3',
    sellerDesc: 'text-white/70 text-sm max-w-md mx-auto leading-relaxed',
} as const;

/** Helper for inspection badge style */
function getInspectionStatusStyles(status: string) {
    if (status === 'PASSED') return { badge: STYLES.inspectionBadge, icon: <CheckCircle2 size={16} /> };
    if (status === 'FAILED') return { badge: STYLES.inspectionBadgeFailed, icon: <CheckCircle2 size={16} /> };
    return { badge: STYLES.inspectionBadgeOther, icon: <CheckCircle2 size={16} /> };
}

export default function ListingDetailView({ listing, userRole }: ListingDetailViewProps) {
    const hasInspection = listing.inspectionStatus || listing.inspectionDate || listing.inspectionNotes;
    const inspectionStyles = getInspectionStatusStyles(listing.inspectionStatus || '');
    const isSeller = userRole === 'SELLER';

    return (
        <div className={STYLES.wrapper}>
            {/* Breadcrumbs */}
            <nav className={STYLES.breadcrumb}>
                <Link href="/" className={STYLES.breadcrumbLink}>
                    <Home size={14} />
                    {MESSAGES.BREADCRUMB_HOME}
                </Link>
                <ChevronRight size={14} />
                <Link href="/listings" className={STYLES.breadcrumbLink}>
                    {MESSAGES.BREADCRUMB_LISTINGS}
                </Link>
                <ChevronRight size={14} />
                <span className={STYLES.breadcrumbCurrent}>{listing.title}</span>
            </nav>

            {/* Main Grid: Image + Info */}
            <div className={STYLES.grid}>
                {/* Left: Image Gallery */}
                <div className="animate-slide-up">
                    <ImageGallery images={listing.images} alt={listing.title} />
                </div>

                {/* Right: Basic Info */}
                <div className={`${STYLES.infoSection} animate-slide-up`} style={{ animationDelay: '100ms' }}>
                    <div className="space-y-4">
                        <h1 className={STYLES.title}>{listing.title}</h1>
                        <div className={STYLES.price}>{formatPrice(listing.price)}</div>

                        <div className={STYLES.metaRow}>
                            {listing.condition && (
                                <span className={listing.condition === 'new' ? STYLES.badgeNew : STYLES.badgeUsed}>
                                    {listing.condition === 'new'
                                        ? MESSAGES.DETAIL_CONDITION_NEW
                                        : MESSAGES.DETAIL_CONDITION_USED}
                                </span>
                            )}

                            {listing.bikeType && (
                                <span className={STYLES.badgeType}>{listing.bikeType}</span>
                            )}

                            <div className={STYLES.metaItem}>
                                <Eye size={16} />
                                <span>{formatNumber(listing.viewsCount)} {MESSAGES.DETAIL_VIEWS}</span>
                            </div>

                            {listing.locationCity && (
                                <div className={STYLES.metaItem}>
                                    <MapPin size={16} />
                                    <span>{listing.locationCity}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Specifications Grid */}
                    <div className={STYLES.specSection}>
                        <h2 className={STYLES.specTitle}>
                            <Tag size={20} className="text-brand-primary" />
                            {MESSAGES.DETAIL_SPECIFICATIONS_TITLE}
                        </h2>
                        <div className={STYLES.specGrid}>
                            <div className={STYLES.specCard}>
                                <div className={STYLES.specIcon}><ShieldCheck size={20} /></div>
                                <span className={STYLES.specLabel}>{MESSAGES.DETAIL_SPEC_BRAND}</span>
                                <span className={STYLES.specValue}>{listing.brand}</span>
                            </div>

                            {listing.model && (
                                <div className={STYLES.specCard}>
                                    <div className={STYLES.specIcon}><Bike size={20} /></div>
                                    <span className={STYLES.specLabel}>{MESSAGES.DETAIL_SPEC_MODEL}</span>
                                    <span className={STYLES.specValue}>{listing.model}</span>
                                </div>
                            )}

                            <div className={STYLES.specCard}>
                                <div className={STYLES.specIcon}><FileText size={20} /></div>
                                <span className={STYLES.specLabel}>{MESSAGES.DETAIL_SPEC_CONDITION}</span>
                                <span className={STYLES.specValue}>
                                    {listing.condition === 'new'
                                        ? MESSAGES.DETAIL_CONDITION_NEW
                                        : MESSAGES.DETAIL_CONDITION_USED}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Purchase Button - Desktop (NOT for SELLER) */}
                    {!isSeller && (
                        <div className={STYLES.ctaSection}>
                            <Link
                                href={`/purchase-request?listingId=${listing.listingId}`}
                                className={STYLES.ctaButton}
                            >
                                {MESSAGES.DETAIL_PURCHASE_BUTTON}
                            </Link>
                            {/* <p className={STYLES.ctaHint}>
                                {MESSAGES.DETAIL_PURCHASE_HINT}
                            </p> */}
                        </div>
                    )}
                </div>
            </div>

            {/* Sticky Mobile CTA (NOT for SELLER) */}
            {!isSeller && (
                <div className={STYLES.mobileStickyCta}>
                    <Link
                        href={`/purchase-request?listingId=${listing.listingId}`}
                        className={STYLES.mobileCtaButton}
                    >
                        {MESSAGES.DETAIL_PURCHASE_BUTTON} - {formatPrice(listing.price)}
                    </Link>
                </div>
            )}

            {/* Description Section */}
            <div className={`${STYLES.descSection} animate-slide-up`} style={{ animationDelay: '200ms' }}>
                <h2 className={STYLES.descTitle}>{MESSAGES.DETAIL_DESCRIPTION_TITLE}</h2>
                <div className={STYLES.descContent}>
                    {listing.description ? (
                        <p className={STYLES.descText}>{listing.description}</p>
                    ) : (
                        <p className={STYLES.descEmpty}>{MESSAGES.DETAIL_NO_DESCRIPTION}</p>
                    )}
                </div>
            </div>

            {/* Inspection Section (BR-S32-03) - Redesigned Verified Style */}
            {hasInspection && (
                <div className={`${STYLES.inspectionSection} animate-slide-up`} style={{ animationDelay: '300ms' }}>
                    <h2 className={STYLES.inspectionTitle}>
                        <ShieldCheck size={24} className="text-green-600" />
                        {MESSAGES.DETAIL_INSPECTION_TITLE}
                    </h2>

                    <div className={STYLES.inspectionCard}>
                        <div className={STYLES.inspectionStamp}>
                            <ShieldCheck size={160} />
                        </div>

                        {listing.inspectionStatus && (
                            <div className={inspectionStyles.badge}>
                                {inspectionStyles.icon}
                                <span>CycleX Verified: {listing.inspectionStatus}</span>
                            </div>
                        )}

                        <div className={STYLES.inspectionGrid}>
                            {listing.inspectionDate && (
                                <div className={STYLES.inspectionItem}>
                                    <div className={STYLES.inspectionItemIcon}><Calendar size={24} /></div>
                                    <div>
                                        <div className={STYLES.inspectionItemLabel}>{MESSAGES.DETAIL_INSPECTION_DATE}</div>
                                        <div className={STYLES.inspectionItemValue}>
                                            {new Date(listing.inspectionDate).toLocaleDateString('vi-VN', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {listing.inspectionNotes && (
                                <div className={STYLES.inspectionItem}>
                                    <div className={STYLES.inspectionItemIcon}><FileText size={24} /></div>
                                    <div className="flex-1">
                                        <div className={STYLES.inspectionItemLabel}>{MESSAGES.DETAIL_INSPECTION_NOTES}</div>
                                        <div className={STYLES.inspectionNoteValue}>{listing.inspectionNotes}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Seller Info Placeholder */}
            <div className={`${STYLES.sellerSection} animate-slide-up`} style={{ animationDelay: '400ms' }}>
                <div className={STYLES.sellerCard}>
                    <h3 className={STYLES.sellerTitle}>{MESSAGES.DETAIL_SELLER_INFO_COMING_SOON}</h3>
                    <p className={STYLES.sellerDesc}>{MESSAGES.DETAIL_SELLER_INFO_DESC}</p>
                </div>
            </div>
        </div>
    );
}
