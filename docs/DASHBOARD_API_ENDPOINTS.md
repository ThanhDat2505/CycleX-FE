# Dashboard (S-10) - API Endpoints Required

## 📋 Overview
Dashboard page displays seller statistics and top performing listings. Currently uses MOCK data when `NEXT_PUBLIC_MOCK_API=true` in `.env.local`.

---

## 🔗 API Endpoints

### 1. **GET /api/seller/dashboard** (Main Dashboard Data)
**Location in Code:** `app/services/dashboardService.ts` → `getDashboardData()`

**Status:** ⚠️ MOCK DATA (Need Real API)

**Authentication:** ✅ Required - Bearer token in Authorization header

**Request:**
```typescript
GET /backend/api/seller/dashboard
Headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`
}
```

**Response Format (SellerDashboardResponse):**
```json
{
  "stats": {
    "activeListings": 2,              // Count of APPROVED listings
    "pendingListings": 1,             // Count of PENDING/REVIEWING listings
    "rejectedListings": 1,            // Count of REJECTED listings
    "totalTransactions": 5,           // Total completed sales/transactions
    "totalViews": 1245,               // Sum of all views across all listings
    "newInquiries": 3                 // Count of unread inquiries
  },
  "topListings": [
    {
      "id": 1,                        // listingId
      "brand": "Giant",
      "model": "Escape 3",
      "price": 8500000,               // Price in VND
      "views": 120,                   // Views for this specific listing
      "inquiries": 2,                 // Inquiries for this listing
      "status": "ACTIVE"              // ACTIVE | PENDING | REJECTED | DRAFT | etc.
    },
    // ... more listings (typically top 5-10 by views)
  ]
}
```

**Expected Behavior:**
- Returns **top performing listings** (sorted by views DESC)
- Statistics aggregated from all seller's listings
- User must be authenticated (BUYER or SELLER role)
- ADMIN, SHIPPER, INSPECTOR roles should be redirected

**Error Handling:**
- 401: Unauthorized (no token or invalid token) → Redirect to `/login`
- 404: Not found (seller not found)
- 500: Server error → Show error banner with retry button

---

## 🎯 How to Enable Real API

### Step 1: Update `.env.local`
```env
NEXT_PUBLIC_MOCK_API=false
```

### Step 2: Code is Ready!
Once environment variable is set to `false`, the code automatically:
1. Uses real API endpoint: `/backend/api/seller/dashboard`
2. Includes authentication token from localStorage
3. Validates all response fields
4. Shows error message if API fails

---

## 📊 Dashboard Page Components

| Component | Data Source | Status |
|-----------|-------------|--------|
| Metrics Cards (4 cards) | `stats` object | ✅ Ready |
| Recent Activity (hardcoded) | Static data in JSX | ❌ No API yet |
| Quick Actions (buttons) | Static navigation | ✅ Ready |
| Top Performing Listings (table) | `topListings` array | ✅ Ready |

### Recent Activity (Line 173-196 in dashboard/page.tsx)
**Status:** ⚠️ Hardcoded mock data - No API endpoint yet

**Mock Data Items:**
```
- "💬 New inquiry on Trek Domane"
- "👁️ Listing viewed 25 times"
- "✅ New sale completed"
- "⭐ 5-star review received"
```

**To Enable:**
1. Backend should provide: `GET /api/seller/activities?limit=4`
2. Response format:
```json
{
  "activities": [
    {
      "id": 1,
      "type": "INQUIRY",        // INQUIRY | VIEW | SALE | REVIEW
      "title": "New inquiry on Trek Domane",
      "description": "Customer asked about shipping costs",
      "timestamp": "2024-02-01T10:30:00Z",
      "icon": "💬"
    }
  ]
}
```

---

## 🔐 Authentication Flow

1. **User logs in** → `authToken` + `userData` stored in localStorage
2. **Dashboard page loads** → `useAuth()` hook retrieves token
3. **getDashboardData()** called → Includes token in Authorization header
4. **Response validated** → Type checking for all fields
5. **Data displayed** → Stats cards and table populated

**Token Format:** `Authorization: Bearer eyJhbGciOiJIUzI1NiIs...`

---

## ✅ Validation Checklist

The frontend validates all API responses:

```typescript
✅ Response exists and is JSON object
✅ stats object exists
✅ stats.activeListings is number
✅ stats.pendingListings is number
✅ stats.rejectedListings is number
✅ stats.totalTransactions is number
✅ stats.totalViews is number
✅ stats.newInquiries is number
✅ topListings is array
✅ Each listing has: id, brand, model, price, views, inquiries, status
```

---

## 🧪 Testing the API

### Test with MOCK Data (Development):
```bash
# In .env.local
NEXT_PUBLIC_MOCK_API=true

# Run development server
npm run dev
# Visit http://localhost:3000/dashboard
# Should show mock data without API calls
```

### Test with Real API (when ready):
```bash
# In .env.local
NEXT_PUBLIC_MOCK_API=false

# Run development server
npm run dev
# Open browser DevTools → Network tab
# Visit http://localhost:3000/dashboard
# Should show request to `/backend/api/seller/dashboard`
# Check response format matches expected schema
```

---

## 📝 Files to Update

### dashboardService.ts
- Lines 40-132: Main `getDashboardData()` function
- Replace mock data block when API is ready
- Keep validation logic (lines 98-118)

### dashboard/page.tsx
- Lines 19-20: Calls `useDashboard()` hook
- Lines 75-78: Displays stats from API
- Lines 173-196: Recent Activity (currently hardcoded)

### useDashboard.ts
- Lines 37-43: Calls `getDashboardData()`
- No changes needed when API is ready

---

## 🚀 Integration Steps

1. Backend provides endpoint: `GET /api/seller/dashboard`
2. Test endpoint manually (Postman/curl) with valid token
3. Set `NEXT_PUBLIC_MOCK_API=false` in `.env.local`
4. Visit `/dashboard` - should load real data
5. Check browser console for validation errors
6. If errors occur, compare response to expected schema above

---

## 📞 Questions?

If backend endpoint differs from expected format:
1. Update `DashboardStats` interface (line 14-21)
2. Update `TopListing` interface (line 23-30)
3. Update response validation (lines 98-118)
4. Update this documentation
