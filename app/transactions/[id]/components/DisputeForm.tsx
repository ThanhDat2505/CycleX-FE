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
    AlertTriangle, Camera, FileText, Send, 
    X, CheckCircle, Info, ShieldAlert, Zap,
    RefreshCw, Tag
} from "lucide-react";

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
            eligibility.reason || "Bạn không thể khiếu nại đơn hàng này."
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
      addToast("Một số tệp không đúng định dạng (chỉ nhận JPG, JPEG, PNG).", "warning");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      addToast("Gửi khiếu nại thành công. CycleX sẽ phản hồi sớm nhất.", "success");
      onSuccess();
    } catch (error: any) {
      addToast(error.message || "Có lỗi xảy ra khi gửi khiếu nại.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingEligibility || isLoadingReasons) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 animate-fade-in">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-white/5 border-t-brand-primary rounded-full animate-spin"></div>
          <Zap size={24} className="absolute inset-0 m-auto text-brand-primary animate-pulse" />
        </div>
        <p className="mt-8 text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] animate-pulse">
          Validating context...
        </p>
      </div>
    );
  }

  if (eligibilityError) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-12 text-center animate-scale-in">
        <div className="w-20 h-20 bg-rose-500/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-glow-rose">
          <ShieldAlert size={40} className="text-rose-500" />
        </div>
        <h3 className="text-3xl font-black text-white mb-3 tracking-tighter uppercase">ACCESS DENIED</h3>
        <p className="text-gray-400 text-sm mb-10 max-w-sm mx-auto leading-relaxed font-medium">
          {eligibilityError}
        </p>
        <button
          onClick={onCancel}
          className="w-full py-4 bg-white/5 border border-white/10 text-gray-300 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-white/10 transition-all active:scale-[0.98]"
        >
          Quay lại đơn hàng
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl animate-fade-in selection:bg-brand-primary/30">
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Step Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
           <div>
              <div className="inline-flex items-center gap-2 bg-brand-primary/10 px-3 py-1 rounded-full mb-3">
                 <Zap size={10} className="text-brand-primary" />
                 <span className="text-[9px] font-black text-brand-primary uppercase tracking-[0.2em]">S-70 Protection</span>
              </div>
              <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Open <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-orange-400">Dispute</span></h2>
           </div>
           <div className="text-right hidden md:block">
              <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Order Reference</span>
              <p className="text-sm font-mono font-bold text-gray-400">#TX-{orderId}</p>
           </div>
        </div>

        {/* Input Sections */}
        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
              <Tag size={12} className="text-brand-primary" /> Lý do khiếu nại
            </label>
            <div className="relative group">
               <select
                 value={reasonId}
                 onChange={(e) => setReasonId(Number(e.target.value))}
                 className="w-full appearance-none px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-bold uppercase tracking-wider text-gray-200 focus:outline-none focus:border-brand-primary/50 cursor-pointer transition-all"
                 required
               >
                 <option value={0} className="bg-brand-bg">-- Lựa chọn nguyên nhân --</option>
                 {reasons.map((r) => <option key={r.reasonId} value={r.reasonId} className="bg-brand-bg">{r.title}</option>)}
               </select>
               <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600 transition-colors">
                  <X className="w-4 h-4 rotate-45" />
               </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
              <FileText size={12} className="text-brand-primary" /> Tiêu đề tóm tắt
            </label>
            <input 
              placeholder="VD: Sản phẩm không đúng mô tả kỹ thuật..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white focus:outline-none focus:border-brand-primary/50 transition-all placeholder:text-gray-700"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
              <Send size={12} className="text-brand-primary" /> Nội dung chi tiết
            </label>
            <textarea
              placeholder="Mô tả cụ thể sự cố để CycleX hỗ trợ tốt nhất (Tối đa 1000 ký tự)..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              maxLength={1000}
              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-medium text-white focus:outline-none focus:border-brand-primary/50 transition-all placeholder:text-gray-700 resize-none min-h-[140px]"
              required
            />
            <div className="flex justify-between items-center px-1">
               <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest italic">Be specific as possible</p>
               <span className={`text-[10px] font-black ${content.length > 900 ? "text-rose-500" : "text-gray-500"}`}>{content.length}/1000</span>
            </div>
          </div>

          {/* Evidence Upload */}
          <div className="space-y-4">
             <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Camera size={12} className="text-brand-primary" /> Bằng chứng trực quan
                </label>
                <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{previews.length}/5 FILES</span>
             </div>
             
             <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] grid grid-cols-3 sm:grid-cols-5 gap-4">
                {previews.map((url, index) => (
                  <div key={index} className="relative group aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                    <img src={url} alt="Evidence" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <button 
                      type="button" 
                      onClick={() => removeFile(index)}
                      className="absolute top-2 right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-110 active:scale-90"
                    >
                      <X size={12} strokeWidth={3} />
                    </button>
                  </div>
                ))}
                
                {previews.length < 5 && (
                  <label className="aspect-square rounded-2xl border-2 border-dashed border-white/10 hover:border-brand-primary hover:bg-brand-primary/5 transition-all flex flex-col items-center justify-center cursor-pointer group">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all transform group-hover:rotate-6">
                      <Camera size={20} className="text-gray-600 group-hover:text-white" />
                    </div>
                    <span className="text-[9px] font-black text-gray-600 mt-3 uppercase tracking-tighter group-hover:text-brand-primary transition-colors">Add Photo</span>
                    <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                )}
             </div>
          </div>
        </div>

        {/* Global Alert */}
        <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-3xl flex gap-4">
          <AlertTriangle size={20} className="text-amber-500 shrink-0" />
          <p className="text-[11px] font-bold text-amber-500/70 uppercase leading-relaxed tracking-tight">
            Thời hạn khiếu nại trong vòng 24h từ lúc nhận xe. Quyết định của CycleX dựa trên bằng chứng bạn tải lên. Hãy đảm bảo hình ảnh rõ ràng và trung thực.
          </p>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 py-5 bg-white/5 text-gray-400 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-white/10 transition-all disabled:opacity-50"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 sm:flex-[2] py-5 bg-brand-primary hover:bg-brand-primary-hover text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-glow-orange active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {isSubmitting ? <><RefreshCw size={16} className="animate-spin" /> Process initiated...</> : "Xác nhận gửi khiếu nại"}
          </button>
        </div>
      </form>
    </div>
  );
}
