/**
 * Dispute Service
 * Handles API calls for dispute creation and management.
 */

import { CreateDisputeRequest, Dispute, DisputeReason, DisputeDetailResponse, DisputeResultResponse } from '../types/dispute';
import { apiCallGET, apiCallPOST, apiCallPUT } from '../utils/apiHelpers';
import { uploadMultipleImages } from './imageUploadService';

// ==================== TYPES ====================

export type BuyerDisputeListOptions = {
    status?: string;
    fromDate?: string;
    toDate?: string;
    q?: string;
    sortBy?: 'createdAt' | 'updatedAt' | 'status';
    sortDir?: 'ASC' | 'DESC';
    page?: number;
    limit?: number;
};

export type BuyerDisputeListRow = {
    id: number;
    orderId: number;
    listingTitle: string;
    status: string;
    reason: string;
    createdAt: string;
    assigneeName: string;
};

export type BuyerDisputeListResult = {
    content: BuyerDisputeListRow[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
};

/**
 * Map BE DisputeDetailResponse → FE Dispute type
 */
function mapToDispute(res: DisputeDetailResponse): Dispute {
    return {
        disputeId: res.id,
        orderId: res.transaction?.id ?? 0,
        buyerId: res.buyer?.id ?? 0,
        sellerId: res.seller?.id ?? 0,
        title: res.reasonText || '',
        content: res.description || '',
        reason: res.reasonText || '',
        status: (res.status as Dispute['status']) || 'OPEN',
        evidenceUrls: res.evidence?.filter(e => e.type === 'IMAGE').map(e => e.url) ?? [],
        adminNote: res.resolutionNote,
        resolvedAt: res.resolvedAt,
        isOverridden: !!res.resolutionAction,
        createdAt: res.createdAt,
        updatedAt: res.updatedAt,
    };
}

/**
 * Validate dispute data before submission
 * Requirement: field validation, reason check, content length
 */
export function validateDisputeData(data: CreateDisputeRequest, availableReasons: DisputeReason[]): { isValid: boolean, error?: string } {
    const { orderId, buyerId, sellerId, title, content, reasonId } = data;

    // 1. Validate required fields
    if (!orderId || !buyerId || !sellerId || !title || !content || !reasonId) {
        return { isValid: false, error: 'Vui lòng điền đầy đủ tất cả các trường bắt buộc.' };
    }

    // 2. Validate reasonId exists in available list
    const reasonExists = availableReasons.some(r => r.reasonId === reasonId);
    if (!reasonExists) {
        return { isValid: false, error: 'Lý do khiếu nại không hợp lệ.' };
    }

    // 3. Validate content length (max 1000 characters)
    if (content.length > 1000) {
        return { isValid: false, error: 'Nội dung khiếu nại không được vượt quá 1000 ký tự.' };
    }

    return { isValid: true };
}

/**
 * Fetch available reasons for creating a dispute
 */
export async function getDisputeReasons(): Promise<DisputeReason[]> {
    return apiCallGET<DisputeReason[]>('/disputes/reasons');
}

/**
 * Upload multiple evidence files to the system
 * Requirement: 0-5 files, jpg/jpeg/png
 */
export async function uploadDisputeEvidence(files: File[], orderId: number): Promise<string[]> {
    if (files.length === 0) return [];
    if (files.length > 5) throw new Error('Chỉ được tải lên tối đa 5 tệp bằng chứng.');
    
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    for (const file of files) {
        if (!validTypes.includes(file.type)) {
            throw new Error(`Định dạng tệp ${file.name} không hợp lệ. Chỉ chấp nhận JPG, JPEG, PNG.`);
        }
    }

    return uploadMultipleImages(files, `dispute_${orderId}`);
}

/**
 * Check if the current buyer is allowed to create a dispute (frequency check)
 */
async function checkBuyerDisputeFrequency(buyerId: number, orderId: number): Promise<boolean> {
    try {
        const response = await apiCallGET<{ allowed: boolean }>(`/buyers/${buyerId}/dispute-eligibility?orderId=${orderId}`);
        return response.allowed;
    } catch {
        return true; // Fallback
    }
}

/**
 * Comprehensive eligibility check for S70
 */
export async function checkDisputeEligibility(orderId: number, buyerId: number, status: string, completedAt: string): Promise<{ allowed: boolean, reason?: string }> {
    // 1. Kiểm tra đơn hàng có tồn tại (đã pass qua props)
    if (!orderId) return { allowed: false, reason: 'Mã đơn hàng không hợp lệ.' };

    // 2. Kiểm tra đơn hàng đã hoàn thành hoặc giao hàng thất bại (DISPUTED)
    if (status !== 'COMPLETED' && status !== 'DISPUTED') {
        return { allowed: false, reason: 'Chỉ có thể khiếu nại đơn hàng đã hoàn thành hoặc giao hàng thất bại.' };
    }

    // 3. Kiểm tra thời hạn khiếu nại (24 giờ sau khi đơn hoàn thành)
    if (completedAt) {
        const hoursRemaining = getDisputeHoursRemaining(status, completedAt);
        if (hoursRemaining === 0) {
            return { allowed: false, reason: `Đã hết thời hạn khiếu nại. Bạn chỉ có ${DISPUTE_DEADLINE_HOURS} giờ để khiếu nại sau khi đơn hoàn thành.` };
        }
    }

    // 4. Kiểm tra tần suất khiếu nại của buyer (backend sẽ check giới hạn 3 lần)
    const isFrequencyAllowed = await checkBuyerDisputeFrequency(buyerId, orderId);
    if (!isFrequencyAllowed) {
        return { allowed: false, reason: 'Đã đạt giới hạn khiếu nại cho đơn hàng này.' };
    }

    return { allowed: true };
}

/**
 * Create a new dispute for an order
 */
export async function createDispute(data: CreateDisputeRequest): Promise<Dispute> {
    const res = await apiCallPOST<DisputeDetailResponse>('/disputes', data);
    return mapToDispute(res);
}

/**
 * Fetch a single dispute by its ID
 * Requirement: Check if disputeId exists, handle errors
 */
export async function getDisputeById(disputeId: number): Promise<Dispute> {
    const res = await apiCallGET<DisputeDetailResponse>(`/disputes/${disputeId}`);
    return mapToDispute(res);
}

/** Number of hours buyer has to raise a dispute after order completion */
export const DISPUTE_DEADLINE_HOURS = 24;

/**
 * Returns how many hours remain before the dispute deadline expires.
 * Returns 0 if already expired or status not eligible.
 */
export function getDisputeHoursRemaining(status: string, completedAt: string): number {
    if (status !== 'COMPLETED' && status !== 'DISPUTED') return 0;
    if (!completedAt) return 0;
    const deadline = new Date(completedAt).getTime() + DISPUTE_DEADLINE_HOURS * 60 * 60 * 1000;
    const remaining = deadline - Date.now();
    return remaining > 0 ? Math.ceil(remaining / (60 * 60 * 1000)) : 0;
}

/**
 * Simple helper to check 24h window (for UI visibility)
 */
export function canCreateDispute(status: string, completedAt: string): boolean {
    if (status !== 'COMPLETED' && status !== 'DISPUTED') return false;
    return getDisputeHoursRemaining(status, completedAt) > 0;
}

/**
 * S-83 Admin Dispute Override
 * Allows BP7 to force resolve a dispute
 */
export async function overrideDispute(disputeId: number, action: 'BUYER_WIN' | 'SELLER_WIN' | 'SPLIT', reason: string): Promise<void> {
    await apiCallPOST(`/admin/disputes/${disputeId}/override`, { action, reason });
}

/**
 * S-74: Get dispute result for buyer/seller viewing
 */
export async function getDisputeResult(disputeId: number): Promise<DisputeResultResponse> {
    return apiCallGET<DisputeResultResponse>(`/disputes/${disputeId}/result`);
}

/**
 * Reply to a dispute (buyer provides more info)
 */
export async function replyToDispute(disputeId: number, content: string): Promise<Dispute> {
    const res = await apiCallPUT<DisputeDetailResponse>(`/disputes/${disputeId}/reply`, { content });
    return mapToDispute(res);
}

/**
 * Get list of disputes created by the buyer
 */
export async function getBuyerDisputes(buyerId: number, options: BuyerDisputeListOptions = {}): Promise<BuyerDisputeListResult> {
    const params = new URLSearchParams();
    
    if (options.status && options.status !== 'ALL') params.set('status', options.status);
    if (options.q) params.set('q', options.q);
    if (options.fromDate) params.set('fromDate', options.fromDate);
    if (options.toDate) params.set('toDate', options.toDate);
    if (options.sortBy) params.set('sortBy', options.sortBy);
    if (options.sortDir) params.set('sortDir', options.sortDir);
    params.set('page', String(options.page ?? 0));
    params.set('limit', String(options.limit ?? 10));

    const queryString = params.toString();
    return apiCallGET<BuyerDisputeListResult>(`/buyers/${buyerId}/disputes${queryString ? `?${queryString}` : ''}`);
}

