'use client';

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
    ChevronLeft, Loader2, AlertTriangle, CheckCircle, 
    XCircle, ShieldAlert, History, MessageSquare, 
    Image as ImageIcon, ExternalLink, Zap
} from "lucide-react";
import { getDisputeById, overrideDispute } from "@/app/services/buyerDisputeService";
import { Dispute } from "@/app/types/dispute";
import { useToast } from "@/app/contexts/ToastContext";
import { formatDate } from "@/app/utils/format";
import { useAuth } from "@/app/hooks/useAuth";

export default function DisputeResultPage() {
    const params = useParams();
    const router = useRouter();
    const { addToast } = useToast();
    const [dispute, setDispute] = useState<Dispute | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const disputeId = Number(params.id);

    // --- S-83 Override State ---
    const { role } = useAuth();
    const isAdmin = role === 'ADMIN';
    const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
    const [overrideAction, setOverrideAction] = useState<'BUYER_WIN' | 'SELLER_WIN' | 'SPLIT'>('BUYER_WIN');
    const [overrideReason, setOverrideReason] = useState('');
    const [isOverriding, setIsOverriding] = useState(false);

    const fetchDispute = React.useCallback(async () => {
        if (isNaN(disputeId)) {
            setError("Mã khiếu nại không hợp lệ.");
            setLoading(false);
            return;
        }

        try {
            const data = await getDisputeById(disputeId);
            setDispute(data);
        } catch (err: any) {
            setError(err.message || "Không tìm thấy thông tin khiếu nại.");
        } finally {
            setLoading(false);
        }
    }, [disputeId]);

    useEffect(() => {
        document.title = "Chi tiết khiếu nại | CycleX Admin";
        fetchDispute();
    }, [fetchDispute]);

    const handleOverrideSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!overrideReason.trim()) {
            addToast('Vui lòng nhập lý do ghi đè (Reason).', 'error');
            return;
        }
        setIsOverriding(true);
        try {
            await overrideDispute(disputeId, overrideAction, overrideReason);
            addToast('Đã ghi đè kết quả thành công! Thông báo đã gửi tới Buyer & Seller.', 'success');
            setIsOverrideModalOpen(false);
            setOverrideReason('');
            fetchDispute(); // Reload data
        } catch (err: any) {
            addToast(err.message || 'Lỗi khi ghi đè dispute.', 'error');
        } finally {
            setIsOverriding(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-brand-bg">
                <div className="flex flex-col items-center">
                    <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
                    <p className="mt-4 text-gray-400 font-bold uppercase tracking-widest text-xs">Đang tải chi tiết mã #{disputeId}...</p>
                </div>
            </div>
        );
    }

    if (error || !dispute) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-brand-bg p-4 text-white">
                <div className="max-w-md w-full bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 text-center animate-scale-in">
                    <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle size={40} />
                    </div>
                    <h2 className="text-2xl font-black mb-2 tracking-tight">Truy Cập Thất Bại</h2>
                    <p className="text-gray-400 mb-8 leading-relaxed font-medium">{error || "Khiếu nại không tồn tại."}</p>
                    <button 
                        onClick={() => router.push('/admin/dashboard')}
                        className="w-full py-4 bg-brand-primary text-white font-black rounded-2xl shadow-lg shadow-brand-primary/20 hover:bg-brand-primary-hover transition-all active:scale-[0.98]"
                    >
                        Quay lại Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const isSolved = dispute.status === "RESOLVED";
    const isRejected = dispute.status === "REJECTED";

    return (
        <div className="min-h-screen bg-brand-bg text-white p-4 lg:p-10 selection:bg-brand-primary/30 font-sans">
            <div className="max-w-4xl mx-auto">
                {/* Header Phase */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-8 border-b border-white/5">
                    <div className="animate-slide-up">
                        <button 
                            onClick={() => router.back()}
                            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 font-bold text-xs uppercase tracking-[0.2em] group"
                        >
                            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Quay lại
                        </button>
                        <div className="flex items-center gap-4 mb-4">
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">
                                Dispute <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-blue-400">Details</span>
                            </h1>
                            {dispute.isOverridden && (
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-500/40 rounded-lg animate-pulse shadow-glow-purple">
                                    <Zap size={12} className="text-purple-400" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">Admin Intervened</span>
                                </div>
                            )}
                        </div>
                        <p className="text-[11px] font-black text-gray-500 tracking-[0.3em] uppercase">Mã khiếu nại: #{dispute.disputeId}</p>
                    </div>

                    {isAdmin && (
                        <button 
                            onClick={() => setIsOverrideModalOpen(true)}
                            className="group flex items-center gap-3 px-6 py-4 bg-white/5 border border-purple-500/30 hover:border-purple-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] text-purple-400 hover:text-white hover:bg-purple-600 transition-all shadow-xl active:scale-95"
                        >
                            <Zap size={16} className="group-hover:animate-bounce" />
                            Admin Override (BP7)
                        </button>
                    )}
                </div>

                {/* Main Content Sections */}
                <div className="space-y-10">
                    {/* Status Section */}
                    <div className="animate-fade-in">
                        <div className={`relative overflow-hidden bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 text-center shadow-2xl`}>
                            {/* Visual Background Glow */}
                            <div className={`absolute -top-24 -left-24 w-48 h-48 blur-[80px] rounded-full opacity-20 ${
                                isSolved ? 'bg-emerald-500' : isRejected ? 'bg-rose-500' : 'bg-brand-primary'
                            }`} />
                            
                            <div className={`w-24 h-24 rounded-3xl mx-auto mb-8 flex items-center justify-center border-2 transition-transform hover:scale-110 duration-500 ${
                                isSolved 
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-glow-emerald" 
                                    : isRejected 
                                        ? "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-glow-red" 
                                        : "bg-brand-primary/10 text-brand-primary border-brand-primary/20 shadow-glow-orange"
                            }`}>
                                {isSolved ? <CheckCircle size={40} strokeWidth={2.5} /> : isRejected ? <XCircle size={40} strokeWidth={2.5} /> : <History size={40} strokeWidth={2.5} />}
                            </div>
                            
                            <h2 className={`text-4xl font-black tracking-tight mb-4 ${
                                isSolved ? "text-emerald-400" : isRejected ? "text-rose-400" : "text-brand-primary"
                            }`}>
                                {isSolved ? "Khiếu nại được chấp nhận" : isRejected ? "Khiếu nại bị từ chối" : "Đang được xem xét"}
                            </h2>
                            
                            <div className="flex items-center justify-center gap-3 text-gray-500 text-xs font-bold uppercase tracking-widest">
                                <span>Order #{dispute.orderId}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                                <span>{formatDate(dispute.createdAt)}</span>
                            </div>

                            {/* Admin Note if resolved */}
                            {(isSolved || isRejected) && dispute.adminNote && (
                                <div className="mt-10 pt-10 border-t border-white/5 text-left bg-white/[0.02] -mx-10 px-10 rounded-b-[2.5rem]">
                                    <div className="flex items-center gap-3 mb-4">
                                        <MessageSquare size={16} className="text-brand-primary" />
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Quyết định từ CycleX Support</h4>
                                    </div>
                                    <p className="text-lg font-medium text-gray-300 leading-relaxed italic">
                                        &ldquo;{dispute.adminNote}&rdquo;
                                    </p>
                                    <p className="mt-4 text-[9px] font-bold text-gray-600 uppercase tracking-widest">Ghi nhận lúc: {formatDate(dispute.resolvedAt || '')}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Dispute Info Sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Details Card */}
                        <div className="lg:col-span-12 space-y-8">
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-xl animate-fade-in delay-100">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary shadow-glow-orange">
                                        <ShieldAlert size={24} strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black tracking-tight">Chi tiết phản hồi</h3>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{dispute.reason}</span>
                                    </div>
                                </div>
                                <div className="p-8 bg-black/20 rounded-2xl border border-white/5">
                                    <p className="text-lg font-medium text-gray-300 leading-relaxed">
                                        {dispute.content}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Evidence Section */}
                        {dispute.evidenceUrls && dispute.evidenceUrls.length > 0 && (
                            <div className="lg:col-span-12 space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                                        <ImageIcon size={18} />
                                    </div>
                                    <h3 className="text-lg font-black tracking-tight uppercase tracking-[0.1em]">Bằng chứng hình ảnh</h3>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-in delay-200">
                                    {dispute.evidenceUrls.map((url, idx) => (
                                        <a 
                                            key={idx} 
                                            href={url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="group relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-lg hover:border-brand-primary/50 transition-all cursor-zoom-in"
                                        >
                                            <img src={url} alt={`Evidence ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-brand-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <ExternalLink size={20} className="text-white drop-shadow-lg" />
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Footer Section */}
                <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.3em]">
                        CycleX System • Dispute Module 3.0
                    </p>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => router.push('/admin/dashboard')}
                            className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                        >
                            Quay lại Dashboard
                        </button>
                    </div>
                </div>
            </div>

            {/* S-83 REDESIGNED OVERRIDE MODAL */}
            {isOverrideModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-bg/80 backdrop-blur-xl animate-fade-in">
                    <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-10 max-w-lg w-full shadow-2xl animate-scale-in relative overflow-hidden">
                        <div className="absolute top-0 inset-x-0 h-2 bg-purple-500 shadow-glow-purple" />
                        
                        <button 
                            onClick={() => setIsOverrideModalOpen(false)}
                            className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"
                        >
                            <XCircle size={24} />
                        </button>

                        <div className="text-center mb-8">
                            <div className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center bg-purple-500/20 text-purple-400 shadow-glow-purple">
                                <Zap size={40} strokeWidth={2.5} />
                            </div>
                            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Admin Dispute Override</h2>
                            <p className="text-xs text-purple-400 font-black uppercase tracking-widest">Thao tác cấp quyền quản trị cao cấp (BP7)</p>
                        </div>

                        <form onSubmit={handleOverrideSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">Kết quả bàn giao mới</label>
                                <div className="grid grid-cols-1 gap-3">
                                    {[
                                        { id: 'BUYER_WIN', label: 'Buyer Thắng - Hoàn trả toàn bộ tiền' },
                                        { id: 'SELLER_WIN', label: 'Seller Thắng - Giải phóng thanh toán' },
                                        { id: 'SPLIT', label: 'Phân chia 50/50 - Mỗi bên nhận một nửa' }
                                    ].map((opt) => (
                                        <button
                                            key={opt.id}
                                            type="button"
                                            onClick={() => setOverrideAction(opt.id as any)}
                                            className={`w-full px-6 py-4 rounded-2xl text-left border transition-all flex items-center justify-between ${
                                                overrideAction === opt.id 
                                                    ? 'bg-purple-500/10 border-purple-500/50 text-white shadow-lg' 
                                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                            }`}
                                        >
                                            <span className="text-sm font-bold">{opt.label}</span>
                                            {overrideAction === opt.id && <CheckCircle size={14} className="text-purple-400" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">Lý do ghi đè (Reason)</label>
                                <textarea 
                                    value={overrideReason} 
                                    onChange={(e) => setOverrideReason(e.target.value)}
                                    rows={4}
                                    required
                                    placeholder="Tại sao bạn muốn ghi đè kết quả của Inspector? Lý do này sẽ được gửi trực tiếp tới Buyer và Seller..."
                                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-white placeholder:text-gray-600 resize-none min-h-[120px]"
                                />
                            </div>

                            <div className="bg-amber-500/10 p-5 rounded-2xl border border-amber-500/20 flex gap-4">
                                <AlertTriangle size={24} className="text-amber-500 shrink-0" />
                                <p className="text-[11px] font-bold text-amber-500/80 leading-relaxed uppercase tracking-tight">
                                    Thao tác này sẽ ghi đè quyết định trước đó của Inspector. Hệ thống sẽ tự động gửi thông báo điều chỉnh tới cả hai bên và ghi nhật ký hệ thống.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setIsOverrideModalOpen(false)}
                                    disabled={isOverriding}
                                    className="py-4 bg-white/5 text-gray-400 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-white/10 transition-all disabled:opacity-50"
                                >
                                    Hủy bỏ
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isOverriding}
                                    className="py-4 bg-purple-600 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all shadow-xl shadow-purple-900/20 hover:bg-purple-500 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isOverriding ? <><Loader2 size={14} className="animate-spin" /> Đang cập nhật...</> : "Xác nhận Override"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
