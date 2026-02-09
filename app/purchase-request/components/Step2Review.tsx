import { PurchaseRequestForm } from '@/app/types/transaction';
import { ListingDetail } from '@/app/types/listing';
import { PLATFORM_FEE, INSPECTION_FEE, calculateTotal } from '../../constants/fees';
import { formatPrice } from '@/app/utils/format';
import { Button } from '@/app/components/ui';

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

    // Calculate total
    const totalAmount = calculateTotal(listing.price, formData.transactionType, formData.depositAmount);

    return (
        <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-slide-up">
            {/* Receipt Header */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white relative overflow-hidden">
                {/* The user provided an incomplete <style jsx> tag. I will assume it was meant to be a comment or a placeholder for future styling and will not include it as it would cause a syntax error. */}
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Xác nhận giao dịch
                </h2>
                <p className="text-blue-100 text-sm mt-1">
                    Vui lòng kiểm tra kỹ thông tin trước khi gửi yêu cầu.
                </p>
            </div>

            <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column: Product & Transaction Info */}
                    <div className="space-y-6">
                        {/* Transaction Info (Receipt style) */}
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <h3 className="font-bold text-gray-800 mb-3 border-b border-gray-200 pb-2">
                                Giao dịch
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Loại giao dịch:</span>
                                    <span className="font-bold text-blue-700 uppercase">
                                        {formData.transactionType === 'PURCHASE' ? 'Mua ngay (COD)' : 'Đặt cọc (COD)'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Ngày nhận xe:</span>
                                    <span className="font-medium text-gray-900">
                                        {new Date(formData.desiredTime).toLocaleDateString('vi-VN')}
                                    </span>
                                </div>
                                {formData.note && (
                                    <div className="pt-2 border-t border-gray-200 mt-2">
                                        <span className="block text-gray-500 text-xs mb-1">Ghi chú:</span>
                                        <p className="text-gray-800 italic bg-white p-2 rounded border border-gray-100">
                                            "{formData.note}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Listing Info */}
                        <div className="flex gap-4 items-start">
                            {listing.images && listing.images[0] ? (
                                <img
                                    src={listing.images[0]}
                                    alt={listing.title}
                                    className="w-24 h-24 object-cover rounded-lg border border-gray-200 shadow-sm flex-shrink-0"
                                />
                            ) : (
                                <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                    No Image
                                </div>
                            )}
                            <div>
                                <h4 className="font-bold text-gray-900 line-clamp-2">{listing.title}</h4>
                                <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {listing.locationCity}
                                </div>
                                <p className="text-blue-600 font-bold mt-2">
                                    {formatPrice(listing.price)}
                                </p>
                            </div>
                        </div>

                        {/* Seller Info */}
                        <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-white shadow-sm">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                                {listing.sellerName?.[0]?.toUpperCase() || 'S'}
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Người bán</p>
                                <p className="font-medium text-gray-900">{listing.sellerName || 'Người bán'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Receiver & Fees */}
                    <div className="space-y-6">
                        {/* Receiver Info */}
                        <div>
                            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Thông tin người nhận
                            </h3>
                            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-2">
                                <p className="flex justify-between">
                                    <span className="text-gray-500">Họ tên:</span>
                                    <span className="font-medium text-gray-900">{formData.receiverName}</span>
                                </p>
                                <p className="flex justify-between">
                                    <span className="text-gray-500">Số điện thoại:</span>
                                    <span className="font-medium text-gray-900 font-mono tracking-wide">{formData.receiverPhone}</span>
                                </p>
                                <p className="pt-2 border-t border-blue-100 mt-2">
                                    <span className="block text-gray-500 text-xs mb-1">Địa chỉ:</span>
                                    <span className="font-medium text-gray-900 text-sm block leading-relaxed">
                                        {formData.receiverAddress}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Fee Breakdown (Receipt) */}
                        <div>
                            <h3 className="font-bold text-gray-800 mb-3">Chi tiết thanh toán</h3>
                            <div className="bg-white border-2 border-gray-100 rounded-xl p-4 shadow-sm">
                                <div className="space-y-3 mb-4">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Giá trị đơn hàng (tạm tính)</span>
                                        <span className="font-medium">
                                            {formData.transactionType === 'PURCHASE'
                                                ? formatPrice(listing.price)
                                                : formatPrice(formData.depositAmount || 0)
                                            }
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Phí dịch vụ</span>
                                        <span className="font-medium">{formatPrice(PLATFORM_FEE)}</span>
                                    </div>
                                    {formData.transactionType === 'PURCHASE' && (
                                        <div className="flex justify-between text-gray-600">
                                            <span>Phí kiểm định xe</span>
                                            <span className="font-medium">{formatPrice(INSPECTION_FEE)}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="border-t-2 border-dashed border-gray-200 pt-3 flex justify-between items-center">
                                    <span className="font-bold text-gray-900">Tổng thanh toán</span>
                                    <span className="text-xl font-bold text-blue-600">
                                        {formatPrice(totalAmount)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="mt-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center gap-2 animate-pulse">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                {/* Terms */}
                <p className="text-xs text-gray-500 mt-8 text-center max-w-2xl mx-auto">
                    Bằng việc xác nhận, bạn đồng ý với <a href="#" className="text-blue-600 hover:underline">Điều khoản dịch vụ</a> và <a href="#" className="text-blue-600 hover:underline">Chính sách bảo mật</a> của CycleX.
                    Yêu cầu sẽ được gửi đến người bán và cần được xác nhận trong vòng 24h.
                </p>

                {/* Actions */}
                <div className="flex justify-between gap-4 mt-8 pt-6 border-t border-gray-100">
                    <Button
                        variant="secondary"
                        onClick={onBack}
                        disabled={isSubmitting}
                        className="!w-auto px-8"
                    >
                        Quay lại
                    </Button>
                    <Button
                        variant="primary"
                        onClick={onConfirm}
                        loading={isSubmitting}
                        disabled={isSubmitting}
                        className="!w-auto px-10 bg-blue-600 hover:bg-blue-700 text-lg shadow-lg shadow-blue-200"
                    >
                        Xác nhận đặt mua
                    </Button>
                </div>
            </div>
        </div>
    );
}
