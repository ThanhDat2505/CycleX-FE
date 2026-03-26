"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  User,
  Shield,
  CheckCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Filter,
  Loader2,
  Ban,
  ShieldCheck,
  UserCog,
  X,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  CreditCard,
} from "lucide-react";
import { adminUserService } from "../../services/adminUserService";
import VietnameseAddressPicker from "../../components/address/VietnameseAddressPicker";
import {
  AdminUser,
  AdminUserQuery,
  UserRole,
  UserStatus,
} from "../../types/adminUser";
import { useToast } from "../../contexts/ToastContext";

export default function AdminUsersPage() {
  useEffect(() => {
    document.title = "Quản Lý Người Dùng | CycleX Admin";
  }, []);

  const { addToast } = useToast();

  // Data State
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState<AdminUserQuery>({ page: 1, pageSize: 10 });
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Modal/Action States
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: "BAN" | "UNBAN" | "CHANGE_ROLE";
    newRole?: UserRole;
  } | null>(null);

  // Create Account State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    role: "SHIPPER" as UserRole,
    cccd: "",
    address: "",
  });
  const [creating, setCreating] = useState(false);

  // Close modals on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsConfirmModalOpen(false);
        setIsCreateModalOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const fetchUsers = useCallback(
    async (currentQuery: AdminUserQuery) => {
      setRefreshing(true);
      try {
        const data = await adminUserService.getUsers(currentQuery);
        setUsers(data.items);
        setTotal(data.total);
        setTotalPages(data.totalPages);
        setQuery(currentQuery);
      } catch (error: any) {
        addToast(
          error.message || "Không thể tải danh sách người dùng",
          "error",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [addToast],
  );

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

  const triggerAction = (
    user: AdminUser,
    type: "BAN" | "UNBAN" | "CHANGE_ROLE",
    newRole?: UserRole,
  ) => {
    if (type === "CHANGE_ROLE" && !newRole) return;
    setSelectedUser(user);
    setConfirmAction({ type, newRole });
    setIsConfirmModalOpen(true);
  };

  const executeAction = async () => {
    if (!selectedUser || !confirmAction) return;

    setRefreshing(true);
    try {
      if (confirmAction.type === "BAN") {
        await adminUserService.updateStatus(selectedUser.userId, {
          status: "SUSPENDED",
        });
        addToast(`Đã khóa tài khoản ${selectedUser.fullName}`, "success");
      } else if (confirmAction.type === "UNBAN") {
        await adminUserService.updateStatus(selectedUser.userId, {
          status: "ACTIVE",
        });
        addToast(`Đã mở khóa tài khoản ${selectedUser.fullName}`, "success");
      } else if (
        confirmAction.type === "CHANGE_ROLE" &&
        confirmAction.newRole
      ) {
        await adminUserService.updateRole(selectedUser.userId, {
          role: confirmAction.newRole,
        });
        addToast(
          `Đã cập nhật vai trò ${confirmAction.newRole} cho ${selectedUser.fullName}`,
          "success",
        );
      }

      setIsConfirmModalOpen(false);
      setConfirmAction(null);
      fetchUsers(query);
    } catch (error: any) {
      addToast(error.message || "Thực hiện thao tác thất bại", "error");
    } finally {
      setRefreshing(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !createForm.email ||
      !createForm.password ||
      !createForm.fullName ||
      !createForm.phone
    ) {
      addToast("Vui lòng điền đầy đủ thông tin bắt buộc", "error");
      return;
    }
    setCreating(true);
    try {
      await adminUserService.createAccount(createForm);
      addToast(`Tạo tài khoản ${createForm.role} thành công!`, "success");
      setIsCreateModalOpen(false);
      setCreateForm({
        email: "",
        password: "",
        fullName: "",
        phone: "",
        role: "SHIPPER",
        cccd: "",
        address: "",
      });
      fetchUsers(query);
    } catch (error: any) {
      addToast(error.message || "Tạo tài khoản thất bại", "error");
    } finally {
      setCreating(false);
    }
  };

  const getStatusStyle = (status: UserStatus) => {
    switch (status) {
      case "ACTIVE":
        return "text-emerald-700 bg-emerald-50 border-emerald-200";
      case "SUSPENDED":
        return "text-rose-700 bg-rose-50 border-rose-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getRoleBadge = (role: UserRole) => {
    const roles = {
      ADMIN: "bg-rose-50 text-rose-700 border-rose-200",
      SELLER: "bg-indigo-50 text-indigo-700 border-indigo-200",
      INSPECTOR: "bg-amber-50 text-amber-700 border-amber-200",
      SHIPPER: "bg-blue-50 text-blue-700 border-blue-200",
      BUYER: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
    return roles[role] || roles.BUYER;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
          <p className="mt-4 text-gray-600 font-bold uppercase tracking-widest text-xs">
            Đang tải người dùng...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 p-4 lg:p-10 selection:bg-brand-primary/30 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-8 border-b border-gray-100">
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-gray-50 backdrop-blur-md border border-gray-200 rounded-full px-4 py-1.5 mb-4 shadow-xl">
              <span className="text-brand-primary text-xs animate-pulse">
                ●
              </span>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-600">
                Quản trị hệ thống CycleX
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter leading-none mb-4">
              Quản Lý{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-blue-400">
                Người Dùng
              </span>
            </h1>
            <p className="text-gray-600 text-lg max-w-xl font-medium">
              Kiểm soát quyền truy cập, thay đổi vai trò và giám sát trạng thái
              tài khoản người dùng bảo mật cao.
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-3 px-6 py-4 bg-brand-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-brand-primary/20 hover:bg-brand-primary-hover transition-all active:scale-[0.98]"
          >
            <UserPlus size={18} />
            Tạo Tài Khoản
          </button>
        </div>

        {/* Filters & Actions Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10 items-center">
          <form
            onSubmit={handleSearch}
            className="lg:col-span-5 relative group"
          >
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-primary transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="Tìm kiếm Email hoặc Tên..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-gray-50 backdrop-blur-xl border border-gray-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/50 transition-all placeholder:text-gray-600"
            />
          </form>

          <div className="lg:col-span-4 grid grid-cols-2 gap-4">
            <div className="relative">
              <select
                onChange={handleRoleFilter}
                value={query.role || ""}
                className="w-full appearance-none px-6 py-4 bg-gray-50 backdrop-blur-xl border border-gray-200 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-700 focus:outline-none focus:border-brand-primary/50 cursor-pointer"
              >
                <option value="" className="bg-white">
                  Tất cả vai trò
                </option>
                {["BUYER", "SELLER", "SHIPPER", "INSPECTOR"].map((r) => (
                  <option key={r} value={r} className="bg-white">
                    {r}
                  </option>
                ))}
              </select>
              <Filter
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
                size={14}
              />
            </div>
            <div className="relative">
              <select
                onChange={handleStatusFilter}
                value={query.status || ""}
                className="w-full appearance-none px-6 py-4 bg-gray-50 backdrop-blur-xl border border-gray-200 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-700 focus:outline-none focus:border-brand-primary/50 cursor-pointer"
              >
                <option value="" className="bg-white">
                  Tất cả trạng thái
                </option>
                <option value="ACTIVE" className="bg-white text-emerald-400">
                  ACTIVE
                </option>
                <option value="SUSPENDED" className="bg-white text-rose-400">
                  SUSPENDED
                </option>
              </select>
              <Filter
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
                size={14}
              />
            </div>
          </div>

          <div className="lg:col-span-3 flex justify-end">
            <button
              onClick={() => fetchUsers(query)}
              disabled={refreshing}
              className={`flex items-center gap-3 px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all ${refreshing ? "cursor-not-allowed opacity-50" : ""}`}
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
              Làm mới
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="relative bg-gray-50 backdrop-blur-3xl border border-gray-200 rounded-[2rem] overflow-hidden shadow-2xl animate-fade-in mb-10">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                    Người dùng
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                    Vai trò
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                    Trạng thái
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-right">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr
                    key={user.userId}
                    className="group hover:bg-white transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-200 to-transparent border border-gray-200 text-gray-900 flex items-center justify-center font-black text-sm group-hover:scale-110 transition-transform origin-left">
                          {user.fullName?.charAt(0).toUpperCase() ?? "?"}
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900 group-hover:text-brand-primary transition-colors">
                            {user.fullName ?? "N/A"}
                          </p>
                          <p className="text-[11px] font-bold text-gray-500 mt-0.5 tracking-tight">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="relative group/role">
                        <select
                          value={user.role}
                          onChange={(e) =>
                            triggerAction(
                              user,
                              "CHANGE_ROLE",
                              e.target.value as UserRole,
                            )
                          }
                          className={`appearance-none px-4 py-1.5 rounded-xl border text-[10px] font-black tracking-widest uppercase transition-all focus:outline-none cursor-pointer pr-8 ${getRoleBadge(user.role)}`}
                        >
                          {["BUYER", "SELLER", "SHIPPER", "INSPECTOR"].map(
                            (r) => (
                              <option
                                key={r}
                                value={r}
                                className="bg-white text-gray-900"
                              >
                                {r}
                              </option>
                            ),
                          )}
                        </select>
                        <UserCog
                          size={10}
                          className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none"
                        />
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest border uppercase transition-all ${getStatusStyle(user.status)}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        {user.status === "ACTIVE" ? (
                          <button
                            onClick={() => triggerAction(user, "BAN")}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl hover:bg-rose-600 hover:text-white transition-all text-xs font-semibold active:scale-95"
                            title="Khóa tài khoản"
                          >
                            <Ban size={15} strokeWidth={2.5} />
                            Khóa
                          </button>
                        ) : (
                          <button
                            onClick={() => triggerAction(user, "UNBAN")}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-xl hover:bg-emerald-600 hover:text-white transition-all text-xs font-semibold active:scale-95"
                            title="Mở khóa tài khoản"
                          >
                            <ShieldCheck size={15} strokeWidth={2.5} />
                            Mở khóa
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
              <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mb-6 text-gray-700">
                <User size={48} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">
                Không tìm thấy kết quả
              </h3>
              <p className="text-gray-500 font-medium">
                Thử điều chỉnh điều kiện lọc hoặc từ khóa tìm kiếm.
              </p>
            </div>
          )}

          {/* Pagination Bar */}
          {!loading && totalPages > 1 && (
            <div className="px-8 py-6 border-t border-gray-100 flex items-center justify-between bg-white">
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                Trang <span className="text-gray-900">{query.page}</span> /{" "}
                <span className="text-gray-900">{totalPages}</span> ({total} Kết
                quả)
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => handlePageChange(query.page! - 1)}
                  disabled={query.page === 1}
                  className="p-3 rounded-2xl border border-gray-200 text-gray-400 disabled:opacity-20 hover:bg-gray-100 hover:text-gray-900 transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => handlePageChange(query.page! + 1)}
                  disabled={query.page === totalPages}
                  className="p-3 rounded-2xl border border-gray-200 text-gray-400 disabled:opacity-20 hover:bg-gray-100 hover:text-gray-900 transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* CONFIRMATION MODAL */}
        {isConfirmModalOpen && selectedUser && confirmAction && (
          <div
            onMouseDown={() => setIsConfirmModalOpen(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xl animate-fade-in shadow-glow-orange cursor-default"
          >
            <div
              onMouseDown={(e) => e.stopPropagation()}
              className="bg-gray-50 backdrop-blur-2xl border border-gray-300 rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl animate-scale-in relative overflow-hidden"
            >
              {/* Accent Decoration */}
              <div
                className={`absolute top-0 inset-x-0 h-2 ${(() => {
                  if (confirmAction.type === "BAN") return "bg-rose-500";
                  if (confirmAction.type === "UNBAN") return "bg-emerald-500";
                  return "bg-brand-primary";
                })()}`}
              />

              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="absolute top-8 right-8 text-gray-500 hover:text-gray-900 transition-colors"
              >
                <X size={24} />
              </button>

              <div className="text-center">
                <div
                  className={`w-20 h-20 rounded-3xl mx-auto mb-8 flex items-center justify-center ${(() => {
                    if (confirmAction.type === "BAN")
                      return "bg-rose-500/20 text-rose-500 shadow-glow-red";
                    if (confirmAction.type === "UNBAN")
                      return "bg-emerald-500/20 text-emerald-500 shadow-glow-emerald";
                    return "bg-brand-primary/20 text-brand-primary shadow-glow-orange";
                  })()}`}
                >
                  {confirmAction.type === "BAN" && (
                    <Ban size={40} strokeWidth={2.5} />
                  )}
                  {confirmAction.type === "UNBAN" && (
                    <ShieldCheck size={40} strokeWidth={2.5} />
                  )}
                  {confirmAction.type === "CHANGE_ROLE" && (
                    <UserCog size={40} strokeWidth={2.5} />
                  )}
                </div>

                <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight leading-tight">
                  {confirmAction.type === "BAN" && "Khóa tài khoản?"}
                  {confirmAction.type === "UNBAN" && "Mở khóa tài khoản?"}
                  {confirmAction.type === "CHANGE_ROLE" && "Thay đổi vai trò?"}
                </h2>

                <p className="text-gray-600 font-medium mb-10 leading-relaxed text-sm">
                  {confirmAction.type === "BAN" && (
                    <span>
                      Bạn có chắc chắn muốn khóa tài khoản của{" "}
                      <b>{selectedUser.fullName}</b>? Người dùng này sẽ không
                      thể đăng nhập.
                    </span>
                  )}
                  {confirmAction.type === "UNBAN" && (
                    <span>
                      Khôi phục quyền truy cập cho{" "}
                      <b>{selectedUser.fullName}</b>?
                    </span>
                  )}
                  {confirmAction.type === "CHANGE_ROLE" && (
                    <span>
                      Cập nhật vai trò từ <b>{selectedUser.role}</b> thành{" "}
                      <b className="text-brand-primary">
                        {confirmAction.newRole}
                      </b>{" "}
                      cho người dùng này?
                    </span>
                  )}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setIsConfirmModalOpen(false)}
                    className="py-4 bg-gray-100 text-gray-700 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-gray-200 transition-all active:scale-[0.98]"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    onClick={executeAction}
                    className={`py-4 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all shadow-xl active:scale-[0.98] ${(() => {
                      if (confirmAction.type === "BAN")
                        return "bg-rose-600 text-white shadow-rose-900/20 hover:bg-rose-500";
                      if (confirmAction.type === "UNBAN")
                        return "bg-emerald-600 text-white shadow-emerald-900/20 hover:bg-emerald-500";
                      return "bg-brand-primary text-white shadow-brand-primary/20 hover:bg-brand-primary-hover";
                    })()}`}
                  >
                    Xác nhận
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CREATE ACCOUNT MODAL */}
        {isCreateModalOpen && (
          <div
            onMouseDown={() => setIsCreateModalOpen(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xl animate-fade-in cursor-default overflow-y-auto"
          >
            <div
              onMouseDown={(e) => e.stopPropagation()}
              className="bg-gray-50 backdrop-blur-2xl border border-gray-300 rounded-[2.5rem] p-10 max-w-lg w-full shadow-2xl animate-scale-in relative overflow-hidden my-auto"
            >
              <div className="absolute top-0 inset-x-0 h-2 bg-brand-primary" />

              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="absolute top-8 right-8 text-gray-500 hover:text-gray-900 transition-colors"
              >
                <X size={24} />
              </button>

              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center bg-brand-primary/20 text-brand-primary shadow-glow-orange">
                  <UserPlus size={40} strokeWidth={2.5} />
                </div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                  Tạo Tài Khoản Mới
                </h2>
                <p className="text-gray-600 text-sm font-medium mt-2">
                  Tạo tài khoản Shipper hoặc Inspector (email tự động xác thực)
                </p>
              </div>

              <form onSubmit={handleCreateAccount} className="space-y-4">
                {/* Role Selection */}
                <div className="grid grid-cols-2 gap-3">
                  {(["SHIPPER", "INSPECTOR"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setCreateForm({ ...createForm, role: r })}
                      className={`py-3 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all ${
                        createForm.role === r
                          ? "bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20"
                          : "bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>

                {/* Form Fields */}
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                    size={16}
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email *"
                    value={createForm.email}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, email: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/50 placeholder:text-gray-600"
                  />
                </div>

                <div className="relative">
                  <Shield
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                    size={16}
                  />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Mật khẩu * (tối thiểu 6 ký tự)"
                    value={createForm.password}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, password: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/50 placeholder:text-gray-600"
                  />
                </div>

                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                    size={16}
                  />
                  <input
                    type="text"
                    required
                    placeholder="Họ và tên *"
                    value={createForm.fullName}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, fullName: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/50 placeholder:text-gray-600"
                  />
                </div>

                <div className="relative">
                  <Phone
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                    size={16}
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Số điện thoại *"
                    value={createForm.phone}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, phone: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/50 placeholder:text-gray-600"
                  />
                </div>

                <div className="relative">
                  <CreditCard
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="CCCD"
                    value={createForm.cccd}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, cccd: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/50 placeholder:text-gray-600"
                  />
                </div>

                {/* Address Picker */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-400 text-xs font-bold">
                    <MapPin size={14} />
                    Địa chỉ
                  </div>
                  <div className="[&_label]:text-gray-400 [&_select]:bg-gray-50 [&_select]:border-gray-200 [&_select]:text-gray-900 [&_select]:rounded-xl [&_input]:bg-gray-50 [&_input]:border-gray-200 [&_input]:text-gray-900 [&_input]:rounded-xl [&_select]:text-sm [&_input]:text-sm [&_option]:bg-white [&_option]:text-gray-900">
                    <VietnameseAddressPicker
                      onChange={(data) =>
                        setCreateForm({
                          ...createForm,
                          address: data.fullAddress,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3 text-xs text-emerald-400 font-bold">
                  <CheckCircle size={14} />
                  Email sẽ tự động được xác thực (verified)
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="py-4 bg-gray-100 text-gray-700 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-gray-200 transition-all active:scale-[0.98]"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="py-4 bg-brand-primary text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-brand-primary/20 hover:bg-brand-primary-hover transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {creating ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <UserPlus size={16} />
                    )}
                    Tạo Tài Khoản
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
