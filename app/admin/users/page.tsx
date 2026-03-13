'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
    Search, User, Shield, AlertTriangle, 
    CheckCircle, RefreshCw, ChevronLeft, ChevronRight, 
    Filter, Loader2, Ban, ShieldCheck, UserCog, X
} from 'lucide-react';
import { adminUserService } from '../../services/adminUserService';
import { AdminUser, AdminUserQuery, UserRole, UserStatus } from '../../types/adminUser';
import { useToast } from '../../contexts/ToastContext';

export default function AdminUsersPage() {
    useEffect(() => {
        document.title = "User Management | CycleX Admin";
    }, []);

    const { addToast } = useToast();
    
    // Data State
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState<AdminUserQuery>({ page: 1, pageSize: 10 });
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [searchInput, setSearchInput] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    // Modal/Action States
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<{
        type: 'BAN' | 'UNBAN' | 'CHANGE_ROLE';
        newRole?: UserRole;
    } | null>(null);

    const fetchUsers = useCallback(async (currentQuery: AdminUserQuery) => {
        setRefreshing(true);
        try {
            const data = await adminUserService.getUsers(currentQuery);
            setUsers(data.items);
            setTotal(data.total);
            setTotalPages(data.totalPages);
            setQuery(currentQuery);
        } catch (error: any) {
            addToast(error.message || 'Không thể tải danh sách người dùng', 'error');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [addToast]);

    useEffect(() => {
        fetchUsers(query);
    }, [fetchUsers]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchUsers({ ...query, search: searchInput, page: 1 });
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            fetchUsers({ ...query, page: newPage });
        }
    };

    const handleRoleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        const newRole = val ? (val as UserRole) : undefined;
        fetchUsers({ ...query, role: newRole, page: 1 });
    };

    const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        const newStatus = val ? (val as UserStatus) : undefined;
        fetchUsers({ ...query, status: newStatus, page: 1 });
    };

    const triggerAction = (user: AdminUser, type: 'BAN' | 'UNBAN' | 'CHANGE_ROLE', newRole?: UserRole) => {
        if (type === 'CHANGE_ROLE' && !newRole) return;
        setSelectedUser(user);
        setConfirmAction({ type, newRole });
        setIsConfirmModalOpen(true);
    };

    const executeAction = async () => {
        if (!selectedUser || !confirmAction) return;

        setRefreshing(true);
        try {
            if (confirmAction.type === 'BAN') {
                await adminUserService.updateStatus(selectedUser.userId, { status: 'SUSPENDED' });
                addToast(`Đã khóa tài khoản ${selectedUser.fullName}`, 'success');
            } else if (confirmAction.type === 'UNBAN') {
                await adminUserService.updateStatus(selectedUser.userId, { status: 'ACTIVE' });
                addToast(`Đã mở khóa tài khoản ${selectedUser.fullName}`, 'success');
            } else if (confirmAction.type === 'CHANGE_ROLE' && confirmAction.newRole) {
                await adminUserService.updateRole(selectedUser.userId, { role: confirmAction.newRole });
                addToast(`Đã cập nhật vai trò ${confirmAction.newRole} cho ${selectedUser.fullName}`, 'success');
            }
            
            setIsConfirmModalOpen(false);
            setConfirmAction(null);
            fetchUsers(query);
        } catch (error: any) {
            addToast(error.message || 'Thực hiện thao tác thất bại', 'error');
        } finally {
            setRefreshing(false);
        }
    };

    const getStatusStyle = (status: UserStatus) => {
        switch (status) {
            case 'ACTIVE': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            case 'SUSPENDED': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
            default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
        }
    };

    const getRoleBadge = (role: UserRole) => {
        const roles = {
            ADMIN: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
            SELLER: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
            INSPECTOR: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
            SHIPPER: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            BUYER: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        };
        return roles[role] || roles.BUYER;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-brand-bg">
                <div className="flex flex-col items-center">
                    <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
                    <p className="mt-4 text-gray-400 font-bold uppercase tracking-widest text-xs">Đang tải người dùng...</p>
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
                            <span className="text-brand-primary text-xs animate-pulse">●</span>
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Quản trị hệ thống CycleX</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter leading-none mb-4">
                            User <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-blue-400">Management</span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-xl font-medium">
                            Kiểm soát quyền truy cập, thay đổi vai trò và giám sát trạng thái tài khoản người dùng bảo mật cao.
                        </p>
                    </div>
                </div>

                {/* Filters & Actions Bar */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10 items-center">
                    <form onSubmit={handleSearch} className="lg:col-span-5 relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-primary transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm Email hoặc Tên..." 
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/50 transition-all placeholder:text-gray-600"
                        />
                    </form>

                    <div className="lg:col-span-4 grid grid-cols-2 gap-4">
                        <div className="relative">
                            <select 
                                onChange={handleRoleFilter}
                                value={query.role || ''}
                                className="w-full appearance-none px-6 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 focus:outline-none focus:border-brand-primary/50 cursor-pointer"
                            >
                                <option value="" className="bg-brand-bg">Tất cả vai trò</option>
                                {['BUYER', 'SELLER', 'SHIPPER', 'INSPECTOR', 'ADMIN'].map(r => (
                                    <option key={r} value={r} className="bg-brand-bg">{r}</option>
                                ))}
                            </select>
                            <Filter className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" size={14} />
                        </div>
                        <div className="relative">
                            <select 
                                onChange={handleStatusFilter}
                                value={query.status || ''}
                                className="w-full appearance-none px-6 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 focus:outline-none focus:border-brand-primary/50 cursor-pointer"
                            >
                                <option value="" className="bg-brand-bg">Tất cả trạng thái</option>
                                <option value="ACTIVE" className="bg-brand-bg text-emerald-400">ACTIVE</option>
                                <option value="SUSPENDED" className="bg-brand-bg text-rose-400">SUSPENDED</option>
                            </select>
                            <Filter className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" size={14} />
                        </div>
                    </div>

                    <div className="lg:col-span-3 flex justify-end">
                        <button 
                            onClick={() => fetchUsers(query)}
                            disabled={refreshing}
                            className={`flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-white hover:bg-white/10 transition-all ${refreshing ? 'cursor-not-allowed opacity-50' : ''}`}
                        >
                            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                            Làm mới
                        </button>
                    </div>
                </div>

                {/* Table Section */}
                <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl animate-fade-in mb-10">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Người dùng</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Vai trò</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Trạng thái</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {users.map((user) => (
                                    <tr key={user.userId} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 text-white flex items-center justify-center font-black text-sm group-hover:scale-110 transition-transform origin-left">
                                                    {user.fullName.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-white group-hover:text-brand-primary transition-colors">{user.fullName}</p>
                                                    <p className="text-[11px] font-bold text-gray-500 mt-0.5 tracking-tight">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="relative group/role">
                                                <select 
                                                    value={user.role} 
                                                    onChange={(e) => triggerAction(user, 'CHANGE_ROLE', e.target.value as UserRole)}
                                                    className={`appearance-none px-4 py-1.5 rounded-xl border text-[10px] font-black tracking-widest uppercase transition-all focus:outline-none cursor-pointer pr-8 ${getRoleBadge(user.role)}`}
                                                >
                                                    {['BUYER', 'SELLER', 'SHIPPER', 'INSPECTOR', 'ADMIN'].map(r => (
                                                        <option key={r} value={r} className="bg-brand-bg text-white">{r}</option>
                                                    ))}
                                                </select>
                                                <UserCog size={10} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" />
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest border uppercase transition-all ${getStatusStyle(user.status)}`}>
                                                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                {user.status === 'ACTIVE' ? (
                                                    <button 
                                                        onClick={() => triggerAction(user, 'BAN')}
                                                        className="p-3 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-glow-red active:scale-95"
                                                        title="Khóa tài khoản"
                                                    >
                                                        <Ban size={18} strokeWidth={2.5} />
                                                    </button>
                                                ) : (
                                                    <button 
                                                        onClick={() => triggerAction(user, 'UNBAN')}
                                                        className="p-3 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all shadow-glow-emerald active:scale-95"
                                                        title="Mở khóa tài khoản"
                                                    >
                                                        <ShieldCheck size={18} strokeWidth={2.5} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {!refreshing && users.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-32 text-center">
                            <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mb-6 text-gray-700">
                                <User size={48} />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-2">Không tìm thấy kết quả</h3>
                            <p className="text-gray-500 font-medium">Thử điều chỉnh điều kiện lọc hoặc từ khóa tìm kiếm.</p>
                        </div>
                    )}

                    {/* Pagination Bar */}
                    {!loading && totalPages > 1 && (
                        <div className="px-8 py-6 border-t border-white/5 flex items-center justify-between bg-white/[0.01]">
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                                Trang <span className="text-white">{query.page}</span> / <span className="text-white">{totalPages}</span> ({total} Kết quả)
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

                {/* CONFIRMATION MODAL */}
                {isConfirmModalOpen && selectedUser && confirmAction && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-bg/80 backdrop-blur-xl animate-fade-in shadow-glow-orange cursor-default">
                        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl animate-scale-in relative overflow-hidden">
                            {/* Accent Decoration */}
                            <div className={`absolute top-0 inset-x-0 h-2 ${
                                confirmAction.type === 'BAN' ? 'bg-rose-500' : 
                                confirmAction.type === 'UNBAN' ? 'bg-emerald-500' : 'bg-brand-primary'
                            }`} />
                            
                            <button 
                                onClick={() => setIsConfirmModalOpen(false)}
                                className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>

                            <div className="text-center">
                                <div className={`w-20 h-20 rounded-3xl mx-auto mb-8 flex items-center justify-center ${
                                    confirmAction.type === 'BAN' ? 'bg-rose-500/20 text-rose-500 shadow-glow-red' : 
                                    confirmAction.type === 'UNBAN' ? 'bg-emerald-500/20 text-emerald-500 shadow-glow-emerald' : 'bg-brand-primary/20 text-brand-primary shadow-glow-orange'
                                }`}>
                                    {confirmAction.type === 'BAN' && <Ban size={40} strokeWidth={2.5} />}
                                    {confirmAction.type === 'UNBAN' && <ShieldCheck size={40} strokeWidth={2.5} />}
                                    {confirmAction.type === 'CHANGE_ROLE' && <UserCog size={40} strokeWidth={2.5} />}
                                </div>

                                <h2 className="text-3xl font-black text-white mb-4 tracking-tight leading-tight">
                                    {confirmAction.type === 'BAN' && "Khóa tài khoản?"}
                                    {confirmAction.type === 'UNBAN' && "Mở khóa tài khoản?"}
                                    {confirmAction.type === 'CHANGE_ROLE' && "Thay đổi vai trò?"}
                                </h2>
                                
                                <p className="text-gray-400 font-medium mb-10 leading-relaxed text-sm">
                                    {confirmAction.type === 'BAN' && <span>Bạn có chắc chắn muốn khóa tài khoản của <b>{selectedUser.fullName}</b>? Người dùng này sẽ không thể đăng nhập.</span>}
                                    {confirmAction.type === 'UNBAN' && <span>Khôi phục quyền truy cập cho <b>{selectedUser.fullName}</b>?</span>}
                                    {confirmAction.type === 'CHANGE_ROLE' && <span>Cập nhật vai trò từ <b>{selectedUser.role}</b> thành <b className="text-brand-primary">{confirmAction.newRole}</b> cho người dùng này?</span>}
                                </p>

                                <div className="grid grid-cols-2 gap-4">
                                    <button 
                                        onClick={() => setIsConfirmModalOpen(false)}
                                        className="py-4 bg-white/5 text-gray-400 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-white/10 transition-all active:scale-[0.98]"
                                    >
                                        Hủy bỏ
                                    </button>
                                    <button 
                                        onClick={executeAction}
                                        className={`py-4 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all shadow-xl active:scale-[0.98] ${
                                            confirmAction.type === 'BAN' ? 'bg-rose-600 text-white shadow-rose-900/20 hover:bg-rose-500' : 
                                            confirmAction.type === 'UNBAN' ? 'bg-emerald-600 text-white shadow-emerald-900/20 hover:bg-emerald-500' : 
                                            'bg-brand-primary text-white shadow-brand-primary/20 hover:bg-brand-primary-hover'
                                        }`}
                                    >
                                        Xác nhận
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
