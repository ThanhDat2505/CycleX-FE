import { apiCallGET } from '../utils/apiHelpers';
import { AdminDisputeListResponse, DisputeDetailResponse } from '../types/dispute';

export interface AdminDisputeQuery {
    page?: number;
    limit?: number;
    status?: string;
    q?: string;
    fromDate?: string;
    toDate?: string;
}

export const adminDisputeService = {
    getDisputes: async (query: AdminDisputeQuery): Promise<AdminDisputeListResponse> => {
        const params = new URLSearchParams();
        if (query.page !== undefined) params.append('page', query.page.toString());
        if (query.limit) params.append('limit', query.limit.toString());
        if (query.status) params.append('status', query.status);
        if (query.q) params.append('q', query.q);
        if (query.fromDate) params.append('fromDate', query.fromDate);
        if (query.toDate) params.append('toDate', query.toDate);

        return apiCallGET<AdminDisputeListResponse>(`/admin/disputes?${params.toString()}`);
    },

    getDisputeDetail: async (disputeId: number): Promise<DisputeDetailResponse> => {
        return apiCallGET<DisputeDetailResponse>(`/admin/disputes/${disputeId}`);
    },
};
