export interface UpdateProfileRequest {
    fullName: string;
    phone: string;
    address?: string;
    avatarUrl?: string | null;
}

export interface ChangePasswordRequest {
    oldPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
}

export interface UserProfileResponse {
    userId: number;
    email: string;
    phone: string;
    cccd: string;
    role: "BUYER" | "SELLER" | "ADMIN" | "INSPECTOR" | "SHIPPER";
    fullName: string;
    status: "ACTIVE" | "INACTIVE" | "LOCKED";
    avatarUrl?: string | null;
    address?: string;
    isVerify: boolean;
    createdAt?: string;
    updatedAt?: string;
}
