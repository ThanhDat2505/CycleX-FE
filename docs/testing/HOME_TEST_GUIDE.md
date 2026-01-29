# 🧪 HOME PAGE - TEST GUIDE (S-01 Compliance)

## 📋 Test Scenarios

### ✅ **Test Case 1: Page Load - Display Listings (Happy Path)**

**Preconditions:**
- Mock API enabled: `NEXT_PUBLIC_MOCK_API=true`
- Navigate to: `http://localhost:3000/`

**Expected Behavior:**
1. ✅ Page loads successfully
2. ✅ Header displays with navigation
3. ✅ Hero section shows search bar and stats
4. ✅ Features section displays 4 feature cards
5. ✅ Listings section shows 12 bike cards (default page size)
6. ✅ Category section shows 8 categories
7. ✅ Footer displays with links
8. ✅ No error messages

**Business Rules:** BR-H01, BR-H02, BR-H03

---

### ✅ **Test Case 2: Listing Cards Display**

**What to Verify:**

**Each listing card should show:**
- ✅ Thumbnail image
- ✅ Title (brand + model + year)
- ✅ Price (formatted VND)
- ✅ Category label (if available)
- ✅ Condition tag ("Như mới" or "Đã sử dụng")
- ✅ Location + Year
- ✅ Favorite button (heart icon)
- ✅ "Chi Tiết" button

**Featured listings should show:**
- ✅ "NỔI BẬT" badge (orange)

**Discounted listings should show:**
- ✅ Discount badge "-X%" (red)
- ✅ Original price (strikethrough)
- ✅ Discounted price (orange)

**Business Rules:** BR-H01, BR-H03

---

### ✅ **Test Case 3: Pagination**

**Test 3a: First Page**
```
URL: http://localhost:3000/
Expected:
- ✅ Shows page 1 of 2
- ✅ "Previous" button disabled
- ✅ "Next" button enabled
- ✅ Displays listings 1-12
```

**Test 3b: Navigate to Page 2**
```
Action: Click "Next" button
Expected:
- ✅ URL stays at /
- ✅ Shows page 2 of 2
- ✅ "Previous" button enabled
- ✅ "Next" button disabled
- ✅ Displays listings 13-24
- ✅ Page scrolls to "Xe Đạp Đang Hot" section
```

**Test 3c: Navigate Back to Page 1**
```
Action: Click "Previous" button
Expected:
- ✅ Shows page 1 of 2
- ✅ "Previous" button disabled
- ✅ Displays listings 1-12
- ✅ Page scrolls to listings section
```

**Business Rules:** BR-H05

---

### ✅ **Test Case 4: Hero Search Bar**

**Test 4a: Empty Search**
```
Action: Click "Tìm Kiếm" without entering text
Expected:
- ✅ Redirects to /search?q=
- ✅ (Note: Search page not implemented yet, will show 404)
```

**Test 4b: Search with Keyword**
```
Action: 
1. Enter "Giant" in search box
2. Click "Tìm Kiếm"
Expected:
- ✅ Redirects to /search?q=Giant
```

**Business Rules:** BR-H04 (search is UI-only, redirects to S-30)

---

### ✅ **Test Case 5: Category Navigation**

**Test 5a: Click Category**
```
Action: Click "Xe Đạp Địa Hình" category
Expected:
- ✅ Redirects to /search?category=dia-hinh
- ✅ (Note: Search page not implemented yet, will show 404)
```

**Test 5b: All Categories Clickable**
```
Verify all 8 categories redirect correctly:
- 🏔️ Xe Đạp Địa Hình → /search?category=dia-hinh
- 🚴 Xe Đạp Đường Trường → /search?category=duong-truong
- ⚡ Xe Đạp Thể Thao → /search?category=the-thao
- 🗺️ Xe Đạp Touring → /search?category=touring
- 🏁 Xe Đạp Đua → /search?category=dua
- 📦 Xe Đạp Gấp → /search?category=gap
- 🔋 Xe Đạp Điện → /search?category=dien
- 👶 Xe Đạp Trẻ Em → /search?category=tre-em
```

---

### ✅ **Test Case 6: Header Navigation**

**Test 6a: Guest User - "Mua Xe"**
```
Action: Click "Mua Xe" in header
Expected:
- ✅ Redirects to /search
```

**Test 6b: Guest User - "Bán Xe"**
```
Action: Click "Bán Xe" in header
Expected:
- ✅ Redirects to /login?returnUrl=/create-listing
```

**Test 6c: Logged In User - "Bán Xe"**
```
Precondition: User logged in
Action: Click "Bán Xe" in header
Expected:
- ✅ Redirects to /create-listing
```

**Test 6d: "Cẩm Nang"**
```
Action: Click "Cẩm Nang" in header
Expected:
- ✅ Redirects to /guide
- ✅ (Note: Guide page not implemented, will show 404)
```

**Business Rules:** Auth flow integration

---

### ✅ **Test Case 7: Footer Navigation**

**Test 7a: "Trang Chủ" When Already on Home**
```
Precondition: On home page (/)
Action: Click "Trang Chủ" in footer
Expected:
- ✅ Stays on /
- ✅ Scrolls to Hero section (smooth scroll)
```

**Test 7b: "Trang Chủ" From Other Page**
```
Precondition: On /login page
Action: Click "Trang Chủ" in footer
Expected:
- ✅ Redirects to /
```

**Test 7c: Footer Links**
```
Verify all footer links work:
- Trang Chủ → / (or scroll to hero)
- Mua Xe → /search
- Bán Xe → /sell (with auth check)
- Cẩm Nang → /guide
```

---

### ✅ **Test Case 8: Listing Card Interactions**

**Test 8a: Click "Chi Tiết" Button**
```
Action: Click "Chi Tiết" on any listing card
Expected:
- ✅ Redirects to /listing/{id}
- ✅ (Note: Detail page not implemented, will show 404)
```

**Test 8b: Click Favorite Button**
```
Action: Click heart icon on listing card
Expected:
- ✅ Heart icon toggles filled/unfilled
- ✅ (Note: No backend save yet, state only)
```

**Business Rules:** BR-H04 (views_count only increments on detail page)

---

### ✅ **Test Case 9: Responsive Design**

**Test 9a: Desktop (≥1024px)**
```
Expected:
- ✅ Header shows full navigation
- ✅ Listings grid: 3 columns
- ✅ Categories grid: 4 columns
- ✅ Footer: 4 columns
```

**Test 9b: Tablet (768px - 1023px)**
```
Expected:
- ✅ Header shows full navigation
- ✅ Listings grid: 2 columns
- ✅ Categories grid: 4 columns
- ✅ Footer: 4 columns
```

**Test 9c: Mobile (<768px)**
```
Expected:
- ✅ Header shows hamburger menu
- ✅ Listings grid: 1 column
- ✅ Categories grid: 2 columns
- ✅ Footer: 1 column
```

---

### ✅ **Test Case 10: Loading States**

**Test 10a: Initial Load**
```
Expected:
- ✅ Shows loading spinner while fetching
- ✅ No listings displayed during load
- ✅ Spinner disappears after data loads
```

**Test 10b: Page Change Loading**
```
Action: Click "Next" to go to page 2
Expected:
- ✅ Shows loading spinner
- ✅ Previous listings cleared
- ✅ New listings appear after load
```

---

### ❌ **Test Case 11: Error Handling**

**Test 11a: API Error Simulation**
```
Setup: Modify mock to throw error
Expected:
- ✅ Shows error message: "Failed to load listings. Please try again later."
- ✅ No listings displayed
- ✅ No pagination shown
- ✅ Error message in red box
```

---

## 📊 **Test Coverage Matrix**

| Business Rule | Test Case | Status |
|---------------|-----------|--------|
| BR-H01: Only APPROVED listings | TC-1, TC-2 | ✅ |
| BR-H02: No client-side filtering | TC-1 | ✅ |
| BR-H03: Trust API data | TC-1, TC-2 | ✅ |
| BR-H04: Views count (detail only) | TC-8 | ✅ |
| BR-H05: Pagination | TC-3 | ✅ |
| Auth integration | TC-6 | ✅ |
| Navigation | TC-4, TC-5, TC-6, TC-7 | ✅ |
| Responsive design | TC-9 | ✅ |
| Error handling | TC-11 | ✅ |

**Coverage: 9/9 = 100%** ✅

---

## 🚀 **How to Test**

### **Setup:**
1. Enable mock mode:
   ```bash
   # .env.local
   NEXT_PUBLIC_MOCK_API=true
   ```

2. Start dev server:
   ```bash
   pnpm run dev
   ```

3. Navigate to: `http://localhost:3000/`

### **Test Execution:**
1. Run each test case above
2. Verify expected behavior
3. Check browser console for errors
4. Test on different screen sizes

### **Verification Checklist:**
- [ ] TC-1: Page loads with all sections
- [ ] TC-2: Listing cards display correctly
- [ ] TC-3: Pagination works (next/prev/scroll)
- [ ] TC-4: Hero search redirects
- [ ] TC-5: Category navigation works
- [ ] TC-6: Header navigation (auth flow)
- [ ] TC-7: Footer navigation (scroll/redirect)
- [ ] TC-8: Listing interactions (detail/favorite)
- [ ] TC-9: Responsive on all devices
- [ ] TC-10: Loading states show
- [ ] TC-11: Error handling works

---

## 📝 **Mock Data Summary**

**Current Mock Setup:**
- Total listings: 24
- Page size: 12
- Total pages: 2
- Featured: Every 4th listing (6 total)
- Discounted: Every 3rd listing (8 total)
- Categories: 8 types
- Conditions: Alternating new/used

**Sample Listing Structure:**
```typescript
{
  listing_id: 1,
  title: "Giant Escape 3 2020",
  brand: "Giant",
  model: "Escape 3",
  price: 8500000,
  thumbnail_url: "...",
  views_count: 245,
  category: "Xe Đạp Địa Hình",
  condition: "new",
  location: "Hà Nội",
  year: 2020,
  is_featured: false,
  discount_percentage: undefined,
  original_price: undefined
}
```

---

## ✅ **Success Criteria**

All test cases must pass:
- ✅ All sections render correctly
- ✅ Listings display with correct data
- ✅ Pagination works and scrolls
- ✅ Navigation redirects correctly
- ✅ Auth flow integrated
- ✅ Responsive on all devices
- ✅ Loading/error states work
- ✅ No TypeScript errors
- ✅ No console errors
- ✅ 100% S-01 compliance

---

## 🔄 **Integration with Other Screens**

| From Home | To Screen | Status |
|-----------|-----------|--------|
| Hero search | S-30 Search | ⬜ Not implemented |
| Category click | S-30 Search | ⬜ Not implemented |
| "Mua Xe" | S-30 Search | ⬜ Not implemented |
| "Bán Xe" (guest) | S-02 Login | ✅ Working |
| "Chi Tiết" | S-31 Detail | ⬜ Not implemented |
| Footer "Trang Chủ" | S-01 Home | ✅ Working |

---

## 📌 **Notes for Testers**

1. **Mock Mode**: Always test with `NEXT_PUBLIC_MOCK_API=true` first
2. **404 Pages**: Some redirects will show 404 (expected, pages not built yet)
3. **Auth State**: Test both logged-in and logged-out states
4. **Browser DevTools**: Check console for errors
5. **Network Tab**: Verify no real API calls in mock mode
6. **Responsive**: Test on Chrome DevTools device emulator
