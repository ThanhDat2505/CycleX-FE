# 🚀 Quick API Reference - CycleX Frontend

## ⚡ TL;DR - What You Need to Know

### To Enable Real APIs:
1. Update `.env.local`: `NEXT_PUBLIC_MOCK_API=false`
2. That's it! Code automatically switches to real API calls.

### Current Situation:
- **Mock Data:** ✅ Working (default mode for development)
- **Real APIs:** ⏳ Ready to integrate (code written, awaiting backend)

---

## 📍 Where Mock Data is Used

```
HOME PAGE (/):
├── Featured Bikes (Mock) → Need: GET /api/home
│   └── Shows "Xe Đạp Đang Hot" section

LISTINGS PAGE (/listings):
├── All Listings (Mock) → Need: GET /api/listings/pagination
├── Search Listings (Mock) → Need: GET /api/listings/search
│   └── With filters & pagination
└── Location: listingService.ts lines 18-220

LISTING DETAIL PAGE (/listings/[id]):
├── Listing Detail (✅ READY)
│   └── Uses: POST /api/listings/detail
│   └── Status: Fully integrated & working
└── Location: listingService.ts lines 268-340

DASHBOARD PAGE (/dashboard):
├── Stats Cards (Mock) → Need: GET /api/seller/dashboard
├── Top Listings Table (Mock) → Need: GET /api/seller/dashboard
├── Recent Activity (Hardcoded) → No API yet
└── Location: dashboardService.ts lines 40-118
```

---

## 🔗 All API Endpoints at a Glance

| Endpoint | Method | Purpose | Mock? | Location |
|----------|--------|---------|-------|----------|
| `/api/home` | GET | Featured bikes (hot) | ✅ | listingService line 18 |
| `/api/listings/pagination` | GET | Browse all listings | ✅ | listingService line 53 |
| `/api/listings/search` | GET | Search with filters | ✅ | listingService line 93 |
| `/api/listings/detail` | POST | Get listing details | ❌ | listingService line 268 |
| `/api/seller/dashboard` | GET | Dashboard stats | ✅ | dashboardService line 40 |

**Legend:** ✅ = Has mock data | ❌ = No mock (already API integrated)

---

## 📊 Dashboard - Specific Details

### What Dashboard Needs:

```
GET /backend/api/seller/dashboard
Headers: Authorization: Bearer {token}

Response:
{
  "stats": {
    "activeListings": 2,        ← Metric Card 1
    "pendingListings": 1,       ← Metric Card 2
    "rejectedListings": 1,      ← Metric Card 3
    "totalTransactions": 5,     ← Metric Card 4
    "totalViews": 1245,         ← Not displayed
    "newInquiries": 3           ← Not displayed
  },
  "topListings": [              ← Table data
    {
      "id": 1,
      "brand": "Giant",
      "model": "Escape 3",
      "price": 8500000,
      "views": 120,
      "inquiries": 2,
      "status": "ACTIVE"
    }
  ]
}
```

### How Mock is Currently Working:

```typescript
// dashboardService.ts line 40
export async function getDashboardData(): Promise<DashboardData> {
  const USE_MOCK_API = process.env.NEXT_PUBLIC_MOCK_API === 'true';
  
  if (USE_MOCK_API) {
    // Line 44-86: Returns hardcoded mock data
    // activeListings = 2
    // pendingListings = 1
    // etc...
  } else {
    // Line 89-118: Makes real API call
    // const response = fetch('/backend/api/seller/dashboard')
    // return response.json()
  }
}
```

### Hardcoded Mock Values (Line 44-86):
```json
{
  "stats": {
    "activeListings": 2,
    "pendingListings": 1,
    "rejectedListings": 1,
    "totalTransactions": 5,
    "totalViews": 1245,
    "newInquiries": 3
  },
  "topListings": [
    { "id": 1, "brand": "Giant", "model": "Escape 3", ... },
    { "id": 2, "brand": "Trek", "model": "FX 2", ... },
    { "id": 3, "brand": "Specialized", "model": "Sirrus X", ... },
    { "id": 4, "brand": "Cannondale", "model": "Trail 5", ... }
  ]
}
```

---

## 🎯 Components Using Data

### Dashboard Page (`dashboard/page.tsx`)

```typescript
// Line 19-20: Fetches data
const { stats, topListings, loading, error } = useDashboard(true);

// Line 72-78: Destructures stats
const { activeListings, pendingListings, rejectedListings, totalTransactions } = stats;

// Line 81-130: Shows 4 metric cards with stats
<MetricCard value={activeListings} />      // From stats.activeListings
<MetricCard value={pendingListings} />     // From stats.pendingListings
<MetricCard value={rejectedListings} />    // From stats.rejectedListings
<MetricCard value={totalTransactions} />   // From stats.totalTransactions

// Line 173-196: Recent Activity (HARDCODED - no API)
<div>💬 New inquiry on Trek Domane</div>

// Line 241-251: Top listings table
{topListings.map(listing => (      // From topListings array
  <tr>
    <td>{listing.brand} {listing.model}</td>
    <td>{listing.price}</td>
    <td>{listing.views}</td>
    <td>{listing.inquiries}</td>
    <td>{listing.status}</td>
  </tr>
))}
```

---

## 🔄 Integration Steps (When Backend Ready)

### Step 1: Backend Provides Endpoint
Backend team creates: `GET /api/seller/dashboard` returning expected JSON

### Step 2: Test Manually
```bash
# Test with curl
curl -X GET http://localhost:8080/api/seller/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"

# Should return JSON matching format above
```

### Step 3: Enable in Frontend
```bash
# Edit .env.local
NEXT_PUBLIC_MOCK_API=false

# Restart dev server
npm run dev

# Visit http://localhost:3000/dashboard
```

### Step 4: Verify
- Check Network tab in DevTools
- Should see request to `/backend/api/seller/dashboard`
- Response should have stats and topListings
- No console errors
- Page should display real data

---

## 🐛 Debugging Tips

### Check if using Mock or Real API:
1. Open DevTools → Console
2. Visit Dashboard page
3. Look for console logs:
   - If mock: No API request shown in Network tab
   - If real: Request appears in Network tab to `/backend/api/seller/dashboard`

### If Data Doesn't Match:
1. Check `.env.local` has correct setting
2. Clear browser cache (Ctrl+Shift+Delete)
3. Restart dev server (npm run dev)

### If Error Appears:
1. Check Network tab → Response
2. Compare with expected format above
3. Check browser console for validation errors
4. Check backend logs for errors

---

## 📁 Files Changed Today

### ✅ Fixed (Header Component)
- `app/components/Header.tsx` (Line 44, 49)
  - Removed BUYER/SELLER from restricted roles
  - Now only ADMIN/SHIPPER/INSPECTOR are restricted
  - "Bán Xe" button now shows for BUYER and SELLER

### ✅ Updated (Listing Detail)
- `app/services/listingService.ts` (Line 268-340)
  - Updated to accept `sellerId` parameter
  - Changed endpoint to `/api/listings/detail`
  - Added validation
- `app/listings/[id]/page.tsx` (Line 14-72)
  - Added `useAuth()` hook to get `sellerId`
  - Pass both `sellerId` and `listingId` to API call
  - Fixed dependency array

### 🆕 Created Documentation
- `docs/API_INTEGRATION_GUIDE.md` (Overview of all APIs)
- `docs/DASHBOARD_API_ENDPOINTS.md` (Detailed dashboard info)
- `docs/DASHBOARD_DETAILED_ANALYSIS.md` (Complete analysis)

### ✅ Ready for API Integration
- `app/services/dashboardService.ts` (Mock already done, API ready)
  - Line 40-118: Switch between mock and real via `NEXT_PUBLIC_MOCK_API`
  - Line 89-118: Real API code already written
  - Just needs backend to provide endpoint

---

## 🚨 Important Notes

### About the Fix to Header:
**Problem:** "Bán Xe" button was hidden for all logged-in users  
**Cause:** isRestrictedRole check included BUYER and SELLER  
**Solution:** Only restrict ADMIN/SHIPPER/INSPECTOR  
**Result:** Now SELLER and BUYER can see "Bán Xe" button ✅

### About Listing Detail API:
**Status:** Already integrated ✅  
**Endpoint:** `POST /api/listings/detail`  
**Working:** Yes, just needs `sellerId` parameter  
**Used on:** `/listings/[id]` page

### About Dashboard API:
**Status:** Ready for integration ⏳  
**Endpoint:** `GET /api/seller/dashboard`  
**Mock Data:** Yes, working ✅  
**To Enable Real:** Set `NEXT_PUBLIC_MOCK_API=false`

---

## 📞 Next Steps

1. **Confirm API endpoints with backend team:**
   - [ ] `/api/seller/dashboard` endpoint exists
   - [ ] Response format matches docs
   - [ ] Authentication works with Bearer token

2. **Test integration:**
   - [ ] Set `NEXT_PUBLIC_MOCK_API=false`
   - [ ] Visit `/dashboard`
   - [ ] Check Network tab
   - [ ] Verify no errors in console

3. **Optional: Implement Recent Activity:**
   - [ ] Create API endpoint for activities
   - [ ] Update `dashboardService.ts`
   - [ ] Update `dashboard/page.tsx` to show real data

---

## 🎓 Learning Resources

- **Full API Guide:** See `docs/API_INTEGRATION_GUIDE.md`
- **Dashboard Deep Dive:** See `docs/DASHBOARD_DETAILED_ANALYSIS.md`
- **Source Code:** 
  - Mock data implementation: `app/services/dashboardService.ts`
  - Component usage: `app/dashboard/page.tsx`
  - Data hook: `app/hooks/useDashboard.ts`
  - Type definitions: `app/types/listing.ts`

---

## ✨ Summary

| Item | Status | Location |
|------|--------|----------|
| Header "Bán Xe" button | ✅ Fixed | `Header.tsx` |
| Listing Detail API | ✅ Working | `listingService.ts` |
| Dashboard Mock Data | ✅ Working | `dashboardService.ts` |
| Dashboard Real API | ⏳ Ready | `dashboardService.ts` line 89-118 |
| Documentation | ✅ Complete | `docs/` folder |

Everything is ready! Just waiting for backend to provide the endpoints.
