import axiosInstance from './axiosConfig';

/**
 * Bike Listing API endpoints (from Postman collection)
 * Public APIs for viewing and searching listings
 */

interface ListingsQueryParams {
  page?: number;
  size?: number;
  status?: string;
  city?: string;
  title?: string;
}

/**
 * Get all bike listings with optional filtering
 * Public endpoint - no authentication required
 * POST /api/bikelistings | GET /api/bikelistings
 * @param params - Query parameters for filtering and pagination
 * @returns Paginated list of bike listings
 */
export const getAllBikeListings = async (params?: ListingsQueryParams) => {
  const queryParams = new URLSearchParams();
  if (params?.page !== undefined) queryParams.append('page', params.page.toString());
  if (params?.size) queryParams.append('size', params.size.toString());
  if (params?.status) queryParams.append('status', params.status);
  if (params?.city) queryParams.append('city', params.city);
  if (params?.title) queryParams.append('title', params.title);

  const queryString = queryParams.toString();
  return axiosInstance.get(
    `/api/bikelistings${queryString ? '?' + queryString : ''}`
  );
};

/**
 * Get a specific bike listing by ID
 * Public endpoint - no authentication required
 * GET /api/bikelistings/{id}
 * @param listingId - The listing's ID
 * @returns Detailed listing information
 */
export const getBikeListingById = async (listingId: string) => {
  return axiosInstance.get(`/api/bikelistings/${listingId}`);
};

/**
 * Create a new bike listing (Admin/Internal endpoint)
 * POST /api/bikelistings
 * @param data - Listing details
 * @returns Created listing object
 */
export const createBikeListing = async (data: any) => {
  return axiosInstance.post('/api/bikelistings', data);
};

/**
 * Update a bike listing (Admin/Internal endpoint)
 * PUT /api/bikelistings/{id}
 * @param listingId - The listing's ID
 * @param data - Updated listing details
 * @returns Updated listing object
 */
export const updateBikeListing = async (listingId: string, data: any) => {
  return axiosInstance.put(`/api/bikelistings/${listingId}`, data);
};

/**
 * Delete a bike listing (Admin/Internal endpoint)
 * DELETE /api/bikelistings/{id}
 * @param listingId - The listing's ID
 * @returns Success response
 */
export const deleteBikeListing = async (listingId: string) => {
  return axiosInstance.delete(`/api/bikelistings/${listingId}`);
};
