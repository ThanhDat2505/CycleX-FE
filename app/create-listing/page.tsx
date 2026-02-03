"use client";

import React from "react";
import { CREATE_LISTING_STEPS } from "./constants";
import { useCreateListing } from "./hooks/useCreateListing";

// Components
import Step1VehicleInfo from "./components/Step1VehicleInfo";
import Step2ImageUpload from "./components/Step2ImageUpload";
import Step3Preview from "./components/Step3Preview";

const CreateListingPage: React.FC = () => {
  const { state, actions } = useCreateListing();
  const { step, formData, errors, isSaving, isUploading, imageUrls, uploadError, isLoggedIn, isLoading } = state;

  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null; // Redirecting handled in hook
  }

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
                ? "bg-brand-primary text-white"
                : "bg-gray-200 text-gray-600"
                }`}
            >
              {s}
            </div>
            {s < CREATE_LISTING_STEPS.PREVIEW && (
              <div
                className={`h-1 flex-1 mx-2 transition ${s < step ? "bg-brand-primary" : "bg-gray-200"
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
        onSubmit={actions.handleSubmit}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && step !== CREATE_LISTING_STEPS.PREVIEW) {
            e.preventDefault();
          }
        }}
        className="bg-white rounded-lg p-8 border border-gray-200 shadow-sm"
      >
        {step === CREATE_LISTING_STEPS.VEHICLE_INFO && (
          <Step1VehicleInfo
            formData={formData}
            errors={errors}
            onChange={actions.handleInputChange}
          />
        )}

        {step === CREATE_LISTING_STEPS.UPLOAD_IMAGES && (
          <Step2ImageUpload
            imageUrls={imageUrls}
            isUploading={isUploading}
            onFileChange={actions.onFileChange}
            onDrop={actions.onDrop}
            onDragOver={actions.onDragOver}
            onRemoveImage={actions.removeImage}
            onSetPrimary={actions.handleSetPrimary}
            error={uploadError}
          />
        )}

        {step === CREATE_LISTING_STEPS.PREVIEW && (
          <Step3Preview formData={formData} imageUrls={imageUrls} />
        )}

        {/* Buttons */}
        <div className="flex gap-4 mt-8 justify-between">
          <button
            type="button"
            onClick={actions.handleSaveDraft}
            disabled={isSaving}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save for Later"}
          </button>

          <div className="flex gap-4">
            {step > CREATE_LISTING_STEPS.VEHICLE_INFO && (
              <button
                type="button"
                onClick={actions.handleBack}
                className="px-6 py-3 border border-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Back
              </button>
            )}

            {step < CREATE_LISTING_STEPS.PREVIEW ? (
              <button
                type="button"
                onClick={actions.handleNext}
                className="px-6 py-3 bg-brand-primary text-white rounded-lg font-semibold hover:bg-brand-primary-hover transition"
              >
                Continue to {step === CREATE_LISTING_STEPS.VEHICLE_INFO ? "Images" : "Preview"}
              </button>
            ) : (
              <button
                type="button"
                onClick={actions.handleSubmit}
                disabled={isSaving}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Publishing..." : "Publish Listing"}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateListingPage;
