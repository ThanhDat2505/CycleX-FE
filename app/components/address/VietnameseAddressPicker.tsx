"use client";

import { useState, useEffect, useCallback } from "react";
import { vietnameseProvinceService } from "@/app/services/vietnameseProvinceService";
import { Province, District, Ward } from "@/app/types/address";

interface VietnameseAddressPickerProps {
  province?: string;
  district?: string;
  ward?: string;
  streetAddress?: string;
  onChange: (data: {
    province: string;
    district: string;
    ward: string;
    streetAddress: string;
    fullAddress: string;
  }) => void;
  disabled?: boolean;
  errors?: {
    province?: string;
    district?: string;
    ward?: string;
    streetAddress?: string;
  };
}

const SELECT_STYLES = `
    w-full px-4 py-3 border rounded-lg 
    focus:ring-2 focus:ring-orange-500 focus:border-orange-500 
    outline-none transition-all bg-white
    appearance-none cursor-pointer
`;

const LABEL_STYLES = "block text-gray-700 font-medium mb-2 text-sm";

function buildFullAddress(
  street: string,
  ward: string,
  district: string,
  province: string,
): string {
  const parts = [street, ward, district, province].filter(Boolean);
  return parts.join(", ");
}

export default function VietnameseAddressPicker({
  province: initProvince = "",
  district: initDistrict = "",
  ward: initWard = "",
  streetAddress: initStreet = "",
  onChange,
  disabled = false,
  errors,
}: VietnameseAddressPickerProps) {
  // Province/District/Ward data from API
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  // Selected codes (for cascading)
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<
    number | null
  >(null);
  const [selectedDistrictCode, setSelectedDistrictCode] = useState<
    number | null
  >(null);

  // Selected names (for display & saving)
  const [selectedProvince, setSelectedProvince] = useState(initProvince);
  const [selectedDistrict, setSelectedDistrict] = useState(initDistrict);
  const [selectedWard, setSelectedWard] = useState(initWard);
  const [streetAddress, setStreetAddress] = useState(initStreet);

  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingWards, setIsLoadingWards] = useState(false);

  // Load provinces on mount
  useEffect(() => {
    let cancelled = false;
    setIsLoadingProvinces(true);
    vietnameseProvinceService
      .getProvinces()
      .then((data) => {
        if (!cancelled) {
          setProvinces(data);
          // If initProvince is set, find and set the code
          if (initProvince) {
            const found = data.find((p) => p.name === initProvince);
            if (found) setSelectedProvinceCode(found.code);
          }
        }
      })
      .catch(() => {
        /* silently fail */
      })
      .finally(() => {
        if (!cancelled) setIsLoadingProvinces(false);
      });
    return () => {
      cancelled = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Load districts when province changes
  useEffect(() => {
    if (!selectedProvinceCode) {
      setDistricts([]);
      setWards([]);
      return;
    }
    let cancelled = false;
    setIsLoadingDistricts(true);
    vietnameseProvinceService
      .getDistricts(selectedProvinceCode)
      .then((data) => {
        if (!cancelled) {
          setDistricts(data.districts || []);
          // If initDistrict is set, find the code
          if (initDistrict) {
            const found = (data.districts || []).find(
              (d) => d.name === initDistrict,
            );
            if (found) setSelectedDistrictCode(found.code);
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoadingDistricts(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedProvinceCode]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load wards when district changes
  useEffect(() => {
    if (!selectedDistrictCode) {
      setWards([]);
      return;
    }
    let cancelled = false;
    setIsLoadingWards(true);
    vietnameseProvinceService
      .getWards(selectedDistrictCode)
      .then((data) => {
        if (!cancelled) setWards(data.wards || []);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoadingWards(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedDistrictCode]);

  // Notify parent on change
  const notifyChange = useCallback(
    (p: string, d: string, w: string, s: string) => {
      onChange({
        province: p,
        district: d,
        ward: w,
        streetAddress: s,
        fullAddress: buildFullAddress(s, w, d, p),
      });
    },
    [onChange],
  );

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = Number(e.target.value);
    const prov = provinces.find((p) => p.code === code);
    const name = prov?.name || "";

    setSelectedProvinceCode(code || null);
    setSelectedProvince(name);
    setSelectedDistrictCode(null);
    setSelectedDistrict("");
    setSelectedWard("");
    setDistricts([]);
    setWards([]);

    notifyChange(name, "", "", streetAddress);
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = Number(e.target.value);
    const dist = districts.find((d) => d.code === code);
    const name = dist?.name || "";

    setSelectedDistrictCode(code || null);
    setSelectedDistrict(name);
    setSelectedWard("");
    setWards([]);

    notifyChange(selectedProvince, name, "", streetAddress);
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = Number(e.target.value);
    const w = wards.find((w) => w.code === code);
    const name = w?.name || "";

    setSelectedWard(name);
    notifyChange(selectedProvince, selectedDistrict, name, streetAddress);
  };

  const handleStreetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setStreetAddress(val);
    notifyChange(selectedProvince, selectedDistrict, selectedWard, val);
  };

  return (
    <div className="space-y-4">
      {/* Province / City */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="province-select" className={LABEL_STYLES}>
            Tỉnh/Thành phố <span className="text-red-500">*</span>
          </label>
          <select
            id="province-select"
            value={selectedProvinceCode || ""}
            onChange={handleProvinceChange}
            disabled={disabled || isLoadingProvinces}
            className={`${SELECT_STYLES} ${errors?.province ? "border-red-500" : "border-gray-300"} ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
          >
            <option value="">
              {isLoadingProvinces ? "Đang tải..." : "-- Chọn Tỉnh/TP --"}
            </option>
            {provinces.map((p) => (
              <option key={p.code} value={p.code}>
                {p.name}
              </option>
            ))}
          </select>
          {errors?.province && (
            <p className="mt-1 text-sm text-red-500">{errors.province}</p>
          )}
        </div>

        {/* District */}
        <div>
          <label htmlFor="district-select" className={LABEL_STYLES}>
            Quận/Huyện <span className="text-red-500">*</span>
          </label>
          <select
            id="district-select"
            value={selectedDistrictCode || ""}
            onChange={handleDistrictChange}
            disabled={disabled || isLoadingDistricts || !selectedProvinceCode}
            className={`${SELECT_STYLES} ${errors?.district ? "border-red-500" : "border-gray-300"} ${disabled || !selectedProvinceCode ? "bg-gray-100 cursor-not-allowed" : ""}`}
          >
            <option value="">
              {isLoadingDistricts ? "Đang tải..." : "-- Chọn Quận/Huyện --"}
            </option>
            {districts.map((d) => (
              <option key={d.code} value={d.code}>
                {d.name}
              </option>
            ))}
          </select>
          {errors?.district && (
            <p className="mt-1 text-sm text-red-500">{errors.district}</p>
          )}
        </div>

        {/* Ward */}
        <div>
          <label htmlFor="ward-select" className={LABEL_STYLES}>
            Phường/Xã <span className="text-red-500">*</span>
          </label>
          <select
            id="ward-select"
            value={wards.find((w) => w.name === selectedWard)?.code || ""}
            onChange={handleWardChange}
            disabled={disabled || isLoadingWards || !selectedDistrictCode}
            className={`${SELECT_STYLES} ${errors?.ward ? "border-red-500" : "border-gray-300"} ${disabled || !selectedDistrictCode ? "bg-gray-100 cursor-not-allowed" : ""}`}
          >
            <option value="">
              {isLoadingWards ? "Đang tải..." : "-- Chọn Phường/Xã --"}
            </option>
            {wards.map((w) => (
              <option key={w.code} value={w.code}>
                {w.name}
              </option>
            ))}
          </select>
          {errors?.ward && (
            <p className="mt-1 text-sm text-red-500">{errors.ward}</p>
          )}
        </div>
      </div>

      {/* Street Address */}
      <div>
        <label htmlFor="street-address" className={LABEL_STYLES}>
          Địa chỉ chi tiết <span className="text-red-500">*</span>
        </label>
        <input
          id="street-address"
          type="text"
          value={streetAddress}
          onChange={handleStreetChange}
          placeholder="Số nhà, tên đường..."
          maxLength={300}
          disabled={disabled}
          className={`${SELECT_STYLES} ${errors?.streetAddress ? "border-red-500" : "border-gray-300"} ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
        />
        {errors?.streetAddress && (
          <p className="mt-1 text-sm text-red-500">{errors.streetAddress}</p>
        )}
      </div>
    </div>
  );
}
