import React from "react";
import { ListingFormData } from "../types";

interface Step3PreviewProps {
    formData: ListingFormData;
    imageUrls: string[];
}

const Step3Preview: React.FC<Step3PreviewProps> = ({ formData, imageUrls }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Preview Listing</h2>
            <div className="bg-gray-50 p-6 rounded-lg space-y-4 border border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Title</p>
                        <p className="font-semibold text-gray-900">{formData.title}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Price</p>
                        <p className="font-semibold text-brand-primary">
                            {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                            }).format(Number(formData.price))}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Category</p>
                        <p className="font-semibold text-gray-900">{formData.category}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Condition</p>
                        <p className="font-semibold text-gray-900 capitalize">
                            {formData.condition}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Brand / Model / Year</p>
                        <p className="font-semibold text-gray-900">
                            {formData.brand} / {formData.model} / {formData.year}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-semibold text-gray-900">{formData.location}</p>
                    </div>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="text-gray-900 mt-1 whitespace-pre-wrap">
                        {formData.description}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Shipping</p>
                    <p className="font-semibold text-gray-900">
                        {formData.shipping ? "Available" : "Not Available"}
                    </p>
                </div>
            </div>

            {/* Images Preview */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Images ({imageUrls.length})</h3>
                {imageUrls.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {imageUrls.map((url, index) => (
                            <div key={index} className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                <img
                                    src={url}
                                    alt={`Preview ${index + 1}`}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">No images uploaded</p>
                )}
            </div>
        </div>
    );
};

export default Step3Preview;
