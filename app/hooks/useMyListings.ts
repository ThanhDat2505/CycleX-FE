/**
 * Custom hook for My Listings (S-11) data management
 * Separates data fetching logic from UI component
 */

import { useState, useEffect } from "react";
import {
  getMyListings,
  type Listing,
  type GetMyListingsParams,
} from "../services/myListingsService";

interface UseMyListingsReturn {
  listings: Listing[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
  retry: () => void;
}

/**
 * Hook to load and manage listings data with pagination and filtering
 * Handles loading state, error handling, and retry logic
 */
export function useMyListings(
  params: GetMyListingsParams,
): UseMyListingsReturn {
  const { sellerId, page, pageSize, status, sortBy } = params;

  const [listings, setListings] = useState<Listing[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(page || 1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!sellerId) {
      setListings([]);
      setTotalItems(0);
      setTotalPages(0);
      setCurrentPage(page || 1);
      setLoading(false);
      setError(null);
      return;
    }

    const abortController = new AbortController();

    const loadListings = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getMyListings({
          sellerId,
          page,
          pageSize,
          status,
          sortBy,
        });

        if (!abortController.signal.aborted) {
          setListings(response.listings);
          setTotalItems(response.totalItems);
          setTotalPages(response.totalPages);
          setCurrentPage(response.currentPage);
        }
      } catch (err) {
        if (!abortController.signal.aborted) {
          console.error("Failed to load listings:", err);
          setError("Không thể tải danh sách tin đăng. Vui lòng thử lại.");
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadListings();

    return () => abortController.abort();
  }, [sellerId, page, pageSize, status, sortBy, retryCount]);

  const retry = () => {
    setRetryCount((prev) => prev + 1);
  };

  return {
    listings,
    totalItems,
    totalPages,
    currentPage,
    loading,
    error,
    retry,
  };
}
