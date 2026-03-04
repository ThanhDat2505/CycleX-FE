import axiosInstance from './axiosConfig';

/**
 * Inspector API endpoints
 * Maps to Postman collection: S-20 to S-24
 * Schema: /api/inspector/{inspectorId}/...
 */

// ============================================================
// S-20: DASHBOARD STATS
// ============================================================

/**
 * S-20: Get inspector dashboard statistics
 * GET /api/inspector/{inspectorId}/dashboard/stats
 * @param inspectorId - The inspector's ID
 * @returns Dashboard stats (pending count, approved count, rejected count, etc.)
 */
export const getInspectorDashboardStats = async (inspectorId: string) => {
  return axiosInstance.get(`/api/inspector/${inspectorId}/dashboard/stats`);
};

// ============================================================
// S-21: LISTINGS FOR REVIEW
// ============================================================

interface ListingsForReviewParams {
  status?: 'ALL' | 'PENDING' | 'REVIEWING';
  sort?: string;
  page?: number;
  pageSize?: number;
}

/**
 * S-21: Get listings for inspector review
 * GET /api/inspector/{inspectorId}/listings
 * @param inspectorId - The inspector's ID
 * @param params - Query parameters (status, sort, pagination)
 * @returns Paginated list of listings awaiting review
 */
export const getListingsForReview = async (
  inspectorId: string,
  params?: ListingsForReviewParams
) => {
  const queryParams = new URLSearchParams();
  if (params?.status) queryParams.append('status', params.status);
  if (params?.sort) queryParams.append('sort', params.sort);
  if (params?.page !== undefined) queryParams.append('page', params.page.toString());
  if (params?.pageSize !== undefined) queryParams.append('pageSize', params.pageSize.toString());

  const queryString = queryParams.toString();
  return axiosInstance.get(
    `/api/inspector/${inspectorId}/listings${queryString ? '?' + queryString : ''}`
  );
};

// ============================================================
// S-22: LISTING DETAIL, LOCK/UNLOCK FOR REVIEW
// ============================================================

/**
 * S-22: Get detailed information about a listing for review
 * GET /api/inspector/{inspectorId}/listings/{listingId}/detail
 * @param inspectorId - The inspector's ID
 * @param listingId - The listing's ID
 * @returns Detailed listing information (title, description, images, seller info, bike details)
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
 * S-22: Lock a listing for review (prevents other inspectors from reviewing)
 * POST /api/inspector/{inspectorId}/listings/{listingId}/lock
 * @param inspectorId - The inspector's ID
 * @param listingId - The listing's ID
 * @returns Lock confirmation (status changes to REVIEWING)
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
 * S-22: Unlock a listing that was locked for review
 * POST /api/inspector/{inspectorId}/listings/{listingId}/unlock
 * @param inspectorId - The inspector's ID
 * @param listingId - The listing's ID
 * @returns Unlock confirmation
 */
export const unlockListing = async (inspectorId: string, listingId: string) => {
  return axiosInstance.post(
    `/api/inspector/${inspectorId}/listings/${listingId}/unlock`
  );
};

// ============================================================
// S-23: APPROVE & REJECT LISTING
// ============================================================

interface ApproveListingRequest {
  reasonText: string;
  reasonCode: string;
  note?: string;
}

interface RejectListingRequest {
  listingId: number;
  reasonCode: string;
  reasonText: string;
  note?: string;
}

/**
 * S-23: Approve a listing after review
 * POST /api/inspector/{inspectorId}/listings/{listingId}/approve
 * @param inspectorId - The inspector's ID
 * @param listingId - The listing's ID
 * @param data - Approval details (reasonText, reasonCode, note)
 * @returns Approval confirmation + InspectionReport created + Product created
 */
export const approveListing = async (
  inspectorId: string,
  listingId: string,
  data: ApproveListingRequest
) => {
  return axiosInstance.post(
    `/api/inspector/${inspectorId}/listings/${listingId}/approve`,
    data
  );
};

/**
 * S-23: Reject a listing with reason
 * POST /api/inspector/{inspectorId}/listings/reject
 * @param inspectorId - The inspector's ID
 * @param data - Rejection reason and details (listingId, reasonCode, reasonText, note)
 * @returns Rejection confirmation + InspectionReport created
 */
export const rejectListing = async (
  inspectorId: string,
  data: RejectListingRequest
) => {
  return axiosInstance.post(
    `/api/inspector/${inspectorId}/listings/reject`,
    data
  );
};

// ============================================================
// S-24: REVIEW HISTORY & INSPECTION REPORTS
// ============================================================

interface ReviewHistoryParams {
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
}

/**
 * S-24: Get review history for inspector
 * GET /api/inspector/{inspectorId}/reviews
 * @param inspectorId - The inspector's ID
 * @param params - Filter parameters (date range, pagination)
 * @returns Paginated array of past reviews with decisions and timestamps
 */
export const getReviewHistory = async (
  inspectorId: string,
  params?: ReviewHistoryParams
) => {
  const queryParams = new URLSearchParams();
  if (params?.from) queryParams.append('from', params.from);
  if (params?.to) queryParams.append('to', params.to);
  if (params?.page !== undefined) queryParams.append('page', params.page.toString());
  if (params?.pageSize !== undefined) queryParams.append('pageSize', params.pageSize.toString());

  const queryString = queryParams.toString();
  return axiosInstance.get(
    `/api/inspector/${inspectorId}/reviews${queryString ? '?' + queryString : ''}`
  );
};

/**
 * S-24: Get inspection report for a listing
 * GET /api/inspector/{inspectorId}/listings/{listingId}/report
 * @param inspectorId - The inspector's ID
 * @param listingId - The listing's ID
 * @returns InspectionReport object (decision, reasonCode, reasonText, inspectionDate, inspectorNote)
 */
export const getInspectionReport = async (
  inspectorId: string,
  listingId: string
) => {
  return axiosInstance.get(
    `/api/inspector/${inspectorId}/listings/${listingId}/report`
  );
};

// ============================================================
// S-24 (Related): DISPUTES
// ============================================================

interface DisputeListParams {
  status?: 'OPEN' | 'CLOSED';
  page?: number;
  pageSize?: number;
}

/**
 * S-24: List disputes for inspector
 * GET /api/inspector/{inspectorId}/disputes
 * @param inspectorId - The inspector's ID
 * @param params - Filter parameters (status, pagination)
 * @returns Paginated disputes array
 */
export const getDisputesList = async (
  inspectorId: string,
  params?: DisputeListParams
) => {
  const queryParams = new URLSearchParams();
  if (params?.status) queryParams.append('status', params.status);
  if (params?.page !== undefined) queryParams.append('page', params.page.toString());
  if (params?.pageSize !== undefined) queryParams.append('pageSize', params.pageSize.toString());

  const queryString = queryParams.toString();
  return axiosInstance.get(
    `/api/inspector/${inspectorId}/disputes${queryString ? '?' + queryString : ''}`
  );
};

/**
 * S-24: Get dispute detail
 * GET /api/inspector/{inspectorId}/disputes/{disputeId}
 * @param inspectorId - The inspector's ID
 * @param disputeId - The dispute's ID
 * @returns Dispute detail object (disputeId, listing, reason, status)
 */
export const getDisputeDetail = async (
  inspectorId: string,
  disputeId: string
) => {
  return axiosInstance.get(
    `/api/inspector/${inspectorId}/disputes/${disputeId}`
  );
};
