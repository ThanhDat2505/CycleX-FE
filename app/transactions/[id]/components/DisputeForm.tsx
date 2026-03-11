'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Textarea, LoadingSpinner } from '@/app/components/ui';
import { DisputeReason, CreateDisputeRequest } from '@/app/types/dispute';
import { getDisputeReasons, checkDisputeEligibility, createDispute, uploadDisputeEvidence, validateDisputeData } from '@/app/services/disputeServices';
import { useToast } from '@/app/contexts/ToastContext';

interface DisputeFormProps {
    orderId: number;
    buyerId: number;
    sellerId: number;
    orderStatus: string;
    completedAt: string;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function DisputeForm({
    orderId,
    buyerId,
    sellerId,
    orderStatus,
    completedAt,
    onSuccess,
    onCancel
}: DisputeFormProps) {
    const { addToast } = useToast();
    const [reasons, setReasons] = useState<DisputeReason[]>([]);
    const [isLoadingReasons, setIsLoadingReasons] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCheckingEligibility, setIsCheckingEligibility] = useState(true);
    const [eligibilityError, setEligibilityError] = useState<string | null>(null);

    // Form fields
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [reasonId, setReasonId] = useState<number>(0);
    const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    useEffect(() => {
        async function init() {
            try {
                // S70 Function: Kiểm tra đơn hàng đã được giao thành công, 24h, tồn tại, tần suất
                const eligibility = await checkDisputeEligibility(orderId, buyerId, orderStatus, completedAt);
                if (!eligibility.allowed) {
                    setEligibilityError(eligibility.reason || 'Bạn không thể khiếu nại đơn hàng này.');
                    return;
                }

                // S70 Function: Lấy danh sách dispute reasons
                const data = await getDisputeReasons();
                setReasons(data);
            } catch (error) {
                addToast('Không thể tải thông tin khiếu nại.', 'error');
            } finally {
                setIsLoadingReasons(false);
                setIsCheckingEligibility(false);
            }
        }
        init();
    }, [orderId, buyerId, orderStatus, completedAt, addToast]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        
        // S70 Function: Validate số lượng evidence (0-5 files)
        if (evidenceFiles.length + files.length > 5) {
            addToast('Bạn chỉ có thể tải lên tối đa 5 tệp bằng chứng.', 'warning');
            return;
        }

        // S70 Function: Validate định dạng evidence (jpg, jpeg, png)
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        const validFiles = files.filter(f => validTypes.includes(f.type));
        
        if (validFiles.length < files.length) {
            addToast('Một số tệp không đúng định dạng (chỉ nhận JPG, JPEG, PNG).', 'warning');
        }

        setEvidenceFiles(prev => [...prev, ...validFiles]);

        // Generate previews
        const newPreviews = validFiles.map(f => URL.createObjectURL(f));
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const removeFile = (index: number) => {
        setEvidenceFiles(prev => prev.filter((_, i) => i !== index));
        URL.revokeObjectURL(previews[index]);
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload: CreateDisputeRequest = {
            orderId,
            buyerId,
            sellerId,
            title,
            content,
            reasonId,
            evidenceUrls: [] // Will be updated after upload
        };

        // S-70 Function: Validate các field dispute (Sử dụng logic trung tâm từ service)
        const validation = validateDisputeData(payload, reasons);
        if (!validation.isValid) {
            addToast(validation.error || 'Vui lòng kiểm tra lại thông tin.', 'error');
            return;
        }

        try {
            setIsSubmitting(true);

            // S70 Function: Upload evidence files và Lưu vào hệ thống
            const evidenceUrls = await uploadDisputeEvidence(evidenceFiles, orderId);
            
            // Cập nhật payload với URLs
            payload.evidenceUrls = evidenceUrls;

            // S70 Function: Tạo dispute mới, Khởi tạo trạng thái (PENDING), Liên kết với order/buyer/seller
            await createDispute(payload);
            
            addToast('Gửi khiếu nại thành công. Chúng tôi sẽ xem xét và phản hồi sớm nhất.', 'success');
            onSuccess();
        } catch (error: any) {
            // Handle structured validation errors (400)
            if (error.errors) {
                const firstError = Object.values(error.errors)[0];
                if (Array.isArray(firstError)) {
                    addToast(firstError[0], 'error');
                } else {
                    addToast('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.', 'error');
                }
            } else {
                addToast(error.message || 'Có lỗi xảy ra khi gửi khiếu nại.', 'error');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isCheckingEligibility || isLoadingReasons) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-gray-100 border-t-brand-primary rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-brand-primary/10 rounded-full animate-pulse"></div>
                    </div>
                </div>
                <p className="mt-6 text-gray-500 font-bold tracking-wide animate-pulse uppercase text-xs">Đang kiểm tra dữ liệu...</p>
            </div>
        );
    }

    if (eligibilityError) {
        return (
            <div className="bg-red-50/50 border border-red-100 rounded-3xl p-8 text-center animate-scale-in">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h3 className="text-xl font-extrabold text-red-900 mb-2">Từ chối yêu cầu</h3>
                <p className="text-red-700/80 text-sm mb-8 max-w-xs mx-auto leading-relaxed">{eligibilityError}</p>
                <Button variant="outline" onClick={onCancel} className="bg-white border-red-200 text-red-700 hover:bg-red-50 px-8 rounded-xl font-bold transition-all">
                    Quay lại đơn hàng
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
            {/* Section 1: Information */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2">
                    <div className="w-8 h-8 bg-brand-primary/10 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-brand-primary" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest">Thông tin khiếu nại</h4>
                </div>

                <div className="grid grid-cols-1 gap-5 bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                    {/* Reason Selection */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
                            Lý do khiếu nại <span className="text-red-500">*</span>
                        </label>
                        <div className="relative group">
                            <select
                                value={reasonId}
                                onChange={(e) => setReasonId(Number(e.target.value))}
                                className="w-full h-12 pl-4 pr-10 rounded-xl border-gray-200 bg-white shadow-sm focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all cursor-pointer appearance-none text-sm font-medium text-gray-700"
                                required
                            >
                                <option value={0}>-- Chọn lý do phù hợp nhất --</option>
                                {reasons.map((r) => (
                                    <option key={r.reasonId} value={r.reasonId}>
                                        {r.title}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-brand-primary transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
                            Tiêu đề tóm tắt <span className="text-red-500">*</span>
                        </label>
                        <Input
                            id="dispute-title"
                            label=""
                            placeholder="VD: Xe thiếu phụ tùng so với tin đăng"
                            value={title}
                            onChange={setTitle}
                            className="bg-white"
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
                            Mô tả chi tiết nội dung <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                            placeholder="Mô tả cụ thể vấn đề bạn gặp phải để đội ngũ CycleX hỗ trợ tốt nhất (Tối đa 1000 ký tự)..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={4}
                            maxLength={1000}
                            className="bg-white rounded-xl border-gray-200 focus:ring-4 focus:ring-brand-primary/10 text-sm"
                            required
                        />
                        <div className="mt-1.5 flex justify-end">
                            <span className={`text-[10px] font-bold ${content.length > 900 ? 'text-red-500' : 'text-gray-400'}`}>
                                {content.length}/1000
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 2: Evidence */}
            <div className="space-y-4">
                <div className="flex items-center justify-between pb-2">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-primary/10 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-brand-primary" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest">Bằng chứng hình ảnh</h4>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{previews.length}/5 Ảnh</span>
                </div>
                
                <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                        {previews.map((url, index) => (
                            <div key={index} className="relative group aspect-square rounded-2xl overflow-hidden border-2 border-white shadow-sm hover:shadow-md transition-all">
                                <img src={url} alt="Evidence" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        className="bg-white/20 backdrop-blur-md hover:bg-red-500 text-white rounded-full p-2 transition-all transform hover:scale-110"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                        
                        {evidenceFiles.length < 5 && (
                            <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 hover:border-brand-primary hover:bg-brand-primary/5 transition-all flex flex-col items-center justify-center cursor-pointer group bg-white shadow-sm">
                                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                                    <svg className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <span className="text-[10px] mt-2 font-bold text-gray-400 group-hover:text-brand-primary uppercase tracking-tighter">Thêm ảnh</span>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/jpeg,image/jpg,image/png"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>
                    <p className="mt-4 text-[11px] text-gray-500 flex items-center gap-2 px-1">
                        <svg className="w-3.5 h-3.5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Tải ảnh rõ nét về tình trạng thực tế của xe để được xử lý nhanh hơn.
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100">
                <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1 rounded-2xl font-bold py-4 border-gray-200 text-gray-600 hover:bg-gray-50 order-2 sm:order-1" 
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Hủy bỏ
                </Button>
                <Button 
                    type="submit" 
                    variant="primary" 
                    className="flex-1 sm:flex-[2] bg-brand-primary hover:bg-brand-primary/90 text-white rounded-2xl font-black py-4 shadow-lg shadow-orange-100 ring-offset-2 active:scale-[0.98] transition-all order-1 sm:order-2 tracking-wide uppercase text-sm" 
                    loading={isSubmitting}
                >
                    {isSubmitting ? 'Đang xử lý...' : 'Xác nhận gửi khiếu nại'}
                </Button>
            </div>
            
            <div className="bg-orange-50/50 rounded-xl p-4 border border-orange-100 flex gap-3">
                <div className="text-brand-primary shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <p className="text-[11px] text-orange-800/80 leading-relaxed font-medium italic">
                    Lưu ý: Bạn chỉ có thể khiếu nại trong vòng 24h kể từ khi nhận xe. Đội ngũ CycleX sẽ kiểm tra đối chứng và phản hồi trong 1-3 ngày làm việc.
                </p>
            </div>
        </form>
    );
}
