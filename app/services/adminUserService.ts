import { apiCallGET, apiCallPUT, apiCallPATCH } from '../utils/apiHelpers';
import { 
    AdminUser, 
    AdminUserListResponse, 
    AdminUserQuery, 
    AdminUpdateUserRequest, 
    AdminUpdateRoleRequest, 
    AdminUpdateStatusRequest 
} from '../types/adminUser';

const USE_MOCK_API = process.env.NEXT_PUBLIC_MOCK_API === 'true';

// --- MOCK DATA FOR DEMO PURPOSES ---
let mockUsers: AdminUser[] = Array.from({ length: 50 }).map((_, i) => ({
    userId: i + 1,
    email: `user${i + 1}@example.com`,
    phone: `0900000${(i + 1).toString().padStart(3, '0')}`,
    fullName: `Nguyễn Văn ${String.fromCharCode(65 + (i % 26))}${i + 1}`,
    role: i === 0 ? 'ADMIN' : (i % 3 === 0 ? 'SELLER' : 'BUYER'),
    status: i % 10 === 0 ? 'SUSPENDED' : 'ACTIVE',
    isVerify: i % 5 !== 0,
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
}));

export const adminUserService = {
    /**
     * Get list of users with pagination and filtering
     */
    getUsers: async (query: AdminUserQuery): Promise<AdminUserListResponse> => {
        if (USE_MOCK_API) {
            await new Promise(resolve => setTimeout(resolve, 800));
            
            let filtered = [...mockUsers];
            
            if (query.search) {
                const s = query.search.toLowerCase();
                filtered = filtered.filter(u => 
                    u.fullName.toLowerCase().includes(s) || 
                    u.email.toLowerCase().includes(s)
                );
            }
            if (query.role) filtered = filtered.filter(u => u.role === query.role);
            if (query.status) filtered = filtered.filter(u => u.status === query.status);

            const page = query.page || 1;
            const pageSize = query.pageSize || 10;
            const total = filtered.length;
            const totalPages = Math.ceil(total / pageSize);
            const items = filtered.slice((page - 1) * pageSize, page * pageSize);

            return {
                items,
                total,
                page,
                pageSize,
                totalPages
            };
        }

        // Real API Call
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
        if (USE_MOCK_API) {
            await new Promise(resolve => setTimeout(resolve, 500));
            const user = mockUsers.find(u => u.userId === userId);
            if (!user) throw new Error('User not found');
            return user;
        }

        return apiCallGET<AdminUser>(`/admin/users/${userId}`);
    },

    /**
     * Update user information (Name, Email, etc.)
     */
    updateUser: async (userId: number, data: AdminUpdateUserRequest): Promise<AdminUser> => {
        if (USE_MOCK_API) {
            await new Promise(resolve => setTimeout(resolve, 600));
            const index = mockUsers.findIndex(u => u.userId === userId);
            if (index === -1) throw new Error('User not found');
            
            mockUsers[index] = { ...mockUsers[index], ...data };
            return mockUsers[index];
        }

        return apiCallPUT<AdminUser>(`/admin/users/${userId}`, data);
    },

    /**
     * Change User Role
     */
    updateRole: async (userId: number, data: AdminUpdateRoleRequest): Promise<AdminUser> => {
        if (USE_MOCK_API) {
            await new Promise(resolve => setTimeout(resolve, 600));
            const index = mockUsers.findIndex(u => u.userId === userId);
            if (index === -1) throw new Error('User not found');
            
            mockUsers[index] = { ...mockUsers[index], role: data.role };
            return mockUsers[index];
        }

        return apiCallPATCH<AdminUser>(`/admin/users/${userId}/role`, data);
    },

    /**
     * Change User Status (ACTIVE, SUSPENDED, BANNED)
     */
    updateStatus: async (userId: number, data: AdminUpdateStatusRequest): Promise<AdminUser> => {
        if (USE_MOCK_API) {
            await new Promise(resolve => setTimeout(resolve, 600));
            const index = mockUsers.findIndex(u => u.userId === userId);
            if (index === -1) throw new Error('User not found');
            
            mockUsers[index] = { ...mockUsers[index], status: data.status };
            return mockUsers[index];
        }

        return apiCallPATCH<AdminUser>(`/admin/users/${userId}/status`, data);
    }
};
