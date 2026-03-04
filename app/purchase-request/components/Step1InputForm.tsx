/**
 * Step1InputForm Component
 * S-50 Step 1: Input purchase request details
 * - Payment method selection (PURCHASE / DEPOSIT)
 * - Deposit amount (conditional)
 * - Desired delivery date
 * - Receiver info (name, phone, address)
 * - Optional note
 */

'use client';

import { useCallback } from 'react';
import { Banknote, Coins, Check, MapPin } from 'lucide-react';
import { PurchaseRequestForm } from '@/app/types/transaction';
import { TransactionType } from '@/app/types/transaction';
import { Input, Textarea, Button } from '@/app/components/ui';
import { MESSAGES } from '@/app/constants';
import { MIN_DAYS_AHEAD } from '@/app/constants/fees';

/** Style constants */
const STYLES = {
    card: 'bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 sm:p-10 animate-fade-in',
    sectionTitle: 'text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3',
    titleBar: 'w-1.5 h-10 bg-brand-primary rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]',
    paymentGrid: 'grid grid-cols-1 md:grid-cols-2 gap-6',
    paymentOption: (isSelected: boolean) => `
        relative p-6 border-2 rounded-2xl cursor-pointer transition-all duration-400 ease-out group overflow-hidden
        ${isSelected
            ? 'border-brand-primary bg-blue-50/50 shadow-lg ring-1 ring-brand-primary scale-[1.03]'
            : 'border-gray-100 bg-gray-50/30 hover:border-blue-200 hover:bg-white hover:shadow-xl hover:-translate-y-1.5'
        }
    `,
    paymentIcon: (isSelected: boolean) => `
        w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500
        ${isSelected
            ? 'bg-brand-primary text-white shadow-lg rotate-3 scale-110'
            : 'bg-white text-gray-400 shadow-sm group-hover:bg-blue-50 group-hover:text-brand-primary group-hover:rotate-0'
        }
    `,
    paymentTitle: (isSelected: boolean) => `text-lg font-bold transition-colors duration-300 ${isSelected ? 'text-blue-900' : 'text-gray-800'}`,
    paymentDesc: 'text-sm text-gray-500 mt-2 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity',
    checkIcon: 'absolute top-3 right-3 text-brand-primary animate-scale-in bg-white rounded-full p-0.5 shadow-sm',
    disabledOption: 'mt-6 p-5 border border-gray-100 rounded-2xl bg-gray-50/50 opacity-60 flex items-center justify-between',
    disabledCircle: 'w-6 h-6 rounded-full border-2 border-gray-200 mt-0.5',
    comingSoonBadge: 'text-[10px] uppercase font-bold tracking-wider bg-gray-200 text-gray-600 px-3 py-1 rounded-full',
    receiverSection: 'mb-10 p-8 bg-gradient-to-br from-blue-50/50 to-white rounded-2xl border border-blue-100/50 shadow-inner-sm',
    receiverTitle: 'text-xl font-bold text-blue-900 mb-8 flex items-center gap-3',
    receiverIcon: 'bg-blue-600 p-2.5 rounded-xl text-white shadow-md shadow-blue-200',
    fieldGrid: 'grid grid-cols-1 md:grid-cols-2 gap-8',
    hint: 'text-xs text-gray-500 mt-2 pl-1 font-medium italic opacity-70',
    hintBlue: 'text-xs text-brand-primary mt-2 pl-1 font-semibold flex items-center gap-1 before:content-[\"●\"] before:text-[8px]',
    noteCounter: 'flex justify-end mt-2',
    noteCounterText: 'text-xs font-mono text-gray-400',
    actions: 'flex justify-end gap-6 pt-8 border-t border-gray-100/80',
    btnAuto: '!w-auto px-10 py-3 text-base font-semibold transition-all duration-300',
    btnPrimary: '!w-auto px-12 py-3 text-base font-bold bg-brand-primary hover:bg-brand-primary-hover shadow-lg shadow-blue-100 hover:shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300',
} as const;

/** Calculate min date for date input */
function getMinDateString(): string {
    return new Date(Date.now() + MIN_DAYS_AHEAD * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
}

interface Step1InputFormProps {
    formData: PurchaseRequestForm;
    errors: Partial<Record<keyof PurchaseRequestForm, string>>;
    onFormDataChange: (data: PurchaseRequestForm) => void;
    onNext: () => void;
    onCancel: () => void;
}

export default function Step1InputForm({
    formData,
    errors,
    onFormDataChange,
    onNext,
    onCancel,
}: Step1InputFormProps) {

    // Handle field changes — typed union instead of `any`
    const handleChange = useCallback((field: keyof PurchaseRequestForm, value: string | number | undefined) => {
        onFormDataChange({
            ...formData,
            [field]: value,
        });
    }, [formData, onFormDataChange]);

    // Handle transaction type toggle
    const handleTypeChange = useCallback((type: TransactionType) => {
        onFormDataChange({
            ...formData,
            transactionType: type,
            depositAmount: type === 'PURCHASE' ? undefined : formData.depositAmount,
        });
    }, [formData, onFormDataChange]);

    return (
        <div className={STYLES.card}>
            <h2 className={STYLES.sectionTitle}>
                <span className={STYLES.titleBar}></span>
                {MESSAGES.S50_STEP1_TITLE}
            </h2>

            {/* Payment Method */}
            <div className="mb-8">
                <label className="block text-gray-700 font-semibold mb-4">
                    {MESSAGES.S50_PAYMENT_METHOD_LABEL} <span className="text-red-500">*</span>
                </label>
                <div className={STYLES.paymentGrid}>
                    {/* Option 1: Purchase (COD Full) */}
                    <div
                        onClick={() => handleTypeChange('PURCHASE')}
                        className={STYLES.paymentOption(formData.transactionType === 'PURCHASE')}
                    >
                        {formData.transactionType === 'PURCHASE' && (
                            <div className={STYLES.checkIcon}>
                                <Check size={20} />
                            </div>
                        )}
                        <div className="flex items-start gap-3">
                            <div className={STYLES.paymentIcon(formData.transactionType === 'PURCHASE')}>
                                <Banknote size={24} />
                            </div>
                            <div>
                                <h3 className={STYLES.paymentTitle(formData.transactionType === 'PURCHASE')}>
                                    {MESSAGES.S50_PAYMENT_PURCHASE_TITLE}
                                </h3>
                                <p className={STYLES.paymentDesc}>
                                    {MESSAGES.S50_PAYMENT_PURCHASE_DESC}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Option 2: Deposit */}
                    <div
                        onClick={() => handleTypeChange('DEPOSIT')}
                        className={STYLES.paymentOption(formData.transactionType === 'DEPOSIT')}
                    >
                        {formData.transactionType === 'DEPOSIT' && (
                            <div className={STYLES.checkIcon}>
                                <Check size={20} />
                            </div>
                        )}
                        <div className="flex items-start gap-3">
                            <div className={STYLES.paymentIcon(formData.transactionType === 'DEPOSIT')}>
                                <Coins size={24} />
                            </div>
                            <div>
                                <h3 className={STYLES.paymentTitle(formData.transactionType === 'DEPOSIT')}>
                                    {MESSAGES.S50_PAYMENT_DEPOSIT_TITLE}
                                </h3>
                                <p className={STYLES.paymentDesc}>
                                    {MESSAGES.S50_PAYMENT_DEPOSIT_DESC}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Option 2: Deposit
                <div className={STYLES.disabledOption}>
                    <div className="flex items-start gap-3">
                        <div className={STYLES.disabledCircle}></div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-500">{MESSAGES.S50_PAYMENT_DEPOSIT_TITLE}</span>
                                <span className={STYLES.comingSoonBadge}>{MESSAGES.S50_PAYMENT_ONLINE_SOON}</span>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">
                                {MESSAGES.S50_PAYMENT_DEPOSIT_DESC}
                            </p>
                        </div>
                    </div>
                </div> */}


                {/* Option 3: Online Payment (Disabled) */}
                <div className={STYLES.disabledOption}>
                    <div className="flex items-start gap-3">
                        <div className={STYLES.disabledCircle}></div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-500">{MESSAGES.S50_PAYMENT_ONLINE_TITLE}</span>
                                <span className={STYLES.comingSoonBadge}>{MESSAGES.S50_PAYMENT_ONLINE_SOON}</span>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">
                                {MESSAGES.S50_PAYMENT_ONLINE_DESC}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Deposit Amount & Date Section */}
            <div className={`${STYLES.fieldGrid} mb-8`}>
                {/* Deposit Amount (conditional) */}
                {formData.transactionType === 'DEPOSIT' && (
                    <div className="animate-fade-in">
                        <Input
                            label={MESSAGES.S50_DEPOSIT_LABEL}
                            id="depositAmount"
                            type="number"
                            value={formData.depositAmount?.toString() || ''}
                            onChange={(val) => handleChange('depositAmount', Number(val))}
                            placeholder={MESSAGES.S50_DEPOSIT_PLACEHOLDER}
                            error={errors.depositAmount}
                            min={0}
                            step={100000}
                        />
                        {!errors.depositAmount && (
                            <p className={STYLES.hintBlue}>
                                {MESSAGES.S50_DEPOSIT_MIN_HINT}
                            </p>
                        )}
                    </div>
                )}

                {/* Desired Date */}
                <div className={formData.transactionType === 'DEPOSIT' ? '' : 'md:col-span-2'}>
                    <Input
                        label={MESSAGES.S50_DATE_LABEL}
                        id="desiredTime"
                        type="date"
                        value={formData.desiredTime}
                        onChange={(val) => handleChange('desiredTime', val)}
                        error={errors.desiredTime}
                        min={getMinDateString()}
                    />
                    {!errors.desiredTime && (
                        <p className={STYLES.hint}>
                            {MESSAGES.S50_DATE_MIN_HINT}
                        </p>
                    )}
                </div>
            </div>

            {/* Shipping Info */}
            <div className={STYLES.receiverSection}>
                <h3 className={STYLES.receiverTitle}>
                    <span className={STYLES.receiverIcon}>
                        <MapPin size={20} />
                    </span>
                    {MESSAGES.S50_RECEIVER_SECTION_TITLE}
                </h3>

                <div className={`${STYLES.fieldGrid} mb-6`}>
                    <Input
                        label={MESSAGES.S50_RECEIVER_NAME_LABEL}
                        id="receiverName"
                        value={formData.receiverName}
                        onChange={(val) => handleChange('receiverName', val)}
                        placeholder={MESSAGES.S50_RECEIVER_NAME_PLACEHOLDER}
                        error={errors.receiverName}
                    />

                    <Input
                        label={MESSAGES.S50_RECEIVER_PHONE_LABEL}
                        id="receiverPhone"
                        type="tel"
                        value={formData.receiverPhone}
                        onChange={(val) => handleChange('receiverPhone', val)}
                        placeholder={MESSAGES.S50_RECEIVER_PHONE_PLACEHOLDER}
                        maxLength={MESSAGES.S50_PHONE_MAX_LENGTH}
                        error={errors.receiverPhone}
                    />
                </div>

                <Textarea
                    label={MESSAGES.S50_RECEIVER_ADDRESS_LABEL}
                    id="receiverAddress"
                    value={formData.receiverAddress}
                    onChange={(e) => handleChange('receiverAddress', e.target.value)}
                    placeholder={MESSAGES.S50_RECEIVER_ADDRESS_PLACEHOLDER}
                    rows={3}
                    error={errors.receiverAddress}
                />
            </div>

            {/* Note */}
            <div className="mb-8">
                <Textarea
                    label={MESSAGES.S50_NOTE_LABEL}
                    id="note"
                    value={formData.note || ''}
                    onChange={(e) => handleChange('note', e.target.value)}
                    placeholder={MESSAGES.S50_NOTE_PLACEHOLDER}
                    rows={4}
                    maxLength={MESSAGES.S50_NOTE_MAX_LENGTH}
                />
                <div className={STYLES.noteCounter}>
                    <span className={STYLES.noteCounterText}>
                        {formData.note?.length || 0}/{MESSAGES.S50_NOTE_MAX_LENGTH}
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div className={STYLES.actions}>
                <Button variant="secondary" onClick={onCancel} className={STYLES.btnAuto}>
                    {MESSAGES.S50_BTN_CANCEL}
                </Button>
                <Button variant="primary" onClick={onNext} className={STYLES.btnPrimary}>
                    {MESSAGES.S50_BTN_NEXT}
                </Button>
            </div>
        </div>
    );
}
