export const ENDPOINTS = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    verifyOtp: "/auth/verify-otp",
    resendOtp: "/auth/resend-otp",
    sendOtp: "/auth/send-otp",
  },
  listings: {
    featured: "/home",
    all: "/bikelistings",
    detail: (listingId: number | string) => `/bikelistings/${listingId}`,
    sellerCreate: (sellerId: number | string) =>
      `/seller/${sellerId}/listings/create`,
    sellerSearch: (sellerId: number | string) =>
      `/seller/${sellerId}/listings/search`,
    sellerSearchLegacy: "/seller/listings/search",
    sellerDetailLegacy: "/seller/listings/detail",
    sellerDashboardStats: (sellerId: number | string) =>
      `/seller/${sellerId}/dashboard/stats`,
    sellerDashboardStatsLegacy: "/seller/dashboard/stats",
    sellerDrafts: (sellerId: number | string) => `/seller/${sellerId}/drafts`,
    sellerDraftSubmit: (
      sellerId: number | string,
      listingId: number | string,
    ) => `/seller/${sellerId}/drafts/${listingId}/submit`,
    sellerListingDetail: (
      sellerId: number | string,
      listingId: number | string,
    ) => `/seller/${sellerId}/listings/${listingId}`,
    sellerListingPreview: (
      sellerId: number | string,
      listingId: number | string,
    ) => `/seller/${sellerId}/listings/${listingId}/preview`,
    sellerListingImages: (
      sellerId: number | string,
      listingId: number | string,
    ) => `/seller/${sellerId}/listings/${listingId}/images`,
    sellerListingImageDetail: (
      sellerId: number | string,
      listingId: number | string,
      imageId: number | string,
    ) => `/seller/${sellerId}/listings/${listingId}/images/${imageId}`,
    sellerListingRejection: (
      sellerId: number | string,
      listingId: number | string,
    ) => `/seller/${sellerId}/listings/${listingId}/rejection`,
  },
  transactions: {
    buyerList: "/buyer/transactions",
    sellerList: "/seller/transactions",
    sellerPending: "/seller/transactions/pending",
    sellerConfirm: (transactionId: number | string) =>
      `/seller/transactions/${transactionId}/confirm`,
    buyerCancel: (transactionId: number | string) =>
      `/buyer/transactions/${transactionId}/cancel`,
    buyerById: (buyerId: number | string) => `/buyer/${buyerId}/transactions`,
    detail: (transactionId: number | string, role: "BUYER" | "SELLER") =>
      `${role === "SELLER" ? "/seller" : "/buyer"}/transactions/${transactionId}`,
    purchaseRequest: (listingId: number | string) =>
      `/products/${listingId}/purchase-requests`,
  },
  shipper: {
    dashboardSummaryLegacy: "/shipper/dashboard/summary",
    dashboardSummary: (shipperId: number | string) =>
      `/shipper/${shipperId}/dashboard/summary`,
    assignedDeliveries: "/shipper/deliveries/assigned",
    deliveries: "/shipper/deliveries",
    deliveryDetail: (deliveryId: number | string) =>
      `/shipper/deliveries/${deliveryId}`,
  },
} as const;
