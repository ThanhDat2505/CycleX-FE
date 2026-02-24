export type ListingStatus = "pending" | "reviewing" | "dispute" | "flagged";

export type Listing = {
  id: string;
  name: string;
  store: string;
  date: string;
  status: ListingStatus;
};

export const LISTINGS: Listing[] = [
  {
    id: "#ID-12345",
    name: "Giant Propel Advanced SL 0 (2025)",
    store: "Xe Đạp Châu Âu",
    date: "12/01/2026",
    status: "pending",
  },
  {
    id: "#ID-12011",
    name: "Giant TCR Advanced Pro 1 Disc (2025)",
    store: "Minh Tuấn Bike Shop",
    date: "11/01/2026",
    status: "reviewing",
  },
  {
    id: "#ID-99881",
    name: "Specialized Allez Sprint (2023)",
    store: "Ngọc Hân Bike",
    date: "10/01/2026",
    status: "dispute",
  },
  {
    id: "#ID-77102",
    name: "Cannondale CAAD13 105 (2022)",
    store: "BikeLab",
    date: "09/01/2026",
    status: "flagged",
  },
];

export const DEFAULT_REVIEW_ID = "#ID-12011";

export const getListingById = (id: string) =>
  LISTINGS.find((x) => x.id.toLowerCase() === id.toLowerCase());
