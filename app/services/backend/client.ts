import type { ApiRequestOptions, BackendErrorShape } from "./contracts";

const BASE_PATH = "/backend/api";

function buildQuery(query?: ApiRequestOptions["query"]): string {
  if (!query) return "";

  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined) return;
    params.set(key, String(value));
  });

  const text = params.toString();
  return text ? `?${text}` : "";
}

function buildHeaders(extra?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...extra,
  };

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("authToken");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
}

export async function backendRequest<TResponse>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<TResponse> {
  const { method = "GET", body, query, headers } = options;

  const response = await fetch(`${BASE_PATH}${endpoint}${buildQuery(query)}`, {
    method,
    headers: buildHeaders(headers),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let parsed: BackendErrorShape | null = null;
    try {
      parsed = (await response.json()) as BackendErrorShape;
    } catch {
      // keep fallback error shape below
    }

    throw {
      status: parsed?.status ?? response.status,
      message: parsed?.message ?? `Server error: ${response.statusText}`,
      errors: parsed?.errors,
    } as BackendErrorShape;
  }

  if (response.status === 204) {
    return {} as TResponse;
  }

  return (await response.json()) as TResponse;
}
