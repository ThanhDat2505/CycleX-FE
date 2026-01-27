export type ListingStatus =
  | "PENDING"
  | "NEED_MORE_INFO"
  | "DISPUTE"
  | "FLAGGED"
  | "DONE";

export type Listing = {
  id: string;
  name: string;
  shop: string;
  submittedAt: string;
  waitingTime: string;
  status: ListingStatus;
};
