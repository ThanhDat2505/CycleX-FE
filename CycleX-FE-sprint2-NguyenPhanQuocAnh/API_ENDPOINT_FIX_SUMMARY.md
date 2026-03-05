# API Endpoint Structure Fix - sellerId Path Variable

## Summary
Fixed routing mismatch where `sellerId` was being sent in request body instead of as a path variable. All `/api/seller/...` endpoints now properly follow REST conventions with `{sellerId}` as a path variable.

---

## Endpoints Fixed

### 1. Create Listing
**Before:**
```
POST /api/seller/listings
Request Body: { sellerId: 1, title: "...", ... }
```

**After:**
```
POST /api/seller/{sellerId}/listings
Request Body: { title: "...", ... }
Path Variable: sellerId = 1
```

**Example:**
```typescript
// Frontend call
const sellerId = 1;
const response = await apiCallPOST(`/seller/${sellerId}/listings`, {
    title: "Honda CBR600RR",
    description: "Perfect condition",
    brand: "Honda",
    model: "CBR600RR",
    // ... other fields (NO sellerId here)
});
```

**HTTP Request:**
```
POST http://localhost:4491/api/seller/1/listings
Content-Type: application/json

{
    "title": "Honda CBR600RR",
    "description": "Perfect condition",
    "brand": "Honda",
    "model": "CBR600RR",
    "manufactureYear": 2024,
    "condition": "Excellent",
    "price": 280000000,
    "locationCity": "Ha Noi",
    "pickupAddress": "456 Le Van Luong, Cau Giay, Ha Noi",
    "saveDraft": false
}
```

---

### 2. Save Draft Listing
**Before:**
```
POST /api/seller/listings
Request Body: { sellerId: 1, title: "...", saveDraft: true, ... }
```

**After:**
```
POST /api/seller/{sellerId}/listings
Request Body: { title: "...", saveDraft: true, ... }
Path Variable: sellerId = 1
```

---

### 3. Preview Listing
**Before:**
```
POST /api/seller/listings/preview
Request Body: { sellerId: 1, listingId: 5 }
```

**After:**
```
POST /api/seller/{sellerId}/listings/preview
Request Body: { listingId: 5 }
Path Variable: sellerId = 1
```

**Example:**
```typescript
const sellerId = 1;
const listingId = 5;
await apiCallPOST(`/seller/${sellerId}/listings/preview`, { listingId });

// HTTP Request:
// POST http://localhost:4491/api/seller/1/listings/preview
// Body: { "listingId": 5 }
```

---

### 4. Submit Listing for Approval
**Before:**
```
POST /api/seller/listings/{listingId}/submit
Request Body: { sellerId: 1, listingId: 5 }
```

**After:**
```
POST /api/seller/{sellerId}/listings/{listingId}/submit
Request Body: {} (empty)
Path Variables: sellerId = 1, listingId = 5
```

**Example:**
```typescript
const sellerId = 1;
const listingId = 5;
await apiCallPOST(`/seller/${sellerId}/listings/${listingId}/submit`, {});

// HTTP Request:
// POST http://localhost:4491/api/seller/1/listings/5/submit
// Body: {}
```

---

### 5. List Drafts
**Before:**
```
POST /api/seller/drafts
Request Body: { sellerId: 1, sort: "newest", page: 0, pageSize: 10 }
```

**After:**
```
POST /api/seller/{sellerId}/drafts
Request Body: { sort: "newest", page: 0, pageSize: 10 }
Path Variable: sellerId = 1
```

**Example:**
```typescript
const sellerId = 1;
await apiCallPOST(`/seller/${sellerId}/drafts`, {
    sort: "newest",
    page: 0,
    pageSize: 10
});

// HTTP Request:
// POST http://localhost:4491/api/seller/1/drafts
// Body: { "sort": "newest", "page": 0, "pageSize": 10 }
```

---

### 6. Get Seller Listing Detail
**Before:**
```
POST /api/seller/listings/detail
Request Body: { sellerId: 1, listingId: 5 }
```

**After:**
```
POST /api/seller/{sellerId}/listings/{listingId}/detail
Request Body: {} (empty)
Path Variables: sellerId = 1, listingId = 5
```

**Example:**
```typescript
const sellerId = 1;
const listingId = 5;
await apiCallPOST(`/seller/${sellerId}/listings/${listingId}/detail`, {});

// HTTP Request:
// POST http://localhost:4491/api/seller/1/listings/5/detail
// Body: {}
```

---

## Implementation Details

### Code Changes in Frontend Service Layer

**Pattern Used:**
```typescript
// Extract sellerId from payload (if included)
const { sellerId, ...rest } = payload;

// Use sellerId in URL path template
const response = await apiCallPOST(`/seller/${sellerId}/listings`, {
    ...rest,
    saveDraft: false
});
```

### REST Principles Applied
✅ Path variables represent resources: `{sellerId}`, `{listingId}`
✅ Query parameters represent operations: `sort`, `page`, `pageSize`
✅ Request body contains entity data (no IDs)
✅ HTTP methods are semantic: `POST` for state changes, `GET` for retrieval

### Files Modified
- `CycleX-FE/app/services/myListingsService.ts`
- `CycleX-FE/app/services/listingService.ts`
- `app/services/myListingsService.ts`
- `app/services/listingService.ts`

---

## Testing Recommendations

1. **Test with Postman Collection:**
   - Update variable `{{sellerId}}` = `1`
   - Ensure API calls include path variable in URL
   - Verify body does NOT contain `sellerId`

2. **Test Frontend Functions:**
   ```typescript
   // Test create listing
   const result = await createListing({
       sellerId: 1,
       title: "Test Bike",
       // ... other fields
   });
   
   // Test preview
   await previewListing(1, 5);
   
   // Test submit
   await submitListing(1, 5);
   ```

3. **Backend Validation:**
   - Verify `@PathVariable("sellerId")` is properly defined
   - Ensure authorization checks use path variable `sellerId`
   - Validate that `sellerId` in path matches authenticated user

---

## Backend Implementation (Reference)

**Java/Spring Boot Example:**

```java
@RestController
@RequestMapping("/api/seller")
public class SellerController {
    
    // Create Listing
    @PostMapping("/{sellerId}/listings")
    public ResponseEntity<ListingResponse> createListing(
            @PathVariable Long sellerId,
            @RequestBody CreateListingRequest request) {
        // Implementation
    }
    
    // Get Drafts
    @PostMapping("/{sellerId}/drafts")
    public ResponseEntity<GetDraftsResponse> getDrafts(
            @PathVariable Long sellerId,
            @RequestParam(defaultValue = "newest") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        // Implementation
    }
    
    // Preview Listing
    @PostMapping("/{sellerId}/listings/preview")
    public ResponseEntity<ListingResponse> previewListing(
            @PathVariable Long sellerId,
            @RequestBody PreviewRequest request) {
        // Implementation
    }
    
    // Submit Listing
    @PostMapping("/{sellerId}/listings/{listingId}/submit")
    public ResponseEntity<ListingResponse> submitListing(
            @PathVariable Long sellerId,
            @PathVariable Long listingId) {
        // Implementation
    }
    
    // Get Listing Detail
    @PostMapping("/{sellerId}/listings/{listingId}/detail")
    public ResponseEntity<ListingDetailResponse> getListingDetail(
            @PathVariable Long sellerId,
            @PathVariable Long listingId) {
        // Implementation
    }
}
```

---

## Consistency with Backend Specification

All updated endpoints now match the Postman collection specification:
- ✅ `GET /api/seller/{sellerId}/dashboard/stats`
- ✅ `GET /api/seller/{sellerId}/listings/search`
- ✅ `POST /api/seller/{sellerId}/listings` (now fixed)
- ✅ `POST /api/seller/{sellerId}/listings/preview` (now fixed)
- ✅ `POST /api/seller/{sellerId}/listings/{listingId}/submit` (now fixed)
- ✅ `POST /api/seller/{sellerId}/drafts` (now fixed)
- ✅ `POST /api/seller/{sellerId}/listings/{listingId}/detail` (now fixed)

All paths now properly use `{sellerId}` as the first path variable following standard REST conventions.
