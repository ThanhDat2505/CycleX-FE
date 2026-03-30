/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { useToast } from "@/app/contexts/ToastContext";
import {
  saveDraft,
  updateDraft,
  submitDraft,
  uploadListingImage,
  getListingDetail,
  getListingImages,
  cancelPublish,
  setImageAsPrimary,
  saveListingVideo,
} from "@/app/services/myListingsService";
import { uploadImage } from "@/app/services/imageUploadService";
import {
  CREATE_LISTING_STEPS,
  LISTING_CONFIG,
  CURRENT_YEAR,
} from "../constants";
import { ListingFormData } from "../types";
import type { CreateListingPayload } from "@/app/services/myListingsService";

const READ_ONLY_STATUSES = new Set([
  "PENDING",
  "REVIEWING",
  "WAITING_INSPECTOR_REVIEW",
  "APPROVED",
  "ARCHIVED",
]);

const CANCELLABLE_STATUSES = new Set([
  "PENDING",
  "REVIEWING",
  "WAITING_INSPECTOR_REVIEW",
]);

const normalizeStatus = (status?: string | null) =>
  (status || "").toUpperCase().trim();

const resolveImageUrl = (imagePath: string): string => {
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  if (imagePath.startsWith("/public/")) return imagePath;
  if (imagePath.startsWith("/uploads/")) return `/backend${imagePath}`;
  return imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
};

export const useCreateListing = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoggedIn, isLoading, user, role } = useAuth();
  const { addToast } = useToast();
  const draftIdParam = searchParams.get("draft");
  const draftId = draftIdParam ? Number(draftIdParam) : null;
  const isViewMode = searchParams.get("mode") === "view";

  // State
  const [step, setStep] = useState<number>(CREATE_LISTING_STEPS.VEHICLE_INFO);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageIds, setImageIds] = useState<(number | null)[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Draft-First: Store listingId after draft creation
  const [listingId, setListingId] = useState<number | null>(null);
  const [isCreatingDraft, setIsCreatingDraft] = useState(false);
  const [isCancellingPublish, setIsCancellingPublish] = useState(false);
  // Submit/Save errors for inline display
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loadedListingStatus, setLoadedListingStatus] = useState<string | null>(
    null,
  );
  const [isReadOnly, setIsReadOnly] = useState(false);

  const normalizedLoadedStatus = useMemo(
    () => normalizeStatus(loadedListingStatus),
    [loadedListingStatus],
  );

  const canCancelPublish = useMemo(
    () => CANCELLABLE_STATUSES.has(normalizedLoadedStatus),
    [normalizedLoadedStatus],
  );

  const readOnlyMessage = useMemo(() => {
    if (canCancelPublish) {
      return "Listing đang ở trạng thái PENDING. Bạn cần Cancel Publish trước khi chỉnh sửa.";
    }
    return "Listing đang ở chế độ chỉ xem.";
  }, [canCancelPublish]);

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
    addressProvince: "",
    addressDistrict: "",
    addressWard: "",
    addressStreet: "",
    videoUrl: "",
  });

  // Video upload state
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);

  // Auth & Role Protection
  useEffect(() => {
    if (!isLoading) {
      if (!isLoggedIn) {
        router.push("/login?returnUrl=/seller/create-listing");
        return;
      }
      if (role !== "SELLER") {
        addToast("Chỉ người bán mới có quyền đăng tin!", "error");
        router.push("/");
        return;
      }
    }
  }, [isLoggedIn, isLoading, router, role, addToast]);

  // Load existing draft when route has ?draft=<listingId>
  useEffect(() => {
    if (isLoading || !isLoggedIn || role !== "SELLER") return;
    if (!user?.userId) return;
    if (!draftId || Number.isNaN(draftId)) return;

    let cancelled = false;

    const loadDraft = async () => {
      setIsCreatingDraft(true);
      setSubmitError(null);

      try {
        const draft = await getListingDetail(user.userId, draftId);
        const images = await getListingImages(user.userId, draftId).catch(() => []);

        if (!isMountedRef.current || cancelled) return;

        setListingId(draft.listingId);
        const normalizedStatus = normalizeStatus(draft.status as string);
        setLoadedListingStatus(normalizedStatus || null);

        const shouldReadOnly =
          isViewMode || READ_ONLY_STATUSES.has(normalizedStatus);
        setIsReadOnly(shouldReadOnly);

        setFormData({
          title: draft.title || "",
          brand: draft.brand || "",
          model: draft.model || "",
          category: draft.bikeType || "",
          condition: draft.condition || "New",
          year: draft.manufactureYear
            ? String(draft.manufactureYear)
            : CURRENT_YEAR.toString(),
          price:
            draft.price !== undefined && draft.price !== null
              ? String(draft.price)
              : "",
          location: draft.locationCity || "",
          pickupAddress: draft.pickupAddress || "",
          description: draft.description || "",
          usageTime: draft.usageTime || "",
          reasonForSale: draft.reasonForSale || "",
          shipping: false,
          addressProvince: "",
          addressDistrict: "",
          addressWard: "",
          addressStreet: "",
          videoUrl: (draft as any).videoUrl || "",
        });

        const sortedImages = [...images]
          .sort((a, b) => (a.imageOrder ?? 0) - (b.imageOrder ?? 0));

        setImageUrls(sortedImages.map((image) => resolveImageUrl(image.imagePath)));
        setImageIds(sortedImages.map((image) => image.imageId ?? image.id ?? null));

        if (shouldReadOnly) {
          setStep(CREATE_LISTING_STEPS.PREVIEW);
        }
      } catch {
        if (!isMountedRef.current || cancelled) return;
        setSubmitError("Không thể tải tin đăng nháp. Vui lòng thử lại.");
        addToast("Không thể tiếp tục tin nháp này. Vui lòng thử lại.", "error");
        router.replace("/seller/draft-listings");
      } finally {
        if (!isMountedRef.current || cancelled) return;
        setIsCreatingDraft(false);
      }
    };

    loadDraft();

    return () => {
      cancelled = true;
    };
  }, [addToast, draftId, isLoading, isLoggedIn, role, router, user?.userId, isViewMode]);

  // Auto clear upload error
  useEffect(() => {
    if (uploadError) {
      const timer = setTimeout(() => setUploadError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [uploadError]);

  // Auto clear submit error after 5 seconds
  useEffect(() => {
    if (submitError) {
      const timer = setTimeout(() => setSubmitError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [submitError]);

  // Validation
  const validateStep1 = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Vui lòng nhập tiêu đề tin đăng";
    if (!formData.brand.trim()) newErrors.brand = "Vui lòng nhập thương hiệu xe";
    if (!formData.model.trim()) newErrors.model = "Vui lòng nhập dòng xe";
    if (!formData.category) newErrors.category = "Vui lòng chọn loại xe";
    if (!formData.price) {
      newErrors.price = "Vui lòng nhập giá bán";
    } else if (Number(formData.price) <= 0) {
      newErrors.price = "Giá bán phải lớn hơn 0";
    }
    if (!formData.location.trim()) newErrors.location = "Vui lòng chọn tỉnh/thành phố";
    if (!formData.addressDistrict.trim()) newErrors.addressDistrict = "Vui lòng chọn quận/huyện";
    if (!formData.addressWard.trim()) newErrors.addressWard = "Vui lòng chọn phường/xã";
    if (!formData.addressStreet.trim()) newErrors.pickupAddress = "Vui lòng nhập số nhà, tên đường";
    if (!formData.description.trim())
      newErrors.description = "Vui lòng nhập mô tả chi tiết";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const validateStep2 = useCallback(() => {
    if (imageUrls.length < LISTING_CONFIG.MIN_IMAGES) {
      setUploadError(
        `Vui lòng tải lên ít nhất ${LISTING_CONFIG.MIN_IMAGES} ảnh.`,
      );
      return false;
    }
    return true;
  }, [imageUrls.length]);

  // Handlers (wrapped with useCallback for performance)
  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      if (isReadOnly) return;

      const { name, value, type } = e.target;
      const checked = (e.target as HTMLInputElement).checked;
      const normalizedValue =
        name === "price"
          ? value.replace(/[^\d]/g, "")
          : value;

      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : normalizedValue,
      }));

      setErrors((prev) => {
        if (prev[name]) {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        }
        return prev;
      });
    },
    [isReadOnly],
  );

  const handleAddressChange = useCallback(
    (data: {
      province: string;
      district: string;
      ward: string;
      streetAddress: string;
      fullAddress: string;
    }) => {
      if (isReadOnly) return;
      setFormData((prev) => ({
        ...prev,
        addressProvince: data.province,
        addressDistrict: data.district,
        addressWard: data.ward,
        addressStreet: data.streetAddress,
        location: data.province,
        pickupAddress: data.fullAddress,
      }));
      setErrors((prev) => {
        const newErrors = { ...prev };
        if (data.province) delete newErrors.location;
        if (data.district) delete newErrors.addressDistrict;
        if (data.ward) delete newErrors.addressWard;
        if (data.fullAddress) delete newErrors.pickupAddress;
        return newErrors;
      });
    },
    [isReadOnly],
  );

  const handleVideoUpload = useCallback(
    async (file: File) => {
      if (isReadOnly) return;
      setVideoError(null);

      // Validate video file
      const validTypes = ["video/mp4", "video/webm", "video/quicktime"];
      if (!validTypes.includes(file.type)) {
        setVideoError("Chỉ chấp nhận file video MP4, WebM hoặc MOV.");
        return;
      }

      if (file.size > 50 * 1024 * 1024) {
        setVideoError("File video không được vượt quá 50MB.");
        return;
      }

      // Check video duration
      const video = document.createElement("video");
      video.preload = "metadata";

      const durationCheck = new Promise<boolean>((resolve) => {
        video.onloadedmetadata = () => {
          URL.revokeObjectURL(video.src);
          if (video.duration > 15) {
            setVideoError("Video không được dài quá 15 giây.");
            resolve(false);
          } else {
            resolve(true);
          }
        };
        video.onerror = () => {
          URL.revokeObjectURL(video.src);
          setVideoError("Không thể đọc file video.");
          resolve(false);
        };
        video.src = URL.createObjectURL(file);
      });

      const isValid = await durationCheck;
      if (!isValid) return;

      setIsUploadingVideo(true);
      try {
        // Save to public/video/ via API upload
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);
        formDataUpload.append("type", "video");

        const response = await fetch("/api/upload-video", {
          method: "POST",
          body: formDataUpload,
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const result = await response.json();
        setFormData((prev) => ({ ...prev, videoUrl: result.url }));

        // Save video path to DB if we have a listingId
        if (listingId && user?.userId) {
          try {
            await saveListingVideo(user.userId, listingId, result.url);
          } catch {
            console.warn("Failed to save video path to DB, will retry on submit");
          }
        }

        addToast("Video đã tải lên thành công!", "success");
      } catch {
        setVideoError("Tải video thất bại. Vui lòng thử lại.");
      } finally {
        setIsUploadingVideo(false);
      }
    },
    [isReadOnly, addToast, listingId, user?.userId],
  );

  const removeVideo = useCallback(() => {
    if (isReadOnly) return;
    setFormData((prev) => ({ ...prev, videoUrl: "" }));
    setVideoError(null);
  }, [isReadOnly]);

  const handleCancelPublish = useCallback(async () => {
    if (!user?.userId) {
      setSubmitError("Bạn cần đăng nhập để hủy đăng tin.");
      return;
    }

    if (!listingId) {
      setSubmitError("Không tìm thấy tin đăng để hủy.");
      return;
    }

    if (!canCancelPublish) {
      setSubmitError("Chỉ có thể hủy khi tin đăng đang ở trạng thái chờ duyệt.");
      return;
    }

    setIsCancellingPublish(true);
    setSubmitError(null);

    try {
      const updated = await cancelPublish(listingId, user.userId);
      setLoadedListingStatus((updated.status as string) || "DRAFT");
      setIsReadOnly(false);
      setStep(CREATE_LISTING_STEPS.VEHICLE_INFO);
      addToast(
        "Hủy đăng tin thành công. Bạn có thể chỉnh sửa tin đăng này ngay bây giờ.",
        "success",
      );
    } catch (error: any) {
      const rawMessage = String(error?.message || "");
      const cannotEditPending = rawMessage
        .toLowerCase()
        .includes("cannot edit listing with status");

      if (cannotEditPending) {
        setSubmitError(
          "Backend chưa hỗ trợ Cancel Publish cho listing đang PENDING. Vui lòng nhờ BE mở endpoint này.",
        );
      } else {
        setSubmitError("Hủy đăng tin thất bại. Vui lòng thử lại.");
      }
    } finally {
      setIsCancellingPublish(false);
    }
  }, [addToast, canCancelPublish, listingId, user?.userId]);

  const getPayload = useCallback((): CreateListingPayload => {
    if (!user || !user.userId) {
      throw new Error("Không xác định được người dùng. Vui lòng đăng nhập lại.");
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
  }, [formData, user]);

  const getDraftPayload = useCallback((): CreateListingPayload => {
    if (!user || !user.userId) {
      throw new Error("Không xác định được người dùng. Vui lòng đăng nhập lại.");
    }

    const fallbackTitle =
      formData.title.trim() ||
      [formData.brand.trim(), formData.model.trim()].filter(Boolean).join(" ") ||
      "Tin nháp chưa đặt tên";

    return {
      sellerId: user.userId,
      title: fallbackTitle,
      description: formData.description || undefined,
      bikeType: formData.category || "Other",
      brand: formData.brand || "Chưa chọn hãng",
      model: formData.model || "Chưa chọn mẫu",
      manufactureYear: formData.year ? Number(formData.year) : undefined,
      condition: formData.condition || undefined,
      usageTime: formData.usageTime || undefined,
      reasonForSale: formData.reasonForSale || undefined,
      price: formData.price ? Number(formData.price) : 0,
      locationCity: formData.location || "Chưa chọn địa điểm",
      pickupAddress: formData.pickupAddress || formData.location || "Chưa nhập địa chỉ",
      saveDraft: true,
    };
  }, [formData, user]);

  const handleNext = useCallback(async () => {
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
          setSubmitError("Không thể lưu bản nháp. Vui lòng thử lại.");
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
        } catch (error) {}
      }

      setStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    } else if (step === CREATE_LISTING_STEPS.UPLOAD_IMAGES) {
      if (validateStep2()) {
        setStep((prev) => prev + 1);
        window.scrollTo(0, 0);
      }
    } else if (step === CREATE_LISTING_STEPS.UPLOAD_VIDEO) {
      // Video is optional, proceed to preview
      setStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    } else {
      setStep((prev) => prev + 1);
    }
  }, [getPayload, isReadOnly, listingId, step, validateStep1, validateStep2]);

  const handleBack = useCallback(() => {
    if (isReadOnly) return;
    setStep((prev) => prev - 1);
  }, [isReadOnly]);

  // Image Logic
  const validateFile = useCallback((file: File): string | null => {
    if (
      !(LISTING_CONFIG.ACCEPTED_IMAGE_TYPES as readonly string[]).includes(
        file.type,
      )
    ) {
      return `File "${file.name}" không hợp lệ. Chỉ chấp nhận JPG, PNG, GIF và WEBP.`;
    }
    if (file.size > LISTING_CONFIG.MAX_FILE_SIZE) {
      return `File "${file.name}" vượt quá giới hạn 5MB.`;
    }
    return null;
  }, []);

  const handleFileUpload = useCallback(
    async (files: FileList | null) => {
      if (isReadOnly) {
        setUploadError(readOnlyMessage);
        return;
      }

      if (!files || files.length === 0) return;
      setUploadError(null);

      if (!listingId) {
        setUploadError(
          "Bản nháp chưa sẵn sàng. Vui lòng hoàn thành Bước 1 trước.",
        );
        return;
      }

      if (!user?.userId) {
        setUploadError("Bạn cần đăng nhập để tải ảnh lên.");
        return;
      }

      if (imageUrls.length + files.length > LISTING_CONFIG.MAX_IMAGES) {
        setUploadError(
          `Bạn chỉ có thể tải lên tối đa ${LISTING_CONFIG.MAX_IMAGES} ảnh.`,
        );
        return;
      }

      const filesToUpload: File[] = [];
      const validationErrors: string[] = [];

      Array.from(files).forEach((file) => {
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
      // Upload files to disk - use allSettled so partial failures don't lose all uploads
      const uploadResults = await Promise.allSettled(
        filesToUpload.map((file) => uploadImage(file, listingId)),
      );

      const successfulUrls: string[] = [];
      let failedCount = 0;
      for (const result of uploadResults) {
        if (result.status === "fulfilled") {
          successfulUrls.push(result.value);
        } else {
          failedCount++;
        }
      }

      if (successfulUrls.length === 0) {
        if (isMountedRef.current) {
          setUploadError("Tải ảnh thất bại. Vui lòng thử lại.");
        }
        return;
      }

      // Persist uploaded image paths to BE listing-images table (S-13).
      const persistResults = await Promise.allSettled(
        successfulUrls.map((url, index) =>
          uploadListingImage(
            user.userId,
            listingId,
            url,
            imageUrls.length + index + 1,
          ),
        ),
      );

      const savedUrls: string[] = [];
      const savedIds: (number | null)[] = [];
      for (let i = 0; i < persistResults.length; i++) {
        const result = persistResults[i];
        if (result.status === "fulfilled") {
          savedUrls.push(successfulUrls[i]);
          savedIds.push(result.value.imageId ?? result.value.id ?? null);
        } else {
          failedCount++;
        }
      }

      // Only update state if component is still mounted
      if (isMountedRef.current) {
        if (savedUrls.length > 0) {
          setImageUrls((prev) => [...prev, ...savedUrls]);
          setImageIds((prev) => [...prev, ...savedIds]);
        }
        if (failedCount > 0) {
          setUploadError(`${failedCount} ảnh tải thất bại. Các ảnh còn lại đã tải thành công.`);
        }
      }
    } catch (error) {
      if (isMountedRef.current) {
        setUploadError("Tải ảnh thất bại. Vui lòng thử lại.");
      }
    } finally {
      if (isMountedRef.current) {
        setIsUploading(false);
      }
    }
    },
    [isReadOnly, readOnlyMessage, listingId, user?.userId, imageUrls.length, validateFile],
  );

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      void handleFileUpload(e.target.files);
    },
    [handleFileUpload],
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      void handleFileUpload(e.dataTransfer.files);
    },
    [handleFileUpload],
  );

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const removeImage = useCallback(
    (indexToRemove: number) => {
      if (isReadOnly) return;
      setImageUrls((prev) =>
        prev.filter((_, index) => index !== indexToRemove),
      );
      setImageIds((prev) =>
        prev.filter((_, index) => index !== indexToRemove),
      );
    },
    [isReadOnly],
  );

  const handleSetPrimary = useCallback(
    async (index: number) => {
      if (isReadOnly) return;
      if (index === 0) return;

      // Swap locally first for instant feedback
      setImageUrls((prev) => {
        const newUrls = [...prev];
        [newUrls[0], newUrls[index]] = [newUrls[index], newUrls[0]];
        return newUrls;
      });
      setImageIds((prev) => {
        const newIds = [...prev];
        [newIds[0], newIds[index]] = [newIds[index], newIds[0]];
        return newIds;
      });

      // Persist to BE if we have the imageId and listingId
      const targetImageId = imageIds[index];
      if (targetImageId && listingId && user?.userId) {
        try {
          await setImageAsPrimary(user.userId, listingId, targetImageId);
        } catch {
          // Revert on failure
          setImageUrls((prev) => {
            const newUrls = [...prev];
            [newUrls[0], newUrls[index]] = [newUrls[index], newUrls[0]];
            return newUrls;
          });
          setImageIds((prev) => {
            const newIds = [...prev];
            [newIds[0], newIds[index]] = [newIds[index], newIds[0]];
            return newIds;
          });
        }
      }
    },
    [isReadOnly, imageIds, listingId, user?.userId],
  );

  const handleSaveDraft = async () => {
    if (isReadOnly) {
      setSubmitError(readOnlyMessage);
      return;
    }

    if (!user) {
      setSubmitError("Bạn cần đăng nhập để lưu bản nháp.");
      return;
    }

    setIsSaving(true);
    try {
      const payload = getDraftPayload();
      if (listingId) {
        await updateDraft(listingId, payload);
      } else {
        const draft = await saveDraft(payload);
        setListingId(draft.id);
      }
      addToast("Đã lưu bản nháp thành công!", "success");
      router.push("/seller/my-listings");
    } catch (error: any) {
      // If the API call itself worked (data saved to DB) but response parsing
      // failed, still redirect. Only block redirect for actual network/API errors.
      const msg = String(error?.message || "");
      if (msg.includes("Invalid response") || msg.includes("must be a number")) {
        addToast("Đã lưu bản nháp thành công!", "success");
        router.push("/seller/my-listings");
      } else {
        setSubmitError("Không thể lưu bản nháp. Vui lòng thử lại.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();

    if (!user) {
      setSubmitError("Bạn cần đăng nhập để đăng tin.");
      return;
    }

    if (!listingId) {
      setSubmitError("Không tìm thấy bản nháp. Vui lòng bắt đầu lại từ đầu.");
      return;
    }

    setIsSaving(true);
    setSubmitError(null);
    try {
      // Draft-First: Submit existing draft instead of creating new
      await submitDraft(listingId, user.userId);
      addToast("Đăng tin thành công! Đang chờ duyệt.", "success");
      router.push("/seller/my-listings");
    } catch (error: any) {
      const msg = String(error?.message || error?.response?.data?.message || "");
      if (msg.includes("Only DRAFT listings can be submitted") || msg.includes("Only DRAFT")) {
        // Listing was already submitted previously — treat as success
        addToast("Tin đăng đã được gửi duyệt!", "success");
        router.push("/seller/my-listings");
      } else {
        setSubmitError("Đăng tin thất bại. Vui lòng thử lại.");
      }
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
      isCancellingPublish,
      submitError,
      isReadOnly,
      readOnlyMessage: isReadOnly ? readOnlyMessage : null,
      canCancelPublish,
      loadedStatus: normalizedLoadedStatus,
      isUploadingVideo,
      videoError,
    },
    actions: {
      setStep,
      handleInputChange,
      handleAddressChange,
      handleNext,
      handleBack,
      onFileChange,
      onDrop,
      onDragOver,
      removeImage,
      handleSetPrimary,
      handleSaveDraft,
      handleSubmit,
      handleCancelPublish,
      handleVideoUpload,
      removeVideo,
    },
  };
};
