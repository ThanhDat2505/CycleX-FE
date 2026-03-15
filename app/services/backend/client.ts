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

function isBodyInitLike(value: unknown): value is BodyInit {
  return (
    value instanceof FormData ||
    value instanceof URLSearchParams ||
    typeof value === "string" ||
    value instanceof Blob ||
    value instanceof ArrayBuffer ||
    ArrayBuffer.isView(value)
  );
}

function buildHeaders(
  extra?: Record<string, string>,
  includeJsonContentType: boolean = true,
): Record<string, string> {
  const headers: Record<string, string> = {
    ...(includeJsonContentType ? { "Content-Type": "application/json" } : {}),
    ...extra,
  };

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
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
  const { method = "GET", body, query, headers, credentials } = options;

  const isFormData = body instanceof FormData;
  const requestBody =
    body === undefined
      ? undefined
      : isBodyInitLike(body)
        ? body
        : JSON.stringify(body);

  const response = await fetch(`${BASE_PATH}${endpoint}${buildQuery(query)}`, {
    method,
    headers: buildHeaders(headers, !isFormData),
    body: requestBody,
    credentials,
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
