'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
    Search, FileText, Filter, Calendar, Info, 
    RefreshCw, ChevronLeft, ChevronRight, XCircle, Shield
} from 'lucide-react';
import { auditLogService } from '../../services/auditLogService';
import { AuditLog, AuditLogQuery, AuditLogAction } from '../../types/auditLog';
import { useToast } from '../../contexts/ToastContext';
import { formatDate } from '../../utils/format';

export default function AuditLogsPage() {
    useEffect(() => {
        document.title = "Audit Logs | Admin | CycleX";
    }, []);

    const { addToast } = useToast();
    
    // Data State
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState<AuditLogQuery>({ page: 1, pageSize: 15 });
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    // Modal State
    const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const fetchLogs = useCallback(async (currentQuery: AuditLogQuery) => {
        setLoading(true);
        try {
            const data = await auditLogService.getLogs(currentQuery);
            setLogs(data.items);
            setTotal(data.total);
            setTotalPages(data.totalPages);
            setQuery(currentQuery);
        } catch (error: any) {
            addToast(error.message || 'Failed to load audit logs', 'error');
        } finally {
            setLoading(false);
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

    const getActionBadge = (action: AuditLogAction) => {
        switch (action) {
            case 'UPDATE_USER': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'UPDATE_ROLE': return 'bg-purple-50 text-purple-600 border-purple-100';
            case 'UPDATE_STATUS': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'OVERRIDE_DISPUTE': return 'bg-rose-50 text-rose-600 border-rose-100';
            case 'REFUND_ISSUE': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'DELETE_POST': return 'bg-gray-100 text-gray-700 border-gray-200';
            default: return 'bg-gray-50 text-gray-500 border-gray-100';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Audit Logs</h1>
                        <p className="text-gray-500 mt-1">Track system events and administrative actions.</p>
                    </div>
                    <button 
                        onClick={() => fetchLogs(query)}
                        className={`p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50 transition-all ${loading ? 'animate-spin' : ''}`}
                        title="Refresh Logs"
                    >
                        <RefreshCw size={20} />
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Action Type</label>
                        <div className="relative">
                            <select 
                                onChange={(e) => handleFilterChange('actionType', e.target.value)}
                                value={query.actionType || ''}
                                className="w-full appearance-none px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
                            >
                                <option value="">All Actions</option>
                                <option value="UPDATE_USER">Update User</option>
                                <option value="UPDATE_ROLE">Change Role</option>
                                <option value="UPDATE_STATUS">Change Status</option>
                                <option value="OVERRIDE_DISPUTE">Override Dispute</option>
                                <option value="REFUND_ISSUE">Refund Issue</option>
                                <option value="DELETE_POST">Delete Post</option>
                            </select>
                            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Filter by Admin ID</label>
                        <div className="relative">
                            <input 
                                type="number" 
                                placeholder="Admin ID..." 
                                value={query.adminId || ''}
                                onChange={(e) => handleFilterChange('adminId', e.target.value ? Number(e.target.value) : undefined)}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                            <Shield className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">From Date</label>
                        <div className="relative">
                            <input 
                                type="date" 
                                value={query.startDate || ''}
                                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-700"
                            />
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">To Date</label>
                        <div className="relative">
                            <input 
                                type="date" 
                                value={query.endDate || ''}
                                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-700"
                            />
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                        </div>
                    </div>
                </div>

                {/* Logs Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center p-20">
                            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="mt-4 text-gray-500 font-medium text-sm">Loading logs...</p>
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-20 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                                <FileText size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">No execution logs found</h3>
                            <p className="text-gray-500 text-sm">Try adjusting your date or target filters.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/80 border-b border-gray-100 whitespace-nowrap">
                                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Date & Time</th>
                                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Admin Details</th>
                                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Action</th>
                                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Target ID</th>
                                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {logs.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-bold text-gray-900">{formatDate(log.createdAt)}</p>
                                                <p className="text-xs text-gray-400 font-medium truncate w-32">{log.id}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-bold text-gray-900">{log.adminName}</p>
                                                <p className="text-xs text-gray-500">ID: {log.adminId}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2.5 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase border ${getActionBadge(log.actionType)}`}>
                                                    {log.actionType.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-gray-700 font-medium bg-gray-100 px-2 py-1 rounded w-fit">{log.targetId}</p>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => openModal(log)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors font-bold text-xs shadow-sm"
                                                >
                                                    <Info size={14} /> View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {!loading && totalPages > 1 && (
                        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <p className="text-xs text-gray-500 font-medium">
                                Showing <span className="font-bold text-gray-900">{(query.page! - 1) * query.pageSize! + 1}</span> to <span className="font-bold text-gray-900">{Math.min(query.page! * query.pageSize!, total)}</span> of <span className="font-bold text-gray-900">{total}</span> logs
                            </p>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => handlePageChange(query.page! - 1)}
                                    disabled={query.page === 1}
                                    className="p-1.5 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <span className="px-3 py-1.5 text-sm font-bold text-gray-900 bg-white border border-gray-200 rounded-lg">
                                    {query.page} / {totalPages}
                                </span>
                                <button 
                                    onClick={() => handlePageChange(query.page! + 1)}
                                    disabled={query.page === totalPages}
                                    className="p-1.5 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Detail Modal */}
                {isDetailModalOpen && selectedLog && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative animate-scale-in">
                            <button onClick={() => setIsDetailModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900">
                                <XCircle size={24} />
                            </button>
                            <div className="mb-8 border-b border-gray-100 pb-4">
                                <h2 className="text-xl font-black text-gray-900 mb-1">Audit Log Details</h2>
                                <p className="text-xs text-gray-500 font-medium">{selectedLog.id}</p>
                            </div>
                            
                            <div className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Admin Executor</p>
                                        <p className="text-sm font-bold text-gray-900">{selectedLog.adminName}</p>
                                        <p className="text-xs text-gray-500">ID: {selectedLog.adminId}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Execution Date</p>
                                        <p className="text-sm font-medium text-gray-900">{formatDate(selectedLog.createdAt)}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Action Category</p>
                                        <span className={`inline-flex px-2 py-1 rounded text-[10px] font-black tracking-widest uppercase border ${getActionBadge(selectedLog.actionType)}`}>
                                            {selectedLog.actionType.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Target Resource</p>
                                        <p className="text-sm text-gray-700 font-medium bg-gray-50 border border-gray-100 px-2 py-1 rounded w-fit">{selectedLog.targetId}</p>
                                    </div>
                                </div>
                                
                                <div className="mt-6">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Deep Inspection Details</p>
                                    <div className="bg-gray-900 text-green-400 p-4 rounded-xl font-mono text-xs overflow-x-auto shadow-inner leading-relaxed">
                                        {selectedLog.details}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <button 
                                    onClick={() => setIsDetailModalOpen(false)}
                                    className="w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                    Close Inspection
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
