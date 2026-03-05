import type {
  Listing as DashboardListing,
  ListingStatus as DashboardListingStatus,
} from "@/app/types/types";
import type { PendingRow, PendingStatus } from "@/app/types/pendingTypes";

type RawObject = Record<string, any>;

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
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
}

function getInspectorId(): number {
  if (typeof window === "undefined") return 0;

  const fromUserData = parseJsonSafe(localStorage.getItem("userData"));
  const candidate = Number(fromUserData?.userId);
  if (Number.isFinite(candidate) && candidate > 0) {
    return candidate;
  }

  return 3;
}

async function inspectorFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(init?.headers ?? {});

  if (!headers.has("Content-Type") && !(init?.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`/backend/api${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    let message = `Server error: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      message = errorData?.message || errorData?.error || message;
    } catch {
      // Ignore parse error and use fallback message
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
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

function statusToDashboardStatus(status: string): DashboardListingStatus {
  switch (status) {
    case "PENDING":
      return "PENDING";
    case "NEED_MORE_INFO":
    case "NEED_INFO":
      return "NEED_MORE_INFO";
    case "DISPUTE":
      return "DISPUTE";
    case "FLAGGED":
      return "FLAGGED";
    case "APPROVED":
      return "APPROVED";
    case "DONE":
    case "REJECTED":
      return "DONE";
    case "REVIEWING":
      return "PENDING";
    default:
      return "PENDING";
  }
}

function statusToPendingStatus(status: string): PendingStatus {
  switch (status) {
    case "PENDING":
      return "PENDING";
    case "REVIEWING":
      return "REVIEWING";
    case "NEED_MORE_INFO":
    case "NEED_INFO":
      return "NEED_MORE_INFO";
    case "DISPUTE":
      return "DISPUTE";
    case "FLAGGED":
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
  return String(raw.status ?? raw.reviewStatus ?? raw.state ?? "PENDING");
}

function mapToDashboardListing(raw: RawObject): DashboardListing {
  const submittedAt = getSubmittedAt(raw);
  const waitingDays =
    Number(raw.waitingDays ?? raw.pendingDays ?? raw.daysWaiting ?? 0) || 0;

  return {
    id: getListingId(raw),
    name: getProductName(raw),
    shop: getStoreName(raw),
    submittedAt: toDisplayDate(submittedAt),
    waitingTime: `${Math.max(0, waitingDays)} ngày`,
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

  async getDashboardStats(): Promise<any> {
    const inspectorId = getInspectorId();
    return inspectorFetch<any>(`/inspector/${inspectorId}/dashboard/stats`, {
      method: "GET",
    });
  },

  async getListingDetail(listingId: string): Promise<InspectorReviewDetail> {
    const inspectorId = getInspectorId();
    const response = await inspectorFetch<any>(
      `/inspector/${inspectorId}/listings/${listingId}/detail`,
      { method: "GET" },
    );

    const payload = response?.data ?? response;
    return mapToReviewDetail(payload ?? {});
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
    payload: { reasonCode: string; reasonText: string; note?: string },
  ): Promise<void> {
    const inspectorId = getInspectorId();
    await inspectorFetch<void>(
      `/inspector/${inspectorId}/listings/${listingId}/approve`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
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
