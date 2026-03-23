import React from "react";
import { BIKE_CATEGORIES } from "@/app/constants/categories";
import { YEAR_OPTIONS } from "../constants";
import { ListingFormData } from "../types";
import VietnameseAddressPicker from "@/app/components/address/VietnameseAddressPicker";

interface Step1VehicleInfoProps {
  formData: ListingFormData;
  errors: Record<string, string>;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
  onAddressChange: (data: {
    province: string;
    district: string;
    ward: string;
    streetAddress: string;
    fullAddress: string;
  }) => void;
}

const Step1VehicleInfo: React.FC<Step1VehicleInfoProps> = ({
  formData,
  errors,
  onChange,
  onAddressChange,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Thông tin xe
      </h2>

      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Tiêu đề tin đăng <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={onChange}
          placeholder="VD: Giant Escape 3 2023 - Gần như mới"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary ${
            errors.title ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Brand */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Thương hiệu <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={onChange}
            placeholder="VD: Giant"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary ${
              errors.brand ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.brand && (
            <p className="text-red-500 text-sm mt-1">{errors.brand}</p>
          )}
        </div>

        {/* Model */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Dòng xe (Model) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={onChange}
            placeholder="VD: Escape 3"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary ${
              errors.model ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.model && (
            <p className="text-red-500 text-sm mt-1">{errors.model}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Loại xe <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={onChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary ${
              errors.category ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Chọn loại xe</option>
            {BIKE_CATEGORIES.map((cat) => (
              <option key={cat.slug} value={cat.apiValue}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">{errors.category}</p>
          )}
        </div>

        {/* Condition */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tình trạng <span className="text-red-500">*</span>
          </label>
          <select
            name="condition"
            value={formData.condition}
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            <option value="New">Mới 100%</option>
            <option value="Like New">Như mới (Like New)</option>
            <option value="Excellent">Rất tốt</option>
            <option value="Good">Tốt</option>
            <option value="Fair">Khá</option>
            <option value="Used">Đã sử dụng</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Year */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Năm sản xuất
          </label>
          <select
            name="year"
            value={formData.year}
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            {YEAR_OPTIONS.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Giá bán (VNĐ) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={onChange}
            placeholder="VD: 5000000"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary ${
              errors.price ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Usage Time */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Usage Time (Ngày bắt đầu sử dụng)
          </label>
          <input
            type="date"
            name="usageTime"
            value={formData.usageTime}
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>

        {/* Reason for Sale */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Lý do bán
          </label>
          <input
            type="text"
            name="reasonForSale"
            value={formData.reasonForSale}
            onChange={onChange}
            placeholder="VD: Lên đời xe mới"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>
      </div>

      {/* Address Picker */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Địa chỉ lấy hàng <span className="text-red-500">*</span>
        </h3>
        <VietnameseAddressPicker
          province={formData.addressProvince}
          district={formData.addressDistrict}
          ward={formData.addressWard}
          streetAddress={formData.addressStreet}
          onChange={onAddressChange}
          errors={{
            province: errors.location,
            streetAddress: errors.pickupAddress,
          }}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Mô tả chi tiết <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={onChange}
          placeholder="Mô tả về tình trạng hiện tại, các sửa chữa nếu có, và lý do bán..."
          rows={6}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
      </div>
    </div>
  );
};

export default React.memo(Step1VehicleInfo);
