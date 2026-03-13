export type UserRole = "BUYER" | "SELLER" | "ADMIN" | "INSPECTOR" | "SHIPPER";
export type UserStatus = "ACTIVE" | "SUSPENDED";

export interface AdminUser {
    userId: number;
    email: string;
    phone: string;
    fullName: string;
    cccd?: string;
    role: UserRole;
    status: UserStatus;
    avatarUrl?: string | null;
    address?: string;
    isVerify: boolean;
    createdAt: string;
    updatedAt?: string;
}

export interface AdminUserListResponse {
    items: AdminUser[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface AdminUserQuery {
    page?: number;
    pageSize?: number;
    search?: string; // Search by name or email
    role?: UserRole;
    status?: UserStatus;
}

export interface AdminUpdateUserRequest {
    fullName?: string;
    email?: string;
    phone?: string;
}

export interface AdminUpdateRoleRequest {
    role: UserRole;
}

export interface AdminUpdateStatusRequest {
    status: UserStatus;
}
