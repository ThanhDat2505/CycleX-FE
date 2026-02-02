# Dashboard (S-10) - Detailed API Analysis

## 🎯 Dashboard Overview

**Page:** `/dashboard`  
**Component:** `app/dashboard/page.tsx`  
**Service:** `app/services/dashboardService.ts`  
**Hook:** `app/hooks/useDashboard.ts`

---

## 📍 Where Mock Data is Used in Dashboard

```
Dashboard Page (dashboard/page.tsx)
    ↓
useDashboard() Hook (hooks/useDashboard.ts)
    ↓
getDashboardData() Service (services/dashboardService.ts)
    ↓
Mock Data Block (Line 44-78 in dashboardService.ts)
    ↓
Displays on Page:
    - 4 Metric Cards (Stats)
    - Recent Activity Section (Static HTML)
    - Quick Actions Links (Static)
    - Top Listings Table (Populated from topListings)
```

---

## 📊 Component Breakdown

### 1. **Metric Cards** (Lines 75-130 in dashboard/page.tsx)

**Sources:**
```typescript
const {
    activeListings,           // From API stats
    pendingListings,          // From API stats
    rejectedListings,         // From API stats
    totalTransactions,        // From API stats
    totalViews,              // Not displayed in Sprint 1
    newInquiries             // Not displayed in Sprint 1
} = stats;
```

**Displayed Cards:**
```
┌─────────────────────────────────────────┐
│  📋 Active Listings      │  ⏳ Pending   │
│  Value: activeListings   │  pendingList │
│  "↑ 2 from last month"   │  "Waiting"   │
└─────────────────────────────────────────┘
│  ❌ Rejected Listings    │  💰 Trans    │
│  Value: rejectedList     │  totalTrans  │
│  "Need attention"        │  "Not avail" │
└─────────────────────────────────────────┘
```

**Mock Data (Line 115-121):**
```json
{
  "stats": {
    "activeListings": 2,        // 4 items filtered, 2 active
    "pendingListings": 1,       // 4 items filtered, 1 pending
    "rejectedListings": 1,      // 4 items filtered, 1 rejected
    "totalTransactions": 5,     // Hardcoded value
    "totalViews": 1245,         // Hardcoded value (not displayed)
    "newInquiries": 3           // Hardcoded value (not displayed)
  }
}
```

**API Integration Point:**
```typescript
// Replace hardcoded values with API response
// When NEXT_PUBLIC_MOCK_API=false:
const response = await fetch('/backend/api/seller/dashboard', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const data = await response.json();
// data.stats will have: activeListings, pendingListings, etc.
```

---

### 2. **Recent Activity Section** (Lines 152-180)

**Status:** ❌ **HARDCODED - NO API YET**

**Current Implementation:**
```typescript
<div className="pb-4 border-b border-gray-100">
  <p className="text-sm text-gray-500 mb-1">Today</p>
  <p className="font-semibold text-gray-900">💬 New inquiry on Trek Domane</p>
  <p className="text-sm text-gray-600">Customer asked about shipping costs</p>
</div>
// ... 3 more hardcoded items
```

**To Implement API:**
```typescript
// 1. Add new interface
interface Activity {
  id: number;
  type: 'INQUIRY' | 'VIEW' | 'SALE' | 'REVIEW';
  title: string;
  description: string;
  timestamp: string;        // ISO date
  icon: string;            // emoji or icon name
}

// 2. Update dashboardService.ts
export async function getActivities(): Promise<Activity[]> {
  const response = await fetch('/backend/api/seller/activities?limit=4', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await response.json();
}

// 3. Update useDashboard hook to also call getActivities()

// 4. Update dashboard/page.tsx to display activities from state
```

**Expected API Response:**
```json
{
  "activities": [
    {
      "id": 1,
      "type": "INQUIRY",
      "title": "New inquiry on Trek Domane",
      "description": "Customer asked about shipping costs",
      "timestamp": "2024-02-01T14:30:00Z",
      "icon": "💬"
    },
    {
      "id": 2,
      "type": "VIEW",
      "title": "Listing viewed 25 times",
      "description": "Specialized Tarmac SL7 getting attention",
      "timestamp": "2024-01-31T10:15:00Z",
      "icon": "👁️"
    },
    {
      "id": 3,
      "type": "SALE",
      "title": "New sale completed",
      "description": "Trek Domane AL 3 - $1,200",
      "timestamp": "2024-01-30T09:00:00Z",
      "icon": "✅"
    },
    {
      "id": 4,
      "type": "REVIEW",
      "title": "5-star review received",
      "description": "From verified buyer",
      "timestamp": "2024-01-29T16:45:00Z",
      "icon": "⭐"
    }
  ]
}
```

---

### 3. **Quick Actions** (Lines 182-204)

**Status:** ✅ **Ready** - Static navigation links

```
┌──────────────────────────────┐
│  Create Listing (Button)     │  → /create-listing
│  View Listings (Button)      │  → /my-listings
│  Draft Listings (Button)     │  → /draft-listings
│  Check Status (Commented)    │  → /listing-status (Future)
└──────────────────────────────┘
```

**No API needed** - Just static routing.

---

### 4. **Top Performing Listings Table** (Lines 206-256)

**Status:** ✅ **Ready** - Uses `topListings` from API

**Data Source:**
```typescript
{topListings.slice(0, TOP_LISTINGS_LIMIT).map((listing: TopListing) => (
  <tr>
    <td>{listing.brand} {listing.model}</td>
    <td>{formatPrice(listing.price)}</td>
    <td>{listing.views}</td>
    <td>{listing.inquiries}</td>
    <td><Status badge>{listing.status}</Status></td>
  </tr>
))}
```

**Mock Data (Lines 72-86 in dashboardService.ts):**
```json
"topListings": [
  {
    "id": 1,
    "brand": "Giant",
    "model": "Escape 3",
    "status": "ACTIVE",
    "price": 8500000,
    "views": 120,
    "inquiries": 2
  },
  // ... 3 more items
]
```

**API Integration:** Ready! Just set `NEXT_PUBLIC_MOCK_API=false`

---

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                 Dashboard Page                          │
│            (dashboard/page.tsx - Line 16)              │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ calls useDashboard(enabled)
                     ↓
┌─────────────────────────────────────────────────────────┐
│              useDashboard Hook                          │
│          (hooks/useDashboard.ts - Line 36)             │
│                                                         │
│  const { stats, topListings, loading, error } =       │
│    useDashboard(isLoggedIn && !authLoading)           │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ calls getDashboardData()
                     ↓
┌─────────────────────────────────────────────────────────┐
│        getDashboardData() Service Function              │
│        (services/dashboardService.ts - Line 40)         │
│                                                         │
│  if (USE_MOCK_API) {                                  │
│    return mockDashboardData()                          │
│  } else {                                              │
│    return real API call to:                            │
│    /backend/api/seller/dashboard                      │
│  }                                                     │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
    ✅ MOCK DATA          ⏳ REAL API
    (When enabled)      (When enabled)
        │                         │
   Returns:              Returns: HTTP 200
   {                     {
    stats: {...},        stats: {...},
    topListings: [...]   topListings: [...]
   }                     }
        │                         │
        └────────────┬────────────┘
                     │
                     ↓
        ┌─────────────────────────┐
        │  State Update           │
        │  setStats()             │
        │  setTopListings()       │
        └────────────┬────────────┘
                     │
                     ↓
        ┌─────────────────────────────────────────┐
        │  Re-render Dashboard with data:         │
        │  - Metric Cards (4)                     │
        │  - Recent Activity (static)             │
        │  - Quick Actions (static)               │
        │  - Top Listings Table                   │
        └─────────────────────────────────────────┘
```

---

## 📋 Mock Data vs Real API

| Aspect | Mock Data | Real API |
|--------|-----------|----------|
| **Enabled When** | `NEXT_PUBLIC_MOCK_API=true` | `NEXT_PUBLIC_MOCK_API=false` |
| **Data Source** | Hardcoded in code (Line 44-86) | `/backend/api/seller/dashboard` |
| **Delay** | 500ms (simulated) | Network dependent |
| **Stats Values** | Fixed (2, 1, 1, 5, 1245, 3) | Dynamic from database |
| **Top Listings** | 4 fixed bikes | Top 5-10 by views |
| **Validation** | Skipped | Enabled (type checking) |
| **Error Handling** | No errors | Real error messages |

---

## 🛠️ How to Test Each Component

### Test 1: Mock Data (Development)
```bash
# .env.local
NEXT_PUBLIC_MOCK_API=true

# Run and visit /dashboard
# Should show:
# ✅ Active Listings: 2
# ✅ Pending Listings: 1
# ✅ Rejected Listings: 1
# ✅ Transactions: 5
# ✅ Table with 4 bikes
```

### Test 2: Real API (Once Backend Ready)
```bash
# .env.local
NEXT_PUBLIC_MOCK_API=false

# Run and visit /dashboard
# Check Network tab in DevTools:
# ✅ Request to /backend/api/seller/dashboard
# ✅ Status: 200
# ✅ Response matches expected format
# ✅ No console errors
```

### Test 3: Error Handling
```bash
# Simulate API error:
# 1. Modify endpoint URL to invalid path
# 2. Or stop backend server
# 3. Visit /dashboard
# Should see: ErrorBanner with "Unable to load dashboard data"
# And: Retry button works
```

---

## ⚡ Performance Notes

1. **Parallel Loading:**
   - `useAuth()` checks authentication (fast, from localStorage)
   - `useDashboard()` fetches data only if `isLoggedIn=true`
   - Both can run in parallel

2. **Loading States:**
   - Page shows "Loading..." while `authLoading=true`
   - Then shows "Loading dashboard..." while `dashboardLoading=true`
   - Then shows content

3. **Error Recovery:**
   - Error banner appears for 5+ seconds (CSS animation)
   - Retry button allows re-fetching without page reload
   - Previous data stays visible while retrying

---

## 🔐 Security Checklist

- ✅ Authentication check before loading (`useAuth`)
- ✅ Role-based access (only BUYER/SELLER, not ADMIN/SHIPPER/INSPECTOR)
- ✅ Bearer token included in API request header
- ✅ Token from localStorage (client-side only)
- ✅ Response validation (prevent injection attacks)
- ✅ Error messages don't leak sensitive info

---

## 📝 Summary

**Current State:**
- ✅ Mock data implemented and working
- ✅ Component layout complete
- ✅ Error handling in place
- ✅ Loading states working
- ⚠️ Recent Activity still hardcoded

**Next Steps:**
1. Backend provides `/api/seller/dashboard` endpoint
2. Set `NEXT_PUBLIC_MOCK_API=false` in `.env.local`
3. (Optional) Implement Recent Activity API and update component
4. Test with real data

**Files to Monitor:**
- `app/services/dashboardService.ts` (main integration point)
- `app/dashboard/page.tsx` (UI)
- `app/hooks/useDashboard.ts` (data fetching hook)
