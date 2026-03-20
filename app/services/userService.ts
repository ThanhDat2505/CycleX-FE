import { UpdateProfileRequest, ChangePasswordRequest, UserProfileResponse } from '@/app/types/user';
import { apiCallGET, apiCallPUT } from '../utils/apiHelpers';
import { validateObject, validateString } from '../utils/apiValidation';
import { authService } from './authService';

export const userService = {
    /**
     * S-04 Get User Profile
     * endpoint: GET /api/users/{userId}
     */
    getUserProfile: async (userId: number | string): Promise<UserProfileResponse | null> => {
        try {
            const data = await apiCallGET<any>(`/users/${userId}`);
            if (!data) return null;

            // Safe Array Check/fallback if BE returns array randomly
            const profile = Array.isArray(data) ? data[0] : data;

            validateObject(profile, 'User Profile API Response');
            validateString(profile.email, 'email');

            // Safe fallback mappings to assure standard display for UI component:
            return {
                userId: Number(profile.userId || profile.id || userId),
                email: String(profile.email || '---'),
                phone: String(profile.phone || '---'),
                fullName: String(profile.fullName || '---'),
                role: profile.role || 'BUYER',
                status: profile.status || 'ACTIVE',
                cccd: String(profile.cccd || '---'),
                avatarUrl: profile.avatarUrl ? String(profile.avatarUrl) : null,
                address: profile.address ? String(profile.address) : undefined,
                isVerify: Boolean(profile.isVerify)
            };
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu User Profile: ', error);
            throw error;
        }
    },

    /**
     * S-04 Update User Profile
     * endpoint: PUT /api/users/{userId}
     */
    updateUserProfile: async (userId: number | string, data: UpdateProfileRequest): Promise<UserProfileResponse> => {
        try {
            const response = await apiCallPUT<any>(`/users/${userId}`, data);

            // Validating that response is at minimum an object, not array, not null.
            if (!response || typeof response !== 'object' || Array.isArray(response)) {
                // Return optimistic fallback if BE returns no content or an erratic string 
                return {
                    userId: Number(userId),
                    email: '---', // Will be preserved by state merging in UI
                    fullName: String(data.fullName),
                    phone: String(data.phone),
                    avatarUrl: data.avatarUrl ? String(data.avatarUrl) : null,
                    address: data.address || undefined,
                    cccd: '---',
                    role: 'BUYER',
                    status: 'ACTIVE',
                    isVerify: true
                };
            }

            return {
                userId: Number(response.userId || response.id || userId),
                email: String(response.email || '---'),
                phone: String(response.phone || data.phone || '---'),
                fullName: String(response.fullName || data.fullName || '---'),
                role: response.role || 'BUYER',
                status: response.status || 'ACTIVE',
                cccd: String(response.cccd || '---'),
                avatarUrl: response.avatarUrl ? String(response.avatarUrl) : data.avatarUrl || null,
                address: response.address ? String(response.address) : data.address || undefined,
                isVerify: Boolean(response.isVerify)
            };

        } catch (error: any) {
            console.error(`Lỗi API Update User Profile ${userId}:`, error);
            const errMessage = error?.message || 'Lỗi kết nối khi cập nhật hồ sơ.';
            throw new Error(errMessage);
        }
    },

    /**
     * S-04 Change Password
     * endpoint: PUT /api/users/{userId}/password (Assumed REST path)
     */
    changePassword: async (userId: number | string, data: ChangePasswordRequest): Promise<void> => {
        try {
            const response = await apiCallPUT<any>(`/users/${userId}/password`, data);

            if (response && typeof response === 'object' && response.error) {
                throw new Error(String(response.error));
            }
        } catch (error: any) {
            console.error(`Lỗi API Change Password ${userId}:`, error);
            const errMessage = error?.message || 'Lỗi kết nối khi đổi mật khẩu.';
            throw new Error(errMessage);
        }
    }
};
