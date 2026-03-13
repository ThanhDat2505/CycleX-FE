/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Shared API Helpers
 * Centralized API call logic with consistent error handling
 * Used by authService and listingService
 */

import { backendRequest, type BackendErrorShape } from "../services/backend";

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

function normalizeError(error: unknown): ApiError {
  const apiError = error as BackendErrorShape | undefined;
  const status = apiError?.status ?? 500;
  const rawMessage = apiError?.message || "Unknown error";

  if (
    rawMessage === "Failed to fetch" ||
    String((error as any)?.name || "") === "TypeError"
  ) {
    return {
      status: 503,
      message:
        "Cannot connect to server. Please check if backend is running or if you have internet connection.",
    };
  }

  return {
    status,
    message: rawMessage,
    errors: apiError?.errors,
  };
}

/**
 * Helper for POST requests with body
 * @param endpoint - API endpoint (e.g., '/auth/login')
 * @param body - Request body object
 * @returns Promise with parsed JSON response
 */
// Ví dụ: apiCallPOST('/auth/login', {email, password}) đường dẫn API và dữ liệu gửi lên
// → Gửi đến: /backend/api/auth/login
// → Trả về: LoginResponse
export async function apiCallPOST<T>(
  endpoint: string,
  body: object,
): Promise<T> {
  try {
    return await backendRequest<T>(endpoint, {
      method: "POST",
      body,
    });
  } catch (error: unknown) {
    throw normalizeError(error);
  }
}

/**
 * Helper for GET requests
 * @param endpoint - API endpoint (e.g., '/home')
 * @returns Promise with parsed JSON response
 */
export async function apiCallGET<T>(endpoint: string): Promise<T> {
  try {
    return await backendRequest<T>(endpoint, { method: "GET" });
  } catch (error: unknown) {
    throw normalizeError(error);
  }
}

/**
 * Helper for PUT requests with body
 * @param endpoint - API endpoint (e.g., '/seller/listings/123')
 * @param body - Request body object
 * @returns Promise with parsed JSON response
 */
export async function apiCallPUT<T>(
  endpoint: string,
  body: object,
): Promise<T> {
  try {
    return await backendRequest<T>(endpoint, {
      method: "PUT",
      body,
    });
  } catch (error: unknown) {
    throw normalizeError(error);
  }
}

/**
 * Helper for PATCH requests with body
 * @param endpoint - API endpoint (e.g., '/seller/{sellerId}/listings/15')
 * @param body - Request body object
 * @returns Promise with parsed JSON response
 */
export async function apiCallPATCH<T>(
  endpoint: string,
  body: object,
): Promise<T> {
  try {
    return await backendRequest<T>(endpoint, {
      method: "PATCH",
      body,
    });
  } catch (error: unknown) {
    throw normalizeError(error);
  }
}

/**
 * Helper for DELETE requests
 * @param endpoint - API endpoint (e.g., '/seller/{sellerId}/drafts/1')
 * @returns Promise with parsed JSON response
 */
export async function apiCallDELETE<T>(endpoint: string): Promise<T> {
  try {
    return await backendRequest<T>(endpoint, { method: "DELETE" });
  } catch (error: unknown) {
    throw normalizeError(error);
  }
}
