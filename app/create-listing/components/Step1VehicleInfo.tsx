import React from "react";
import { BIKE_CATEGORIES } from "@/app/constants/categories";
import { ListingFormData } from "../types";

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 30 }, (_, i) => currentYear - i);

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
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8A00] ${errors.title ? "border-red-500" : "border-gray-300"
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
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8A00] ${errors.brand ? "border-red-500" : "border-gray-300"
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
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8A00] ${errors.model ? "border-red-500" : "border-gray-300"
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
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8A00] ${errors.category ? "border-red-500" : "border-gray-300"
                            }`}
                    >
                        <option value="">Select Category</option>
                        {BIKE_CATEGORIES.map((cat) => (
                            <option key={cat.slug} value={cat.name}>
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
                    >
                        <option value="new">New (Mới 100%)</option>
                        <option value="used">Used (Đã sử dụng)</option>
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
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
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8A00] ${errors.price ? "border-red-500" : "border-gray-300"
                            }`}
                    />
                    {errors.price && (
                        <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                    )}
                </div>
            </div>

            {/* Location */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={onChange}
                    placeholder="e.g., Quận 1, TP.HCM"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8A00] ${errors.location ? "border-red-500" : "border-gray-300"
                        }`}
                />
                {errors.location && (
                    <p className="text-red-500 text-sm mt-1">{errors.location}</p>
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
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8A00] ${errors.description ? "border-red-500" : "border-gray-300"
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
                    className="w-5 h-5 rounded border-gray-300 accent-[#FF8A00]"
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

export default Step1VehicleInfo;
