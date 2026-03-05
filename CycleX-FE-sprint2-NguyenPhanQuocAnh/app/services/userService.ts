import { apiCallGET, apiCallPOST, apiCallPUT, apiCallDELETE } from '@/app/utils/apiHelpers';

// ============ Types ============
export interface CreateUserRequest {
  email: string;
  password: string;
  phone: string;
  cccd: string;
  role: 'BUYER' | 'SELLER' | 'INSPECTOR' | 'SHIPPER';
  fullName: string;
  status: 'ACTIVE' | 'INACTIVE';
  avatarUrl?: string | null;
  isVerify: boolean;
}

export interface UpdateUserRequest {
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface UserResponse {
  userId: number;
  email: string;
  phone: string;
  cccd: string;
  role: string;
  fullName: string;
  status: string;
  avatarUrl?: string;
  isVerify: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============ API Methods ============

/**
 * Create a new user
 * POST /api/users
 * @param userData - User data to create
 * @returns Created user object
 */
export const createUser = async (userData: CreateUserRequest): Promise<UserResponse> => {
  return apiCallPOST('/users', userData);
};

/**
 * Get all users
 * GET /api/users
 * @returns List of all users
 */
export const getAllUsers = async (): Promise<UserResponse[]> => {
  return apiCallGET('/users');
};

/**
 * Get user by ID
 * GET /api/users/{userId}
 * @param userId - User ID
 * @returns User object
 */
export const getUserById = async (userId: number): Promise<UserResponse> => {
  if (!userId) {
    throw new Error('userId is required');
  }
  return apiCallGET(`/users/${userId}`);
};

/**
 * Update user by ID
 * PUT /api/users/{userId}
 * @param userId - User ID
 * @param updateData - Fields to update
 * @returns Updated user object
 */
export const updateUser = async (userId: number, updateData: UpdateUserRequest): Promise<UserResponse> => {
  if (!userId) {
    throw new Error('userId is required');
  }
  return apiCallPUT(`/users/${userId}`, updateData);
};

/**
 * Delete user by ID
 * DELETE /api/users/{userId}
 * @param userId - User ID
 * @returns Confirmation message
 */
export const deleteUser = async (userId: number): Promise<{ message: string }> => {
  if (!userId) {
    throw new Error('userId is required');
  }
  return apiCallDELETE(`/users/${userId}`);
};
