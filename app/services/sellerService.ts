import axiosInstance from './axiosConfig';

/**
 * Seller API endpoints
 * Maps to business screens: S-10, S-11, S-12, S-13, S-14, S-15, S-16, S-17, S-18, S-19
 */

interface DashboardStatsResponse {
  activeListings?: number;
  pendingListings?: number;
  rejectedListings?: number;
  transactionCount?: number;
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
}

interface CreateListingRequest {
  title: string;
  description: string;
  brand: string;
  model: string;
  year?: number;
  color?: string;
  price: number;
  condition: string;
  city: string;
  district?: string;
  address: string;
  bikeType: string;
  frameSize?: string;
  wheelSize?: string;
  material?: string;
}

interface UpdateListingRequest {
  sellerId?: string;
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
  imageOrder: number;
}

/**
 * S-10: Get seller dashboard statistics
 * @param sellerId - The seller's ID
 * @returns Dashboard stats including listing counts and transaction count
 */
export const getSellerDashboardStats = async (
  sellerId: string
): Promise<DashboardStatsResponse> => {
  return axiosInstance.get(`/api/seller/${sellerId}/dashboard/stats`);
};

/**
 * S-11: Get seller's listings with filtering and search
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

  const queryString = queryParams.toString();
  return axiosInstance.get(
    `/api/seller/${sellerId}/listings/search${queryString ? '?' + queryString : ''}`
  );
};

/**
 * S-11, S-15: Get detailed information about a specific listing
 * @param sellerId - The seller's ID
 * @param listingId - The listing's ID
 * @returns Detailed listing information
 */
export const getSellerListingDetail = async (sellerId: string, listingId: string) => {
  return axiosInstance.get(`/api/seller/${sellerId}/listings/${listingId}/detail`);
};

/**
 * S-19: Listing Result (Approve/Reject + InspectionReport)
 * URL: /api/seller/{sellerId}/listings/{listingId}/result
 * Method: GET
 */
export const getSellerListingResult = async (sellerId: string, listingId: string) => {
  return axiosInstance.get(`/api/seller/${sellerId}/listings/${listingId}/result`);
};


/**
 * S-11: Get rejection reason for a listing
 * @param sellerId - The seller's ID
 * @param listingId - The listing's ID
 * @returns Rejection reason details
 */
export const getListingRejectionReason = async (sellerId: string, listingId: string) => {
  return axiosInstance.get(`/api/seller/${sellerId}/listings/${listingId}/rejection`);
};

/**
 * S-12: Create a new listing (saves as draft by default)
 * @param sellerId - The seller's ID
 * @param data - Listing details
 * @returns Created listing object
 */
export const createSellerListing = async (sellerId: string, data: CreateListingRequest) => {
  return axiosInstance.post(`/api/seller/${sellerId}/listings/create`, data);
};

/**
 * S-14: Get preview of a listing before submission
 * @param sellerId - The seller's ID
 * @param listingId - The listing's ID
 * @returns Listing preview data
 */
export const getListingPreview = async (sellerId: string, listingId: string) => {
  return axiosInstance.get(`/api/seller/${sellerId}/listings/${listingId}/preview`);
};

/**
 * S-16: Update an existing listing
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

/**
 * S-17: Get listing status and lifecycle information
 * (Use getSellerListingDetail as it contains status info)
 */

/**
 * S-18: Get all draft listings
 * @param sellerId - The seller's ID
 * @param page - Page number (0-indexed)
 * @param pageSize - Number of items per page
 * @param sort - Sorting option (e.g., 'newest')
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
 * S-18: Delete a draft listing
 * @param sellerId - The seller's ID
 * @param draftId - The draft's ID
 * @returns Success response
 */
export const deleteSellerDraft = async (sellerId: string, draftId: string) => {
  return axiosInstance.delete(`/api/seller/${sellerId}/drafts/${draftId}`);
};

/**
 * S-12, S-18: Submit a draft listing for approval (changes status to PENDING_APPROVAL)
 * @param sellerId - The seller's ID
 * @param draftId - The draft's ID
 * @returns Updated listing object with PENDING_APPROVAL status
 */
export const submitSellerDraft = async (sellerId: string, draftId: string) => {
  return axiosInstance.post(`/api/seller/${sellerId}/drafts/${draftId}/submit`);
};

/**
 * S-13: Get all images for a listing
 * @param sellerId - The seller's ID
 * @param listingId - The listing's ID
 * @returns List of listing images
 */
export const getListingImages = async (sellerId: string, listingId: string) => {
  return axiosInstance.get(`/api/seller/${sellerId}/listings/${listingId}/images`);
};

/**
 * S-13: Upload an image to a listing
 * @param sellerId - The seller's ID
 * @param listingId - The listing's ID
 * @param data - Image data (path and order)
 * @returns Uploaded image object
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
 * @param sellerId - The seller's ID
 * @param listingId - The listing's ID
 * @param imageId - The image's ID
 * @returns Success response
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
