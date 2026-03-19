import { apiCallGET } from '../utils/apiHelpers';
import { AuditLog, AuditLogListResponse, AuditLogQuery, AuditLogAction } from '../types/auditLog';

export const auditLogService = {
    /**
     * Get list of audit logs with pagination and complex filtering
     */
    getLogs: async (query: AuditLogQuery): Promise<AuditLogListResponse> => {
        const queryParams = new URLSearchParams();
        if (query.page) queryParams.append('page', query.page.toString());
        if (query.pageSize) queryParams.append('pageSize', query.pageSize.toString());
        if (query.actionType) queryParams.append('actionType', query.actionType);
        if (query.adminId) queryParams.append('adminId', query.adminId.toString());
        if (query.startDate) queryParams.append('startDate', query.startDate);
        if (query.endDate) queryParams.append('endDate', query.endDate);

        return apiCallGET<AuditLogListResponse>(`/admin/audit-logs?${queryParams.toString()}`);
    }
};
