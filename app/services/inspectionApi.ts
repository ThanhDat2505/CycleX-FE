import axiosInstance from './axiosConfig';

/**
 * Inspector API endpoints
 * Maps to business screens: Inspector dashboard and review management
 */

interface InspectionQueryParams {
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
}

interface RejectListingRequest {
  listingId: number;
  reasonCode: string;
  reasonText: string;
  note?: string;
}

/**
 * Get inspector dashboard statistics
 * GET /api/inspector/{inspectorId}/dashboard/stats
 * @param inspectorId - The inspector's ID
 * @returns Dashboard stats
 */
export const getInspectorDashboardStats = async (inspectorId: string) => {
  return axiosInstance.get(`/api/inspector/${inspectorId}/dashboard/stats`);
};

/**
 * Get listings for inspector review
 * GET /api/inspector/{inspectorId}/listings
 * @param inspectorId - The inspector's ID
 * @returns List of listings awaiting review
 */
export const getListingsForReview = async (inspectorId: string) => {
  return axiosInstance.get(`/api/inspector/${inspectorId}/listings`);
};

/**
 * Get detailed information about a listing for review
 * GET /api/inspector/{inspectorId}/listings/{id}/detail
 * @param inspectorId - The inspector's ID
 * @param listingId - The listing's ID
 * @returns Detailed listing information for review
 */
export const getListingDetailForReview = async (
  inspectorId: string,
  listingId: string
) => {
  return axiosInstance.get(
    `/api/inspector/${inspectorId}/listings/${listingId}/detail`
  );
};

/**
 * Lock a listing for review (prevents other inspectors from reviewing)
 * POST /api/inspector/{inspectorId}/listings/{id}/lock
 * @param inspectorId - The inspector's ID
 * @param listingId - The listing's ID
 * @returns Success response
 */
export const lockListingForReview = async (
  inspectorId: string,
  listingId: string
) => {
  return axiosInstance.post(
    `/api/inspector/${inspectorId}/listings/${listingId}/lock`
  );
};

/**
 * Unlock a listing that was locked for review
 * POST /api/inspector/{inspectorId}/listings/{id}/unlock
 * @param inspectorId - The inspector's ID
 * @param listingId - The listing's ID
 * @returns Success response
 */
export const unlockListing = async (inspectorId: string, listingId: string) => {
  return axiosInstance.post(
    `/api/inspector/${inspectorId}/listings/${listingId}/unlock`
  );
};

/**
 * Approve a listing after review
 * POST /api/inspector/{inspectorId}/listings/{id}/approve
 * @param inspectorId - The inspector's ID
 * @param listingId - The listing's ID
 * @returns Success response
 */
export const approveListing = async (inspectorId: string, listingId: string) => {
  return axiosInstance.post(
    `/api/inspector/${inspectorId}/listings/${listingId}/approve`
  );
};

/**
 * Reject a listing with reason
 * POST /api/inspector/{inspectorId}/listings/reject
 * @param inspectorId - The inspector's ID
 * @param data - Rejection reason and details
 * @returns Success response
 */
export const rejectListing = async (
  inspectorId: string,
  data: RejectListingRequest
) => {
  return axiosInstance.post(`/api/inspector/${inspectorId}/listings/reject`, data);
};

/**
 * Get review history for inspector
 * POST /api/inspector/{inspectorId}/reviews
 * @param inspectorId - The inspector's ID
 * @param params - Filter parameters (date range, pagination)
 * @returns Paginated list of review history
 */
export const getReviewHistory = async (
  inspectorId: string,
  params?: InspectionQueryParams
) => {
  const data = {
    from: params?.from || '',
    to: params?.to || '',
    page: params?.page || 0,
    pageSize: params?.pageSize || 20,
  };
  return axiosInstance.post(`/api/inspector/${inspectorId}/reviews`, data);
};
