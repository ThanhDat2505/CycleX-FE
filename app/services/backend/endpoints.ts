export const ENDPOINTS = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    verifyOtp: "/auth/verify-otp",
    resendOtp: "/auth/resend-otp",
  },
  listings: {
    featured: "/home",
    all: "/bikelistings",
    detail: (listingId: number | string) => `/bikelistings/${listingId}`,
    sellerCreate: (sellerId: number | string) =>
      `/seller/${sellerId}/listings/create`,
    sellerSearch: (sellerId: number | string) =>
      `/seller/${sellerId}/listings/search`,
  },
  transactions: {
    buyerList: "/buyer/transactions",
    sellerList: "/seller/transactions",
    detail: (transactionId: number | string, role: "BUYER" | "SELLER") =>
      `${role === "SELLER" ? "/seller" : "/buyer"}/transactions/${transactionId}`,
    purchaseRequest: (listingId: number | string) =>
      `/products/${listingId}/purchase-requests`,
  },
  shipper: {
    dashboardSummary: (shipperId: number | string) =>
      `/shipper/${shipperId}/dashboard/summary`,
    deliveries: "/shipper/deliveries",
    deliveryDetail: (deliveryId: number | string) =>
      `/shipper/deliveries/${deliveryId}`,
  },
} as const;
