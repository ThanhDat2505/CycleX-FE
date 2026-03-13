// Types for user address management

export interface UserAddress {
    addressId: number;
    label: string;
    province: string;
    district: string;
    ward: string;
    streetAddress: string;
    fullAddress: string;
    receiverName?: string;
    receiverPhone?: string;
    isDefault: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateAddressRequest {
    label?: string;
    province: string;
    district: string;
    ward: string;
    streetAddress: string;
    receiverName?: string;
    receiverPhone?: string;
    isDefault?: boolean;
}

export interface UpdateAddressRequest {
    label?: string;
    province?: string;
    district?: string;
    ward?: string;
    streetAddress?: string;
    receiverName?: string;
    receiverPhone?: string;
    isDefault?: boolean;
}

// Vietnamese province API types
export interface Province {
    code: number;
    name: string;
}

export interface District {
    code: number;
    name: string;
}

export interface Ward {
    code: number;
    name: string;
}

export interface ProvinceDetail extends Province {
    districts: District[];
}

export interface DistrictDetail extends District {
    wards: Ward[];
}
