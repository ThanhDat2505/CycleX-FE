import { apiCallGET } from '../utils/apiHelpers';
import { AuditLog, AuditLogListResponse, AuditLogQuery, AuditLogAction } from '../types/auditLog';

const USE_MOCK_API = process.env.NEXT_PUBLIC_MOCK_API === 'true';

// --- MOCK DATA FOR DEMO PURPOSES ---
const actionTypes: AuditLogAction[] = ["UPDATE_USER", "UPDATE_ROLE", "UPDATE_STATUS", "OVERRIDE_DISPUTE", "REFUND_ISSUE", "DELETE_POST"];
const adminNames = ["Nguyễn Văn Admin", "Trần Thị Censor", "Lê Văn Manager"];

let mockLogs: AuditLog[] = Array.from({ length: 150 }).map((_, i) => {
    const action = actionTypes[i % actionTypes.length];
    const adminIdx = i % adminNames.length;
    
    // Distribute dates over the last 60 days
    const dateOffset = Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000;
    const createdAt = new Date(Date.now() - dateOffset).toISOString();

    return {
        id: `LOG-${1000 + i}`,
        actionType: action,
        adminId: 101 + adminIdx,
        adminName: adminNames[adminIdx],
        targetId: `TARGET-${Math.floor(Math.random() * 5000)}`,
        details: action === "OVERRIDE_DISPUTE" 
            ? `Admin changed dispute resolution to BUYER_REFUND. Reason: Provided evidence was clear.` 
            : `Admin changed system state for target.`,
        createdAt
    };
}).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Sort newest first

export const auditLogService = {
    /**
     * Get list of audit logs with pagination and complex filtering
     */
    getLogs: async (query: AuditLogQuery): Promise<AuditLogListResponse> => {
        if (USE_MOCK_API) {
            await new Promise(resolve => setTimeout(resolve, 800));
            
            let filtered = [...mockLogs];
            
            if (query.actionType) {
                filtered = filtered.filter(l => l.actionType === query.actionType);
            }
            if (query.adminId) {
                filtered = filtered.filter(l => l.adminId === query.adminId);
            }
            
            if (query.startDate) {
                const start = new Date(query.startDate).setHours(0,0,0,0);
                filtered = filtered.filter(l => new Date(l.createdAt).getTime() >= start);
            }
            
            if (query.endDate) {
                const end = new Date(query.endDate).setHours(23,59,59,999);
                filtered = filtered.filter(l => new Date(l.createdAt).getTime() <= end);
            }

            const page = query.page || 1;
            const pageSize = query.pageSize || 10;
            const total = filtered.length;
            const totalPages = Math.ceil(total / pageSize);
            const items = filtered.slice((page - 1) * pageSize, page * pageSize);

            return {
                items,
                total,
                page,
                pageSize,
                totalPages
            };
        }

        // Real API Call
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
