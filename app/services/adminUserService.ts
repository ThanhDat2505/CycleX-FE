import { apiCallGET, apiCallPUT, apiCallPATCH, apiCallPOST } from '../utils/apiHelpers';
import {
    AdminUser,
    AdminUserListResponse,
    AdminUserQuery,
    AdminUpdateUserRequest,
    AdminUpdateRoleRequest,
    AdminUpdateStatusRequest,
    AdminCreateAccountRequest
} from '../types/adminUser';

export const adminUserService = {
    /**
     * Get list of users with pagination and filtering
     */
    getUsers: async (query: AdminUserQuery): Promise<AdminUserListResponse> => {
        const queryParams = new URLSearchParams();
        if (query.page) queryParams.append('page', query.page.toString());
        if (query.pageSize) queryParams.append('pageSize', query.pageSize.toString());
        if (query.search) queryParams.append('search', query.search);
        if (query.role) queryParams.append('role', query.role);
        if (query.status) queryParams.append('status', query.status);

        return apiCallGET<AdminUserListResponse>(`/admin/users?${queryParams.toString()}`);
    },

    /**
     * Get specific user details
     */
    getUserById: async (userId: number): Promise<AdminUser> => {
        return apiCallGET<AdminUser>(`/admin/users/${userId}`);
    },

    /**
     * Update user information (Name, Email, etc.)
     */
    updateUser: async (userId: number, data: AdminUpdateUserRequest): Promise<AdminUser> => {
        return apiCallPUT<AdminUser>(`/admin/users/${userId}`, data);
    },

    /**
     * Change User Role
     */
    updateRole: async (userId: number, data: AdminUpdateRoleRequest): Promise<AdminUser> => {
        return apiCallPATCH<AdminUser>(`/admin/users/${userId}/role`, data);
    },

    /**
     * Change User Status (ACTIVE, SUSPENDED, BANNED)
     */
    updateStatus: async (userId: number, data: AdminUpdateStatusRequest): Promise<AdminUser> => {
        return apiCallPATCH<AdminUser>(`/admin/users/${userId}/status`, data);
    },

    /**
     * Create a new Shipper or Inspector account (auto verified)
     */
    createAccount: async (data: AdminCreateAccountRequest): Promise<AdminUser> => {
        return apiCallPOST<AdminUser>(`/admin/users`, data);
    }
};
