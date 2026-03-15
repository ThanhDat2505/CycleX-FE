import { Province, ProvinceDetail, DistrictDetail } from '../types/address';

const VN_PROVINCES_API = 'https://provinces.open-api.vn/api';

export const vietnameseProvinceService = {
    /**
     * Get all provinces/cities
     */
    getProvinces: async (): Promise<Province[]> => {
        const res = await fetch(`${VN_PROVINCES_API}/?depth=1`);
        if (!res.ok) throw new Error('Không thể tải danh sách tỉnh/thành phố');
        return res.json();
    },

    /**
     * Get districts of a province
     */
    getDistricts: async (provinceCode: number): Promise<ProvinceDetail> => {
        const res = await fetch(`${VN_PROVINCES_API}/p/${provinceCode}?depth=2`);
        if (!res.ok) throw new Error('Không thể tải danh sách quận/huyện');
        return res.json();
    },

    /**
     * Get wards of a district
     */
    getWards: async (districtCode: number): Promise<DistrictDetail> => {
        const res = await fetch(`${VN_PROVINCES_API}/d/${districtCode}?depth=2`);
        if (!res.ok) throw new Error('Không thể tải danh sách phường/xã');
        return res.json();
    },
};
