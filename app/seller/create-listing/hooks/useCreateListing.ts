import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { useToast } from "@/app/contexts/ToastContext";
import { saveDraft, updateDraft, submitDraft, uploadListingImage, getListingDetail, getListingImages } from "@/app/services/myListingsService";
import { uploadImage } from "@/app/services/imageUploadService";
import { CREATE_LISTING_STEPS, LISTING_CONFIG, CURRENT_YEAR } from "../constants";
import { ListingFormData } from "../types";
import type { CreateListingPayload } from "@/app/services/myListingsService";

export const useCreateListing = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isLoggedIn, isLoading, user, role } = useAuth();
    const { addToast } = useToast();
    const draftIdParam = searchParams.get('draft');
    const draftId = draftIdParam ? Number(draftIdParam) : null;
    const isViewMode = searchParams.get('mode') === 'view';

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
    const [loadedListingStatus, setLoadedListingStatus] = useState<string | null>(null);
    const [isReadOnly, setIsReadOnly] = useState(false);

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
        condition: "New",
        year: CURRENT_YEAR.toString(),
        price: "",
        location: "",
        pickupAddress: "",
        description: "",
        usageTime: "",
        reasonForSale: "",
        shipping: false,
    });

    // Auth & Role Protection
    useEffect(() => {
        if (!isLoading) {
            if (!isLoggedIn) {
                router.push("/login?returnUrl=/seller/create-listing");
                return;
            }
            if (role !== 'SELLER') {
                addToast("Chỉ người bán mới có quyền đăng tin!", "error");
                router.push("/");
                return;
            }
        }
    }, [isLoggedIn, isLoading, router, role, addToast]);

    // Load existing draft when route has ?draft=<listingId>
    useEffect(() => {
        if (isLoading || !isLoggedIn || role !== 'SELLER') return;
        if (!user?.userId) return;
        if (!draftId || Number.isNaN(draftId)) return;

        let cancelled = false;

        const loadDraft = async () => {
            setIsCreatingDraft(true);
            setSubmitError(null);

            try {
                const [draft, images] = await Promise.all([
                    getListingDetail(user.userId, draftId),
                    getListingImages(user.userId, draftId),
                ]);

                if (!isMountedRef.current || cancelled) return;

                setListingId(draft.listingId);
                const normalizedStatus = (draft.status || '').toUpperCase();
                setLoadedListingStatus(normalizedStatus || null);

                const readOnlyStatuses = new Set([
                    'PENDING',
                    'REVIEWING',
                    'WAITING_INSPECTOR_REVIEW',
                    'APPROVED',
                    'ARCHIVED',
                ]);

                const shouldReadOnly = isViewMode || readOnlyStatuses.has(normalizedStatus);
                setIsReadOnly(shouldReadOnly);

                setFormData({
                    title: draft.title || "",
                    brand: draft.brand || "",
                    model: draft.model || "",
                    category: draft.bikeType || "",
                    condition: draft.condition || "New",
                    year: draft.manufactureYear ? String(draft.manufactureYear) : CURRENT_YEAR.toString(),
                    price: draft.price !== undefined && draft.price !== null ? String(draft.price) : "",
                    location: draft.locationCity || "",
                    pickupAddress: draft.pickupAddress || "",
                    description: draft.description || "",
                    usageTime: draft.usageTime || "",
                    reasonForSale: draft.reasonForSale || "",
                    shipping: false,
                });

                const resolveImageUrl = (imagePath: string): string => {
                    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
                    if (imagePath.startsWith('/public/')) return imagePath;
                    if (imagePath.startsWith('/uploads/')) return `/backend${imagePath}`;
                    return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
                };

                const sortedImageUrls = [...images]
                    .sort((a, b) => (a.imageOrder ?? 0) - (b.imageOrder ?? 0))
                    .map((image) => resolveImageUrl(image.imagePath));

                setImageUrls(sortedImageUrls);

                if (shouldReadOnly) {
                    setStep(CREATE_LISTING_STEPS.PREVIEW);
                }
            } catch {
                if (!isMountedRef.current || cancelled) return;
                setSubmitError('Failed to load draft listing. Please try again.');
            } finally {
                if (!isMountedRef.current || cancelled) return;
                setIsCreatingDraft(false);
            }
        };

        loadDraft();

        return () => {
            cancelled = true;
        };
    }, [draftId, isLoading, isLoggedIn, role, user?.userId, isViewMode]);

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
        if (isReadOnly) return;

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
    }, [isReadOnly]);

    const getReadOnlyMessage = useCallback(() => {
        const status = (loadedListingStatus || '').toUpperCase();
        if (status === 'PENDING' || status === 'REVIEWING' || status === 'WAITING_INSPECTOR_REVIEW') {
            return 'Listing đang ở trạng thái PENDING. Bạn cần Cancel Publish trước khi chỉnh sửa.';
        }
        return 'Listing đang ở chế độ chỉ xem.';
    }, [loadedListingStatus]);

    const handleNext = async () => {
        if (isReadOnly) return;

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
                setStep(step + 1);
                window.scrollTo(0, 0);
            }
        } else {
            setStep(step + 1);
        }
    };

    const handleBack = useCallback(() => {
        if (isReadOnly) return;
        setStep(prev => prev - 1);
    }, [isReadOnly]);

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
        if (isReadOnly) {
            setUploadError(getReadOnlyMessage());
            return;
        }

        if (!files || files.length === 0) return;
        setUploadError(null);

        if (!listingId) {
            setUploadError("Draft not ready yet. Please complete Step 1 and try again.");
            return;
        }

        if (!user?.userId) {
            setUploadError("You must be logged in to upload images.");
            return;
        }

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
            const uploadPromises = filesToUpload.map(file => uploadImage(file, listingId));
            const newUrls = await Promise.all(uploadPromises);

            // Persist uploaded image paths to BE listing-images table (S-13).
            await Promise.all(
                newUrls.map((url, index) =>
                    uploadListingImage(user.userId, listingId, url, imageUrls.length + index + 1)
                )
            );

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
        if (isReadOnly) return;
        setImageUrls(prev => prev.filter((_, index) => index !== indexToRemove));
    }, [isReadOnly]);

    const handleSetPrimary = useCallback((index: number) => {
        if (isReadOnly) return;
        if (index === 0) return;
        setImageUrls(prev => {
            const newUrls = [...prev];
            [newUrls[0], newUrls[index]] = [newUrls[index], newUrls[0]];
            return newUrls;
        });
    }, [isReadOnly]);

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
            usageTime: formData.usageTime || undefined,
            reasonForSale: formData.reasonForSale || undefined,
            price: Number(formData.price),
            locationCity: formData.location,
            pickupAddress: formData.pickupAddress || formData.location,
            saveDraft: true,
        };
    };

    const handleSaveDraft = async () => {
        if (isReadOnly) {
            setSubmitError(getReadOnlyMessage());
            return;
        }

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
            if (listingId) {
                await updateDraft(listingId, payload);
            } else {
                const draft = await saveDraft(payload);
                setListingId(draft.id);
            }
            router.push('/seller/my-listings');
        } catch (error) {

            setSubmitError("Failed to save draft. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSubmit = async (e?: React.SyntheticEvent) => {
        if (e) e.preventDefault();

        if (isReadOnly) {
            setSubmitError(getReadOnlyMessage());
            return;
        }

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
            await submitDraft(listingId, user.userId);

            router.push('/seller/my-listings');
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
            submitError,
            isReadOnly,
            readOnlyMessage: isReadOnly ? getReadOnlyMessage() : null,
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
