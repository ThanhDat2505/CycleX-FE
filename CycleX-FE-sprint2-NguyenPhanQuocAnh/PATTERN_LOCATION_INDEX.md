# Quick Reference: Payload Patterns Location Index

## 🎯 Pattern 1: Payload Construction `const payload = { ...formData, ... }`

| # | File | Function | Lines | Code Snippet | Purpose |
|---|------|----------|-------|--------------|---------|
| 1 | app/services/myListingsService.ts | createListing | 176-177 | `const { sellerId, ...rest } = payload;` `const response = await apiCallPOST(\`...\`, { ...rest, saveDraft: false });` | Creates listing for review (PENDING) |
| 2 | app/services/myListingsService.ts | saveDraft | 227-228 | `const { sellerId, ...rest } = payload;` `const response = await apiCallPOST(\`...\`, { ...rest, saveDraft: true });` | Saves listing as draft (DRAFT) |
| 3 | app/services/myListingsService.ts | updateDraft | 248, 276 | `export async function updateDraft(listingId: number, payload: Partial<CreateListingPayload>)` `const response = await apiCallPUT(\`...\`, payload);` | Updates existing draft |
| 4 | app/seller/create-listing/hooks/useCreateListing.ts | getPayload | 272-289 | Returns CreateListingPayload with: `sellerId, title, description, bikeType, brand, model, manufactureYear, condition, price, locationCity, imageUrls` | Maps formData to API payload structure |
| 5 | app/seller/create-listing/hooks/useCreateListing.ts | handleNext | 144-145 | `const payload = getPayload();` `const draft = await saveDraft(payload);` | Creates draft on Step 1 complete |
| 6 | app/seller/create-listing/hooks/useCreateListing.ts | handleNext | 159 | `const payload = getPayload();` | Reconstructs payload with imageUrls after upload |
| 7 | app/seller/create-listing/hooks/useCreateListing.ts | handleSaveDraft | 309-310 | `const payload = getPayload();` `await saveDraft(payload);` | Manual draft save button |
| 8 | app/services/sellerService.ts | createSellerListing | 165-169 | `const payload = { ...data, sellerId };` `return axiosInstance.post(\`...\`, payload);` | ⚠️ DEPRECATED - Uses axios (violates CLAUDE.md) |

---

## 🎯 Pattern 2: localStorage.getItem("userData")

| # | File | Function/Location | Line | Code Snippet | Purpose | Returns |
|---|------|-------------------|------|--------------|---------|---------|
| 1 | app/services/authService.ts | getUser | 284 | `const userData = localStorage.getItem('userData');` `return userData ? JSON.parse(userData) : null;` | Get user object from storage | User \| null |
| 2 | app/hooks/useAuth.ts | useEffect (init) | 32 | `const userData = localStorage.getItem('userData');` | Restore auth state on mount | String \| null (parsed) |
| 3 | app/hooks/useAuth.ts | useEffect (error) | 43-44 | `localStorage.removeItem('authToken');` `localStorage.removeItem('userData');` | Clear auth on invalid token | void |
| 4 | app/hooks/useAuth.ts | logout | 60-61 | `localStorage.removeItem('authToken');` `localStorage.removeItem('userData');` | User logout | void |
| 5 | app/services/axiosConfig.ts | Request interceptor | 23 | `const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;` | Get JWT token for Authorization header | String \| null |

---

## 🎯 Pattern 3: saveDraft Flag Usage

| # | File | Function | Line | Pattern | Flag | Status | Purpose |
|---|------|----------|------|---------|------|--------|---------|
| 1 | app/services/myListingsService.ts | createListing | 177 | `{ ...rest, saveDraft: false }` | `false` | PENDING | Submit for review |
| 2 | app/services/myListingsService.ts | saveDraft | 228 | `{ ...rest, saveDraft: true }` | `true` | DRAFT | Save as draft |

---

## 📍 Complete File Locations

### Files With "payload" + "..." Pattern
```
📄 app/services/myListingsService.ts
   ├─ Line 176-177: createListing destructuring
   ├─ Line 227-228: saveDraft destructuring
   └─ Line 248-276: updateDraft call

📄 app/seller/create-listing/hooks/useCreateListing.ts
   ├─ Line 272-289: getPayload construction
   ├─ Line 144-145: Draft creation
   ├─ Line 159: Image upload draft
   ├─ Line 309-310: Manual save draft
   └─ Line 320-339: Submit draft

📄 app/services/sellerService.ts
   └─ Line 165-169: Alternative createSellerListing (⚠️ DEPRECATED)
```

### Files With localStorage Usage
```
📄 app/services/authService.ts
   └─ Line 284: getUser() retrieves userData

📄 app/hooks/useAuth.ts
   ├─ Line 32-33: Init on mount
   ├─ Line 43-44: Clear on error
   └─ Line 60-61: Logout function

📄 app/services/axiosConfig.ts
   └─ Line 23: Get token for request header
```

---

## 🔄 Data Flow Visualization

### CREATE LISTING FLOW
```
User Input (formData)
    ↓
useCreateListing.getPayload() — Lines 272-289
    ↓ (maps category→bikeType, location→locationCity)
CreateListingPayload
    ↓
useCreateListing.handleNext() — Lines 144-145
    ↓
myListingsService.saveDraft(payload) — Line 228
    ↓ (adds saveDraft: true)
POST /api/seller/{sellerId}/listings/create
    ↓ (with { ...rest, saveDraft: true })
Returns: Listing object with {id, status: "DRAFT"}

LATER: useCreateListing.handleSubmit() — Lines 320-339
    ↓ (uses listingId from draft, doesn't create new payload)
myListingsService.submitDraft(listingId) — Line 336
    ↓
POST /api/seller/listings/{listingId}/submit
    ↓
Returns: Listing object with {status: "PENDING"}
```

### AUTH FLOW WITH localStorage
```
Login
    ↓
localStorage.setItem('userData', JSON.stringify(user))
localStorage.setItem('authToken', token)
    ↓
Browser Reload
    ↓
useAuth.useEffect() — Line 32-33
    ↓
const userData = localStorage.getItem('userData')
const token = localStorage.getItem('authToken')
    ↓
User state restored

Logout / Auth Error
    ↓
authService.logout() OR useAuth error handler — Lines 43-44, 60-61
    ↓
localStorage.removeItem('userData')
localStorage.removeItem('authToken')
    ↓
User cleared
```

---

## 🔗 Type Definitions

### CreateListingPayload (app/services/myListingsService.ts, Line 37)
```typescript
export interface CreateListingPayload {
    sellerId: number;
    title: string;
    description?: string;
    bikeType: string;           // From form: category
    brand: string;
    model: string;
    manufactureYear?: number;   // From form: year (Number)
    condition?: string;
    usageTime?: string;
    reasonForSale?: string;
    price: number;              // From form: Number(price)
    locationCity: string;       // From form: location
    pickupAddress?: string;
    imageUrls?: string[];
    // NOTE: saveDraft is NOT in interface but added in API calls
}
```

### ListingFormData (app/seller/create-listing/types.ts)
```typescript
export interface ListingFormData {
    title: string;
    brand: string;
    model: string;
    category: string;           // Maps to bikeType
    condition: string;
    year: string;               // Maps to manufactureYear (Number)
    price: string;              // Maps to price (Number)
    location: string;           // Maps to locationCity
    description: string;
    shipping: boolean;
}
```

**Key Mapping**:
- `formData.category` → `payload.bikeType`
- `formData.location` → `payload.locationCity`
- `formData.year` (string) → `payload.manufactureYear` (Number)
- `formData.price` (string) → `payload.price` (Number)

---

## ⚠️ ISSUES FOUND

| Issue # | Severity | Location | Description | Impact |
|---------|----------|----------|-------------|--------|
| 1 | Medium | app/services/sellerService.ts | Uses axios instead of fetch - violates CLAUDE.md rules | Alternative flow ignored; inconsistent error handling |
| 2 | Low | app/services/axiosConfig.ts | Multiple keys for token: 'token' vs 'authToken' | Potential key mismatch; useAuth uses 'authToken' but axiosConfig uses 'token' |
| 3 | Low | app/services/myListingsService.ts | CreateListingPayload type missing saveDraft field | Type checking doesn't validate saveDraft requirement |
| 4 | Low | app/services/transactionService.ts | Confusing parameter signature for createPurchaseRequest | Parameter mismatch with usage - productId vs full data object |

---

## 📋 QUICK CHECKLIST FOR CODE REVIEW

- [ ] All payload construction uses `getPayload()` from useCreateListing
- [ ] All draft saves pass `saveDraft: true` flag
- [ ] All final submissions use existing listingId (not new payload)
- [ ] localStorage access guarded with `typeof window !== 'undefined'`
- [ ] All textarea/forms using controlled components with `useState`
- [ ] All API calls wrapped in try-catch with proper error handling
- [ ] All useEffects return cleanup functions where needed
- [ ] Form validation happens before payload construction
- [ ] Data from localStorage validated before use (Not null checks)
- [ ] No hardcoded 'token' vs 'authToken' key mismatch

---

## 🔍 SEARCH COMMAND REFERENCE

To find these patterns yourself:
```bash
# Find payload construction
grep -rn "const.*{.*\.\.\..*}" app/

# Find localStorage.getItem
grep -rn "localStorage.getItem" app/

# Find saveDraft usage
grep -rn "saveDraft" app/

# Find specific pattern in files
grep -rn "saveDraft.*true\|saveDraft.*false" app/services/
```

---

Last Updated: 2026-03-05
Total Patterns Found: 12 files
Total Code Locations: 20+ distinct locations
