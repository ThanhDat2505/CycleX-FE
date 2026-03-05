export type ListingStatus =
  | "PENDING"
  | "REVIEWING"
  | "NEED_MORE_INFO"
  | "DISPUTE"
  | "FLAGGED"
  | "APPROVED"
  | "DONE";

export type Listing = {
  id: string;
  name: string;
  shop: string;
  submittedAt: string;
  waitingTime: string;
  status: ListingStatus;
};
