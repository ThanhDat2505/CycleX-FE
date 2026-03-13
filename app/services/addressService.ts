import { apiCallGET, apiCallPOST, apiCallPUT, apiCallDELETE, apiCallPATCH } from '../utils/apiHelpers';
import { UserAddress, CreateAddressRequest, UpdateAddressRequest } from '../types/address';

export const addressService = {
    /**
     * Get all addresses of a user
     */
    getAddresses: async (userId: number): Promise<UserAddress[]> => {
        const data = await apiCallGET<UserAddress[]>(`/users/${userId}/addresses`);
        return data || [];
    },

    /**
     * Get single address
     */
    getAddress: async (userId: number, addressId: number): Promise<UserAddress> => {
        return apiCallGET<UserAddress>(`/users/${userId}/addresses/${addressId}`);
    },

    /**
     * Create new address
     */
    createAddress: async (userId: number, req: CreateAddressRequest): Promise<UserAddress> => {
        return apiCallPOST<UserAddress>(`/users/${userId}/addresses`, req);
    },

    /**
     * Update an address
     */
    updateAddress: async (userId: number, addressId: number, req: UpdateAddressRequest): Promise<UserAddress> => {
        return apiCallPUT<UserAddress>(`/users/${userId}/addresses/${addressId}`, req);
    },

    /**
     * Delete an address
     */
    deleteAddress: async (userId: number, addressId: number): Promise<void> => {
        await apiCallDELETE<void>(`/users/${userId}/addresses/${addressId}`);
    },

    /**
     * Set an address as default
     */
    setDefault: async (userId: number, addressId: number): Promise<UserAddress> => {
        return apiCallPATCH<UserAddress>(`/users/${userId}/addresses/${addressId}/set-default`, {});
    },
};
