'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
    FileText, Filter, Calendar, Info, 
    RefreshCw, ChevronLeft, ChevronRight, X, Shield,
    Terminal, Hash, Database, Clock, Fingerprint
} from 'lucide-react';
import { auditLogService } from '../../services/auditLogService';
import { AuditLog, AuditLogQuery, AuditLogAction } from '../../types/auditLog';
import { useToast } from '../../contexts/ToastContext';
import { formatDate } from '../../utils/format';

export default function AuditLogsPage() {
    useEffect(() => {
        document.title = "Audit Logs | CycleX Admin";
    }, []);

    const { addToast } = useToast();
    
    // Data State
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState<AuditLogQuery>({ page: 1, pageSize: 15 });
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [refreshing, setRefreshing] = useState(false);

    // Modal State
    const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const fetchLogs = useCallback(async (currentQuery: AuditLogQuery) => {
        setRefreshing(true);
        try {
            const data = await auditLogService.getLogs(currentQuery);
            setLogs(data.items);
            setTotal(data.total);
            setTotalPages(data.totalPages);
            setQuery(currentQuery);
        } catch (error: any) {
            addToast(error.message || 'Không thể tải nhật ký hệ thống', 'error');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [addToast]);

    useEffect(() => {
        fetchLogs(query);
    }, [fetchLogs]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            fetchLogs({ ...query, page: newPage });
        }
    };

    const handleFilterChange = (key: keyof AuditLogQuery, value: any) => {
        const newQuery = { ...query, [key]: value || undefined, page: 1 };
        fetchLogs(newQuery);
    };

    const openModal = (log: AuditLog) => {
        setSelectedLog(log);
        setIsDetailModalOpen(true);
    };

    const getActionStyle = (action: AuditLogAction) => {
        switch (action) {
            case 'UPDATE_USER': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            case 'UPDATE_ROLE': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
            case 'UPDATE_STATUS': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            case 'OVERRIDE_DISPUTE': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
            case 'REFUND_ISSUE': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            case 'DELETE_POST': return 'text-gray-400 bg-white/5 border-white/10';
            default: return 'text-gray-400 bg-white/5 border-white/10';
        }
    };

    if (loading && !refreshing) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-brand-bg">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest text-[10px]">Đang truy xuất nhật ký...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-bg text-white p-4 lg:p-10 selection:bg-brand-primary/30 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-8 border-b border-white/5">
                    <div className="animate-slide-up">
                        <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 mb-4 shadow-xl">
                            <Fingerprint size={12} className="text-brand-primary" />
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Security & Systems Audit</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter leading-none mb-4">
                            Audit <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-blue-400">Logs</span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-xl font-medium">
                            Giám sát toàn bộ hoạt động quản trị, thay đổi dữ liệu và các hành động nhạy cảm trên hệ thống.
                        </p>
                    </div>
                    <div>
                        <button 
                            onClick={() => fetchLogs(query)}
                            className={`flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-white hover:bg-white/10 transition-all ${refreshing ? 'cursor-not-allowed opacity-50' : ''}`}
                        >
                            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                            Refresh logs
                        </button>
                    </div>
                </div>

                {/* Filters Bar */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Loại hành động</label>
                        <div className="relative group">
                            <select 
                                onChange={(e) => handleFilterChange('actionType', e.target.value)}
                                value={query.actionType || ''}
                                className="w-full appearance-none px-6 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-[11px] font-bold uppercase tracking-wider text-gray-300 focus:outline-none focus:border-brand-primary/50 cursor-pointer"
                            >
                                <option value="" className="bg-brand-bg">Tất cả hành động</option>
                                <option value="UPDATE_USER" className="bg-brand-bg">Update User</option>
                                <option value="UPDATE_ROLE" className="bg-brand-bg">Change Role</option>
                                <option value="UPDATE_STATUS" className="bg-brand-bg">Change Status</option>
                                <option value="OVERRIDE_DISPUTE" className="bg-brand-bg text-rose-400">Override Dispute</option>
                                <option value="REFUND_ISSUE" className="bg-brand-bg text-emerald-400">Refund Issue</option>
                                <option value="DELETE_POST" className="bg-brand-bg">Delete Post</option>
                            </select>
                            <Filter className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" size={14} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Mã Quản trị (Admin ID)</label>
                        <div className="relative group">
                            <input 
                                type="number" 
                                placeholder="Nhập Admin ID..." 
                                value={query.adminId || ''}
                                onChange={(e) => handleFilterChange('adminId', e.target.value ? Number(e.target.value) : undefined)}
                                className="w-full px-6 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-sm font-bold focus:outline-none focus:border-brand-primary/50 transition-all placeholder:text-gray-700"
                            />
                            <Shield className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" size={16} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Từ ngày</label>
                        <div className="relative group">
                            <input 
                                type="date" 
                                value={query.startDate || ''}
                                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                className="w-full px-6 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-[11px] font-bold text-gray-300 focus:outline-none focus:border-brand-primary/50 transition-all [color-scheme:dark]"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Đến ngày</label>
                        <div className="relative group">
                            <input 
                                type="date" 
                                value={query.endDate || ''}
                                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                className="w-full px-6 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-[11px] font-bold text-gray-300 focus:outline-none focus:border-brand-primary/50 transition-all [color-scheme:dark]"
                            />
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl animate-fade-in mb-10">
                    <div className="overflow-x-auto min-h-[400px]">
                        {logs.length === 0 && !refreshing ? (
                            <div className="flex flex-col items-center justify-center py-32 text-center">
                                <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mb-6 text-gray-700">
                                    <FileText size={48} />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Không có nhật ký nào</h3>
                                <p className="text-gray-500 font-medium">Thử điều chỉnh điều kiện lọc hoặc ngày giới hạn.</p>
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5">
                                        <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Thời gian</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Quản trị viên</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Hành động</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Đối tượng</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-right">Chi tiết</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {logs.map((log) => (
                                        <tr key={log.id} className="group hover:bg-white/[0.02] transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] font-black text-white group-hover:text-brand-primary transition-colors">{formatDate(log.createdAt).split(' ')[0]}</span>
                                                    <span className="text-[10px] font-bold text-gray-600 mt-1 uppercase tracking-tighter">{formatDate(log.createdAt).split(' ').slice(1).join(' ')}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black text-gray-400 group-hover:scale-110 transition-transform origin-left">
                                                        {log.adminName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-white">{log.adminName}</p>
                                                        <p className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">ID: {log.adminId}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`inline-flex px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase border transition-all ${getActionStyle(log.actionType)}`}>
                                                    {log.actionType.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <Hash size={12} className="text-gray-600" />
                                                    <span className="text-sm font-bold text-gray-300 font-mono tracking-tighter bg-white/5 px-3 py-1 rounded-lg border border-white/5 group-hover:border-white/10 transition-colors">{log.targetId}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button 
                                                    onClick={() => openModal(log)}
                                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/10 hover:border-brand-primary/50 transition-all active:scale-95"
                                                >
                                                    <Info size={14} /> Kiểm tra
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Pagination */}
                    {!loading && totalPages > 1 && (
                        <div className="px-8 py-6 border-t border-white/5 flex items-center justify-between bg-white/[0.01]">
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                                Hiển thị <span className="text-white">{(query.page! - 1) * query.pageSize! + 1}</span> - <span className="text-white">{Math.min(query.page! * query.pageSize!, total)}</span> / <span className="text-white">{total}</span> Nhật ký
                            </p>
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => handlePageChange(query.page! - 1)}
                                    disabled={query.page === 1}
                                    className="p-3 rounded-2xl border border-white/10 text-gray-400 disabled:opacity-20 hover:bg-white/5 hover:text-white transition-all"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button 
                                    onClick={() => handlePageChange(query.page! + 1)}
                                    disabled={query.page === totalPages}
                                    className="p-3 rounded-2xl border border-white/10 text-gray-400 disabled:opacity-20 hover:bg-white/5 hover:text-white transition-all"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* --- TERMINAL STYLE DETAIL MODAL --- */}
                {isDetailModalOpen && selectedLog && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-bg/80 backdrop-blur-xl animate-fade-in selection:bg-emerald-500/30">
                        <div className="bg-[#0A0F14] border border-white/10 rounded-[2.5rem] w-full max-w-2xl shadow-2xl animate-scale-in relative overflow-hidden flex flex-col max-h-[90vh]">
                            {/* Terminal Top Bar */}
                            <div className="flex items-center justify-between px-10 py-6 border-b border-white/10 bg-white/[0.02]">
                                <div className="flex items-center gap-4">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-rose-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                                    </div>
                                    <div className="flex items-center gap-2 ml-4">
                                        <Terminal size={16} className="text-emerald-500 animate-pulse" />
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Log Inspection System v1.02</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setIsDetailModalOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors group"
                                >
                                    <X size={20} className="text-gray-500 group-hover:text-white" />
                                </button>
                            </div>

                            {/* Inspection Info Bar */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 border-b border-white/10">
                                <div className="p-6 bg-[#0A0F14]">
                                    <div className="flex items-center gap-2 mb-2 text-gray-500">
                                        <Clock size={12} />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Timestamp</span>
                                    </div>
                                    <p className="text-[11px] font-bold">{formatDate(selectedLog.createdAt)}</p>
                                </div>
                                <div className="p-6 bg-[#0A0F14]">
                                    <div className="flex items-center gap-2 mb-2 text-gray-500">
                                        <Database size={12} />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Reference ID</span>
                                    </div>
                                    <p className="text-[11px] font-bold text-brand-primary">{selectedLog.id}</p>
                                </div>
                                <div className="p-6 bg-[#0A0F14]">
                                    <div className="flex items-center gap-2 mb-2 text-gray-500">
                                        <Shield size={12} />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Authority</span>
                                    </div>
                                    <p className="text-[11px] font-bold">{selectedLog.adminName}</p>
                                </div>
                                <div className="p-6 bg-[#0A0F14]">
                                    <div className="flex items-center gap-2 mb-2 text-gray-500">
                                        <Hash size={12} />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Target Object</span>
                                    </div>
                                    <p className="text-[11px] font-bold text-emerald-400">{selectedLog.targetId}</p>
                                </div>
                            </div>
                            
                            {/* Deep Content - Terminal Body */}
                            <div className="flex-1 overflow-y-auto p-10 font-mono scrollbar-thin scrollbar-thumb-white/10">
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-emerald-500 text-[10px] font-black uppercase mb-3 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 
                                            Action Metadata
                                        </p>
                                        <div className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl relative">
                                            <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black tracking-[0.1em] uppercase border mb-4 ${getActionStyle(selectedLog.actionType)}`}>
                                                {selectedLog.actionType}
                                            </span>
                                            <p className="text-gray-400 text-sm leading-relaxed mb-4 ">
                                                &gt; Process started by auth token verify: 256-bit AES
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-emerald-500 text-[10px] font-black uppercase mb-3 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 
                                            Execution Description
                                        </p>
                                        <div className="p-8 bg-emerald-500/[0.02] border border-emerald-500/10 rounded-2xl text-emerald-100/80 leading-relaxed text-sm">
                                            {selectedLog.details}
                                        </div>
                                    </div>

                                    <div className="pt-10 border-t border-white/5 text-[9px] text-gray-600 font-bold uppercase tracking-[0.2em] flex items-center justify-between">
                                        <span>System Integrity: Verified</span>
                                        <span className="animate-pulse">_ TERMINAL_READY</span>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-8 border-t border-white/10 bg-white/[0.01] flex justify-end">
                                <button 
                                    onClick={() => setIsDetailModalOpen(false)}
                                    className="px-10 py-4 bg-emerald-600/10 text-emerald-500 border border-emerald-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all active:scale-[0.98] shadow-glow-emerald"
                                >
                                    End Inspection Session
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
