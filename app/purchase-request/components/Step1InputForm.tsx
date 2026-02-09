import { PurchaseRequestForm } from '@/app/types/transaction';
import { Input, Textarea, Button } from '@/app/components/ui';

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

    // Handle field changes
    const handleChange = (field: keyof PurchaseRequestForm, value: any) => {
        onFormDataChange({
            ...formData,
            [field]: value,
        });
    };

    // Handle transaction type change
    const handleTypeChange = (type: 'PURCHASE' | 'DEPOSIT') => {
        onFormDataChange({
            ...formData,
            transactionType: type,
            // Reset deposit amount if switching to PURCHASE
            depositAmount: type === 'PURCHASE' ? undefined : formData.depositAmount,
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="w-1 h-8 bg-blue-600 rounded-full"></span>
                Thông tin yêu cầu
            </h2>

            {/* Payment Method */}
            <div className="mb-8">
                <label className="block text-gray-700 font-semibold mb-4">
                    Phương thức thanh toán <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Option 1: Purchase (COD Full) */}
                    <div
                        onClick={() => handleTypeChange('PURCHASE')}
                        className={`
                            relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ease-in-out group
                            ${formData.transactionType === 'PURCHASE'
                                ? 'border-blue-500 bg-blue-50/50 shadow-md ring-1 ring-blue-500 scale-[1.02]'
                                : 'border-gray-200 hover:border-blue-300 hover:bg-white hover:shadow-card-hover hover:-translate-y-1'
                            }
                        `}
                    >
                        {formData.transactionType === 'PURCHASE' && (
                            <div className="absolute top-2 right-2 text-blue-600 animate-scale-in">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        )}
                        <div className="flex items-start gap-3">
                            <div className={`
                                w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300
                                ${formData.transactionType === 'PURCHASE' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500'}
                            `}>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className={`font-bold transition-colors duration-300 ${formData.transactionType === 'PURCHASE' ? 'text-blue-700' : 'text-gray-800'}`}>
                                    Thanh toán toàn bộ (COD)
                                </h3>
                                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                                    Thanh toán 100% giá trị đơn hàng cho người bán khi nhận xe.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Option 2: Deposit */}
                    <div
                        onClick={() => handleTypeChange('DEPOSIT')}
                        className={`
                            relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ease-in-out group
                            ${formData.transactionType === 'DEPOSIT'
                                ? 'border-blue-500 bg-blue-50/50 shadow-md ring-1 ring-blue-500 scale-[1.02]'
                                : 'border-gray-200 hover:border-blue-300 hover:bg-white hover:shadow-card-hover hover:-translate-y-1'
                            }
                        `}
                    >
                        {formData.transactionType === 'DEPOSIT' && (
                            <div className="absolute top-2 right-2 text-blue-600 animate-scale-in">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        )}
                        <div className="flex items-start gap-3">
                            <div className={`
                                w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300
                                ${formData.transactionType === 'DEPOSIT' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500'}
                            `}>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className={`font-bold transition-colors duration-300 ${formData.transactionType === 'DEPOSIT' ? 'text-blue-700' : 'text-gray-800'}`}>
                                    Đặt cọc giữ chỗ (COD)
                                </h3>
                                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                                    Đặt cọc một phần tiền để giữ xe. Phần còn lại thanh toán khi nhận xe.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Option 3: Online Payment (Disabled) */}
                <div className="mt-4 p-4 border border-gray-100 rounded-xl bg-gray-50 opacity-60">
                    <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full border-2 border-gray-200 mt-0.5"></div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-500">Thanh toán Online (Thẻ/Ví điện tử)</span>
                                <span className="text-[10px] uppercase font-bold tracking-wider bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">Coming Soon</span>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">
                                Tính năng đang được phát triển.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Deposit Amount & Date Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Deposit Amount (conditional) */}
                {formData.transactionType === 'DEPOSIT' && (
                    <div className="animate-fade-in">
                        <Input
                            label="Số tiền đặt cọc (VND)"
                            id="depositAmount"
                            type="number"
                            value={formData.depositAmount?.toString() || ''}
                            onChange={(val) => handleChange('depositAmount', Number(val))}
                            placeholder="Ví dụ: 500000"
                            error={errors.depositAmount}
                            min={0}
                            step={100000}
                        />
                        {!errors.depositAmount && (
                            <p className="text-xs text-blue-600 mt-1 pl-1">
                                * Tối thiểu 100,000 VND
                            </p>
                        )}
                    </div>
                )}

                {/* Desired Date */}
                <div className={formData.transactionType === 'DEPOSIT' ? '' : 'md:col-span-2'}>
                    <Input
                        label="Ngày nhận xe dự kiến"
                        id="desiredTime"
                        type="date"
                        value={formData.desiredTime}
                        onChange={(val) => handleChange('desiredTime', val)}
                        error={errors.desiredTime}
                        min={new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    />
                    {!errors.desiredTime && (
                        <p className="text-xs text-gray-500 mt-1 pl-1">
                            * Vui lòng đặt lịch trước ít nhất 3 ngày
                        </p>
                    )}
                </div>
            </div>

            {/* Shipping Info */}
            <div className="mb-8 p-6 bg-blue-50/50 rounded-xl border border-blue-100">
                <h3 className="text-lg font-bold text-blue-900 mb-6 flex items-center gap-2">
                    <span className="bg-blue-100 p-2 rounded-lg text-blue-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </span>
                    Thông tin nhận hàng
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <Input
                        label="Họ tên người nhận"
                        id="receiverName"
                        value={formData.receiverName}
                        onChange={(val) => handleChange('receiverName', val)}
                        placeholder="Nhập họ tên"
                        error={errors.receiverName}
                    />

                    <Input
                        label="Số điện thoại liên hệ"
                        id="receiverPhone"
                        type="tel"
                        value={formData.receiverPhone}
                        onChange={(val) => handleChange('receiverPhone', val)}
                        placeholder="Ví dụ: 0912345678"
                        maxLength={10}
                        error={errors.receiverPhone}
                    />
                </div>

                <Textarea
                    label="Địa chỉ nhận hàng chi tiết"
                    id="receiverAddress"
                    value={formData.receiverAddress}
                    onChange={(e) => handleChange('receiverAddress', e.target.value)}
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                    rows={3}
                    error={errors.receiverAddress}
                />
            </div>

            {/* Note */}
            <div className="mb-8">
                <Textarea
                    label="Ghi chú (Tùy chọn)"
                    id="note"
                    value={formData.note || ''}
                    onChange={(e) => handleChange('note', e.target.value)}
                    placeholder="Nhập ghi chú cho người bán..."
                    rows={4}
                    maxLength={500}
                />
                <div className="flex justify-end mt-1">
                    <span className="text-xs text-gray-400">
                        {formData.note?.length || 0}/500
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                <Button
                    variant="secondary"
                    onClick={onCancel}
                    className="!w-auto px-8"
                >
                    Hủy bỏ
                </Button>
                <Button
                    variant="primary"
                    onClick={onNext}
                    className="!w-auto px-8 bg-blue-600 hover:bg-blue-700"
                >
                    Tiếp theo
                </Button>
            </div>
        </div>
    );
}

