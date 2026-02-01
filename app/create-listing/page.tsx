"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { saveDraft, createListing } from "@/app/services/myListingsService";
import type { CreateListingPayload } from "@/app/services/myListingsService";
import { uploadImage } from "@/app/services/imageUploadService";
import { CREATE_LISTING_STEPS, LISTING_CONFIG } from "./constants";
import { ListingFormData } from "./types";

// Components
import Step1VehicleInfo from "./components/Step1VehicleInfo";
import Step2ImageUpload from "./components/Step2ImageUpload";
import Step3Preview from "./components/Step3Preview";

const currentYear = new Date().getFullYear();

const CreateListingPage: React.FC = () => {
  const router = useRouter();
  const { isLoggedIn, isLoading } = useAuth();
  const [step, setStep] = useState<number>(CREATE_LISTING_STEPS.VEHICLE_INFO);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  // Form State
  const [formData, setFormData] = useState<ListingFormData>({
    title: "",
    brand: "",
    model: "",
    category: "",
    condition: "used", // default
    year: currentYear.toString(),
    price: "",
    location: "",
    description: "",
    shipping: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auth Protection
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/login?returnUrl=/create-listing");
    }
  }, [isLoggedIn, isLoading, router]);


  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null; // Redirecting...
  }

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.brand.trim()) newErrors.brand = "Brand is required";
    if (!formData.model.trim()) newErrors.model = "Model is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (Number(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    // Handle checkbox separately
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateStep2 = () => {
    if (imageUrls.length < LISTING_CONFIG.MIN_IMAGES) {
      alert(`Please upload at least ${LISTING_CONFIG.MIN_IMAGES} images.`);
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === CREATE_LISTING_STEPS.VEHICLE_INFO) {
      if (validateStep1()) {
        setStep(step + 1);
        window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 0);
      }
    } else if (step === CREATE_LISTING_STEPS.UPLOAD_IMAGES) {
      if (validateStep2()) {
        setStep(step + 1);
        window.scrollTo(0, 0);
      }
    } else {
      setStep(step + 1);
    }
  };

  // Image Upload Handlers
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    // Limit total images (e.g., max 10)
    if (imageUrls.length + files.length > LISTING_CONFIG.MAX_IMAGES) {
      alert(`You can only upload a maximum of ${LISTING_CONFIG.MAX_IMAGES} images.`);
      return;
    }

    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map(file => uploadImage(file));
      const newUrls = await Promise.all(uploadPromises);
      setImageUrls(prev => [...prev, ...newUrls]);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload some images. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFileUpload(e.dataTransfer.files);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeImage = (indexToRemove: number) => {
    setImageUrls(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const getPayload = (): CreateListingPayload => ({
    title: formData.title,
    brand: formData.brand,
    model: formData.model,
    type: formData.category,
    condition: formData.condition,
    year: Number(formData.year),
    price: Number(formData.price),
    location: formData.location,
    description: formData.description,
    shipping: formData.shipping,
    imageUrls: imageUrls,
  });

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      const payload = getPayload();
      await saveDraft(payload);
      alert("Draft saved successfully!");
    } catch (error) {
      console.error("Failed to save draft:", error);
      alert("Failed to save draft. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // This is mainly for the final step, but we prepare the logic here
    setIsSaving(true);
    try {
      const payload = getPayload();
      // In a real flow, this might happen at Step 3
      // For now, we just simulate the call
      await createListing(payload);
      alert("Listing created successfully!");
      router.push('/my-listings'); // Redirect to listing management
    } catch (error) {
      console.error("Failed to create listing:", error);
      alert("Failed to create listing. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Create New Listing</h1>
        <p className="text-gray-600 mt-2">
          Fill in the details about your bike
        </p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-12">
        {Object.values(CREATE_LISTING_STEPS).map((s) => (
          <React.Fragment key={s}>
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-full font-bold transition ${s <= step
                ? "bg-[#FF8A00] text-white"
                : "bg-gray-200 text-gray-600"
                }`}
            >
              {s}
            </div>
            {s < CREATE_LISTING_STEPS.PREVIEW && (
              <div
                className={`h-1 flex-1 mx-2 transition ${s < step ? "bg-[#FF8A00]" : "bg-gray-200"
                  }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="flex gap-4 mb-8 text-center text-sm">
        <div className="flex-1">
          <p className="font-semibold text-gray-900">Step {CREATE_LISTING_STEPS.VEHICLE_INFO}</p>
          <p className="text-gray-600">Basic Info</p>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900">Step {CREATE_LISTING_STEPS.UPLOAD_IMAGES}</p>
          <p className="text-gray-600">Images</p>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900">Step {CREATE_LISTING_STEPS.PREVIEW}</p>
          <p className="text-gray-600">Preview</p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg p-8 border border-gray-200 shadow-sm"
      >
        {step === CREATE_LISTING_STEPS.VEHICLE_INFO && (
          <Step1VehicleInfo
            formData={formData}
            errors={errors}
            onChange={handleInputChange}
          />
        )}

        {step === CREATE_LISTING_STEPS.UPLOAD_IMAGES && (
          <Step2ImageUpload
            imageUrls={imageUrls}
            isUploading={isUploading}
            onFileChange={onFileChange}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onRemoveImage={removeImage}
          />
        )}

        {step === CREATE_LISTING_STEPS.PREVIEW && (
          <Step3Preview formData={formData} imageUrls={imageUrls} />
        )}

        {/* Buttons */}
        <div className="flex gap-4 mt-8 justify-between">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save for Later"}
          </button>

          <div className="flex gap-4">
            {step > CREATE_LISTING_STEPS.VEHICLE_INFO && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 border border-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Back
              </button>
            )}

            {step < CREATE_LISTING_STEPS.PREVIEW ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-[#FF8A00] text-white rounded-lg font-semibold hover:bg-[#FF7A00] transition"
              >
                Continue to {step === CREATE_LISTING_STEPS.VEHICLE_INFO ? "Images" : "Preview"}
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Publish Listing
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

// Export to fix fast refresh issues (sometimes needed)
export default CreateListingPage;
