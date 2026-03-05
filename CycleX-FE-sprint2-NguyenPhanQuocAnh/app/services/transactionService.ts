
import axiosInstance from './axiosConfig';

/**
 * Transaction & Purchase Request Service
 * Maps to Postman collection: S-50 (Purchase Request), S-52 to S-54 (Transactions)
 */

// ============================================================
// TYPE DEFINITIONS
// ============================================================

interface PurchaseRequestReviewData {
  transactionType: 'PURCHASE' | 'DEPOSIT';
  desiredTransactionTime: string;
  note?: string;
}

interface CreatePurchaseRequestData {
  transactionType: 'PURCHASE' | 'DEPOSIT';
  desiredTransactionTime: string;
  note?: string;
}

interface ConfirmTransactionRequest {
  note?: string;
}

interface RejectTransactionRequest {
  reason: string;
}

interface PendingTransactionParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
  transactionType?: 'PURCHASE' | 'DEPOSIT';
  keyword?: string;
}

// ============================================================
// S-50: PURCHASE REQUEST
// ============================================================

/**
 * S-50.1: Init Purchase Request Screen
 * GET /api/products/{productId}/purchase-request/init
 * @param productId - The product's ID
 * @returns Init data (product details, seller info, pricing, fees)
 */
export const initPurchaseRequest = async (productId: string) => {
  return axiosInstance.get(`/api/products/${productId}/purchase-request/init`);
};

/**
 * S-50.2: Review Purchase Request (no DB write)
 * POST /api/products/{productId}/purchase-requests/review
 * @param productId - The product's ID
 * @param data - Review data (transactionType, desiredTransactionTime, note)
 * @returns Review preview (totals, fees, timeline)
 */
export const reviewPurchaseRequest = async (
  productId: string,
  data: PurchaseRequestReviewData
) => {
  return axiosInstance.post(
    `/api/products/${productId}/purchase-requests/review`,
    data
  );
};

/**
 * S-50.3: Create Purchase Request (PURCHASE or DEPOSIT)
 * POST /api/products/{productId}/purchase-requests
 * @param productId - The product's ID
 * @param data - Purchase request data (transactionType, desiredTransactionTime, note)
 * @returns Created request with requestId
 */
export const createPurchaseRequest = async (
  productId: string,
  data: CreatePurchaseRequestData
) => {
  return axiosInstance.post(
    `/api/products/${productId}/purchase-requests`,
    data
  );
};

// ============================================================
// S-52: SELLER - GET PENDING TRANSACTIONS
// ============================================================

/**
 * S-52: Get pending transactions for seller
 * GET /api/seller/transactions/pending
 * @param params - Filter and pagination parameters
 * @returns Paginated pending transactions array with buyer info
 */
export const getSellerPendingTransactions = async (
  params?: PendingTransactionParams
) => {
  const queryParams = new URLSearchParams();
  if (params?.page !== undefined) queryParams.append('page', params.page.toString());
  if (params?.size !== undefined) queryParams.append('size', params.size.toString());
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params?.sortDir) queryParams.append('sortDir', params.sortDir);
  if (params?.transactionType) queryParams.append('transactionType', params.transactionType);
  if (params?.keyword) queryParams.append('keyword', params.keyword);

  const queryString = queryParams.toString();
  return axiosInstance.get(
    `/api/seller/transactions/pending${queryString ? '?' + queryString : ''}`
  );
};

// ============================================================
// S-53: SELLER - TRANSACTION DETAIL & ACTIONS
// ============================================================

/**
 * S-53: Get transaction detail (seller view)
 * GET /api/seller/transactions/{requestId}
 * @param requestId - The transaction/request ID
 * @returns Transaction detail (buyer, listing, amount, desired time, status)
 */
export const getSellerTransactionDetail = async (requestId: string) => {
  return axiosInstance.get(`/api/seller/transactions/${requestId}`);
};

/**
 * S-53: Confirm transaction (seller accepts purchase request)
 * POST /api/seller/transactions/{requestId}/confirm
 * @param requestId - The transaction/request ID
 * @param data - Confirmation data (note)
 * @returns Confirmation (status: CONFIRMED)
 */
export const confirmSellerTransaction = async (
  requestId: string,
  data?: ConfirmTransactionRequest
) => {
  return axiosInstance.post(
    `/api/seller/transactions/${requestId}/confirm`,
    data || {}
  );
};

/**
 * S-53: Reject transaction (seller rejects purchase request)
 * POST /api/seller/transactions/{requestId}/reject
 * @param requestId - The transaction/request ID
 * @param data - Rejection data (reason)
 * @returns Rejection confirmation (status: REJECTED)
 */
export const rejectSellerTransaction = async (
  requestId: string,
  data: RejectTransactionRequest
) => {
  return axiosInstance.post(
    `/api/seller/transactions/${requestId}/reject`,
    data
  );
};

// ============================================================
// S-54: BUYER - TRANSACTION DETAIL & ACTIONS
// ============================================================

/**
 * S-54: Get transaction detail (buyer view)
 * GET /api/buyer/transactions/{requestId}
 * @param requestId - The transaction/request ID
 * @returns Transaction detail (seller, listing, status, timeline)
 */
export const getBuyerTransactionDetail = async (requestId: string) => {
  return axiosInstance.get(`/api/buyer/transactions/${requestId}`);
};

/**
 * S-54: Cancel transaction (buyer cancels before seller confirms)
 * POST /api/buyer/transactions/{requestId}/cancel
 * @param requestId - The transaction/request ID
 * @returns Cancellation confirmation (status: CANCELLED)
 */
export const cancelBuyerTransaction = async (requestId: string) => {
  return axiosInstance.post(`/api/buyer/transactions/${requestId}/cancel`);
};
