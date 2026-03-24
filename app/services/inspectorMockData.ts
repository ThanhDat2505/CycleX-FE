export const INSPECTOR_MOCK_ENABLED = true;

const MOCK_DELAY_MS = 300;

export type MockListing = {
    id: string;
    productName: string;
    storeName: string;
    sellerName: string;
    submittedAt: string;
    status: string;
    priceVnd: number;
    specs: { brand: string; type: string; frame: string; weight: string };
    waitingDays: number;
    images: { main: string; thumbs: string[] };
    history: Array<{ at: string; tag: string; desc: string; type?: string }>;
    // Fields for PendingRow mapping
    listingId?: string;
    title?: string;
    shopName?: string;
    ownerName?: string;
    createdAt?: string;
};

// Seed initial mock listings with various order statuses
export const mockInspectorListings: MockListing[] = [
    {
        id: "LST-001",
        productName: "Xe đạp địa hình Trek Marlin 7",
        storeName: "Hanoi Bikes",
        sellerName: "Nguyen Van A",
        submittedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        status: "PENDING",
        priceVnd: 15000000,
        specs: { brand: "Trek", type: "Mountain", frame: "Aluminum", weight: "14kg" },
        waitingDays: 2,
        images: { main: "https://images.unsplash.com/photo-1485965120184-e220f721d03e", thumbs: [] },
        history: [{ at: new Date(Date.now() - 2 * 86400000).toISOString(), tag: "SUBMITTED", desc: "User submitted listing" }]
    },
    {
        id: "LST-002",
        productName: "Xe đạp đường phố Giant Escape 3",
        storeName: "Saigon Cycles",
        sellerName: "Le Thi B",
        submittedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
        status: "REVIEWING",
        priceVnd: 8000000,
        specs: { brand: "Giant", type: "City", frame: "Aluminum", weight: "12kg" },
        waitingDays: 5,
        images: { main: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7", thumbs: [] },
        history: [
            { at: new Date(Date.now() - 5 * 86400000).toISOString(), tag: "SUBMITTED", desc: "User submitted listing" },
            { at: new Date(Date.now() - 1 * 86400000).toISOString(), tag: "REVIEWING", desc: "Inspector started reviewing" }
        ]
    },
    {
        id: "LST-003",
        productName: "Xe đạp touring Asama",
        storeName: "Danang Bikes",
        sellerName: "Tran Van C",
        submittedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
        status: "APPROVED",
        priceVnd: 5000000,
        specs: { brand: "Asama", type: "Touring", frame: "Steel", weight: "16kg" },
        waitingDays: 1,
        images: { main: "https://images.unsplash.com/photo-1507035895480-2b3156c31bf8", thumbs: [] },
        history: [{ at: new Date(Date.now() - 1 * 86400000).toISOString(), tag: "APPROVED", desc: "Listing approved" }]
    },
    {
        id: "LST-004",
        productName: "Xe đạp leo núi Trinx TX16",
        storeName: "Hanoi Bikes",
        sellerName: "Pham Thi D",
        submittedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
        status: "DISPUTE",
        priceVnd: 4500000,
        specs: { brand: "Trinx", type: "Mountain", frame: "Aluminum", weight: "15kg" },
        waitingDays: 3,
        images: { main: "https://images.unsplash.com/photo-1541625602330-2277a4c46182", thumbs: [] },
        history: [{ at: new Date(Date.now() - 3 * 86400000).toISOString(), tag: "DISPUTE", desc: "User reported issue" }]
    },
    {
        id: "LST-005",
        productName: "Xe đạp điện VinFast 1",
        storeName: "VinShop",
        sellerName: "Hoang Van E",
        submittedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
        status: "REJECTED",
        priceVnd: 22000000,
        specs: { brand: "VinFast", type: "E-bike", frame: "Aluminum", weight: "24kg" },
        waitingDays: 4,
        images: { main: "https://images.unsplash.com/photo-1528629297340-d1d466945dc5", thumbs: [] },
        history: [{ at: new Date(Date.now() - 1 * 86400000).toISOString(), tag: "REJECTED", desc: "Missing information" }]
    }
];

export async function handleInspectorMockRequest(path: string, init?: RequestInit): Promise<any> {
    const method = (init?.method || "GET").toUpperCase();
    console.log(`[INSPECTOR MOCK] ${method} ${path}`);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY_MS));

    // Dashboard Stats
    if (path.includes("/dashboard/stats")) {
        return {
            pendingCount: mockInspectorListings.filter(l => l.status === "PENDING").length,
            reviewingCount: mockInspectorListings.filter(l => l.status === "REVIEWING").length,
            approvedCount: mockInspectorListings.filter(l => l.status === "APPROVED").length,
            rejectedCount: mockInspectorListings.filter(l => l.status === "REJECTED").length,
            disputeCount: mockInspectorListings.filter(l => l.status === "DISPUTE").length,
        };
    }

    // Get listings for review (with optional status filtering)
    if (path.match(/\/listings\?/) || path.endsWith("/listings")) {
        // Parse query params if any
        const urlParams = new URLSearchParams(path.split('?')[1] || "");
        const statusStr = urlParams.get("status");
        
        let filtered = [...mockInspectorListings];
        if (statusStr && statusStr !== "ALL") {
            const statusList = statusStr.split(',');
            filtered = filtered.filter(l => statusList.includes(l.status));
        }
        return filtered;
    }

    // Listing detail
    if (path.includes("/detail") && method === "GET") {
        const match = path.match(/\/listings\/([^/]+)\/detail/);
        const id = match ? match[1] : null;
        const listing = mockInspectorListings.find(l => l.id === id);
        if (!listing) throw new Error("Listing not found");
        return listing;
    }

    // Lock listing
    if (path.includes("/lock") && method === "POST") {
        return { success: true };
    }

    // Unlock listing
    if (path.includes("/unlock") && method === "POST") {
        return { success: true };
    }

    // Approve listing
    if (path.includes("/approve") && method === "POST") {
        const match = path.match(/\/listings\/([^/]+)\/approve/);
        if (match) {
            const idx = mockInspectorListings.findIndex(l => l.id === match[1]);
            if (idx !== -1) {
                mockInspectorListings[idx].status = "APPROVED";
                mockInspectorListings[idx].history.unshift({
                    at: new Date().toISOString(),
                    tag: "APPROVED",
                    desc: "Đã phê duyệt thông qua Mock API"
                });
            }
        }
        return { success: true };
    }

    // Reject listing
    if (path.includes("/reject") && method === "POST") {
        let body: any = {};
        if (init?.body && typeof init.body === "string") {
            try { body = JSON.parse(init.body); } catch (e) {}
        }
        const listingId = body.listingId;
        if (listingId) {
            const idx = mockInspectorListings.findIndex(l => l.id === String(listingId));
            if (idx !== -1) {
                mockInspectorListings[idx].status = "REJECTED";
                mockInspectorListings[idx].history.unshift({
                    at: new Date().toISOString(),
                    tag: "REJECTED",
                    desc: body.reasonText || "Đã từ chối qua Mock API"
                });
            }
        }
        return { success: true };
    }
    
    // Request More Info
    if (path.includes("/request-info") && method === "POST") {
        let body: any = {};
        if (init?.body && typeof init.body === "string") {
            try { body = JSON.parse(init.body); } catch (e) {}
        }
        const listingId = body.listingId;
        if (listingId) {
            const idx = mockInspectorListings.findIndex(l => l.id === String(listingId));
            if (idx !== -1) {
                mockInspectorListings[idx].status = "NEED_MORE_INFO";
                mockInspectorListings[idx].history.unshift({
                    at: new Date().toISOString(),
                    tag: "NEED_INFO",
                    desc: body.reasonText || "Yêu cầu bổ sung qua Mock API"
                });
            }
        }
        return { success: true };
    }
    
    // Review history
    if (path.includes("/reviews") && method === "GET") {
        return mockInspectorListings;
    }

    console.warn(`[INSPECTOR MOCK] Unhandled route: ${method} ${path}`);
    throw { status: 404, message: "Not found in mock" };
}
