import {
  firstDefined,
  getArray,
  getNumber,
  getPositiveNumber,
  getString,
  isRecord,
  toDisplayDate,
  toListPayload,
  toRecord,
  type JsonRecord,
} from "@/app/services/dataAdapter";
import { backendRequest, type BackendErrorShape } from "@/app/services/backend";
import { authService } from "./authService";

type DisputeListOptions = {
  status?: string;
  createdFrom?: string;
  createdTo?: string;
  q?: string;
  disputeId?: string;
  transactionId?: string;
  listingId?: string;
  assigneeId?: string;
  sortBy?: "createdAt" | "updatedAt" | "status" | "disputeId";
  sortDir?: "ASC" | "DESC";
  page?: number;
  limit?: number;
};

export type DisputeActor = {
  id: string;
  name: string;
  email: string;
  phone?: string;
};

export type DisputeEvidence = {
  type: "IMAGE" | "VIDEO" | "TEXT" | "FILE";
  url?: string;
  text?: string;
  name?: string;
  uploaderRole?: "BUYER" | "SELLER" | "INSPECTOR" | "ADMIN";
};

export type DisputeListRow = {
  id: string;
  transactionId: string;
  listingId: string;
  listingTitle: string;
  status: string;
  reason: string;
  createdAt: string;
  assigneeId: string;
  assigneeName: string;
  requesterName: string;
};

export type DisputeListResult = {
  items: DisputeListRow[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type DisputeDetail = {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  reasonCode: string;
  reasonText: string;
  description: string;
  assignee: DisputeActor;
  requester: DisputeActor;
  buyer: DisputeActor;
  seller: DisputeActor;
  listing: {
    id: string;
    title: string;
    imageUrl: string;
    priceVnd: number;
    status: string;
  };
  transaction: {
    id: string;
    status: string;
    amountVnd: number;
    createdAt: string;
    updatedAt: string;
  };
  evidence: DisputeEvidence[];
};

export type DisputeResolutionPayload = {
  action: "REFUND_BUYER" | "RELEASE_FUND_SELLER" | "CLOSE_CASE";
  resolutionNote: string;
};

export type CurrentUserContext = {
  role: "ADMIN" | "INSPECTOR" | string;
  userId: number;
};

function parseJsonSafe(value: string | null): JsonRecord | null {
  if (!value) return null;
  try {
    const parsed: unknown = JSON.parse(value);
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function getAuthToken(): string | null {
  return authService.getToken();
}

function getJwtPayload(token: string | null): JsonRecord | null {
  if (!token) return null;
  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return null;
    const normalized = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    const parsed: unknown = JSON.parse(atob(padded));
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function pickPositiveNumber(values: unknown[]): number | null {
  for (const value of values) {
    const candidate = getPositiveNumber(value, 0);
    if (candidate > 0) return candidate;
  }
  return null;
}

function getCurrentUserContext(): CurrentUserContext {
  const userData = authService.getUser() as any;
  const token = authService.getToken();
  const payload = getJwtPayload(token);

  const authorities = getArray(payload?.authorities);
  const roleRaw = firstDefined(
    userData?.role,
    payload?.role,
    authorities[0],
    "INSPECTOR",
  );

  const role = getString(roleRaw, "INSPECTOR")
    .replace("ROLE_", "")
    .toUpperCase();

  const nestedUser = isRecord(userData?.user) ? userData.user : null;
  const userId =
    pickPositiveNumber([
      userData?.userId,
      userData?.id,
      userData?.inspectorId,
      nestedUser?.userId,
      payload?.userId,
      payload?.id,
      payload?.sub,
    ]) ?? 0;

  return {
    role,
    userId,
  };
}

function buildQuery(
  params: Record<string, string | number | undefined>,
): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    query.set(key, String(value));
  });
  const raw = query.toString();
  return raw ? `?${raw}` : "";
}

function normalizeStatus(status: unknown): string {
  return getString(status, "OPEN", (raw) => raw.toUpperCase());
}

function mapActor(raw: unknown): DisputeActor {
  const record = toRecord(raw);
  return {
    id: getString(
      firstDefined(record.id, record.userId, record.inspectorId),
      "-",
    ),
    name: getString(
      firstDefined(record.name, record.fullName, record.displayName),
      "-",
    ),
    email: getString(record.email, "-"),
    phone: record.phone ? getString(record.phone) : undefined,
  };
}

function mapEvidence(items: JsonRecord[]): DisputeEvidence[] {
  return items.map((item) => {
    const typeRaw = getString(
      firstDefined(item.type, item.evidenceType),
      "TEXT",
      (raw) => raw.toUpperCase(),
    );

    const normalizedType: DisputeEvidence["type"] =
      typeRaw === "IMAGE" ||
      typeRaw === "VIDEO" ||
      typeRaw === "TEXT" ||
      typeRaw === "FILE"
        ? typeRaw
        : "TEXT";

    const uploaderRaw = getString(
      firstDefined(item.uploaderRole, item.uploaderType),
      "",
      (raw) => raw.toUpperCase(),
    );

    const uploaderRole: DisputeEvidence["uploaderRole"] =
      uploaderRaw === "BUYER" ||
      uploaderRaw === "SELLER" ||
      uploaderRaw === "INSPECTOR" ||
      uploaderRaw === "ADMIN"
        ? uploaderRaw
        : undefined;

    return {
      type: normalizedType,
      url: getString(firstDefined(item.url, item.fileUrl, item.mediaUrl), ""),
      text: getString(firstDefined(item.text, item.content, item.note), ""),
      name: getString(firstDefined(item.name, item.fileName), ""),
      uploaderRole,
    };
  });
}

function mapListRow(raw: JsonRecord): DisputeListRow {
  const transaction = toRecord(raw.transaction);
  const listing = toRecord(raw.listing);
  const assignee = toRecord(raw.assignee);
  const requester = toRecord(raw.requester);

  return {
    id: getString(firstDefined(raw.id, raw.disputeId), "-"),
    transactionId: getString(
      firstDefined(raw.transactionId, transaction.id),
      "-",
    ),
    listingId: getString(firstDefined(raw.listingId, listing.id), "-"),
    listingTitle: getString(
      firstDefined(raw.listingTitle, listing.title, listing.name),
      "Khong co tieu de",
    ),
    status: normalizeStatus(raw.status),
    reason: getString(
      firstDefined(raw.reasonText, raw.reason, raw.reasonCode),
      "-",
    ),
    createdAt: toDisplayDate(firstDefined(raw.createdAt, raw.createdDate)),
    assigneeId: getString(
      firstDefined(raw.assigneeId, assignee.id, raw.inspectorId),
      "-",
    ),
    assigneeName: getString(
      firstDefined(raw.assigneeName, assignee.name, raw.inspectorName),
      "Chua phan cong",
    ),
    requesterName: getString(
      firstDefined(raw.requesterName, requester.name, raw.createdByName),
      "-",
    ),
  };
}

function mapDetail(raw: JsonRecord): DisputeDetail {
  const listing = toRecord(raw.listing);
  const transaction = toRecord(raw.transaction);
  const evidenceItems = toListPayload(
    firstDefined(raw.evidence, raw.attachments, raw.medias),
  );

  return {
    id: getString(firstDefined(raw.id, raw.disputeId), "-"),
    status: normalizeStatus(raw.status),
    createdAt: toDisplayDate(firstDefined(raw.createdAt, raw.createdDate)),
    updatedAt: toDisplayDate(firstDefined(raw.updatedAt, raw.updatedDate)),
    reasonCode: getString(firstDefined(raw.reasonCode, raw.reason), "OTHER"),
    reasonText: getString(
      firstDefined(raw.reasonText, raw.reasonDescription, raw.reason),
      "-",
    ),
    description: getString(
      firstDefined(raw.description, raw.detail, raw.note),
      "-",
    ),
    assignee: mapActor(firstDefined(raw.assignee, raw.inspector)),
    requester: mapActor(firstDefined(raw.requester, raw.createdBy)),
    buyer: mapActor(firstDefined(raw.buyer, transaction.buyer)),
    seller: mapActor(firstDefined(raw.seller, transaction.seller)),
    listing: {
      id: getString(firstDefined(listing.id, raw.listingId), "-"),
      title: getString(
        firstDefined(listing.title, listing.name, raw.listingTitle),
        "-",
      ),
      imageUrl: getString(
        firstDefined(listing.imageUrl, listing.thumbnailUrl, raw.imageUrl),
        "",
      ),
      priceVnd: getNumber(
        firstDefined(listing.priceVnd, listing.price, raw.priceVnd),
        0,
      ),
      status: normalizeStatus(firstDefined(listing.status, raw.listingStatus)),
    },
    transaction: {
      id: getString(firstDefined(transaction.id, raw.transactionId), "-"),
      status: normalizeStatus(
        firstDefined(transaction.status, raw.transactionStatus),
      ),
      amountVnd: getNumber(
        firstDefined(transaction.amountVnd, transaction.amount, raw.amountVnd),
        0,
      ),
      createdAt: toDisplayDate(transaction.createdAt),
      updatedAt: toDisplayDate(transaction.updatedAt),
    },
    evidence: mapEvidence(evidenceItems),
  };
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    return await backendRequest<T>(path, {
      method:
        (init?.method?.toUpperCase() as
          | "GET"
          | "POST"
          | "PUT"
          | "PATCH"
          | "DELETE") ?? "GET",
      body: init?.body,
      credentials: "omit",
    });
  } catch (error: unknown) {
    const backendError = error as BackendErrorShape | undefined;
    const fallback = "Khong the ket noi den API dispute";
    const message = getString(
      firstDefined(backendError?.message, (error as Error)?.message),
      fallback,
    );
    throw new Error(message);
  }
}

async function tryFirstSuccess<T>(
  requests: Array<() => Promise<T>>,
): Promise<T> {
  let lastError: unknown;
  for (const call of requests) {
    try {
      return await call();
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError ?? new Error("Khong the ket noi den API dispute");
}

export const disputeService = {
  getCurrentUserContext,

  async getDisputes(
    options: DisputeListOptions = {},
  ): Promise<DisputeListResult> {
    const query = buildQuery({
      status:
        options.status && options.status !== "ALL" ? options.status : undefined,
      from: options.createdFrom,
      to: options.createdTo,
      q: options.q,
      disputeId: options.disputeId,
      transactionId: options.transactionId,
      listingId: options.listingId,
      assigneeId: options.assigneeId,
      sortBy: options.sortBy,
      sortDir: options.sortDir,
      page: options.page ?? 0,
      limit: options.limit ?? 10,
    });

    const payload: unknown = await tryFirstSuccess<unknown>([
      () => requestJson<unknown>(`/disputes${query}`),
      // Backward-compatible fallbacks.
      () => {
        const ctx = getCurrentUserContext();
        return requestJson<unknown>(
          `/inspector/${ctx.userId}/disputes${query}`,
        );
      },
      () => requestJson<unknown>(`/admin/disputes${query}`),
      () => requestJson<unknown>(`/admin/disputes/list${query}`),
    ]);

    const payloadRecord = toRecord(payload);
    const rows = toListPayload(payload).map(mapListRow);
    const page = getNumber(
      firstDefined(
        payloadRecord.page,
        payloadRecord.currentPage,
        options.page,
        0,
      ),
      0,
    );
    const pageSize = getPositiveNumber(
      firstDefined(
        payloadRecord.limit,
        payloadRecord.pageSize,
        payloadRecord.size,
        options.limit,
        10,
      ),
      10,
    );
    const totalItems = getPositiveNumber(
      firstDefined(
        payloadRecord.totalItems,
        payloadRecord.totalElements,
        rows.length,
      ),
      rows.length,
    );
    const totalPagesFallback =
      pageSize > 0 ? Math.ceil(totalItems / pageSize) : 1;
    const totalPages = getPositiveNumber(
      firstDefined(payloadRecord.totalPages, totalPagesFallback),
      1,
    );

    return {
      items: rows,
      page,
      pageSize,
      totalItems,
      totalPages,
    };
  },

  async getDisputeDetail(disputeId: string): Promise<DisputeDetail> {
    const id = encodeURIComponent(getString(disputeId, "").trim());

    const payload: unknown = await tryFirstSuccess<unknown>([
      () => requestJson<unknown>(`/disputes/${id}`),
      // Backward-compatible fallbacks.
      () => {
        const ctx = getCurrentUserContext();
        return requestJson<unknown>(`/inspector/${ctx.userId}/disputes/${id}`);
      },
      () => requestJson<unknown>(`/admin/disputes/${id}`),
    ]);

    const payloadRecord = toRecord(payload);
    const detailSource = toRecord(firstDefined(payloadRecord.data, payload));
    const detail = mapDetail(detailSource);
    detail.id = getString(disputeId, detail.id);
    return detail;
  },

  async resolveDispute(
    disputeId: string,
    payload: DisputeResolutionPayload,
  ): Promise<void> {
    const id = encodeURIComponent(getString(disputeId, "").trim());

    const resolutionBody: JsonRecord = {
      action: payload.action,
      resolutionNote: payload.resolutionNote,
    };

    await tryFirstSuccess<void>([
      () =>
        requestJson<void>(`/disputes/${id}/resolve`, {
          method: "POST",
          body: JSON.stringify(resolutionBody),
        }),
      // Backward-compatible fallbacks.
      () => {
        const ctx = getCurrentUserContext();
        return requestJson<void>(
          `/inspector/${ctx.userId}/disputes/${id}/resolve`,
          {
            method: "POST",
            body: JSON.stringify({
              action: payload.action,
              resolutionNote: payload.resolutionNote,
              decision: payload.action,
              reason: payload.resolutionNote,
              reasonText: payload.resolutionNote,
            }),
          },
        );
      },
      () =>
        requestJson<void>(`/admin/disputes/${id}/resolve`, {
          method: "POST",
          body: JSON.stringify(resolutionBody),
        }),
    ]);
  },

  async getEvidenceBlobUrl(evidenceUrl: string): Promise<string> {
    const token = getAuthToken();
    const isAbsolute = /^https?:\/\//i.test(evidenceUrl);
    const path = isAbsolute
      ? evidenceUrl
      : `/backend${evidenceUrl.startsWith("/") ? "" : "/"}${evidenceUrl}`;

    const response = await fetch(path, {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      credentials: "omit",
    });

    if (!response.ok) {
      throw new Error(`Khong tai duoc evidence (${response.status})`);
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  },
};
