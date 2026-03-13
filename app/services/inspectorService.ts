/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
  Listing as DashboardListing,
  ListingStatus as DashboardListingStatus,
} from "@/app/types/types";
import type { PendingRow, PendingStatus } from "@/app/types/pendingTypes";

import { authService } from "./authService";

type RawObject = Record<string, any>;

const inFlightInspectorRequests = new Map<string, Promise<unknown>>();

export type InspectorReviewDetail = {
  id: string;
  productName: string;
  storeName: string;
  submittedAt: string;
  status: string;
  priceVnd: number;
  sellerName: string;
  specs: {
    brand: string;
    type: string;
    frame: string;
    weight: string;
  };
  waitingDays: number;
  images: {
    main: string;
    thumbs: string[];
  };
  history: Array<{
    at: string;
    tag: string;
    variant: "neutral" | "warning" | "info" | "danger" | "success";
    desc: string;
  }>;
};

export type ReviewHistoryRow = {
  id: string;
  productName: string;
  submittedAt: string;
  status: string;
  sellerName: string;
  note: string;
};

export type InspectorDashboardStats = {
  pendingCount: number;
  reviewingCount: number;
  approvedCount: number;
  rejectedCount: number;
  disputeCount: number;
};

type QueryOptions = {
  status?: string;
  sort?: "newest" | "oldest";
  page?: number;
  pageSize?: number;
};

function parseJsonSafe(value: string | null): RawObject | null {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function getAuthToken(): string | null {
  return authService.getToken();
}

function getJwtPayload(token: string | null): RawObject | null {
  if (!token) return null;
  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return null;
    const normalized = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

function pickPositiveNumber(values: unknown[]): number | null {
  for (const value of values) {
    const candidate = Number(value);
    if (Number.isFinite(candidate) && candidate > 0) {
      return candidate;
    }
  }
  return null;
}

function getInspectorId(): number {
  const token = authService.getToken();
  const payload = getJwtPayload(token);
  const tokenInspectorId = pickPositiveNumber([
    payload?.userId,
    payload?.id,
    payload?.sub,
  ]);
  if (tokenInspectorId) {
    return tokenInspectorId;
  }

  const fromUserData = authService.getUser() as any;
  const userDataInspectorId = pickPositiveNumber([
    fromUserData?.userId,
    fromUserData?.id,
    fromUserData?.inspectorId,
    fromUserData?.user?.userId,
    fromUserData?.user?.id,
  ]);
  if (userDataInspectorId) {
    return userDataInspectorId;
  }

  throw new Error(
    "Không xác định được inspectorId từ phiên đăng nhập. Vui lòng đăng nhập lại.",
  );
}

/**
 * Check whether the current JWT token is expired.
 * Returns true when the token is missing or its `exp` claim is in the past.
 */
function isTokenExpired(): boolean {
  const token = getAuthToken();
  if (!token) return true;
  const payload = getJwtPayload(token);
  if (!payload) return true;
  if (typeof payload?.exp === "number") {
    return payload.exp * 1000 < Date.now();
  }
  return false;
}

class InspectorApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function inspectorFetch<T>(path: string, init?: RequestInit): Promise<T> {
  // --- Token expiration guard ---
  if (isTokenExpired()) {
    // Clear stale auth data and redirect to login
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      window.location.href = "/login";
    }
    throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
  }

  const token = getAuthToken();
  const method = (init?.method ?? "GET").toUpperCase();
  const bodyKey =
    typeof init?.body === "string"
      ? init.body
      : init?.body instanceof URLSearchParams
        ? init.body.toString()
        : "";
  const requestKey = `${method} ${path} ${bodyKey}`;

  const existingRequest = inFlightInspectorRequests.get(requestKey);
  if (existingRequest) {
    return existingRequest as Promise<T>;
  }

  const headers: Record<string, string> = {};

  if (!(init?.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Keep calls under /backend so Next.js rewrites to backend host.
  // credentials: "omit" prevents browser cookies from being attached,
  // avoiding CSRF/session side effects on POST/PUT/DELETE.
  const requestPromise = (async () => {
    const response = await fetch(`/backend/api${path}`, {
      method,
      headers,
      body: init?.body,
      credentials: "omit",
    });

    if (!response.ok) {
      let message = `Server error: ${response.status} ${response.statusText}`;
      try {
        const text = await response.text();
        // Try parsing as JSON first
        try {
          const errorData = JSON.parse(text);
          message =
            errorData?.message ||
            errorData?.error ||
            errorData?.detail ||
            message;
        } catch {
          // Plain-text error body
          if (text.length > 0 && text.length < 500) message = text;
        }
      } catch {
        // Ignore read error
      }

      // Special handling for auth errors
      if (response.status === 401 || response.status === 403) {
        console.error(
          `[inspectorFetch] ${response.status} on ${method} ${path}:`,
          message,
        );
      }

      throw new InspectorApiError(response.status, message);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  })();

  inFlightInspectorRequests.set(requestKey, requestPromise);

  try {
    return await requestPromise;
  } finally {
    inFlightInspectorRequests.delete(requestKey);
  }
}

function toArrayPayload(value: any): RawObject[] {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.content)) return value.content;
  if (Array.isArray(value?.results)) return value.results;
  if (Array.isArray(value?.payload)) return value.payload;
  return [];
}

function normalizeStatus(status: unknown): string {
  const normalized = String(status ?? "PENDING")
    .trim()
    .toUpperCase();
  return normalized || "PENDING";
}

function statusToDashboardStatus(status: string): DashboardListingStatus {
  const normalizedStatus = normalizeStatus(status);

  switch (normalizedStatus) {
    case "PENDING":
    case "PENDING_APPROVAL":
      return "PENDING";
    case "REVIEWING":
    case "IN_REVIEW":
      return "REVIEWING";
    case "NEED_MORE_INFO":
    case "NEED_INFO":
    case "MISSING_INFO":
      return "NEED_MORE_INFO";
    case "DISPUTE":
    case "UNDER_REVIEW":
      return "DISPUTE";
    case "FLAGGED":
    case "REPORTED":
    case "REPORT":
      return "FLAGGED";
    case "APPROVED":
    case "PASSED":
      return "APPROVED";
    case "DONE":
    case "REJECTED":
      return "DONE";
    default:
      return "UNKNOWN";
  }
}

function statusToPendingStatus(status: string): PendingStatus {
  const normalizedStatus = normalizeStatus(status);

  switch (normalizedStatus) {
    case "PENDING":
    case "PENDING_APPROVAL":
      return "PENDING";
    case "REVIEWING":
    case "IN_REVIEW":
      return "REVIEWING";
    case "NEED_MORE_INFO":
    case "NEED_INFO":
    case "MISSING_INFO":
      return "NEED_MORE_INFO";
    case "DISPUTE":
    case "UNDER_REVIEW":
      return "DISPUTE";
    case "FLAGGED":
    case "REPORTED":
    case "REPORT":
      return "FLAGGED";
    default:
      return "PENDING";
  }
}

function toISODate(value: any): string {
  if (!value) return "";
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.slice(0, 10);
  }
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function toDisplayDate(isoDate: string): string {
  if (!isoDate) return "—";
  const [yyyy, mm, dd] = isoDate.split("-");
  if (!yyyy || !mm || !dd) return isoDate;
  return `${dd}/${mm}/${yyyy}`;
}

function getListingId(raw: RawObject): string {
  return String(
    raw.id ?? raw.listingId ?? raw.bikeListingId ?? raw.code ?? "UNKNOWN",
  );
}

function getProductName(raw: RawObject): string {
  return (
    raw.productName ??
    raw.title ??
    raw.name ??
    raw.bikeName ??
    "Unnamed Listing"
  );
}

function getStoreName(raw: RawObject): string {
  return raw.storeName ?? raw.shopName ?? raw.sellerShopName ?? raw.shop ?? "—";
}

function getSellerName(raw: RawObject): string {
  return raw.sellerName ?? raw.ownerName ?? raw.sellerFullName ?? "—";
}

function getSubmittedAt(raw: RawObject): string {
  return toISODate(raw.submittedAt ?? raw.createdAt ?? raw.updatedAt);
}

function getStatus(raw: RawObject): string {
  return normalizeStatus(raw.status ?? raw.reviewStatus ?? raw.state);
}

function mapToDashboardListing(raw: RawObject): DashboardListing {
  const submittedAt = getSubmittedAt(raw);
  const waitingDays =
    Number(raw.waitingDays ?? raw.pendingDays ?? raw.daysWaiting ?? 0) || 0;
  const waitingTimeText =
    typeof raw.waitingTime === "string" && raw.waitingTime.trim().length > 0
      ? raw.waitingTime.trim()
      : typeof raw.waitLabel === "string" && raw.waitLabel.trim().length > 0
        ? raw.waitLabel.trim()
        : `${Math.max(0, waitingDays)} ngày`;

  return {
    id: getListingId(raw),
    name: getProductName(raw),
    shop: getStoreName(raw),
    imageUrl:
      raw.imageUrl ??
      raw.thumbnailUrl ??
      raw.mainImageUrl ??
      (Array.isArray(raw.imageUrls) && raw.imageUrls.length > 0
        ? raw.imageUrls[0]
        : undefined),
    submittedAt: toDisplayDate(submittedAt),
    waitingTime: waitingTimeText,
    status: statusToDashboardStatus(getStatus(raw)),
  };
}

function mapToPendingRow(raw: RawObject): PendingRow {
  const submittedIso = getSubmittedAt(raw);
  const wait =
    Number(raw.waitingDays ?? raw.pendingDays ?? raw.daysWaiting ?? 0) || 0;

  return {
    id: getListingId(raw),
    status: statusToPendingStatus(getStatus(raw)),
    name: getProductName(raw),
    shop: getStoreName(raw),
    submittedAt: toDisplayDate(submittedIso),
    wait,
    waitLabel: `${Math.max(0, wait)} ngày`,
    dateISO: submittedIso,
  };
}

function mapHistoryItems(raw: RawObject): InspectorReviewDetail["history"] {
  const source = toArrayPayload(
    raw.history ?? raw.reviewLogs ?? raw.timeline ?? raw.activities,
  );
  return source.map((item: RawObject) => {
    const tag = String(item.tag ?? item.type ?? item.status ?? "UPDATE");
    const variant: InspectorReviewDetail["history"][number]["variant"] =
      tag.includes("REJECT") || tag.includes("DISPUTE")
        ? "danger"
        : tag.includes("APPROVE") || tag.includes("DONE")
          ? "success"
          : tag.includes("NEED") || tag.includes("PENDING")
            ? "warning"
            : "info";

    return {
      at: String(item.at ?? item.createdAt ?? item.time ?? ""),
      tag,
      variant,
      desc: String(
        item.desc ?? item.description ?? item.note ?? item.message ?? "",
      ),
    };
  });
}

function mapToReviewDetail(raw: RawObject): InspectorReviewDetail {
  const id = getListingId(raw);
  return {
    id,
    productName: getProductName(raw),
    storeName: getStoreName(raw),
    submittedAt: toDisplayDate(getSubmittedAt(raw)),
    status: getStatus(raw),
    priceVnd: Number(raw.priceVnd ?? raw.price ?? raw.amount ?? 0) || 0,
    sellerName: getSellerName(raw),
    specs: {
      brand: raw.specs?.brand ?? raw.brand ?? "—",
      type: raw.specs?.type ?? raw.bikeType ?? raw.type ?? "—",
      frame: raw.specs?.frame ?? raw.frame ?? "—",
      weight: raw.specs?.weight ?? raw.weight ?? "—",
    },
    waitingDays:
      Number(raw.waitingDays ?? raw.pendingDays ?? raw.daysWaiting ?? 0) || 0,
    images: {
      main: raw.images?.main ?? raw.mainImageUrl ?? raw.thumbnailUrl ?? "",
      thumbs: Array.isArray(raw.images?.thumbs)
        ? raw.images.thumbs
        : Array.isArray(raw.imageUrls)
          ? raw.imageUrls
          : raw.thumbnailUrl
            ? [raw.thumbnailUrl]
            : [],
    },
    history: mapHistoryItems(raw),
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

export const inspectorService = {
  getCurrentInspectorId: getInspectorId,

  async getListingsForReview(options: QueryOptions = {}): Promise<RawObject[]> {
    const inspectorId = getInspectorId();
    const query = buildQuery({
      status: options.status ?? "ALL",
      sort: options.sort ?? "newest",
      page: options.page ?? 0,
      pageSize: options.pageSize ?? 50,
    });

    const response = await inspectorFetch<any>(
      `/inspector/${inspectorId}/listings${query}`,
      { method: "GET" },
    );

    return toArrayPayload(response);
  },

  async getDashboardListings(): Promise<DashboardListing[]> {
    const listings = await this.getListingsForReview({
      status: "ALL",
      sort: "newest",
    });
    return listings.map(mapToDashboardListing);
  },

  async getPendingListings(): Promise<PendingRow[]> {
    const listings = await this.getListingsForReview({
      status: "ALL",
      sort: "newest",
    });
    return listings.map(mapToPendingRow);
  },

  async getReviewRequiredRows(): Promise<PendingRow[]> {
    const listings = await this.getListingsForReview({
      status: "ALL",
      sort: "newest",
    });
    return listings
      .map(mapToPendingRow)
      .filter(
        (row) => row.status === "DISPUTE" || row.status === "NEED_MORE_INFO",
      );
  },

  async getDashboardStats(): Promise<InspectorDashboardStats> {
    const inspectorId = getInspectorId();
    return inspectorFetch<InspectorDashboardStats>(`/inspector/${inspectorId}/dashboard/stats`, {
      method: "GET",
    });
  },

  async getListingDetail(listingId: string): Promise<InspectorReviewDetail> {
    const inspectorId = getInspectorId();
    const normalizedListingId = String(listingId).trim();
    const response = await inspectorFetch<any>(
      `/inspector/${inspectorId}/listings/${normalizedListingId}/detail`,
      { method: "GET" },
    );

    const payload = response?.data ?? response;
    const detail = mapToReviewDetail(payload ?? {});
    // Always keep detail id consistent with route param to avoid posting
    // approve/reject requests with mismatched listing identifiers.
    detail.id = normalizedListingId;
    return detail;
  },

  async lockListing(listingId: string): Promise<void> {
    const inspectorId = getInspectorId();
    await inspectorFetch<void>(
      `/inspector/${inspectorId}/listings/${listingId}/lock`,
      {
        method: "POST",
      },
    );
  },

  async unlockListing(listingId: string): Promise<void> {
    const inspectorId = getInspectorId();
    await inspectorFetch<void>(
      `/inspector/${inspectorId}/listings/${listingId}/unlock`,
      {
        method: "POST",
      },
    );
  },

  async approveListing(
    listingId: string,
    payload: { reasonText: string; reasonCode?: string; note?: string },
  ): Promise<void> {
    const inspectorId = getInspectorId();
    const listingPathId = Number(listingId);
    const normalizedListingId =
      Number.isFinite(listingPathId) && listingPathId > 0
        ? String(listingPathId)
        : String(listingId).trim();

    const approvePath = `/inspector/${inspectorId}/listings/${normalizedListingId}/approve`;

    try {
      await inspectorFetch<void>(approvePath, {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch (error) {
      if (!(error instanceof InspectorApiError) || error.status !== 403) {
        throw error;
      }

      const detail = await this.getListingDetail(normalizedListingId);
      const normalizedStatus = String(detail?.status ?? "")
        .trim()
        .toUpperCase();

      if (
        normalizedStatus === "PENDING" ||
        normalizedStatus === "PENDING_APPROVAL"
      ) {
        await this.lockListing(normalizedListingId);
        await inspectorFetch<void>(approvePath, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        return;
      }

      throw error;
    }
  },

  async rejectListing(
    listingId: string,
    payload: { reasonCode: string; reasonText: string; note?: string },
  ): Promise<void> {
    const inspectorId = getInspectorId();
    await inspectorFetch<void>(`/inspector/${inspectorId}/listings/reject`, {
      method: "POST",
      body: JSON.stringify({
        listingId: Number(listingId) || listingId,
        ...payload,
      }),
    });
  },

  async getReviewHistory(
    from: string,
    to: string,
  ): Promise<ReviewHistoryRow[]> {
    const inspectorId = getInspectorId();
    const query = buildQuery({ from, to, page: 0, pageSize: 100 });
    const response = await inspectorFetch<any>(
      `/inspector/${inspectorId}/reviews${query}`,
      { method: "GET" },
    );

    return toArrayPayload(response).map((item: RawObject) => ({
      id: getListingId(item),
      productName: getProductName(item),
      submittedAt: toDisplayDate(getSubmittedAt(item)),
      status: getStatus(item),
      sellerName: getSellerName(item),
      note: String(item.note ?? item.reasonText ?? item.latestNote ?? ""),
    }));
  },

  async getChatThread(inspectionRequestId: string): Promise<any[]> {
    const response = await inspectorFetch<any>(
      `/inspection-requests/${inspectionRequestId}/chat-thread`,
      { method: "GET" },
    );
    return toArrayPayload(response);
  },

  async sendChatText(inspectionRequestId: string, text: string): Promise<any> {
    return inspectorFetch<any>(
      `/inspection-requests/${inspectionRequestId}/chat-messages`,
      {
        method: "POST",
        body: JSON.stringify({ type: "TEXT", text }),
      },
    );
  },
};

