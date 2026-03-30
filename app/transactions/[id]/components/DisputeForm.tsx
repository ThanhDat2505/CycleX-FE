"use client";

import { useState, useEffect } from "react";
import { Button, Input, Textarea, LoadingSpinner } from "@/app/components/ui";
import { DisputeReason, CreateDisputeRequest } from "@/app/types/dispute";
import {
  getDisputeReasons,
  checkDisputeEligibility,
  createDispute,
  uploadDisputeEvidence,
  validateDisputeData,
} from "@/app/services/buyerDisputeService";
import { useToast } from "@/app/contexts/ToastContext";
import {
  AlertTriangle,
  Camera,
  FileText,
  Send,
  X,
  CheckCircle,
  Info,
  ShieldAlert,
  Zap,
  RefreshCw,
  Tag,
} from '@/app/components/ui/Icons';

interface DisputeFormProps {
  orderId: number;
  buyerId: number;
  sellerId: number;
  sellerName?: string;
  deliveryDate?: string;
  orderStatus: string;
  completedAt: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function DisputeForm({
  orderId,
  buyerId,
  sellerId,
  sellerName,
  deliveryDate,
  orderStatus,
  completedAt,
  onSuccess,
  onCancel,
}: DisputeFormProps) {
  const { addToast } = useToast();
  const [reasons, setReasons] = useState<DisputeReason[]>([]);
  const [isLoadingReasons, setIsLoadingReasons] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(true);
  const [eligibilityError, setEligibilityError] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [reasonId, setReasonId] = useState<number>(0);
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const eligibility = await checkDisputeEligibility(
          orderId,
          buyerId,
          orderStatus,
          completedAt,
        );
        if (!eligibility.allowed) {
          setEligibilityError(
            eligibility.reason || "Bạn không thể khiếu nại đơn hàng này.",
          );
          return;
        }

        const data = await getDisputeReasons();
        setReasons(data);
      } catch (error) {
        addToast("Không thể tải thông tin khiếu nại.", "error");
      } finally {
        setIsLoadingReasons(false);
        setIsCheckingEligibility(false);
      }
    }
    init();
  }, [orderId, buyerId, orderStatus, completedAt, addToast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (evidenceFiles.length + files.length > 5) {
      addToast("Bạn chỉ có thể tải lên tối đa 5 tệp bằng chứng.", "warning");
      return;
    }
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    const validFiles = files.filter((f) => validTypes.includes(f.type));
    if (validFiles.length < files.length) {
      addToast(
        "Một số tệp không đúng định dạng (chỉ nhận JPG, JPEG, PNG).",
        "warning",
      );
    }
    setEvidenceFiles((prev) => [...prev, ...validFiles]);
    const newPreviews = validFiles.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeFile = (index: number) => {
    setEvidenceFiles((prev) => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previews[index]);
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const validateFields = () => {
    const errors: Record<string, string> = {};
    if (!reasonId || reasonId === 0)
      errors.reasonId = "Vui lòng chọn lý do khiếu nại.";
    if (!title.trim()) errors.title = "Vui lòng nhập tiêu đề tóm tắt.";
    if (!content.trim()) errors.content = "Vui lòng nhập nội dung chi tiết.";
    else if (content.length > 1000)
      errors.content = "Nội dung không được vượt quá 1000 ký tự.";
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const errors = validateFields();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      addToast("Vui lòng điền đầy đủ thông tin khiếu nại.", "error");
      return;
    }
    const payload: CreateDisputeRequest = {
      orderId,
      buyerId,
      sellerId,
      title,
      content,
      reasonId,
      evidenceUrls: [],
    };

    const validation = validateDisputeData(payload, reasons);
    if (!validation.isValid) {
      addToast(validation.error || "Vui lòng kiểm tra lại thông tin.", "error");
      return;
    }

    try {
      setIsSubmitting(true);
      const evidenceUrls = await uploadDisputeEvidence(evidenceFiles, orderId);
      payload.evidenceUrls = evidenceUrls;
      await createDispute(payload);
      addToast(
        "Gửi khiếu nại thành công. CycleX sẽ phản hồi sớm nhất.",
        "success",
      );
      onSuccess();
    } catch (error: any) {
      addToast(error.message || "Có lỗi xảy ra khi gửi khiếu nại.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingEligibility || isLoadingReasons) {
    return (
      <div className="flex flex-col items-center justify-center py-24 rounded-2xl animate-fade-in">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-brand-primary rounded-full animate-spin"></div>
          <Zap
            size={24}
            className="absolute inset-0 m-auto text-brand-primary animate-pulse"
          />
        </div>
        <p className="mt-8 text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] animate-pulse">
          Đang kiểm tra...
        </p>
      </div>
    );
  }

  if (eligibilityError) {
    return (
      <div className="rounded-2xl p-12 text-center animate-scale-in">
        <div className="w-20 h-20 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-8">
          <ShieldAlert size={40} className="text-rose-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-3">
          Không thể khiếu nại
        </h3>
        <p className="text-gray-500 text-sm mb-10 max-w-sm mx-auto leading-relaxed">
          {eligibilityError}
        </p>
        <button
          onClick={onCancel}
          className="w-full py-4 bg-gray-100 border border-gray-200 text-gray-600 font-bold uppercase tracking-widest text-xs rounded-2xl hover:bg-gray-200 transition-all active:scale-[0.98]"
        >
          Quay lại đơn hàng
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-6 animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Order Info Card */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Thông tin đơn hàng
            </span>
            <span className="inline-flex items-center gap-1.5 bg-brand-primary/10 px-2.5 py-1 rounded-full">
              <Zap size={10} className="text-brand-primary" />
              <span className="text-[9px] font-bold text-brand-primary uppercase tracking-wider">
                Bảo Vệ S-70
              </span>
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <p className="text-[11px] text-gray-400 font-medium">Đơn hàng</p>
              <p className="text-sm font-bold text-gray-800">#TX-{orderId}</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-medium">Người bán</p>
              <p className="text-sm font-bold text-gray-800">
                {sellerName || `Người bán #${sellerId}`}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-medium">
                Ngày hoàn thành
              </p>
              <p className="text-sm font-bold text-gray-800">
                {deliveryDate ||
                  new Date(completedAt).toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>
        </div>

        {/* Input Sections */}
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-700 flex items-center gap-2">
              <Tag size={14} className="text-brand-primary" /> Lý do khiếu nại{" "}
              <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                title="Lý do khiếu nại"
                value={reasonId}
                onChange={(e) => {
                  setReasonId(Number(e.target.value));
                  if (submitted)
                    setFieldErrors((prev) => ({ ...prev, reasonId: "" }));
                }}
                className={`w-full appearance-none px-4 py-3 bg-white border rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary cursor-pointer transition-all ${
                  submitted && fieldErrors.reasonId
                    ? "border-rose-400"
                    : "border-gray-300"
                }`}
              >
                <option value={0}>-- Lựa chọn nguyên nhân --</option>
                {reasons.map((r) => (
                  <option key={r.reasonId} value={r.reasonId}>
                    {r.title}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <X className="w-4 h-4 rotate-45" />
              </div>
            </div>
            {submitted && fieldErrors.reasonId && (
              <p className="text-xs text-rose-500 mt-1">
                {fieldErrors.reasonId}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-700 flex items-center gap-2">
              <FileText size={14} className="text-brand-primary" /> Tiêu đề tóm
              tắt <span className="text-rose-500">*</span>
            </label>
            <input
              placeholder="VD: Sản phẩm không đúng mô tả kỹ thuật..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (submitted)
                  setFieldErrors((prev) => ({ ...prev, title: "" }));
              }}
              className={`w-full px-4 py-3 bg-white border rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all placeholder:text-gray-400 ${
                submitted && fieldErrors.title
                  ? "border-rose-400"
                  : "border-gray-300"
              }`}
            />
            {submitted && fieldErrors.title && (
              <p className="text-xs text-rose-500 mt-1">{fieldErrors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-700 flex items-center gap-2">
              <Send size={14} className="text-brand-primary" /> Nội dung chi
              tiết <span className="text-rose-500">*</span>
            </label>
            <textarea
              placeholder="Mô tả cụ thể sự cố để CycleX hỗ trợ tốt nhất (Tối đa 1000 ký tự)..."
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (submitted)
                  setFieldErrors((prev) => ({ ...prev, content: "" }));
              }}
              rows={4}
              maxLength={1000}
              className={`w-full px-4 py-3 bg-white border rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all placeholder:text-gray-400 resize-none min-h-[120px] ${
                submitted && fieldErrors.content
                  ? "border-rose-400"
                  : "border-gray-300"
              }`}
            />
            <div className="flex justify-between items-center px-1">
              {submitted && fieldErrors.content ? (
                <p className="text-xs text-rose-500">{fieldErrors.content}</p>
              ) : (
                <p className="text-[10px] text-gray-400 italic">
                  Hãy mô tả cụ thể nhất có thể
                </p>
              )}
              <span
                className={`text-[10px] font-bold ${content.length > 900 ? "text-rose-500" : "text-gray-400"}`}
              >
                {content.length}/1000
              </span>
            </div>
          </div>

          {/* Evidence Upload */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <label className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                <Camera size={14} className="text-brand-primary" /> Bằng chứng
                trực quan
              </label>
              <span className="text-[10px] font-medium text-gray-400">
                {previews.length}/5 files
              </span>
            </div>

            <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl grid grid-cols-3 sm:grid-cols-5 gap-3">
              {previews.map((url, index) => (
                <div
                  key={index}
                  className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-sm"
                >
                  <img
                    src={url}
                    alt="Evidence"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <button
                    type="button"
                    title="Xóa ảnh"
                    onClick={() => removeFile(index)}
                    className="absolute top-1.5 right-1.5 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity active:scale-90"
                  >
                    <X size={10} strokeWidth={3} />
                  </button>
                </div>
              ))}

              {previews.length < 5 && (
                <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-brand-primary hover:bg-brand-primary/5 transition-all flex flex-col items-center justify-center cursor-pointer group">
                  <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all">
                    <Camera
                      size={18}
                      className="text-gray-400 group-hover:text-white"
                    />
                  </div>
                  <span className="text-[9px] font-semibold text-gray-400 mt-2 group-hover:text-brand-primary transition-colors">
                    Thêm ảnh
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Global Alert */}
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3">
          <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 leading-relaxed">
            Thời hạn khiếu nại trong vòng 24h từ lúc nhận xe. Quyết định của
            CycleX dựa trên bằng chứng bạn tải lên. Hãy đảm bảo hình ảnh rõ ràng
            và trung thực.
          </p>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 py-3 bg-gray-100 text-gray-600 font-semibold text-sm rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 sm:flex-[2] py-3 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold text-sm rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <RefreshCw size={16} className="animate-spin" /> Đang xử lý...
              </>
            ) : (
              "Xác nhận gửi khiếu nại"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
