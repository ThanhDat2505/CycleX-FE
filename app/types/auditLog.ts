export type AuditLogAction = 
    | "UPDATE_USER" 
    | "UPDATE_ROLE" 
    | "UPDATE_STATUS" 
    | "OVERRIDE_DISPUTE" 
    | "REFUND_ISSUE" 
    | "DELETE_POST";

export interface AuditLog {
    id: string;
    actionType: AuditLogAction;
    adminId: number;
    adminName: string;
    targetId: string; // The ID of the affected user/dispute/post
    details: string; // JSON string or human readable description
    createdAt: string;
}

export interface AuditLogListResponse {
    items: AuditLog[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface AuditLogQuery {
    page?: number;
    pageSize?: number;
    startDate?: string;
    endDate?: string;
    actionType?: AuditLogAction;
    adminId?: number;
}
