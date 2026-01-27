import type { Listing } from "./types";

export const mockListings: Listing[] = [
  {
    id: "L1",
    name: "Giant TCR Advanced Pro 1 Disc (2025)",
    shop: "Minh Tuấn Bike Shop",
    submittedAt: "11/01/2026",
    waitingTime: "2 ngày",
    status: "PENDING",
  },
  {
    id: "L2",
    name: "Trek Domane SL 6 Gen 4 (2024)",
    shop: "CycleHub Store",
    submittedAt: "10/01/2026",
    waitingTime: "3 ngày",
    status: "NEED_MORE_INFO",
  },
  {
    id: "L3",
    name: "Specialized Allez Sprint (2023)",
    shop: "Ngọc Hân Bike",
    submittedAt: "09/01/2026",
    waitingTime: "4 ngày",
    status: "DISPUTE",
  },
  {
    id: "L4",
    name: "Cannondale CAAD13 105 (2022)",
    shop: "BikeLab",
    submittedAt: "08/01/2026",
    waitingTime: "5 ngày",
    status: "FLAGGED",
  },
  {
    id: "L5",
    name: "Merida Scultura 4000 (2021)",
    shop: "Thanh Bình Cycles",
    submittedAt: "06/01/2026",
    waitingTime: "7 ngày",
    status: "DONE",
  },
];
