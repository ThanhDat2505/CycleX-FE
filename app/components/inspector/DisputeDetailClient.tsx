"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  disputeService,
  type DisputeDetail,
  type DisputeEvidence,
} from "@/app/services/inspectorDisputeService";
import { getErrorMessage } from "@/app/services/errorUtils";
import { 
    ChevronLeft, Loader2, ShieldAlert, CheckCircle, 
    XCircle, History, MessageSquare, Image as ImageIcon, 
    ExternalLink, Zap, ShoppingBag, User, FileText,
    Gavel, ArrowRight
} from "lucide-react";
import { formatDate } from "@/app/utils/format";

export default function DisputeDetailClient({
  disputeId,
}: {
  disputeId: string;
}) {
  const router = useRouter();
  const [detail, setDetail] = useState<DisputeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openingEvidenceIndex, setOpeningEvidenceIndex] = useState<number | null>(null);

  const handleOpenEvidence = async (item: DisputeEvidence, index: number) => {
    if (!item.url) return;
    try {
      setOpeningEvidenceIndex(index);
      const blobUrl = await disputeService.getEvidenceBlobUrl(item.url);
      window.open(blobUrl, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Không thể mở bằng chứng bảo mật"));
    } finally {
      setOpeningEvidenceIndex(null);
    }
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await disputeService.getDisputeDetail(disputeId);
        if (!mounted) return;
        setDetail(data);
      } catch (err: unknown) {
        if (!mounted) return;
        setError(getErrorMessage(err, "Không tải được tiết khiếu nại"));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [disputeId]);

  const priceVnd = useMemo(() => {
    const value = detail?.listing.priceVnd || 0;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  }, [detail?.listing.priceVnd]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-brand-bg transition-all">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-white/5 border-t-brand-primary rounded-full animate-spin"></div>
          <Zap size={24} className="absolute inset-0 m-auto text-brand-primary animate-pulse" />
        </div>
        <p className="mt-8 text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] animate-pulse">
          Decrypting Case Data...
        </p>
      </div>
    );
  }

  if (!detail || error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-brand-bg p-8">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-12 text-center max-w-md animate-scale-in">
            <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-glow-rose">
                <ShieldAlert size={40} />
            </div>
            <h2 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase leading-tight">Access Error</h2>
            <p className="text-gray-400 font-medium mb-10 leading-relaxed">{error || "Dữ liệu khiếu nại bị hỏng hoặc không tồn tại."}</p>
            <button 
                onClick={() => router.back()}
                className="w-full py-4 bg-white/5 border border-white/10 text-gray-300 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-white/10 transition-all active:scale-[0.98]"
            >
                Quay lại hàng chờ
            </button>
        </div>
      </div>
    );
  }

  const isSolved = detail.status === "RESOLVED";
  const isRejected = detail.status === "REJECTED";

  return (
    <div className="bg-brand-bg min-h-screen text-white p-4 lg:p-10 font-sans selection:bg-brand-primary/30">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header Phase */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-white/5">
            <div className="animate-slide-up">
                <Link 
                    href="/inspector/disputes" 
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-primary transition-colors mb-6 font-bold text-[10px] uppercase tracking-[0.2em] group"
                >
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Queue
                </Link>
                <div className="flex items-center gap-4 mb-4">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">
                        Case <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-orange-400">#{detail.id}</span>
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                   <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase border ${
                        isSolved ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 
                        isRejected ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' : 
                        'text-brand-primary bg-brand-primary/10 border-brand-primary/20 animate-pulse'
                    }`}>
                        {detail.status}
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Khởi tạo: {detail.createdAt}</span>
                </div>
            </div>

            {!isSolved && !isRejected && (
              <Link
                href={`/inspector/disputes/${encodeURIComponent(detail.id)}/resolution`}
                className="group flex items-center gap-4 px-8 py-5 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-glow-orange transition-all active:scale-95"
              >
                <Gavel size={18} className="group-hover:rotate-12 transition-transform" />
                Proceed to Resolution
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Core Data */}
            <div className="lg:col-span-12 space-y-8">
                
                {/* Reason Card */}
                <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl animate-fade-in">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary shadow-glow-orange">
                            <ShieldAlert size={28} strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Cơ sở khiếu nại</p>
                            <h3 className="text-2xl font-black tracking-tight text-white uppercase">{detail.reasonText}</h3>
                        </div>
                    </div>
                    <div className="p-8 bg-black/20 rounded-3xl border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 text-white/5 group-hover:text-white/10 transition-colors">
                            <MessageSquare size={100} />
                        </div>
                        <p className="text-xl font-medium text-gray-300 leading-relaxed italic relative z-10">
                            &ldquo;{detail.description}&rdquo;
                        </p>
                    </div>
                </div>

                {/* Evidence Grid */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                                <ImageIcon size={20} />
                            </div>
                            <h3 className="text-lg font-black tracking-widest uppercase">Evidence Repositories</h3>
                        </div>
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{detail.evidence.length} OBJECTS</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {detail.evidence.length > 0 ? (
                            detail.evidence.map((item, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => void handleOpenEvidence(item, index)}
                                    disabled={!item.url || openingEvidenceIndex === index}
                                    className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-left hover:bg-white/10 hover:border-brand-primary/50 transition-all active:scale-[0.98] overflow-hidden"
                                >
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-brand-primary group-hover:border-brand-primary/30 transition-all">
                                            {openingEvidenceIndex === index ? <Loader2 size={24} className="animate-spin" /> : <FileText size={24} />}
                                        </div>
                                        <ExternalLink size={16} className="text-gray-700 group-hover:text-brand-primary transition-colors" />
                                    </div>
                                    <span className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">
                                        {item.uploaderRole ? `SOURCE: ${item.uploaderRole}` : "SYSTEM OBJECT"}
                                    </span>
                                    <h4 className="text-xs font-bold text-white truncate group-hover:text-brand-primary transition-colors">
                                        {formatDate(detail.createdAt).split(' ')[0]} - {index + 1}
                                    </h4>
                                </button>
                            ))
                        ) : (
                            <div className="col-span-full p-12 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-[2rem]">
                                <p className="text-gray-600 font-bold uppercase tracking-widest text-xs italic">Không có bằng chứng đi kèm</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Secondary Data Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Transaction & Parties */}
                    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-8 animate-fade-in delay-200">
                        <div className="flex items-center gap-3 mb-2">
                           <History size={18} className="text-brand-primary" />
                           <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Transaction Registry</h4>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="flex justify-between items-center p-5 bg-black/20 rounded-2xl border border-white/5">
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Protocol ID</span>
                                <span className="text-sm font-mono font-bold text-brand-primary">#TX-{detail.transaction.id}</span>
                            </div>
                            <div className="flex justify-between items-center p-5 bg-black/20 rounded-2xl border border-white/5">
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Order Status</span>
                                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">{detail.transaction.status}</span>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-6">
                            <div className="group">
                                <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] mb-2">BUYER</p>
                                <p className="text-xs font-black text-white group-hover:text-brand-primary transition-colors">{detail.buyer.name}</p>
                                <p className="text-[10px] font-medium text-gray-500 truncate">{detail.buyer.email}</p>
                            </div>
                            <div className="group">
                                <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] mb-2">SELLER</p>
                                <p className="text-xs font-black text-white group-hover:text-brand-primary transition-colors">{detail.seller.name}</p>
                                <p className="text-[10px] font-medium text-gray-500 truncate">{detail.seller.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Listing Summary */}
                    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-8 animate-fade-in delay-300">
                        <div className="flex items-center gap-3 mb-2">
                           <ShoppingBag size={18} className="text-brand-primary" />
                           <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Asset Profile</h4>
                        </div>
                        
                        <div className="group flex gap-6 p-6 bg-black/20 rounded-3xl border border-white/5 hover:border-brand-primary/30 transition-all">
                           <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                              {detail.listing.imageUrl ? (
                                <img src={detail.listing.imageUrl} alt={detail.listing.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-700">
                                   <ShoppingBag size={32} />
                                </div>
                              )}
                           </div>
                           <div className="flex flex-col justify-center">
                              <h5 className="text-sm font-black text-white mb-2 leading-tight group-hover:text-brand-primary transition-colors">{detail.listing.title}</h5>
                              <p className="text-xs font-mono font-bold text-brand-primary">{priceVnd}</p>
                              <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest mt-2 px-2 py-0.5 bg-white/5 rounded border border-white/5 w-fit">PID-{detail.listing.id}</span>
                           </div>
                        </div>

                        <div className="pt-8 border-t border-white/5">
                            <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] mb-3">ASSIGNED INSPECTOR</p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
                                    <User size={18} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-white">{detail.assignee.name}</p>
                                    <p className="text-[10px] font-medium text-gray-500">{detail.assignee.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        {/* Footer Audit */}
        <div className="text-center pt-20 border-t border-white/5">
            <p className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.4em]">
                CycleX Case ID: {detail.id} • Protocol S-74 Enforcement • Premium AI Workflow
            </p>
        </div>
      </div>
    </div>
  );
}
