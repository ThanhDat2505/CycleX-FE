export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiEnvelope<T> {
  data: T;
  message?: string;
  timestamp?: string;
}

export interface ApiRequestOptions {
  method?: HttpMethod;
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
}

export interface BackendErrorShape {
  status?: number;
  message?: string;
  errors?: Record<string, string[]>;
}
