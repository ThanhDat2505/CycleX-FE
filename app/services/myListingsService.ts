/* eslint-disable @typescript-eslint/no-explicit-any */

// Service layer for My Listings (S-11)

import {
    validateResponse,
    validateArray,
    validateObject,
    validateNumber,
    validateString,
    validateEnum,
    validatePositiveNumber
} from '../utils/apiValidation';
import { apiCallPOST, apiCallPUT, apiCallGET, apiCallPATCH, apiCallDELETE } from '../utils/apiHelpers';
import { ITEMS_PER_PAGE, VALID_LISTING_STATUSES, type ListingStatus } from '../constants';

export interface Listing {
    id: number;
    mainImageUrl?: string;
    brand: string;
    model: string;
    type: string;
    condition: string;
    price: number;
    location: string;
    status: ListingStatus;
    rejectionReason?: string;
    shipping: boolean;
    views: number;
    inquiries: number;
    createdDate: string;
    updatedDate: string;
}

export interface GetMyListingsParams {
    sellerId?: number;
    page?: number;
    pageSize?: number;
    status?: string;
    sortBy?: 'recent' | 'views' | 'price-high' | 'price-low';
}

export interface GetMyListingsResponse {
    listings: Listing[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
}

export interface CreateListingPayload {
    sellerId: number;
    title: string;
    description?: string;
    bikeType: string;
    brand: string;
    model: string;
    manufactureYear?: number;
    condition?: string;
    usageTime?: string;
    reasonForSale?: string;
    price: number;
    locationCity: string;
    pickupAddress?: string;
    imageUrls?: string[];
    saveDraft?: boolean;
}

type ListingApiResponse = Partial<Listing> & {
    listingId?: number;
};

interface SellerListingSearchItemResponse {
    listingId: number;
    title?: string;
    brand: string;
    model: string;
    price: number | string;
    status: string;
    viewsCount?: number;
    rejectionReason?: string;
    condition?: string;
    locationCity?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface SellerListingDetailResponse {
    listingId: number;
    sellerId?: number;
    title?: string;
    description?: string;
    bikeType?: string;
    brand: string;
    model: string;
    manufactureYear?: number;
    condition?: string;
    usageTime?: string;
    reasonForSale?: string;
    price: number | string;
    locationCity?: string;
    pickupAddress?: string;
    status: string;
    viewsCount?: number;
    createdAt?: string;
    updatedAt?: string;
}

interface SellerListingSearchPageResponse {
    content: SellerListingSearchItemResponse[];
    totalElements: number;
    totalPages: number;
    number: number;
}

/**
 * Backend may return `listingId` while FE expects `id`.
 * Normalize once so downstream code can consistently rely on `id`.
 */
function normalizeListingResponse(response: ListingApiResponse, context: string): Listing {
    validateResponse(response, context);

    const normalizedId = typeof response.id === 'number'
        ? response.id
        : response.listingId;

    if (typeof normalizedId !== 'number') {
        throw new Error(`Invalid response: ${context}.id (or listingId) must be a number`);
    }

    return {
        ...response,
        id: normalizedId,
    } as Listing;
}

function mapStatusFromBackend(status: string): ListingStatus {
    const normalized = status.toUpperCase();
    if (normalized === 'APPROVED') return 'APPROVE';
    if (normalized === 'REJECTED') return 'REJECT';
    if (normalized === 'SOLD') return 'SOLD';
    if (normalized === 'DRAFT') return 'DRAFT';
    if (normalized === 'PENDING') return 'PENDING';
    if (normalized === 'NEED_MORE_INFO') return 'NEED_MORE_INFO';
    if (normalized === 'HELD') return 'HELD';

    // Treat in-review/non-editable statuses as PENDING on My Listings card.
    if (normalized === 'REVIEWING' || normalized === 'WAITING_INSPECTOR_REVIEW' || normalized === 'ARCHIVED') {
        return 'PENDING';
    }

    return 'PENDING';
}

function mapStatusToBackend(status?: string): string | undefined {
    if (!status) return undefined;

    const normalized = status.toUpperCase();
    if (normalized === 'APPROVE' || normalized === 'ACTIVE') return 'APPROVED';
    if (normalized === 'REJECT') return 'REJECTED';
    if (normalized === 'SOLD') return 'SOLD';
    if (normalized === 'DRAFT' || normalized === 'PENDING') return normalized;

    return undefined;
}

function mapSearchItemToListing(item: SellerListingSearchItemResponse): Listing {
    const parsedPrice = Number(item.price ?? 0);

    return {
        id: item.listingId,
        brand: item.brand,
        model: item.model,
        type: item.title || '',
        condition: item.condition || '',
        price: Number.isFinite(parsedPrice) ? parsedPrice : 0,
        location: item.locationCity || '',
        status: mapStatusFromBackend(item.status),
        rejectionReason: item.rejectionReason,
        shipping: false,
        views: item.viewsCount ?? 0,
        inquiries: 0,
        createdDate: item.createdAt || new Date().toISOString(),
        updatedDate: item.updatedAt || item.createdAt || new Date().toISOString(),
    };
}

async function attachMainImageToListings(sellerId: number, listings: Listing[]): Promise<Listing[]> {
    const resolveImageUrl = (imagePath?: string): string | undefined => {
        if (!imagePath) return undefined;
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
        if (imagePath.startsWith('/public/')) return imagePath;
        if (imagePath.startsWith('/uploads/')) return `/backend${imagePath}`;
        return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    };

    const listingsWithImage = await Promise.all(
        listings.map(async (listing) => {
            try {
                const images = await getListingImages(sellerId, listing.id);
                const sorted = [...images].sort((a, b) => (a.imageOrder ?? 0) - (b.imageOrder ?? 0));
                const mainImageUrl = resolveImageUrl(sorted[0]?.imagePath);
                return mainImageUrl ? ({ ...listing, mainImageUrl } as Listing) : listing;
            } catch {
                // Image loading failure should not block listing cards.
                return listing;
            }
        })
    );

    return listingsWithImage;
}

/**
 * Get seller's listings with pagination and filters
 * 
 * API Endpoint: GET /seller/listings
 * Query params: page, pageSize, status, sortBy
 */
export async function getMyListings(
    params: GetMyListingsParams = {}
): Promise<GetMyListingsResponse> {
    const { sellerId, page = 1, pageSize = ITEMS_PER_PAGE, status, sortBy = 'recent' } = params;

    if (!sellerId) {
        throw new Error('Seller ID is required to load listings.');
    }

    const backendStatus = mapStatusToBackend(status);
    const queryObj: Record<string, string> = {
        page: Math.max(page - 1, 0).toString(),
        pageSize: pageSize.toString(),
        sort: sortBy === 'recent' ? 'newest' : 'newest',
    };

    if (backendStatus) {
        queryObj.status = backendStatus;
    }

    const queryStr = new URLSearchParams(queryObj).toString();
    const response = await apiCallGET<SellerListingSearchPageResponse>(
        `/seller/${sellerId}/listings/search?${queryStr}`
    );

    validateResponse(response, 'getMyListings response');
    validateArray(response.content, 'content');
    validateNumber(response.totalElements, 'totalElements');
    validateNumber(response.totalPages, 'totalPages');
    validateNumber(response.number, 'number');

    const mappedListings = response.content.map(mapSearchItemToListing);

    // BE currently sorts by createdAt; keep FE-side sort fallback for current page.
    if (sortBy === 'views') {
        mappedListings.sort((a, b) => b.views - a.views);
    } else if (sortBy === 'price-high') {
        mappedListings.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'price-low') {
        mappedListings.sort((a, b) => a.price - b.price);
    }

    const listingsWithImage = await attachMainImageToListings(sellerId, mappedListings);

    return {
        listings: listingsWithImage,
        totalItems: response.totalElements,
        totalPages: response.totalPages,
        currentPage: response.number + 1,
    };
}

/**
 * Create a new listing and submit for approval
 * Endpoint: POST /api/seller/{sellerId}/listings/create
 */
export async function createListing(payload: CreateListingPayload): Promise<Listing> {
    // Real API: POST /api/seller/{sellerId}/listings/create
    // Strip imageUrls — images are uploaded separately via /images endpoint
    const { sellerId, imageUrls, ...body } = payload;
    const response = await apiCallPOST<ListingApiResponse>(`/seller/${sellerId}/listings/create`, { ...body, sellerId, saveDraft: false });
    const normalizedResponse = normalizeListingResponse(response, 'createListing response');

    validateNumber(normalizedResponse.id, 'id');
    validateString(normalizedResponse.brand, 'brand');
    validateString(normalizedResponse.model, 'model');
    validateEnum(normalizedResponse.status, VALID_LISTING_STATUSES, 'status');

    return normalizedResponse;
}

/**
 * Save listing as draft (not submitted for approval)
 * Endpoint: POST /api/seller/{sellerId}/listings/create (saveDraft: true)
 */
export async function saveDraft(payload: CreateListingPayload): Promise<Listing> {
    // Real API: POST /api/seller/{sellerId}/listings/create with saveDraft: true
    // Strip imageUrls — images are uploaded separately via /images endpoint
    const { sellerId, imageUrls, ...body } = payload;
    const response = await apiCallPOST<ListingApiResponse>(`/seller/${sellerId}/listings/create`, { ...body, sellerId, saveDraft: true });
    const normalizedResponse = normalizeListingResponse(response, 'saveDraft response');

    validateNumber(normalizedResponse.id, 'id');
    validateString(normalizedResponse.brand, 'brand');
    validateString(normalizedResponse.model, 'model');
    validateEnum(normalizedResponse.status, VALID_LISTING_STATUSES, 'status');

    return normalizedResponse;
}

/**
 * Update an existing listing
 * Endpoint: PATCH /api/seller/{sellerId}/listings/{listingId}
 */
export async function updateDraft(listingId: number, payload: Partial<CreateListingPayload>): Promise<Listing> {
    // Real API: PATCH /api/seller/{sellerId}/listings/{listingId}
    const { sellerId, ...rest } = payload;
    const sid = sellerId ?? 0;
    const response = await apiCallPATCH<ListingApiResponse>(`/seller/${sid}/listings/${listingId}`, { sellerId: sid, ...rest });
    const normalizedResponse = normalizeListingResponse(response, 'updateDraft response');

    validateNumber(normalizedResponse.id, 'id');

    return normalizedResponse;
}

/**
 * Submit a draft listing for approval (DRAFT → PENDING)
 * Endpoint: POST /api/seller/{sellerId}/drafts/{listingId}/submit
 */
export async function submitDraft(listingId: number, sellerId?: number): Promise<Listing> {
    // Real API: POST /api/seller/{sellerId}/drafts/{listingId}/submit
    const sid = sellerId ?? 0;
    const response = await apiCallPOST<ListingApiResponse>(`/seller/${sid}/drafts/${listingId}/submit`, {});
    const normalizedResponse = normalizeListingResponse(response, 'submitDraft response');

    validateNumber(normalizedResponse.id, 'id');
    validateEnum(normalizedResponse.status, VALID_LISTING_STATUSES, 'status');

    return normalizedResponse;
}

/**
 * Cancel publish for a listing (expected PENDING/REVIEWING -> DRAFT)
 * Fallback implementation uses seller update endpoint with status=DRAFT.
 */
export async function cancelPublish(listingId: number, sellerId: number): Promise<Listing> {
    const response = await apiCallPATCH<ListingApiResponse>(
        `/seller/${sellerId}/listings/${listingId}/cancel-publish`,
        {}
    );
    const normalizedResponse = normalizeListingResponse(response, 'cancelPublish response');

    validateNumber(normalizedResponse.id, 'id');
    validateEnum(normalizedResponse.status, VALID_LISTING_STATUSES, 'status');

    return normalizedResponse;
}

/**
 * Preview a listing before submitting
 * Endpoint: GET /api/seller/{sellerId}/listings/{listingId}/preview
 */
export async function previewListing(sellerId: number, listingId: number): Promise<Listing> {
    // Real API: GET /api/seller/{sellerId}/listings/{listingId}/preview
    const response = await apiCallGET<ListingApiResponse>(`/seller/${sellerId}/listings/${listingId}/preview`);
    const normalizedResponse = normalizeListingResponse(response, 'previewListing response');

    validateNumber(normalizedResponse.id, 'id');
    validateString(normalizedResponse.brand, 'brand');
    validateString(normalizedResponse.model, 'model');

    return normalizedResponse;
}

/**
 * Submit a DRAFT listing for approval (DRAFT → PENDING)
 * Endpoint: POST /api/seller/{sellerId}/drafts/{listingId}/submit
 */
export async function submitListing(sellerId: number, listingId: number): Promise<Listing> {
    // Real API: POST /api/seller/{sellerId}/drafts/{listingId}/submit
    const response = await apiCallPOST<ListingApiResponse>(`/seller/${sellerId}/drafts/${listingId}/submit`, {});
    const normalizedResponse = normalizeListingResponse(response, 'submitListing response');

    validateNumber(normalizedResponse.id, 'id');
    validateEnum(normalizedResponse.status, VALID_LISTING_STATUSES, 'status');

    return normalizedResponse;
}

export interface GetDraftsParams {
    sellerId: number;
    sort?: 'newest' | 'oldest';
    page?: number;
    pageSize?: number;
}

export interface GetDraftsResponse {
    items: Listing[];
    pagination: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        pageSize: number;
    };
}

/**
 * Get all draft listings
 * Endpoint: GET /api/seller/{sellerId}/drafts?page=0&pageSize=10&sort=newest
 */
export async function getDrafts(params: GetDraftsParams): Promise<GetDraftsResponse> {
    const { sellerId, sort = 'newest', page = 0, pageSize = 10 } = params;

    // Real API: GET /api/seller/{sellerId}/drafts
    const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        sort,
    }).toString();
    const response = await apiCallGET<SellerListingSearchPageResponse>(`/seller/${sellerId}/drafts?${queryParams}`);

    validateResponse(response, 'getDrafts response');
    validateArray(response.content, 'content');
    validateNumber(response.totalElements, 'totalElements');
    validateNumber(response.totalPages, 'totalPages');
    validateNumber(response.number, 'number');

    const items = response.content.map(mapSearchItemToListing);

    return {
        items,
        pagination: {
            totalItems: response.totalElements,
            totalPages: response.totalPages,
            currentPage: response.number,
            pageSize,
        },
    };
}

// ========== NEW API ENDPOINTS (from CycleX API Postman) ==========

/**
 * Get seller dashboard stats
 * Endpoint: GET /api/seller/{sellerId}/dashboard/stats
 */
export async function getDashboardStats(sellerId: number): Promise<any> {
    return await apiCallGET(`/seller/${sellerId}/dashboard/stats`);
}

/**
 * Get My Listings with search/filter
 * Endpoint: GET /api/seller/{sellerId}/listings/search?page=0&pageSize=20&status=APPROVED
 */
export interface SearchListingsParams {
    sellerId: number;
    page?: number;
    pageSize?: number;
    status?: string;
    title?: string;
    brand?: string;
    model?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
}

export async function searchMyListings(params: SearchListingsParams): Promise<GetMyListingsResponse> {
    const { sellerId, page = 0, pageSize = 20, status, title, brand, model, minPrice, maxPrice, sort } = params;

    const queryObj: Record<string, string> = { page: page.toString(), pageSize: pageSize.toString() };
    const backendStatus = mapStatusToBackend(status);
    if (backendStatus) queryObj.status = backendStatus;
    if (title) queryObj.title = title;
    if (brand) queryObj.brand = brand;
    if (model) queryObj.model = model;
    if (minPrice !== undefined) queryObj.minPrice = minPrice.toString();
    if (maxPrice !== undefined) queryObj.maxPrice = maxPrice.toString();
    if (sort) queryObj.sort = sort;

    const queryStr = new URLSearchParams(queryObj).toString();
    const response = await apiCallGET<SellerListingSearchPageResponse>(`/seller/${sellerId}/listings/search?${queryStr}`);

    validateResponse(response, 'searchMyListings response');
    validateArray(response.content, 'content');
    validateNumber(response.totalElements, 'totalElements');
    validateNumber(response.totalPages, 'totalPages');
    validateNumber(response.number, 'number');

    return {
        listings: response.content.map(mapSearchItemToListing),
        totalItems: response.totalElements,
        totalPages: response.totalPages,
        currentPage: response.number + 1,
    };
}

/**
 * Get listing detail for seller edit/view flow
 * Endpoint: GET /api/seller/{sellerId}/listings/{listingId}/preview
 */
export async function getListingDetail(sellerId: number, listingId: number): Promise<SellerListingDetailResponse> {
    const response = await apiCallGET<SellerListingDetailResponse>(`/seller/${sellerId}/listings/${listingId}/preview`);

    validateResponse(response, 'getListingDetail response');
    validateNumber(response.listingId, 'listingId');
    validateString(response.brand, 'brand');
    validateString(response.model, 'model');
    validateString(response.status, 'status');

    return response;
}

/**
 * Get rejection reason for a listing
 * Endpoint: GET /api/seller/{sellerId}/listings/{listingId}/rejection
 */
export interface RejectionInfo {
    listingId: number;
    reasonCode: string;
    reasonText: string;
    note?: string;
}

export async function getRejectionReason(sellerId: number, listingId: number): Promise<RejectionInfo> {
    return await apiCallGET<RejectionInfo>(`/seller/${sellerId}/listings/${listingId}/rejection`);
}

/**
 * Delete a draft listing
 * Endpoint: DELETE /api/seller/{sellerId}/drafts/{draftId}
 */
export async function deleteDraft(sellerId: number, draftId: number): Promise<void> {
    await apiCallDELETE(`/seller/${sellerId}/drafts/${draftId}`);
}

/**
 * Get listing images
 * Endpoint: GET /api/seller/{sellerId}/listings/{listingId}/images
 */
export interface ListingImage {
    id?: number;
    imageId?: number;
    imagePath: string;
    imageOrder: number;
}

export async function getListingImages(sellerId: number, listingId: number): Promise<ListingImage[]> {
    return await apiCallGET<ListingImage[]>(`/seller/${sellerId}/listings/${listingId}/images`);
}

/**
 * Upload a listing image
 * Endpoint: POST /api/seller/{sellerId}/listings/{listingId}/images
 * Body: { imagePath, imageOrder }
 */
export async function uploadListingImage(
    sellerId: number,
    listingId: number,
    imagePath: string,
    _imageOrder?: number
): Promise<ListingImage> {
    return await apiCallPOST<ListingImage>(`/seller/${sellerId}/listings/${listingId}/images`, { imagePath });
}

/**
 * Delete a listing image
 * Endpoint: DELETE /api/seller/{sellerId}/listings/{listingId}/images/{imageId}
 */
export async function deleteListingImage(sellerId: number, listingId: number, imageId: number): Promise<void> {
    await apiCallDELETE(`/seller/${sellerId}/listings/${listingId}/images/${imageId}`);
}

/**
 * Set an image as primary (order = 1)
 * Endpoint: PATCH /api/seller/{sellerId}/listings/{listingId}/images/{imageId}/set-primary
 */
export async function setImageAsPrimary(sellerId: number, listingId: number, imageId: number): Promise<void> {
    await apiCallPATCH(`/seller/${sellerId}/listings/${listingId}/images/${imageId}/set-primary`, {});
}
/**
 * Save listing video path to DB
 * Endpoint: POST /api/seller/{sellerId}/listings/{listingId}/video
 */
export async function saveListingVideo(sellerId: number, listingId: number, videoPath: string): Promise<void> {
    await apiCallPOST(`/seller/${sellerId}/listings/${listingId}/video`, { videoPath });
}
