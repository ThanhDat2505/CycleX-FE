export type ListingStatus =
  | "PENDING"
  | "REVIEWING"
  | "NEED_INFO"
  | "DISPUTE"
  | "FLAGGED"
  | "DONE";

export const STATUS_LABEL: Record<ListingStatus, string> = {
  PENDING: "Đang chờ duyệt",
  REVIEWING: "Đang review",
  NEED_INFO: "Cần bổ sung",
  DISPUTE: "Tranh chấp",
  FLAGGED: "Bị flag",
  DONE: "Đã xử lý",
};

export type ListingSpec = {
  brand: string;
  type: string;
  frame: string;
  weight: string;
};

export type ListingHistoryItem = {
  at: string;
  tag: string;
  variant: "neutral" | "warning" | "info" | "danger" | "success";
  desc: string;
};

export type Listing = {
  id: string;
  productName: string;
  storeName: string;
  submittedAt: string;
  status: ListingStatus;
  vehicleType: "Bicycle";
  priceVnd: number;
  sellerName: string;
  specs: ListingSpec;
  waitingDays?: number;
  images: {
    thumb: string;
    main: string;
    thumbs: string[];
  };
  history: ListingHistoryItem[];
};

const img = (seed: string, w: number, h: number, suffix: string) =>
  `https://picsum.photos/seed/${encodeURIComponent(`${seed}-${suffix}`)}/${w}/${h}`;

export const listings: Listing[] = [
  {
    id: "ID-12345",
    productName: "Giant Propel Advanced SL 0 (2025)",
    storeName: "Xe Đạp Châu Âu",
    submittedAt: "2026-01-12",
    status: "PENDING",
    vehicleType: "Bicycle",
    priceVnd: 5500000,
    sellerName: "Nguyễn Văn A",
    specs: {
      brand: "Giant",
      type: "Road Bike",
      frame: "Carbon",
      weight: "8.2kg",
    },
    waitingDays: 2,
    images: {
      thumb: img("ID-12345", 220, 150, "thumb"),
      main: img("ID-12345", 1200, 800, "main"),
      thumbs: [
        img("ID-12345", 520, 360, "t1"),
        img("ID-12345", 520, 360, "t2"),
        img("ID-12345", 520, 360, "t3"),
        img("ID-12345", 520, 360, "t4"),
      ],
    },
    history: [
      {
        at: "11/01/2026 10:12",
        tag: "SUBMIT",
        variant: "neutral",
        desc: "Seller gửi tin đăng để kiểm duyệt.",
      },
      {
        at: "11/01/2026 10:15",
        tag: "PENDING",
        variant: "warning",
        desc: "Tin vào hàng đợi chờ duyệt.",
      },
    ],
  },
  {
    id: "ID-12011",
    productName: "Giant TCR Advanced Pro 1 Disc (2025)",
    storeName: "Minh Tuấn Bike Shop",
    submittedAt: "2026-01-11",
    status: "REVIEWING",
    vehicleType: "Bicycle",
    priceVnd: 7900000,
    sellerName: "Trần Minh Tuấn",
    specs: {
      brand: "Giant",
      type: "Road Bike",
      frame: "Carbon",
      weight: "8.5kg",
    },
    waitingDays: 1,
    images: {
      thumb: img("ID-12011", 220, 150, "thumb"),
      main: img("ID-12011", 1200, 800, "main"),
      thumbs: [
        img("ID-12011", 520, 360, "t1"),
        img("ID-12011", 520, 360, "t2"),
        img("ID-12011", 520, 360, "t3"),
        img("ID-12011", 520, 360, "t4"),
      ],
    },
    history: [
      {
        at: "10/01/2026 09:40",
        tag: "SUBMIT",
        variant: "neutral",
        desc: "Seller gửi tin đăng để kiểm duyệt.",
      },
      {
        at: "11/01/2026 09:20",
        tag: "REVIEWING",
        variant: "info",
        desc: "Inspector mở tin → hệ thống khóa để review.",
      },
    ],
  },
  {
    id: "ID-55555",
    productName: "Trek Domane SL 6 Gen 4 (2024)",
    storeName: "CycleHub Store",
    submittedAt: "2026-01-08",
    status: "NEED_INFO",
    vehicleType: "Bicycle",
    priceVnd: 13500000,
    sellerName: "Nguyễn Văn B",
    specs: {
      brand: "Trek",
      type: "Road Bike",
      frame: "Carbon",
      weight: "8.9kg",
    },
    waitingDays: 5,
    images: {
      thumb: img("ID-55555", 220, 150, "thumb"),
      main: img("ID-55555", 1200, 800, "main"),
      thumbs: [
        img("ID-55555", 520, 360, "t1"),
        img("ID-55555", 520, 360, "t2"),
        img("ID-55555", 520, 360, "t3"),
        img("ID-55555", 520, 360, "t4"),
      ],
    },
    history: [
      {
        at: "08/01/2026 09:12",
        tag: "NEED_INFO",
        variant: "warning",
        desc: "Yêu cầu bổ sung thông tin trước khi duyệt.",
      },
    ],
  },
  {
    id: "ID-99881",
    productName: "Specialized Allez Sprint (2023)",
    storeName: "Ngọc Hân Bike",
    submittedAt: "2026-01-10",
    status: "DISPUTE",
    vehicleType: "Bicycle",
    priceVnd: 6200000,
    sellerName: "Ngọc Hân",
    specs: {
      brand: "Specialized",
      type: "Road Bike",
      frame: "Aluminum",
      weight: "9.1kg",
    },
    waitingDays: 3,
    images: {
      thumb: img("ID-99881", 220, 150, "thumb"),
      main: img("ID-99881", 1200, 800, "main"),
      thumbs: [
        img("ID-99881", 520, 360, "t1"),
        img("ID-99881", 520, 360, "t2"),
        img("ID-99881", 520, 360, "t3"),
        img("ID-99881", 520, 360, "t4"),
      ],
    },
    history: [
      {
        at: "10/01/2026 10:05",
        tag: "DISPUTE",
        variant: "danger",
        desc: "Tin phát sinh tranh chấp cần xem xét.",
      },
    ],
  },
  {
    id: "ID-77102",
    productName: "Cannondale CAAD13 105 (2022)",
    storeName: "BikeLab",
    submittedAt: "2026-01-09",
    status: "FLAGGED",
    vehicleType: "Bicycle",
    priceVnd: 5900000,
    sellerName: "Lê Quốc Bảo",
    specs: {
      brand: "Cannondale",
      type: "Road Bike",
      frame: "Aluminum",
      weight: "9.0kg",
    },
    waitingDays: 4,
    images: {
      thumb: img("ID-77102", 220, 150, "thumb"),
      main: img("ID-77102", 1200, 800, "main"),
      thumbs: [
        img("ID-77102", 520, 360, "t1"),
        img("ID-77102", 520, 360, "t2"),
        img("ID-77102", 520, 360, "t3"),
        img("ID-77102", 520, 360, "t4"),
      ],
    },
    history: [
      {
        at: "09/01/2026 15:10",
        tag: "FLAGGED",
        variant: "neutral",
        desc: "Tin bị gắn cờ do nghi vấn thông tin/ảnh.",
      },
    ],
  },
  {
    id: "ID-65432",
    productName: "Merida Scultura 4000 (2021)",
    storeName: "Thanh Bình Cycles",
    submittedAt: "2026-01-06",
    status: "DONE",
    vehicleType: "Bicycle",
    priceVnd: 5100000,
    sellerName: "Nguyễn Thanh Bình",
    specs: {
      brand: "Merida",
      type: "Road Bike",
      frame: "Carbon",
      weight: "8.9kg",
    },
    waitingDays: 7,
    images: {
      thumb: img("ID-65432", 220, 150, "thumb"),
      main: img("ID-65432", 1200, 800, "main"),
      thumbs: [
        img("ID-65432", 520, 360, "t1"),
        img("ID-65432", 520, 360, "t2"),
        img("ID-65432", 520, 360, "t3"),
        img("ID-65432", 520, 360, "t4"),
      ],
    },
    history: [
      {
        at: "06/01/2026 09:00",
        tag: "DONE",
        variant: "success",
        desc: "Tin đã được xử lý/hoàn tất.",
      },
    ],
  },
];

export const getListingById = (id?: string) =>
  listings.find((x) => x.id === id);
