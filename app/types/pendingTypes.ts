export type PendingStatus =
  | "PENDING"
  | "REVIEWING"
  | "NEED_MORE_INFO"
  | "DISPUTE"
  | "FLAGGED";

export type PendingRow = {
  id: string;
  status: PendingStatus;
  name: string;
  shop: string;
  sellerName: string;
  submittedAt: string;
  wait: number;
  waitLabel: string;
  dateISO: string;
};
