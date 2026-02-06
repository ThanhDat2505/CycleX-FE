import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { saveDraft, updateDraft, submitDraft } from "@/app/services/myListingsService";
import { uploadImage } from "@/app/services/imageUploadService";
import { CREATE_LISTING_STEPS, LISTING_CONFIG, CURRENT_YEAR } from "../constants";
import { ListingFormData } from "../types";
import type { CreateListingPayload } from "@/app/services/myListingsService";

export const useCreateListing = () => {
    const router = useRouter();
    const { isLoggedIn, isLoading, user } = useAuth();

    // State
    const [step, setStep] = useState<number>(CREATE_LISTING_STEPS.VEHICLE_INFO);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    // Draft-First: Store listingId after draft creation
    const [listingId, setListingId] = useState<number | null>(null);
    const [isCreatingDraft, setIsCreatingDraft] = useState(false);
    // Submit/Save errors for inline display
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Ref to track if component is mounted (prevents memory leaks)
    const isMountedRef = useRef(true);

    // Cleanup on unmount
    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const [formData, setFormData] = useState<ListingFormData>({
        title: "",
        brand: "",
        model: "",
        category: "",
        condition: "used",
        year: CURRENT_YEAR.toString(),
        price: "",
        location: "",
        description: "",
        shipping: false,
    });

    // Auth Protection
    useEffect(() => {
        if (!isLoading && !isLoggedIn) {
            router.push("/login?returnUrl=/create-listing");
        }
    }, [isLoggedIn, isLoading, router]);

    // Auto clear upload error
    useEffect(() => {
        if (uploadError) {
            const timer = setTimeout(() => setUploadError(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [uploadError, imageUrls]);

    // Auto clear submit error after 5 seconds
    useEffect(() => {
        if (submitError) {
            const timer = setTimeout(() => setSubmitError(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [submitError]);

    // Validation
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

    const validateStep2 = () => {
        if (imageUrls.length < LISTING_CONFIG.MIN_IMAGES) {
            setUploadError(`Please upload at least ${LISTING_CONFIG.MIN_IMAGES} images.`);
            return false;
        }
        return true;
    };

    // Handlers (wrapped with useCallback for performance)
    const handleInputChange = useCallback((
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        setErrors((prev) => {
            if (prev[name]) {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            }
            return prev;
        });
    }, []);

    const handleNext = async () => {
        if (step === CREATE_LISTING_STEPS.VEHICLE_INFO) {
            if (!validateStep1()) {
                window.scrollTo(0, 0);
                return;
            }

            // Draft-First: Create draft at Step 1 to get listingId
            if (!listingId) {
                setIsCreatingDraft(true);
                try {
                    const payload = getPayload();
                    const draft = await saveDraft(payload);
                    setListingId(draft.id);

                } catch (error) {

                    setSubmitError('Failed to save draft. Please try again.');
                    setIsCreatingDraft(false);
                    return;
                } finally {
                    setIsCreatingDraft(false);
                }
            } else {
                // Update existing draft with latest data
                try {
                    const payload = getPayload();
                    await updateDraft(listingId, payload);

                } catch (error) {

                }
            }

            setStep(step + 1);
            window.scrollTo(0, 0);
        } else if (step === CREATE_LISTING_STEPS.UPLOAD_IMAGES) {
            if (validateStep2()) {
                // Update draft with image URLs before proceeding
                if (listingId) {
                    try {
                        await updateDraft(listingId, { imageUrls });
                    } catch (error) {

                    }
                }
                setStep(step + 1);
                window.scrollTo(0, 0);
            }
        } else {
            setStep(step + 1);
        }
    };

    const handleBack = useCallback(() => {
        setStep(prev => prev - 1);
    }, []);

    // Image Logic
    const validateFile = (file: File): string | null => {
        if (!(LISTING_CONFIG.ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
            return `File "${file.name}" is not a valid image. Only JPG, PNG, GIF, and WEBP are allowed.`;
        }
        if (file.size > LISTING_CONFIG.MAX_FILE_SIZE) {
            return `File "${file.name}" exceeds the 5MB size limit.`;
        }
        return null;
    };

    const handleFileUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        setUploadError(null);

        if (imageUrls.length + files.length > LISTING_CONFIG.MAX_IMAGES) {
            setUploadError(`You can only upload a maximum of ${LISTING_CONFIG.MAX_IMAGES} images.`);
            return;
        }

        const filesToUpload: File[] = [];
        const validationErrors: string[] = [];

        Array.from(files).forEach(file => {
            const error = validateFile(file);
            if (error) {
                validationErrors.push(error);
            } else {
                filesToUpload.push(file);
            }
        });

        if (validationErrors.length > 0) {
            setUploadError(validationErrors[0]);
            if (filesToUpload.length === 0) return;
        }

        setIsUploading(true);
        try {
            // Draft-First: Pass listingId to uploadImage for correct folder structure
            const uploadPromises = filesToUpload.map(file => uploadImage(file, listingId ?? undefined));
            const newUrls = await Promise.all(uploadPromises);
            // Only update state if component is still mounted
            if (isMountedRef.current) {
                setImageUrls(prev => [...prev, ...newUrls]);
            }
        } catch (error) {

            if (isMountedRef.current) {
                setUploadError("Failed to upload some images. Please try again.");
            }
        } finally {
            if (isMountedRef.current) {
                setIsUploading(false);
            }
        }
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => handleFileUpload(e.target.files);

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        handleFileUpload(e.dataTransfer.files);
    };

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

    const removeImage = useCallback((indexToRemove: number) => {
        setImageUrls(prev => prev.filter((_, index) => index !== indexToRemove));
    }, []);

    const handleSetPrimary = useCallback((index: number) => {
        if (index === 0) return;
        setImageUrls(prev => {
            const newUrls = [...prev];
            [newUrls[0], newUrls[index]] = [newUrls[index], newUrls[0]];
            return newUrls;
        });
    }, []);

    // Submission Logic
    const getPayload = (): CreateListingPayload => {
        if (!user || !user.userId) {
            throw new Error("User not identified. Please try logging in again.");
        }

        return {
            sellerId: user.userId,
            title: formData.title,
            description: formData.description,
            bikeType: formData.category,
            brand: formData.brand,
            model: formData.model,
            manufactureYear: Number(formData.year),
            condition: formData.condition,
            price: Number(formData.price),
            locationCity: formData.location,
            imageUrls: imageUrls,
        };
    };

    const handleSaveDraft = async () => {
        if (!user) {
            setSubmitError("You must be logged in to save a draft.");
            return;
        }

        if (!formData.title.trim()) {
            setSubmitError("Please enter a Listing Title to save as draft.");
            setErrors(prev => ({ ...prev, title: "Title is required for drafts" }));
            if (step !== CREATE_LISTING_STEPS.VEHICLE_INFO) {
                setStep(CREATE_LISTING_STEPS.VEHICLE_INFO);
            }
            return;
        }

        setIsSaving(true);
        try {
            const payload = getPayload();
            await saveDraft(payload);
            router.push('/my-listings');
        } catch (error) {

            setSubmitError("Failed to save draft. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSubmit = async (e?: React.SyntheticEvent) => {
        if (e) e.preventDefault();
        if (!user) {
            setSubmitError("You must be logged in to create a listing.");
            return;
        }

        if (!listingId) {
            setSubmitError("No draft found. Please start from the beginning.");
            return;
        }

        setIsSaving(true);
        try {
            // Draft-First: Submit existing draft instead of creating new
            await submitDraft(listingId);

            router.push('/my-listings');
        } catch (error) {

            setSubmitError("Failed to submit listing. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    return {
        state: {
            step,
            formData,
            errors,
            isSaving,
            isUploading,
            imageUrls,
            uploadError,
            isLoggedIn,
            isLoading,
            listingId,
            isCreatingDraft,
            submitError
        },
        actions: {
            setStep,
            handleInputChange,
            handleNext,
            handleBack,
            onFileChange,
            onDrop,
            onDragOver,
            removeImage,
            handleSetPrimary,
            handleSaveDraft,
            handleSubmit
        }
    };
};
