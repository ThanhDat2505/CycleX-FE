import axiosInstance from './axiosConfig';

/**
 * Seller API endpoints
 * Maps to Postman collection: S-10 to S-18
 * Schema: /api/seller/{sellerId}/...
 */

// ============================================================
// TYPE DEFINITIONS
// ============================================================

interface DashboardStatsResponse {
  activeListings?: number;
  pendingListings?: number;
  totalListings?: number;
  rejectedListings?: number;
  transactionCount?: number;
  totalSales?: number;
  draftCount?: number;
}

interface MyListingsRequest {
  page?: number;
  pageSize?: number;
  status?: string;
  title?: string;
  brand?: string;
  model?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  keyword?: string;
}

interface CreateListingRequest {
  sellerId?: number | string;
  title: string;
  description: string;
  bikeType: string;
  brand: string;
  model: string;
  manufactureYear?: number;
  condition: string;
  usageTime?: string;
  reasonForSale?: string;
  price: number;
  locationCity: string;
  pickupAddress: string;
  saveDraft?: boolean;
}

interface UpdateListingRequest {
  sellerId?: string | number;
  title?: string;
  description?: string;
  brand?: string;
  model?: string;
  manufactureYear?: number;
  condition?: string;
  usageTime?: string;
  reasonForSale?: string;
  price?: number;
  bikeType?: string;
  locationCity?: string;
  pickupAddress?: string;
}

interface UploadImageRequest {
  imagePath: string;
}

// ============================================================
// S-10: DASHBOARD STATS
// ============================================================

/**
 * S-10: Get seller dashboard statistics
 * GET /api/seller/{sellerId}/dashboard/stats
 * @param sellerId - The seller's ID
 * @returns Dashboard stats (totalListings, pendingApproval, approved, rejected, totalSales)
 */
export const getSellerDashboardStats = async (
  sellerId: string
): Promise<DashboardStatsResponse> => {
  return axiosInstance.get(`/api/seller/${sellerId}/dashboard/stats`);
};

// ============================================================
// S-11: MY LISTINGS - SEARCH & DETAIL
// ============================================================

/**
 * S-11: Get seller's listings with filtering and search
 * GET /api/seller/{sellerId}/listings/search
 * @param sellerId - The seller's ID
 * @param params - Filter and pagination parameters
 * @returns Paginated list of seller listings
 */
export const getSellerListings = async (
  sellerId: string,
  params?: MyListingsRequest
) => {
  const queryParams = new URLSearchParams();
  if (params?.page !== undefined) queryParams.append('page', params.page.toString());
  if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
  if (params?.status) queryParams.append('status', params.status);
  if (params?.title) queryParams.append('title', params.title);
  if (params?.brand) queryParams.append('brand', params.brand);
  if (params?.model) queryParams.append('model', params.model);
  if (params?.minPrice) queryParams.append('minPrice', params.minPrice);
  if (params?.maxPrice) queryParams.append('maxPrice', params.maxPrice);
  if (params?.sort) queryParams.append('sort', params.sort);
  if (params?.keyword) queryParams.append('keyword', params.keyword);

  const queryString = queryParams.toString();
  return axiosInstance.get(
    `/api/seller/${sellerId}/listings/search${queryString ? '?' + queryString : ''}`
  );
};

/**
 * S-11: Get detailed information about a specific listing
 * GET /api/seller/{sellerId}/listings/{listingId}/detail
 * @param sellerId - The seller's ID
 * @param listingId - The listing's ID
 * @returns Detailed listing information with all fields and images
 */
export const getSellerListingDetail = async (sellerId: string, listingId: string) => {
  return axiosInstance.get(`/api/seller/${sellerId}/listings/${listingId}/detail`);
};

/**
 * S-11: Get rejection reason for a listing
 * GET /api/seller/{sellerId}/listings/{listingId}/rejection
 * @param sellerId - The seller's ID
 * @param listingId - The listing's ID
 * @returns Rejection reason object (reasonCode, reasonText, rejectionDate)
 */
export const getListingRejectionReason = async (sellerId: string, listingId: string) => {
  return axiosInstance.get(`/api/seller/${sellerId}/listings/${listingId}/rejection`);
};

/**
 * S-11: Get listing result (Approval/Rejection + Inspection Report)
 * GET /api/seller/{sellerId}/listings/{listingId}/result
 * @param sellerId - The seller's ID
 * @param listingId - The listing's ID
 * @returns { listing: SellerListingResponse, inspectionReport: InspectionReportResponse }
 */
export const getSellerListingResult = async (sellerId: string, listingId: string) => {
  return axiosInstance.get(`/api/seller/${sellerId}/listings/${listingId}/result`);
};

// ============================================================
// S-12: CREATE & UPDATE LISTING
// ============================================================

/**
 * S-12: Create a new listing (saves as draft by default or submits if saveDraft=false)
 * POST /api/seller/{sellerId}/listings/create
 * @param sellerId - The seller's ID
 * @param data - Listing details
 * @returns Created listing object with listingId
 */
export const createSellerListing = async (sellerId: string, data: CreateListingRequest) => {
  // Ensure sellerId is in the payload
  const payload = { ...data, sellerId };
  return axiosInstance.post(`/api/seller/${sellerId}/listings/create`, payload);
};

/**
 * S-12: Update an existing listing (PATCH)
 * PATCH /api/seller/{sellerId}/listings/{listingId}
 * @param sellerId - The seller's ID
 * @param listingId - The listing's ID
 * @param data - Updated listing details
 * @returns Updated listing object
 */
export const updateSellerListing = async (
  sellerId: string,
  listingId: string,
  data: UpdateListingRequest
) => {
  return axiosInstance.patch(`/api/seller/${sellerId}/listings/${listingId}`, data);
};

// ============================================================
// S-13: LISTING IMAGES
// ============================================================

/**
 * S-13: Get all images for a listing
 * GET /api/seller/{sellerId}/listings/{listingId}/images
 * @param sellerId - The seller's ID
 * @param listingId - The listing's ID
 * @returns Array of image objects (imageId, imagePath, uploadDate)
 */
export const getListingImages = async (sellerId: string, listingId: string) => {
  return axiosInstance.get(`/api/seller/${sellerId}/listings/${listingId}/images`);
};

/**
 * S-13: Upload an image to a listing
 * POST /api/seller/{sellerId}/listings/{listingId}/images
 * @param sellerId - The seller's ID
 * @param listingId - The listing's ID
 * @param data - Image data (imagePath)
 * @returns Uploaded image object with imageId
 */
export const uploadListingImage = async (
  sellerId: string,
  listingId: string,
  data: UploadImageRequest
) => {
  return axiosInstance.post(`/api/seller/${sellerId}/listings/${listingId}/images`, data);
};

/**
 * S-13: Delete an image from a listing
 * DELETE /api/seller/{sellerId}/listings/{listingId}/images/{imageId}
 * @param sellerId - The seller's ID
 * @param listingId - The listing's ID
 * @param imageId - The image's ID
 * @returns Deletion confirmation
 */
export const deleteListingImage = async (
  sellerId: string,
  listingId: string,
  imageId: string
) => {
  return axiosInstance.delete(
    `/api/seller/${sellerId}/listings/${listingId}/images/${imageId}`
  );
};

// ============================================================
// S-14: LISTING PREVIEW
// ============================================================

/**
 * S-14: Get preview of a listing before submission/publication
 * GET /api/seller/{sellerId}/listings/{listingId}/preview
 * @param sellerId - The seller's ID
 * @param listingId - The listing's ID
 * @returns Listing preview object showing how it will appear to buyers
 */
export const getListingPreview = async (sellerId: string, listingId: string) => {
  return axiosInstance.get(`/api/seller/${sellerId}/listings/${listingId}/preview`);
};

// ============================================================
// S-18: DRAFTS
// ============================================================

/**
 * S-18: Get all draft listings
 * GET /api/seller/{sellerId}/drafts
 * @param sellerId - The seller's ID
 * @param page - Page number (0-indexed)
 * @param pageSize - Number of items per page
 * @param sort - Sorting option (e.g., 'newest', 'oldest')
 * @returns Paginated list of draft listings
 */
export const getSellerDrafts = async (
  sellerId: string,
  page?: number,
  pageSize?: number,
  sort?: string
) => {
  const queryParams = new URLSearchParams();
  if (page !== undefined) queryParams.append('page', page.toString());
  if (pageSize) queryParams.append('pageSize', pageSize.toString());
  if (sort) queryParams.append('sort', sort);

  const queryString = queryParams.toString();
  return axiosInstance.get(
    `/api/seller/${sellerId}/drafts${queryString ? '?' + queryString : ''}`
  );
};

/**
 * S-18: Submit a draft listing for approval (changes status to PENDING)
 * POST /api/seller/{sellerId}/drafts/{listingId}/submit
 * @param sellerId - The seller's ID
 * @param listingId - The draft's listing ID
 * @returns Confirmation (listing status: PENDING)
 */
export const submitSellerDraft = async (sellerId: string, listingId: string) => {
  return axiosInstance.post(`/api/seller/${sellerId}/drafts/${listingId}/submit`);
};

/**
 * S-18: Delete a draft listing
 * DELETE /api/seller/{sellerId}/drafts/{listingId}
 * @param sellerId - The seller's ID
 * @param listingId - The draft's listing ID
 * @returns Deletion confirmation
 */
export const deleteSellerDraft = async (sellerId: string, listingId: string) => {
  return axiosInstance.delete(`/api/seller/${sellerId}/drafts/${listingId}`);
};
