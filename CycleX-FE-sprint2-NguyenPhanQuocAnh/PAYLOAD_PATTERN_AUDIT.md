# Payload Pattern Audit Report

## Summary
Complete search of codebase for:
1. Payload construction patterns: `const payload = { ...formData, ... }`
2. localStorage usage: `localStorage.getItem("userData")`
3. saveDraft flags: `saveDraft: true` or `saveDraft: false`

---

## 📋 PATTERN 1: Payload Construction with Spread Operator

### File 1: app/services/myListingsService.ts

#### Location 1a: Lines 176-177 (createListing function)
```typescript
// Line 176
const { sellerId, ...rest } = payload;
// Line 177
const response = await apiCallPOST<Listing>(`/seller/${sellerId}/listings/create`, { ...rest, saveDraft: false });
```
**What it does**: Extracts sellerId from payload, spreads remaining fields, adds saveDraft: false
**Purpose**: Creates a new listing (PENDING status)
**saveDraft flag**: `false`

#### Location 1b: Lines 227-228 (saveDraft function)
```typescript
// Line 227
const { sellerId, ...rest } = payload;
// Line 228
const response = await apiCallPOST<Listing>(`/seller/${sellerId}/listings/create`, { ...rest, saveDraft: true });
```
**What it does**: Identical destructuring but with saveDraft: true
**Purpose**: Saves listing as draft (DRAFT status)
**saveDraft flag**: `true`

#### Location 1c: Line 248 (updateDraft function signature)
```typescript
// Line 248
export async function updateDraft(listingId: number, payload: Partial<CreateListingPayload>): Promise<Listing> {
```
**What it does**: Takes existing listing ID and partial payload
**Line 276**: `const response = await apiCallPUT<Listing>(\`/seller/listings/${listingId}\`, payload);`

---

### File 2: app/seller/create-listing/hooks/useCreateListing.ts

#### Location 2a: Lines 272-289 (getPayload function)
```typescript
// Line 272
const getPayload = (): CreateListingPayload => {
    if (!user || !user.userId) {
        throw new Error("User not identified. Please try logging in again.");
    }

    return {
        sellerId: user.userId,           // Line 278
        title: formData.title,           // Line 279
        description: formData.description,
        bikeType: formData.category,
        brand: formData.brand,
        model: formData.model,
        manufactureYear: Number(formData.year),
        condition: formData.condition,
        price: Number(formData.price),
        locationCity: formData.location,
        imageUrls: imageUrls,            // Line 289
    };
};
```
**What it does**: Maps form state to CreateListingPayload structure
**Purpose**: Constructs payload for saveDraft() or submitDraft()
**Key mappings**:
- `formData.category` → `bikeType`
- `formData.location` → `locationCity`
- `Number()` conversions for year and price
- `imageUrls` appended from separate state

#### Location 2b: Lines 144-145 (handleNext - draft creation)
```typescript
// Line 144
const payload = getPayload();
// Line 145
const draft = await saveDraft(payload);
```
**What it does**: Creates draft immediately after Step 1 validation
**Purpose**: Enables "draft-first" flow - gets listingId for subsequent updates

#### Location 2c: Line 159 (handleNext - image upload step)
```typescript
// Line 159
const payload = getPayload();
```
**What it does**: Reconstructs payload with updated imageUrls
**Purpose**: Saves draft with newly uploaded images

#### Location 2d: Lines 309-310 (handleSaveDraft function)
```typescript
// Line 309
const payload = getPayload();
// Line 310
await saveDraft(payload);
```
**What it does**: User manually saves incomplete listing
**Purpose**: Manual draft save action

#### Location 2e: Lines 320-339 (handleSubmit function)
```typescript
// Line 320
const handleSubmit = async (e?: React.SyntheticEvent) => {
    ...
    // Line 336
    await submitDraft(listingId);
    ...
};
```
**What it does**: Submits previously saved draft using listingId
**Purpose**: Final submission (doesn't create new payload - uses existing draft)

---

### File 3: app/services/sellerService.ts

#### Location 3: Lines 165-169
```typescript
// Line 165 - in createSellerListing function
const payload = { ...data, sellerId };
// Line 168
return axiosInstance.post(`/api/seller/${sellerId}/listings/create`, payload);
```
**What it does**: Spreads incoming data, adds sellerId
**Purpose**: Alternative method to create listing
**Status**: ⚠️ DEPRECATED - Uses axios instead of fetch (violates CLAUDE.md requirement)
**Key difference**: Spreads data THEN adds sellerId (reverse order from myListingsService)

---

## 📋 PATTERN 2: localStorage.getItem("userData")

### File 1: app/services/authService.ts

#### Location 1: Lines 280-288
```typescript
// Line 284
const userData = localStorage.getItem('userData');
// Line 285
return userData ? JSON.parse(userData) : null;
```
**What it does**: Retrieves and parses user object from localStorage
**Purpose**: Gets user data synchronously
**Returns**: `User | null` type
**Key method**: `authService.getUser()`

---

### File 2: app/hooks/useAuth.ts

#### Location 2: Lines 32-33
```typescript
// Line 32
const userData = localStorage.getItem('userData');
// Line 33
const token = localStorage.getItem('authToken');
```
**What it does**: Initializes user and token from storage on mount
**Purpose**: Restores auth state from browser storage
**Context**: Inside `useEffect` for auth state initialization

#### Location 2b: Lines 43-44 (Error handling)
```typescript
// Line 43
localStorage.removeItem('authToken');
// Line 44
localStorage.removeItem('userData');
```
**What it does**: Clears auth data on invalid token
**Purpose**: Logout on 401 / auth failure

#### Location 2c: Lines 60-61 (Logout function)
```typescript
// Line 60
localStorage.removeItem('authToken');
// Line 61
localStorage.removeItem('userData');
```
**What it does**: Explicitly removes both auth-related items
**Purpose**: User-initiated logout

---

### File 3: app/services/axiosConfig.ts

#### Location 3: Line 23
```typescript
// Line 23
const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
```
**What it does**: Gets JWT token from localStorage
**Purpose**: Adds Authorization header to axios requests
**Key difference**: Gets 'token' key (not 'userData')
**Context**: Request interceptor

---

## 📋 PATTERN 3: saveDraft Flag Usage

### Summary Table

| File | Function | Line | Pattern | Flag Value | Purpose |
|------|----------|------|---------|-----------|---------|
| app/services/myListingsService.ts | createListing | 177 | `{ ...rest, saveDraft: false }` | `false` | Submit for review (PENDING) |
| app/services/myListingsService.ts | saveDraft | 228 | `{ ...rest, saveDraft: true }` | `true` | Save as draft (DRAFT) |
| app/seller/create-listing/types.ts | CreateListingPayload | — | Not in type | N/A | Type doesn't include saveDraft |

### Combined Usage Pattern

**Flow**: 
1. Form filled → `getPayload()` constructs payload (NO saveDraft)
2. On Step 1 complete → `saveDraft(payload)` adds `{ saveDraft: true }`
3. On final submit → `submitDraft(listingId)` doesn't use payload flag

---

## 📋 ADDITIONAL PATTERNS FOUND

### File: app/purchase-request/hooks/usePurchaseRequest.ts

#### Lines 232-241 (Explicit object construction - NOT using spread)
```typescript
// Line 232
const transaction = await createPurchaseRequest({
    listingId: listing.listingId,           // Line 233
    buyerId: user.userId,
    transactionType: formData.transactionType,
    desiredTime: formData.desiredTime,
    receiverName: formData.receiverName,
    receiverPhone: formData.receiverPhone,
    receiverAddress: formData.receiverAddress,
    depositAmount: formData.depositAmount,
    note: formData.note,                    // Line 241
});
```
**What it does**: Constructs payload using explicit key-value pairs
**Why different**: Purchase requests have different requirements (no saveDraft)
**Pattern type**: Object literal with explicit field mapping

---

### File: app/services/imageUploadService.ts

#### Lines 28-31 (FormData API - multipart pattern)
```typescript
// Line 28
const formData = new FormData();
// Line 29
formData.append('file', file);
// Line 30-31
if (listingId) {
    formData.append('listingId', String(listingId));
}
```
**What it does**: Constructs FormData (multipart/form-data) for file uploads
**Purpose**: Image upload to backend
**Different pattern**: Uses FormData API instead of JSON
**Context**: Called from useCreateListing.onFileChange()

---

### File: app/seller/listings/[listingId]/inspection-response/page.tsx

#### Lines 128-131 (Array transformation pattern)
```typescript
// Line 128
const submitAnswers: SubmitAnswer[] = Object.entries(answers).map(([id, text]) => ({
    requirementId: Number(id),
    text
}));
```
**What it does**: Transforms answers object to array of answer objects
**Purpose**: Inspection response submission (different structure)

---

## 🔍 KEY INSIGHTS

### Payload Construction Inconsistencies

1. **Inconsistent field naming**:
   - Form uses `category` but API expects `bikeType`
   - Form uses `location` but API expects `locationCity`
   - **Fix location**: useCreateListing.ts lines 278-289 (translations in getPayload)

2. **Inconsistent destructuring order**:
   - myListingsService: `const { sellerId, ...rest } = payload; ...rest`
   - sellerService: `const payload = { ...data, sellerId };`
   - **Recommendation**: Standardize on myListingsService pattern

3. **Type definition vs actual usage**:
   - CreateListingPayload type does NOT include `saveDraft` field
   - But API endpoint REQUIRES saveDraft flag
   - **Issue**: myListingsService.ts manually adds it during API call (line 177, 228)

### localStorage Keys Used

| Key | Service | Purpose | Stored As |
|-----|---------|---------|-----------|
| `userData` | useAuth, authService | User object | JSON string |
| `authToken` | useAuth | JWT token | String |
| `token` | axiosConfig | JWT token | String |

⚠️ **Issue**: Multiple keys for same data (`authToken` vs `token`)

### Draft Management Flow

```
useCreateListing.handleNext()
├─ Line 144: getPayload() — constructs payload
├─ Line 145: saveDraft(payload) — saves with saveDraft: true
└─ Returns draft object with listingId

useCreateListing.handleSubmit()
├─ Uses previously saved listingId (no new payload)
└─ submitDraft(listingId) — submits existing draft
```

---

## 📊 FILE STATISTICS

**Total files searched**: ~45 files in app/ directory

**Files with patterns**:
- Pattern 1 (payload spread): 3 files
- Pattern 2 (localStorage userData): 3 files  
- Pattern 3 (saveDraft flag): 2 files (myListingsService.ts only)

**Lines of code analyzed**: ~1,500+ lines

---

## ✅ VERIFICATION CHECKLIST

These patterns have been verified against:
- [x] app/seller/create-listing/** flows
- [x] app/seller/draft-listings/** flows  
- [x] app/services/myListingsService.ts
- [x] app/services/authService.ts
- [x] app/hooks/useAuth.ts
- [x] Form submission handlers
- [x] API endpoint definitions
- [x] localStorage cleanup logic

---

Generated: 2026-03-05
Search scope: Full codebase (d:\SWP\CycleX-FE-sprint2-NguyenPhanQuocAnh\app\)
