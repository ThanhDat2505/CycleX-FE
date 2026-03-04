# API Integration Guide - CycleX Frontend

## 📌 Current Status

| Feature | Mock Data | Real API | Status |
|---------|-----------|----------|--------|
| Dashboard Stats | ✅ | ⏳ | Ready for API |
| Listing Detail | ✅ | ✅ | Integrated (POST /api/listings/detail) |
| Search/Browse | ✅ | ⏳ | Ready for API |
| Featured Bikes | ✅ | ⏳ | Ready for API |
| Recent Activity | ✅ | ❌ | No API yet |

---

## 🎯 How to Enable/Disable Mock Data

### In `.env.local`:
```env
# Use mock data (development before backend ready)
NEXT_PUBLIC_MOCK_API=true

# Use real API (when backend ready)
NEXT_PUBLIC_MOCK_API=false
```

### Code Check (all services):
```typescript
const USE_MOCK_API = process.env.NEXT_PUBLIC_MOCK_API === 'true';

if (USE_MOCK_API) {
    // Use mock data
} else {
    // Call real API
}
```

---

## 📋 API Endpoints Required

### ✅ ALREADY INTEGRATED

#### 1. **POST /api/listings/detail**
- **File:** `app/services/listingService.ts` → `getListingDetail()`
- **Status:** ✅ **INTEGRATED** (Line 268-340)
- **Endpoint:** `/backend/api/listings/detail`
- **Request:**
  ```json
  {
    "sellerId": number,
    "listingId": number
  }
  ```
- **Response:** `SellerListingResponse` (ListingDetail type)
- **Auth:** Bearer token required
- **Usage Page:** `/listings/[id]` (Listing Detail Page)

---

### ⏳ READY FOR API INTEGRATION

#### 2. **GET /api/seller/dashboard**
- **File:** `app/services/dashboardService.ts` → `getDashboardData()`
- **Status:** ⏳ **MOCK DATA** (Line 40-118)
- **Endpoint:** `/backend/api/seller/dashboard`
- **Request:** None (GET request only)
- **Response:** `SellerDashboardResponse`
  ```json
  {
    "stats": {
      "activeListings": number,
      "pendingListings": number,
      "rejectedListings": number,
      "totalTransactions": number,
      "totalViews": number,
      "newInquiries": number
    },
    "topListings": [
      {
        "id": number,
        "brand": string,
        "model": string,
        "price": number,
        "views": number,
        "inquiries": number,
        "status": string
      }
    ]
  }
  ```
- **Auth:** Bearer token required
- **Usage Page:** `/dashboard` (Dashboard Page)
- **Mock Data Location:** Line 44-78
- **Documentation:** See `docs/DASHBOARD_API_ENDPOINTS.md`

---

#### 3. **GET /api/home**
- **File:** `app/services/listingService.ts` → `getFeaturedBikes()`
- **Status:** ⏳ **MOCK DATA** (Line 18-38)
- **Endpoint:** `/backend/api/home`
- **Request:** None (GET request only)
- **Response:** Array of `HomeBike`
  ```json
  [
    {
      "listingId": number,
      "title": string,
      "price": number,
      "imageUrl": string,
      "locationCity": string,
      "viewCount": number
    }
  ]
  ```
- **Auth:** Not required (public endpoint)
- **Usage Page:** `/` (Home page - "Xe Đạp Đang Hot" section)
- **Mock Data Location:** Line 21-28

---

#### 4. **GET /api/listings/pagination**
- **File:** `app/services/listingService.ts` → `getAllListings()`
- **Status:** ⏳ **MOCK DATA** (Line 53-72)
- **Endpoint:** `/backend/api/listings/pagination`
- **Request:** None (GET request only)
- **Response:** Array of `HomeBike`
  ```json
  [
    {
      "listingId": number,
      "title": string,
      "price": number,
      "imageUrl": string,
      "locationCity": string
    }
  ]
  ```
- **Auth:** Not required (public endpoint)
- **Usage Page:** `/listings` (Listings browse page)
- **Mock Data Location:** Line 56-62

---

#### 5. **GET /api/listings/search**
- **File:** `app/services/listingService.ts` → `searchListings()`
- **Status:** ⏳ **MOCK DATA** (Line 129-220)
- **Endpoint:** `/backend/api/listings/search`
- **Request:** Query parameters
  ```
  ?keyword=search
  &minPrice=100000
  &maxPrice=50000000
  &bikeType=Xe%20%C4%90i%C3%A0%20Hình
  &brand=Giant
  &condition=new
  &page=1
  &pageSize=12
  &sortBy=newest
  ```
- **Response:** `SearchResponse`
  ```json
  {
    "items": [
      {
        "listingId": number,
        "title": string,
        "price": number,
        "imageUrl": string,
        "locationCity": string
      }
    ],
    "pagination": {
      "page": number,
      "pageSize": number,
      "total": number
    }
  }
  ```
- **Auth:** Not required (public endpoint)
- **Usage Page:** `/listings` (Search filters)
- **Mock Data Location:** Line 140-215
- **Documentation:** See code comments BR-S30-01 through BR-S30-05

---

## 📊 Mock Data Locations

| Service | File | Mock Data Block | Lines |
|---------|------|-----------------|-------|
| Featured Bikes | `listingService.ts` | `getFeaturedBikes()` | 21-28 |
| All Listings | `listingService.ts` | `getAllListings()` | 56-62 |
| Search | `listingService.ts` | `searchListings()` | 140-215 |
| Dashboard | `dashboardService.ts` | `getDashboardData()` | 44-78 |
| Listing Detail | `listingService.ts` | `getListingDetail()` | 281-313 |

---

## 🔄 How Mock Data Works

### Example: Dashboard Service

**When `NEXT_PUBLIC_MOCK_API=true`:**
```typescript
// Simulates API delay
await new Promise(resolve => setTimeout(resolve, 500));

// Returns mock data
return {
  stats: { /* mock stats */ },
  topListings: [ /* mock listings */ ]
};
```

**When `NEXT_PUBLIC_MOCK_API=false`:**
```typescript
// Makes real API call
const response = await fetch('/backend/api/seller/dashboard', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${authToken}`
  }
});

// Validates response
const data = await response.json();
// Validates structure...
return data;
```

---

## ✅ Validation in All Services

Each service validates API responses before returning:

```typescript
// Example validations (dashboard):
validateResponse(data);
validateObject(data.stats, 'stats');
validateNumber(data.stats.activeListings, 'stats.activeListings');
validateArray(data.topListings, 'topListings');

data.topListings.forEach((listing, index) => {
  validateNumber(listing.id, `topListings[${index}].id`);
  validateString(listing.brand, `topListings[${index}].brand`);
});
```

**Validation Utilities:** `app/utils/apiValidation.ts`
- `validateResponse()` - Check if response exists
- `validateObject()` - Check if field is object
- `validateArray()` - Check if field is array
- `validateNumber()` - Check if field is number
- `validateString()` - Check if field is string
- `validatePositiveNumber()` - Check if number > 0

---

## 🚀 Integration Checklist

### For Each API Endpoint:

1. **Backend Ready?**
   - [ ] Endpoint documented
   - [ ] Response format confirmed
   - [ ] Authentication method confirmed

2. **Frontend Ready?**
   - [ ] Mock data implemented ✅
   - [ ] Validation logic implemented ✅
   - [ ] Error handling implemented ✅
   - [ ] Component using the data ✅

3. **Integration Step:**
   - [ ] Update `.env.local`: `NEXT_PUBLIC_MOCK_API=false`
   - [ ] Test endpoint with Postman/curl
   - [ ] Check browser console Network tab
   - [ ] Verify response matches expected format
   - [ ] Check validation passes (no console errors)

4. **Debugging:**
   - [ ] Check `console.log()` messages in browser console
   - [ ] Check Network tab for request/response
   - [ ] Check for validation errors
   - [ ] Check error banner displays correct message

---

## 📁 File Structure

```
app/
├── services/
│   ├── listingService.ts       ← 5 functions with mock data
│   ├── dashboardService.ts     ← 1 function with mock data
│   └── authService.ts          ← Login/Register (already integrated)
├── hooks/
│   ├── useDashboard.ts         ← Calls dashboardService
│   ├── useMyListings.ts        ← For seller listings
│   └── useAuth.ts              ← Authentication
├── types/
│   └── listing.ts              ← Type definitions
├── utils/
│   └── apiValidation.ts        ← Validation functions
├── dashboard/
│   └── page.tsx                ← Uses getDashboardData()
├── listings/
│   ├── page.tsx                ← Uses searchListings(), getAllListings()
│   └── [id]/
│       └── page.tsx            ← Uses getListingDetail()
└── page.tsx                    ← Home page, uses getFeaturedBikes()
```

---

## 💡 Tips for Backend Team

1. **Response Format:** Follow exact JSON structure in "Response" sections above
2. **Field Names:** Use camelCase (not snake_case)
3. **Numbers:** Price in VND (integer), counts as integers
4. **Arrays:** Use empty array `[]` if no results, not `null`
5. **Errors:** Return appropriate HTTP status codes:
   - 400: Bad request
   - 401: Unauthorized
   - 404: Not found
   - 500: Server error
6. **Date Format:** ISO 8601 if dates included (e.g., `2024-02-01T10:30:00Z`)

---

## 🔗 Links

- **Dashboard API Details:** `docs/DASHBOARD_API_ENDPOINTS.md`
- **Services Code:** `app/services/`
- **Types:** `app/types/listing.ts`
- **Validation:** `app/utils/apiValidation.ts`
- **Environment Setup:** `.env.local` (create from `.env.example`)

---

## 📞 Questions?

Check these in order:
1. Service file comments (especially `@param` and endpoint URLs)
2. Type definitions in `app/types/listing.ts`
3. Documentation files in `docs/`
4. Code comments starting with ✅, ⚠️, or 💡
