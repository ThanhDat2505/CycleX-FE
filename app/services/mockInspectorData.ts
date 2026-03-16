export const mockListings = [
  {
    id: "MOCK-001",
    productName: "Xe tay ga Honda Vision 2022",
    storeName: "Cửa hàng Xe Máy ABC",
    submittedAt: "2026-03-10T10:00:00Z",
    status: "PENDING",
    priceVnd: 25000000,
    sellerName: "Nguyễn Văn A",
    specs: {
      brand: "Honda",
      type: "Tay ga",
      frame: "Khung thép",
      weight: "97 kg",
    },
    waitingDays: 2,
    images: {
      main: "https://via.placeholder.com/600x400/f0f4ff/3b82f6?text=Vision+2022",
      thumbs: [
        "https://via.placeholder.com/600x400/f0f4ff/3b82f6?text=Thumb1",
        "https://via.placeholder.com/600x400/f0f4ff/3b82f6?text=Thumb2",
        "https://via.placeholder.com/600x400/f0f4ff/3b82f6?text=Thumb3",
      ]
    },
    history: [
      {
        at: "2026-03-10T10:00:00Z",
        tag: "CREATE",
        variant: "info",
        desc: "Người bán tạo tin đăng"
      }
    ]
  },
  {
    id: "MOCK-002",
    productName: "Xe số Yamaha Sirius 2021",
    storeName: "Cửa hàng Huy Hoàng",
    submittedAt: "2026-03-11T09:30:00Z",
    status: "APPROVED",
    priceVnd: 12000000,
    sellerName: "Trần Thế B",
    specs: {
      brand: "Yamaha",
      type: "Xe số",
      frame: "Khung ống thép",
      weight: "96 kg",
    },
    waitingDays: 0,
    images: {
      main: "https://via.placeholder.com/600x400/eaf7ee/22c55e?text=Sirius+2021",
      thumbs: [
        "https://via.placeholder.com/600x400/eaf7ee/22c55e?text=Thumb1",
        "https://via.placeholder.com/600x400/eaf7ee/22c55e?text=Thumb2"
      ]
    },
    history: [
      {
        at: "2026-03-11T09:30:00Z",
        tag: "CREATE",
        variant: "info",
        desc: "Người bán tạo tin đăng"
      },
      {
        at: "2026-03-12T14:20:00Z",
        tag: "APPROVE",
        variant: "success",
        desc: "Inspector đã duyệt tin đăng"
      }
    ]
  },
  {
    id: "MOCK-003",
    productName: "Xe côn tay Honda Winner X",
    storeName: "Duy Bike",
    submittedAt: "2026-03-12T15:45:00Z",
    status: "REJECTED",
    priceVnd: 32000000,
    sellerName: "Lê Văn C",
    specs: {
      brand: "Honda",
      type: "Xe côn tay",
      frame: "Khung rổ",
      weight: "122 kg",
    },
    waitingDays: 0,
    images: {
      main: "https://via.placeholder.com/600x400/ffecec/ef4444?text=Winner+X",
      thumbs: [
        "https://via.placeholder.com/600x400/ffecec/ef4444?text=Thumb1"
      ]
    },
    history: [
      {
        at: "2026-03-12T15:45:00Z",
        tag: "CREATE",
        variant: "info",
        desc: "Người bán tạo tin đăng"
      },
      {
        at: "2026-03-13T10:15:00Z",
        tag: "REJECT",
        variant: "danger",
        desc: "Từ chối do hình ảnh không rõ nét"
      }
    ]
  },
  {
    id: "MOCK-004",
    productName: "Xe tay ga Piaggio Vespa Sprint",
    storeName: "Vespa Store HCM",
    submittedAt: "2026-03-14T08:20:00Z",
    status: "NEED_MORE_INFO",
    priceVnd: 60000000,
    sellerName: "Phạm Thị D",
    specs: {
      brand: "Piaggio",
      type: "Tay ga",
      frame: "Khung thép nguyên khối",
      weight: "120 kg",
    },
    waitingDays: 1,
    images: {
      main: "https://via.placeholder.com/600x400/fff7cc/f4b400?text=Vespa",
      thumbs: [
        "https://via.placeholder.com/600x400/fff7cc/f4b400?text=Thumb1",
        "https://via.placeholder.com/600x400/fff7cc/f4b400?text=Thumb2"
      ]
    },
    history: [
      {
        at: "2026-03-14T08:20:00Z",
        tag: "CREATE",
        variant: "info",
        desc: "Người bán tạo tin đăng"
      },
      {
        at: "2026-03-14T16:30:00Z",
        tag: "NEED_INFO",
        variant: "warning",
        desc: "Yêu cầu bổ sung ảnh số khung"
      }
    ]
  },
  {
    id: "MOCK-005",
    productName: "Xe Mô tô Kawasaki Ninja 400",
    storeName: "Moto Phân Khối Lớn",
    submittedAt: "2026-03-15T10:00:00Z",
    status: "DISPUTE",
    priceVnd: 120000000,
    sellerName: "Hoàng Tăng E",
    specs: {
      brand: "Kawasaki",
      type: "Sportbike",
      frame: "Khung sườn ống thép",
      weight: "168 kg",
    },
    waitingDays: 2,
    images: {
      main: "https://via.placeholder.com/600x400/fff7cc/f4b400?text=Ninja+400",
      thumbs: [
        "https://via.placeholder.com/600x400/fff7cc/f4b400?text=Thumb1"
      ]
    },
    history: [
      {
        at: "2026-03-15T10:00:00Z",
        tag: "CREATE",
        variant: "info",
        desc: "Người bán tạo tin đăng"
      },
      {
        at: "2026-03-16T09:00:00Z",
        tag: "DISPUTE",
        variant: "danger",
        desc: "Có tranh chấp về tình trạng thực tế"
      }
    ]
  },
  {
    id: "MOCK-006",
    productName: "Xe đạp điện VinFast Ludo",
    storeName: "VinFast Tân Bình",
    submittedAt: "2026-03-16T07:00:00Z",
    status: "REVIEWING",
    priceVnd: 8000000,
    sellerName: "Trịnh Khắc F",
    specs: {
      brand: "VinFast",
      type: "Xe máy điện",
      frame: "Khung hợp kim",
      weight: "68 kg",
    },
    waitingDays: 0,
    images: {
      main: "https://via.placeholder.com/600x400/f0f4ff/3b82f6?text=Vinfast+Ludo",
      thumbs: [
        "https://via.placeholder.com/600x400/f0f4ff/3b82f6?text=Thumb1"
      ]
    },
    history: [
      {
        at: "2026-03-16T07:00:00Z",
        tag: "CREATE",
        variant: "info",
        desc: "Người bán tạo tin đăng"
      },
      {
        at: "2026-03-16T08:30:00Z",
        tag: "REVIEWING",
        variant: "info",
        desc: "Đang xem xét bởi Inspector"
      }
    ]
  }
];

export const getMockDashboardStats = () => {
  return {
    pendingCount: mockListings.filter(l => l.status === "PENDING").length,
    reviewingCount: mockListings.filter(l => l.status === "REVIEWING").length,
    approvedCount: mockListings.filter(l => l.status === "APPROVED").length,
    rejectedCount: mockListings.filter(l => l.status === "REJECTED").length,
    disputeCount: mockListings.filter(l => l.status === "DISPUTE").length,
  };
};
