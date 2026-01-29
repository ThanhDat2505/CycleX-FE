# S-01 Home Screen - Documentation

## Design Resources
- **Figma Mockup:** [https://mock-branch-01543539.figma.site](https://mock-branch-01543539.figma.site)

## Screen Identity
- **Screen ID:** S-01
- **Screen Name:** Home / Listing
- **Purpose:** Public page displaying approved bike listings with pagination
- **Route:** `/` (root path)
- **Access:** Public (no authentication required)

---

## API Contract (QUAN TRỌNG NHẤT)

### Endpoint
- **Method:** `GET`
- **URL:** `/backend/api/home/listings`
- **Query Parameters:**
  - `page` (number): Page number (1-indexed)
  - `pageSize` (number): Number of items per page (default: 12)

### Request
```http
GET /backend/api/home/listings?page=1&pageSize=12
```

### Response (FE sử dụng)
```json
{
  "items": [
    {
      "listing_id": 123,
      "title": "Giant Escape 3 2022",
      "brand": "Giant",
      "model": "Escape 3",
      "price": 8500000,
      "thumbnail_url": "https://...",
      "views_count": 120
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 12,
    "total": 120
  }
}
```

**Note:** API contract may change. Service layer (`listingService.ts`) centralizes API calls for easy updates.

---

## Business Rule đã áp dụng

### BR-H01 – Status listing hiển thị
✅ **Implemented:** Home only displays listings with `status = APPROVED`
- **How:** Backend filters listings before sending to FE
- **FE responsibility:** Trust and display data as-is

### BR-H02 – Lọc listing
✅ **Implemented:** Backend pre-filters listings by status
- **How:** FE does NOT perform client-side filtering
- **Code:** No filter logic in `page.tsx` or components

### BR-H03 – Dữ liệu Home
✅ **Implemented:** FE trusts API data without modification
- **How:** Direct mapping from API response to component props
- **Code:** No data transformation or joining in FE

### BR-H04 – Tăng view count
✅ **Implemented:** `views_count` only increments on Listing Detail page
- **How:** No view count API call on Home page
- **Code:** Only navigation to detail page, no view tracking

### BR-H05 – FE & view count
✅ **Implemented:** FE can call view count API, but only on Detail page
- **How:** Home page does NOT call view increment API
- **Code:** `handleListingClick` only navigates, doesn't increment views

---

## State of Object liên quan

### State H1 – Approved
- **Condition:** `status = APPROVED`
- **Allowed Actions:**
  - ✅ Display on Home
  - ✅ View Detail (navigate to `/listing/[id]`)
  - ✅ Increment view count (on Detail page only)

### State H2 – Other status
- **Condition:** `status ≠ APPROVED`
- **Forbidden Actions:**
  - ❌ Display on Home (filtered by BE)

### State Transition
```
(APPROVED) → Click Listing → Navigate to Detail → views_count++
```
**Note:** View count increment happens on Detail page, NOT on Home

---

## Navigation

### From Home
- **Click Listing Card** → `/listing/[listing_id]` (S-32 Listing Detail)
- **Click Logo** → `/` (refresh Home)
- **Click Login** → `/login` (S-02 Login)
- **Click Register** → `/register` (S-03 Register)

### To Home
- Any page can navigate back to Home via Header logo

---

## Authentication & Authorization

### Access Level
- **Public:** No authentication required
- **Guest users:** Can view all listings
- **Logged-in users:** Can view all listings (same as guest)

### Header Behavior
- **Not logged in:** Shows "Login" + "Register" buttons
- **Logged in:** Shows "Profile" + "Logout" buttons

### Authentication Check
- Uses `localStorage.getItem('authToken')` to detect login state
- No redirect to login page (Home is public)

---

## UI / UX Constraints

### Layout
- **Grid View:** Responsive grid layout
  - Desktop (≥1024px): 3 columns
  - Tablet (768-1024px): 2 columns
  - Mobile (<768px): 1 column

### Listing Card Display
Each card shows:
1. **Thumbnail Image** (400x300px placeholder if unavailable)
2. **Title** (Brand + Model)
3. **Price** (formatted in VND currency)
4. **Views Count** (👁 icon + number)

### Pagination
- **Type:** Previous/Next buttons
- **Page Size:** 12 items per page
- **Display:** "Page X of Y"
- **Disabled States:**
  - Previous button disabled on page 1
  - Next button disabled on last page
- **Behavior:** Scroll to top when changing pages

### States
- **Loading:** Spinner animation while fetching data
- **Error:** Red alert box with error message
- **Empty:** "No listings available" message (if 0 results)

### No Search/Filter
❌ **NOT implemented:** Search and filter are S-30 (future feature)

---

## What this screen DOES NOT do (rất quan trọng)

### ❌ Does NOT Filter Client-Side
- No search box
- No filter dropdowns (price, brand, model)
- No sort options (price, date, popularity)
- **Reason:** BE handles all filtering (BR-H02)

### ❌ Does NOT Increment View Count
- No API call to increment `views_count` on Home
- **Reason:** View count only increments on Detail page (BR-H04)

### ❌ Does NOT Modify Listing Data
- No data transformation
- No joining with other data sources
- No client-side calculations
- **Reason:** FE trusts API data (BR-H03)

### ❌ Does NOT Require Authentication
- No redirect to login
- No protected routes
- No role-based access control
- **Reason:** Home is public (all users can view)

### ❌ Does NOT Show Non-Approved Listings
- No draft listings
- No pending listings
- No rejected listings
- **Reason:** BE filters to APPROVED only (BR-H01)

---

## Dependency với screen khác

### Depends On
- **S-02 Login:** Header "Login" button navigates to login page
- **S-03 Register:** Header "Register" button navigates to register page

### Used By
- **S-32 Listing Detail:** Click listing card navigates to detail page
- **All screens:** Header logo can navigate back to Home

### Future Dependencies
- **S-30 Search & Filter:** Will add search/filter UI to Home (not implemented yet)

---

## Files Created/Modified

### Type Definitions
- [`app/types/listing.ts`](file:///d:/FPT/Ky5/SWP391/P/CycleX-FE/app/types/listing.ts) - Listing interfaces

### Service Layer
- [`app/services/listingService.ts`](file:///d:/FPT/Ky5/SWP391/P/CycleX-FE/app/services/listingService.ts) - API calls with mock mode

### Components (Reusable)
- [`app/components/ListingCard.tsx`](file:///d:/FPT/Ky5/SWP391/P/CycleX-FE/app/components/ListingCard.tsx) - Single listing card
- [`app/components/ListingGrid.tsx`](file:///d:/FPT/Ky5/SWP391/P/CycleX-FE/app/components/ListingGrid.tsx) - Responsive grid
- [`app/components/Pagination.tsx`](file:///d:/FPT/Ky5/SWP391/P/CycleX-FE/app/components/Pagination.tsx) - Pagination controls
- [`app/components/Header.tsx`](file:///d:/FPT/Ky5/SWP391/P/CycleX-FE/app/components/Header.tsx) - Navigation header

### Pages
- [`app/page.tsx`](file:///d:/FPT/Ky5/SWP391/P/CycleX-FE/app/page.tsx) - Home page implementation

### Configuration
- [`.env.local`](file:///d:/FPT/Ky5/SWP391/P/CycleX-FE/.env.local) - Environment variables (mock mode enabled)

---

## Testing Instructions

### Mock Mode Testing (Current)
1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Open browser:**
   - Navigate to `http://localhost:3000`

3. **Verify:**
   - ✅ Listings display in grid (3 columns on desktop)
   - ✅ Each card shows: image, title, price, views
   - ✅ Pagination shows "Page 1 of 2" (24 mock items / 12 per page)
   - ✅ Click "Next" → Goes to page 2
   - ✅ Click "Previous" → Goes back to page 1
   - ✅ Click listing card → Navigates to `/listing/[id]` (will show 404 until S-32 is implemented)
   - ✅ Header shows "Login" + "Register" (if not logged in)
   - ✅ Responsive: Resize browser to test tablet/mobile layouts

### Real API Testing (When BE is ready)
1. **Update environment:**
   ```bash
   # In .env.local
   NEXT_PUBLIC_USE_MOCK_API=false
   ```

2. **Verify API contract:**
   - Endpoint: `GET /backend/api/home/listings?page=1&pageSize=12`
   - Response matches expected structure

3. **Test with real data:**
   - Same verification steps as mock mode
   - Verify only APPROVED listings appear

---

## Known Limitations

1. **No Detail Page Yet:** Clicking listing navigates to `/listing/[id]` which shows 404 until S-32 is implemented
2. **No Search/Filter:** Planned for S-30 (future)
3. **Mock Images:** Using placeholder images from picsum.photos
4. **No Profile Page:** Header "Profile" button navigates to `/profile` (not implemented yet)

---

## Maintainability Notes

### Easy to Modify
- **Change API endpoint:** Edit `listingService.ts` only
- **Change card layout:** Edit `ListingCard.tsx` only
- **Change grid columns:** Edit `ListingGrid.tsx` Tailwind classes
- **Change page size:** Update `pageSize` parameter in `page.tsx`
- **Add search/filter:** Add new components, reuse `ListingGrid` + `ListingCard`

### Component Reusability
- `ListingCard` → Reusable in S-32, S-30, favorites, etc.
- `Pagination` → Reusable in any paginated list
- `Header` → Reusable across all pages

### Type Safety
- All API responses typed with TypeScript
- Props typed for all components
- Easy refactoring with IDE support
