import React from "react";
import { BIKE_CATEGORIES } from "@/app/constants/categories";
import { YEAR_OPTIONS } from "../constants";
import { ListingFormData } from "../types";

interface Step1VehicleInfoProps {
    formData: ListingFormData;
    errors: Record<string, string>;
    onChange: (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => void;
}

const Step1VehicleInfo: React.FC<Step1VehicleInfoProps> = ({
    formData,
    errors,
    onChange,
}) => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Vehicle Information
            </h2>

            {/* Title */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Listing Title <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={onChange}
                    placeholder="e.g., Giant Escape 3 2023 - Like New"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary ${errors.title ? "border-red-500" : "border-gray-300"
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
                        Brand <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={onChange}
                        placeholder="e.g., Giant"
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary ${errors.brand ? "border-red-500" : "border-gray-300"
                            }`}
                    />
                    {errors.brand && (
                        <p className="text-red-500 text-sm mt-1">{errors.brand}</p>
                    )}
                </div>

                {/* Model */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Model <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="model"
                        value={formData.model}
                        onChange={onChange}
                        placeholder="e.g., Escape 3"
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary ${errors.model ? "border-red-500" : "border-gray-300"
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
                        Category <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={onChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary ${errors.category ? "border-red-500" : "border-gray-300"
                            }`}
                    >
                        <option value="">Select Category</option>
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
                        Condition <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="condition"
                        value={formData.condition}
                        onChange={onChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    >
                        <option value="New">New (Mới 100%)</option>
                        <option value="Like New">Like New (Như mới)</option>
                        <option value="Excellent">Excellent (Rất tốt)</option>
                        <option value="Good">Good (Tốt)</option>
                        <option value="Fair">Fair (Khá)</option>
                        <option value="Used">Used (Đã sử dụng)</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Year */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Year
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
                        Price (VND) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={onChange}
                        placeholder="e.g., 5000000"
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary ${errors.price ? "border-red-500" : "border-gray-300"
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
                        Usage Time
                    </label>
                    <input
                        type="text"
                        name="usageTime"
                        value={formData.usageTime}
                        onChange={onChange}
                        placeholder="e.g., 6 months, 2 years"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                </div>

                {/* Reason for Sale */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Reason for Sale
                    </label>
                    <input
                        type="text"
                        name="reasonForSale"
                        value={formData.reasonForSale}
                        onChange={onChange}
                        placeholder="e.g., Upgrade to newer model"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                </div>
            </div>

            {/* Location */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={onChange}
                    placeholder="e.g., Ho Chi Minh, Ha Noi, Da Nang"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary ${errors.location ? "border-red-500" : "border-gray-300"
                        }`}
                />
                {errors.location && (
                    <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                )}
            </div>

            {/* Pickup Address */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pickup Address <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="pickupAddress"
                    value={formData.pickupAddress}
                    onChange={onChange}
                    placeholder="e.g., 123 Nguyen Hue, Quan 1, TP.HCM"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary ${errors.pickupAddress ? "border-red-500" : "border-gray-300"
                        }`}
                />
                {errors.pickupAddress && (
                    <p className="text-red-500 text-sm mt-1">{errors.pickupAddress}</p>
                )}
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={onChange}
                    placeholder="Describe the condition, modifications, and reasons for selling..."
                    rows={6}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary ${errors.description ? "border-red-500" : "border-gray-300"
                        }`}
                />
                {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
            </div>

            {/* Shipping */}
            <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <input
                    type="checkbox"
                    name="shipping"
                    checked={formData.shipping}
                    onChange={onChange}
                    className="w-5 h-5 rounded border-gray-300 accent-brand-primary"
                />
                <div>
                    <span className="text-gray-900 font-medium block">
                        Offer Shipping
                    </span>
                    <span className="text-gray-500 text-sm">
                        Check this if you are willing to ship the bike to the buyer.
                    </span>
                </div>
            </label>
        </div>
    );
};

export default React.memo(Step1VehicleInfo);
