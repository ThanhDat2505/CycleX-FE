/**
 * Dispute Service
 * Handles API calls for dispute creation and management.
 */

import { CreateDisputeRequest, Dispute, DisputeReason, DisputeDetailResponse, DisputeResultResponse } from '../types/dispute';
import { apiCallGET, apiCallPOST, apiCallPUT } from '../utils/apiHelpers';
import { uploadMultipleImages } from './imageUploadService';

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

    // 2. Kiểm tra đơn hàng đã được giao thành công (status === COMPLETED)
    if (status !== 'COMPLETED') {
        return { allowed: false, reason: 'Chỉ có thể khiếu nại đơn hàng đã hoàn thành.' };
    }

    // 3. Kiểm tra thời gian tạo dispute (trong 24h sau khi giao)
    const completedDate = new Date(completedAt);
    const now = new Date();
    const diffInHours = (now.getTime() - completedDate.getTime()) / (1000 * 60 * 60);
    if (diffInHours > 24) {
        return { allowed: false, reason: 'Đã hết thời hạn khiếu nại (24h kể từ khi hoàn thành).' };
    }

    // 4. Kiểm tra tần suất khiếu nại của buyer
    const isFrequencyAllowed = await checkBuyerDisputeFrequency(buyerId, orderId);
    if (!isFrequencyAllowed) {
        return { allowed: false, reason: 'Bạn đã thực hiện quá nhiều khiếu nại gần đây. Vui lòng liên hệ hỗ trợ.' };
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

/**
 * Simple helper to check 24h window (for UI visibility)
 */
export function canCreateDispute(status: string, updatedAt: string): boolean {
    if (status !== 'COMPLETED') return false;
    const completedDate = new Date(updatedAt);
    const now = new Date();
    const diffInHours = (now.getTime() - completedDate.getTime()) / (1000 * 60 * 60);
    return diffInHours <= 24;
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
