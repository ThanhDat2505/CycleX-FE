'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
    Search, User, MoreVertical, Edit2, Shield, AlertTriangle, 
    CheckCircle, XCircle, RefreshCw, ChevronLeft, ChevronRight, Filter
} from 'lucide-react';
import { adminUserService } from '../../services/adminUserService';
import { AdminUser, AdminUserQuery, UserRole, UserStatus } from '../../types/adminUser';
import { useToast } from '../../contexts/ToastContext';
import { formatDate } from '../../utils/format';

export default function AdminUsersPage() {
    useEffect(() => {
        document.title = "User Management | Admin | CycleX";
    }, []);

    const { addToast } = useToast();
    
    // Data State
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState<AdminUserQuery>({ page: 1, pageSize: 10 });
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [searchInput, setSearchInput] = useState('');

    // Modal States
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

    // Active dropdown row
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

    const fetchUsers = useCallback(async (currentQuery: AdminUserQuery) => {
        setLoading(true);
        try {
            const data = await adminUserService.getUsers(currentQuery);
            setUsers(data.items);
            setTotal(data.total);
            setTotalPages(data.totalPages);
            setQuery(currentQuery);
        } catch (error: any) {
            addToast(error.message || 'Failed to load users', 'error');
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        fetchUsers(query);
    }, [fetchUsers]); // Intentionally omitting query to avoid loops, search handles updates manually

    // --- Actions ---
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

    const openModal = (user: AdminUser, type: 'view' | 'edit' | 'role' | 'status') => {
        setSelectedUser(user);
        setActiveDropdown(null);
        if (type === 'view') setIsViewModalOpen(true);
        if (type === 'edit') setIsEditModalOpen(true);
        if (type === 'role') setIsRoleModalOpen(true);
        if (type === 'status') setIsStatusModalOpen(true);
    };

    // --- Update Handlers ---
    const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedUser) return;
        
        const formData = new FormData(e.currentTarget);
        const fullName = formData.get('fullName') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;

        try {
            await adminUserService.updateUser(selectedUser.userId, { fullName, email, phone });
            addToast('User details updated successfully', 'success');
            setIsEditModalOpen(false);
            fetchUsers(query);
        } catch (error: any) {
            addToast(error.message || 'Failed to update user', 'error');
        }
    };

    const handleUpdateRole = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedUser) return;
        
        const formData = new FormData(e.currentTarget);
        const role = formData.get('role') as UserRole;

        try {
            await adminUserService.updateRole(selectedUser.userId, { role });
            addToast('User role updated successfully', 'success');
            setIsRoleModalOpen(false);
            fetchUsers(query);
        } catch (error: any) {
            addToast(error.message || 'Failed to update role', 'error');
        }
    };

    const handleUpdateStatus = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedUser) return;
        
        const formData = new FormData(e.currentTarget);
        const status = formData.get('status') as UserStatus;

        try {
            await adminUserService.updateStatus(selectedUser.userId, { status });
            addToast('User status updated successfully', 'success');
            setIsStatusModalOpen(false);
            fetchUsers(query);
        } catch (error: any) {
            addToast(error.message || 'Failed to update status', 'error');
        }
    };

    // --- Helpers ---
    const getStatusStyle = (status: UserStatus) => {
        switch (status) {
            case 'ACTIVE': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'SUSPENDED': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'BANNED': return 'bg-rose-50 text-rose-600 border-rose-100';
            case 'LOCKED': return 'bg-gray-100 text-gray-600 border-gray-200';
            default: return 'bg-gray-50 text-gray-500 border-gray-100';
        }
    };

    const getRoleBorder = (role: UserRole) => {
        switch (role) {
            case 'ADMIN': return 'border-l-4 border-l-rose-500';
            case 'SELLER': return 'border-l-4 border-l-purple-500';
            case 'INSPECTOR': return 'border-l-4 border-l-amber-500';
            case 'SHIPPER': return 'border-l-4 border-l-blue-500';
            default: return 'border-l-4 border-l-emerald-500';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">User Management</h1>
                        <p className="text-gray-500 mt-1">Manage accounts, roles, and system access.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => fetchUsers(query)}
                            className={`p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50 transition-all ${loading ? 'animate-spin' : ''}`}
                            title="Refresh Data"
                        >
                            <RefreshCw size={20} />
                        </button>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6 flex flex-col lg:flex-row gap-4 justify-between items-center">
                    <form onSubmit={handleSearch} className="relative w-full lg:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by name or email..." 
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </form>

                    <div className="flex w-full lg:w-auto gap-4">
                        <div className="relative w-1/2 lg:w-40">
                            <select 
                                onChange={handleRoleFilter}
                                value={query.role || ''}
                                className="w-full appearance-none px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
                            >
                                <option value="">All Roles</option>
                                <option value="BUYER">Buyer</option>
                                <option value="SELLER">Seller</option>
                                <option value="ADMIN">Admin</option>
                                <option value="INSPECTOR">Inspector</option>
                                <option value="SHIPPER">Shipper</option>
                            </select>
                            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                        </div>
                        <div className="relative w-1/2 lg:w-40">
                            <select 
                                onChange={handleStatusFilter}
                                value={query.status || ''}
                                className="w-full appearance-none px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
                            >
                                <option value="">All Statuses</option>
                                <option value="ACTIVE">Active</option>
                                <option value="INACTIVE">Inactive</option>
                                <option value="SUSPENDED">Suspended</option>
                                <option value="BANNED">Banned</option>
                                <option value="LOCKED">Locked</option>
                            </select>
                            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-visible min-h-[400px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center p-20">
                            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="mt-4 text-gray-500 font-medium text-sm">Loading users...</p>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-20 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                                <User size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">No users found</h3>
                            <p className="text-gray-500 text-sm">Try adjusting your search criteria or filters.</p>
                        </div>
                    ) : (
                        <div className="overflow-visible sm:overflow-x-auto min-h-[200px] pb-24">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/80 border-b border-gray-100 rounded-t-2xl">
                                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest rounded-tl-2xl">User</th>
                                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Contact</th>
                                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Role</th>
                                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right rounded-tr-2xl">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {users.map((user) => (
                                        <tr key={user.userId} className={`hover:bg-gray-50/50 transition-colors group ${getRoleBorder(user.role)}`}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                                                        {user.fullName.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{user.fullName}</p>
                                                        <p className="text-xs text-gray-500">ID: #{user.userId}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-gray-700">{user.email}</p>
                                                <p className="text-xs text-gray-500">{user.phone}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-[10px] font-black tracking-widest uppercase border border-gray-200">
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black tracking-widest border uppercase ${getStatusStyle(user.status)}`}>
                                                    {user.status === 'ACTIVE' && <CheckCircle size={10} strokeWidth={3} />}
                                                    {(user.status === 'SUSPENDED' || user.status === 'BANNED') && <AlertTriangle size={10} strokeWidth={3} />}
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right relative">
                                                <button 
                                                    onClick={() => setActiveDropdown(activeDropdown === user.userId ? null : user.userId)}
                                                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-200 transition-colors"
                                                >
                                                    <MoreVertical size={18} />
                                                </button>
                                                
                                                {/* Dropdown Menu */}
                                                {activeDropdown === user.userId && (
                                                    <div className="absolute right-6 top-10 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-20 py-1 overflow-hidden animate-fade-in origin-top-right">
                                                        <button 
                                                            onClick={() => openModal(user, 'view')}
                                                            className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                        >
                                                            <User size={14} className="text-gray-400" /> View Details
                                                        </button>
                                                        <button 
                                                            onClick={() => openModal(user, 'edit')}
                                                            className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                        >
                                                            <Edit2 size={14} className="text-blue-500" /> Edit Info
                                                        </button>
                                                        <button 
                                                            onClick={() => openModal(user, 'role')}
                                                            className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                        >
                                                            <Shield size={14} className="text-purple-500" /> Change Role
                                                        </button>
                                                        <div className="h-px bg-gray-100 my-1"></div>
                                                        <button 
                                                            onClick={() => openModal(user, 'status')}
                                                            className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                        >
                                                            <AlertTriangle size={14} className="text-amber-500" /> Manage Status
                                                        </button>
                                                    </div>
                                                )}
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
                                Showing <span className="font-bold text-gray-900">{(query.page! - 1) * query.pageSize! + 1}</span> to <span className="font-bold text-gray-900">{Math.min(query.page! * query.pageSize!, total)}</span> of <span className="font-bold text-gray-900">{total}</span> users
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

                {/* --- MODALS --- */}
                {/* 1. View Detail Modal */}
                {isViewModalOpen && selectedUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-scale-in">
                            <button onClick={() => setIsViewModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900">
                                <XCircle size={24} />
                            </button>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-2xl">
                                    {selectedUser.fullName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-gray-900">{selectedUser.fullName}</h2>
                                    <p className="text-sm font-medium text-gray-500">{selectedUser.email}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Role & Status</p>
                                    <div className="flex gap-2">
                                        <span className="inline-flex px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-[10px] font-black tracking-widest uppercase border border-gray-200">{selectedUser.role}</span>
                                        <span className={`inline-flex px-2.5 py-1 rounded-lg text-[10px] font-black tracking-widest border uppercase ${getStatusStyle(selectedUser.status)}`}>{selectedUser.status}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Phone Number</p>
                                    <p className="text-sm font-medium text-gray-900">{selectedUser.phone || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">CCCD (Identity ID)</p>
                                    <p className="text-sm font-medium text-gray-900">{selectedUser.cccd || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Verified Status</p>
                                    <p className="text-sm font-medium text-gray-900">{selectedUser.isVerify ? 'Verified Account' : 'Unverified'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Joined Date</p>
                                    <p className="text-sm font-medium text-gray-900">{formatDate(selectedUser.createdAt)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. Edit Info Modal */}
                {isEditModalOpen && selectedUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-scale-in">
                            <div className="mb-6">
                                <h2 className="text-xl font-black text-gray-900">Edit User Info</h2>
                                <p className="text-xs text-gray-500 mt-1">Update basic contact information for #{selectedUser.userId}</p>
                            </div>
                            <form onSubmit={handleUpdateUser} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Full Name</label>
                                    <input type="text" name="fullName" defaultValue={selectedUser.fullName} required autoFocus
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 font-medium" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Email Address</label>
                                    <input type="email" name="email" defaultValue={selectedUser.email} required
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 font-medium" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Phone Number</label>
                                    <input type="text" name="phone" defaultValue={selectedUser.phone} required
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 font-medium" />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
                                    <button type="submit" className="flex-1 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">Save Changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* 3. Change Role Modal */}
                {isRoleModalOpen && selectedUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-scale-in">
                            <div className="mb-6 flex items-center justify-center gap-3">
                                <Shield className="text-purple-500" size={24} />
                                <h2 className="text-xl font-black text-gray-900">Change Role</h2>
                            </div>
                            <form onSubmit={handleUpdateRole} className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 text-center mb-4">Select a new role for <span className="font-bold text-gray-900">{selectedUser.fullName}</span></p>
                                    <select name="role" defaultValue={selectedUser.role} className="w-full appearance-none px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 font-bold focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 cursor-pointer text-center">
                                        <option value="BUYER">BUYER</option>
                                        <option value="SELLER">SELLER</option>
                                        <option value="INSPECTOR">INSPECTOR</option>
                                        <option value="SHIPPER">SHIPPER</option>
                                        <option value="ADMIN">ADMIN</option>
                                    </select>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button type="button" onClick={() => setIsRoleModalOpen(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
                                    <button type="submit" className="flex-1 py-2.5 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200">Update Role</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* 4. Change Status Modal */}
                {isStatusModalOpen && selectedUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-scale-in border-t-8 border-t-amber-500">
                            <div className="mb-6 flex items-center justify-center gap-3">
                                <AlertTriangle className="text-amber-500" size={24} />
                                <h2 className="text-xl font-black text-gray-900">Manage Status</h2>
                            </div>
                            <form onSubmit={handleUpdateStatus} className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 text-center mb-4">Set system access status for <span className="font-bold text-gray-900">{selectedUser.fullName}</span></p>
                                    <select name="status" defaultValue={selectedUser.status} className="w-full appearance-none px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 font-bold focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 cursor-pointer text-center">
                                        <option value="ACTIVE">ACTIVE - Full Access</option>
                                        <option value="INACTIVE">INACTIVE</option>
                                        <option value="SUSPENDED">SUSPENDED - Temporarily Blocked</option>
                                        <option value="BANNED">BANNED - Permanently Blocked</option>
                                        <option value="LOCKED">LOCKED - Requires verification</option>
                                    </select>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button type="button" onClick={() => setIsStatusModalOpen(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
                                    <button type="submit" className="flex-1 py-2.5 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 transition-colors shadow-lg shadow-amber-200">Confirm Status</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
