import React from "react";
import { LISTING_CONFIG } from "../constants";

interface Step2ImageUploadProps {
    imageUrls: string[];
    isUploading: boolean;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onRemoveImage: (index: number) => void;
    onSetPrimary: (index: number) => void;
    error?: string | null;
}

const Step2ImageUpload: React.FC<Step2ImageUploadProps> = ({
    imageUrls,
    isUploading,
    onFileChange,
    onDrop,
    onDragOver,
    onRemoveImage,
    onSetPrimary,
    error,
}) => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Upload Images (Minimum {LISTING_CONFIG.MIN_IMAGES})
            </h2>

            {/* Error Message Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative animate-pulse" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {/* Drag & Drop Area */}
            <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${isUploading
                    ? "bg-gray-100 border-gray-400 cursor-wait"
                    : "bg-gray-50 border-gray-300 hover:bg-gray-100 cursor-pointer"
                    }`}
                onDrop={!isUploading ? onDrop : undefined}
                onDragOver={!isUploading ? onDragOver : undefined}
                onClick={() =>
                    !isUploading && document.getElementById("fileInput")?.click()
                }
            >
                <input
                    type="file"
                    id="fileInput"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={onFileChange}
                    disabled={isUploading}
                />

                {isUploading ? (
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mb-2"></div>
                        <p className="text-gray-600">Uploading images...</p>
                    </div>
                ) : (
                    <>
                        <svg
                            className="w-16 h-16 text-gray-400 mx-auto mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <p className="text-gray-900 font-medium mb-2">
                            Click to upload or drag and drop
                        </p>
                        <p className="text-gray-600 text-sm">
                            SVG, PNG, JPG or GIF (max. 800x400px)
                        </p>
                    </>
                )}
            </div>

            {/* Image Preview Grid */}
            {imageUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    {imageUrls.map((url, index) => (
                        <div
                            key={index}
                            className={`relative group aspect-w-4 aspect-h-3 bg-gray-100 rounded-lg overflow-hidden border ${index === 0 ? 'border-brand-primary ring-2 ring-brand-primary ring-opacity-50' : 'border-gray-200'
                                }`}
                        >
                            <img
                                src={url}
                                alt={`Uploaded bike ${index + 1}`}
                                className="object-cover w-full h-full"
                            />

                            {/* Primary Badge */}
                            {index === 0 && (
                                <div className="absolute top-2 left-2 bg-brand-primary text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                                    Primary Image
                                </div>
                            )}

                            {/* Actions Overlay */}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200">
                                {/* Set as Primary Button (Only for non-primary images) */}
                                {index !== 0 && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onSetPrimary(index);
                                        }}
                                        className="absolute top-2 left-2 bg-white/90 hover:bg-white text-gray-700 text-xs font-medium px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        Set as Primary
                                    </button>
                                )}

                                {/* Remove Button */}
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRemoveImage(index);
                                    }}
                                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-50 text-red-500 transition opacity-0 group-hover:opacity-100"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <p className="text-sm text-gray-500 mt-2">
                {imageUrls.length} images uploaded. Minimum {LISTING_CONFIG.MIN_IMAGES}{" "}
                required.
            </p>
        </div>
    );
};

export default Step2ImageUpload;
