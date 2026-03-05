# CycleX API Complete Specifications from Postman Collection

**Base URL**: `{{baseUrl}}` = `http://localhost:4491`

---

## 🔐 1. AUTH MODULE

### 1.1 Register - SELLER
- **HTTP Method**: POST
- **Full URL**: `{{baseUrl}}/api/auth/register`
- **Path Parameters**: None
- **Query Parameters**: None
- **Headers**:
  - `Content-Type: application/json`
- **Authorization**: None
- **Request Body Type**: raw (JSON)
- **Request Body**:
```json
{
  "email": "seller@test.com",
  "password": "123456",
  "phone": "0901234567",
  "cccd": "012345678",
  "role": "SELLER",
  "fullName": "Seller Test",
  "status": "ACTIVE",
  "avatarUrl": null,
  "isVerify": false
}
```

### 1.2 Register - BUYER
- **HTTP Method**: POST
- **Full URL**: `{{baseUrl}}/api/auth/register`
- **Path Parameters**: None
- **Query Parameters**: None
- **Headers**:
  - `Content-Type: application/json`
- **Authorization**: None
- **Request Body Type**: raw (JSON)
- **Request Body**:
```json
{
  "email": "buyer@test.com",
  "password": "123456",
  "phone": "0901234568",
  "cccd": "012345679",
  "role": "BUYER",
  "fullName": "Buyer Test",
  "status": "ACTIVE",
  "avatarUrl": null,
  "isVerify": false
}
```

### 1.3 Register - INSPECTOR
- **HTTP Method**: POST
- **Full URL**: `{{baseUrl}}/api/auth/register`
- **Path Parameters**: None
- **Query Parameters**: None
- **Headers**:
  - `Content-Type: application/json`
- **Authorization**: None
- **Request Body Type**: raw (JSON)
- **Request Body**:
```json
{
  "email": "inspector@test.com",
  "password": "123456",
  "phone": "0901234569",
  "cccd": "012345680",
  "role": "INSPECTOR",
  "fullName": "Inspector Test",
  "status": "ACTIVE",
  "avatarUrl": null,
  "isVerify": false
}
```

### 1.4 Register - SHIPPER
- **HTTP Method**: POST
- **Full URL**: `{{baseUrl}}/api/auth/register`
- **Path Parameters**: None
- **Query Parameters**: None
- **Headers**:
  - `Content-Type: application/json`
- **Authorization**: None
- **Request Body Type**: raw (JSON)
- **Request Body**:
```json
{
  "email": "shipper@test.com",
  "password": "123456",
  "phone": "0901234570",
  "cccd": "012345681",
  "role": "SHIPPER",
  "fullName": "Shipper Test",
  "status": "ACTIVE",
  "avatarUrl": null,
  "isVerify": false
}
```

### 1.5 Send OTP
- **HTTP Method**: POST
- **Full URL**: `{{baseUrl}}/api/auth/send-otp`
- **Path Parameters**: None
- **Query Parameters**: None
- **Headers**:
  - `Content-Type: application/json`
- **Authorization**: None
- **Request Body Type**: raw (JSON)
- **Request Body**:
```json
{
  "email": "seller@test.com"
}
```

### 1.6 Verify OTP
- **HTTP Method**: POST
- **Full URL**: `{{baseUrl}}/api/auth/verify-otp`
- **Path Parameters**: None
- **Query Parameters**: None
- **Headers**:
  - `Content-Type: application/json`
- **Authorization**: None
- **Request Body Type**: raw (JSON)
- **Request Body**:
```json
{
  "email": "seller@test.com",
  "otp": "123456"
}
```

### 1.7 Login - SELLER
- **HTTP Method**: POST
- **Full URL**: `{{baseUrl}}/api/auth/login`
- **Path Parameters**: None
- **Query Parameters**: None
- **Headers**:
  - `Content-Type: application/json`
- **Authorization**: None
- **Request Body Type**: raw (JSON)
- **Request Body**:
```json
{
  "email": "seller@test.com",
  "password": "123456"
}
```

### 1.8 Login - BUYER
- **HTTP Method**: POST
- **Full URL**: `{{baseUrl}}/api/auth/login`
- **Path Parameters**: None
- **Query Parameters**: None
- **Headers**:
  - `Content-Type: application/json`
- **Authorization**: None
- **Request Body Type**: raw (JSON)
- **Request Body**:
```json
{
  "email": "buyer@test.com",
  "password": "123456"
}
```

### 1.9 Login - INSPECTOR
- **HTTP Method**: POST
- **Full URL**: `{{baseUrl}}/api/auth/login`
- **Path Parameters**: None
- **Query Parameters**: None
- **Headers**:
  - `Content-Type: application/json`
- **Authorization**: None
- **Request Body Type**: raw (JSON)
- **Request Body**:
```json
{
  "email": "inspector@test.com",
  "password": "123456"
}
```

### 1.10 Login - SHIPPER
- **HTTP Method**: POST
- **Full URL**: `{{baseUrl}}/api/auth/login`
- **Path Parameters**: None
- **Query Parameters**: None
- **Headers**:
  - `Content-Type: application/json`
- **Authorization**: None
- **Request Body Type**: raw (JSON)
- **Request Body**:
```json
{
  "email": "shipper@test.com",
  "password": "123456"
}
```

---

## 👤 2. USERS CRUD MODULE

### 2.1 Create User
- **HTTP Method**: POST
- **Full URL**: `{{baseUrl}}/api/users`
- **Path Parameters**: None
- **Query Parameters**: None
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer {{token}}`
- **Authorization**: Bearer Token ({{token}})
- **Request Body Type**: raw (JSON)
- **Request Body**:
```json
{
  "email": "newuser@test.com",
  "password": "123456",
  "phone": "0909999888",
  "cccd": "099887766",
  "role": "BUYER",
  "fullName": "New User",
  "status": "ACTIVE",
  "avatarUrl": null,
  "isVerify": false
}
```

### 2.2 Get All Users
- **HTTP Method**: GET
- **Full URL**: `{{baseUrl}}/api/users`
- **Path Parameters**: None
- **Query Parameters**: None
- **Headers**:
  - `Authorization: Bearer {{token}}`
- **Authorization**: Bearer Token ({{token}})
- **Request Body Type**: None

### 2.3 Get User by ID
- **HTTP Method**: GET
- **Full URL**: `{{baseUrl}}/api/users/{{userId}}`
- **Path Parameters**: 
  - `userId` (required)
- **Query Parameters**: None
- **Headers**:
  - `Authorization: Bearer {{token}}`
- **Authorization**: Bearer Token ({{token}})
- **Request Body Type**: None

### 2.4 Update User
- **HTTP Method**: PUT
- **Full URL**: `{{baseUrl}}/api/users/{{userId}}`
- **Path Parameters**: 
  - `userId` (required)
- **Query Parameters**: None
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer {{token}}`
- **Authorization**: Bearer Token ({{token}})
- **Request Body Type**: raw (JSON)
- **Request Body**:
```json
{
  "fullName": "Updated User Name",
  "phone": "0909111222",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

### 2.5 Delete User
- **HTTP Method**: DELETE
- **Full URL**: `{{baseUrl}}/api/users/{{userId}}`
- **Path Parameters**: 
  - `userId` (required)
- **Query Parameters**: None
- **Headers**:
  - `Authorization: Bearer {{token}}`
- **Authorization**: Bearer Token ({{token}})
- **Request Body Type**: None

---

## 🏍️ 3. BIKELISTINGS CRUD MODULE (Public)

### 3.1 Create BikeListing
- **HTTP Method**: POST
- **Full URL**: `{{baseUrl}}/api/bikelistings`
- **Path Parameters**: None
- **Query Parameters**: None
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer {{sellerToken}}`
- **Authorization**: Bearer Token ({{sellerToken}})
- **Request Body Type**: raw (JSON)
- **Request Body**:
```json
{
  "sellerId": "{{sellerId}}",
  "title": "Yamaha YZF-R1 2023",
  "description": "Like new condition, low mileage, full service history",
  "bikeType": "Sport",
  "brand": "Yamaha",
  "model": "YZF-R1",
  "manufactureYear": 2023,
  "condition": "Like New",
  "usageTime": "6 months",
  "reasonForSale": "Upgrading to a newer model",
  "price": 350000000,
  "locationCity": "Ho Chi Minh",
  "pickupAddress": "123 Nguyen Van Linh, Quan 7, TP.HCM",
  "status": "PENDING"
}
```

### 3.2 Get All BikeListings
- **HTTP Method**: GET
- **Full URL**: `{{baseUrl}}/api/bikelistings?page=0&size=10`
- **Path Parameters**: None
- **Query Parameters**:
  - `page`: 0
  - `size`: 10
- **Headers**: None
- **Authorization**: None
- **Request Body Type**: None

### 3.3 Get All BikeListings (filter by status)
- **HTTP Method**: GET
- **Full URL**: `{{baseUrl}}/api/bikelistings?page=0&size=10&status=PENDING`
- **Path Parameters**: None
- **Query Parameters**:
  - `page`: 0
  - `size`: 10
  - `status`: PENDING
- **Headers**: None
- **Authorization**: None
- **Request Body Type**: None

### 3.4 Get All BikeListings (filter by city)
- **HTTP Method**: GET
- **Full URL**: `{{baseUrl}}/api/bikelistings?page=0&size=10&city=Ho Chi Minh`
- **Path Parameters**: None
- **Query Parameters**:
  - `page`: 0
  - `size`: 10
  - `city`: Ho Chi Minh
- **Headers**: None
- **Authorization**: None
- **Request Body Type**: None

### 3.5 Get All BikeListings (search by title)
- **HTTP Method**: GET
- **Full URL**: `{{baseUrl}}/api/bikelistings?page=0&size=10&title=Yamaha`
- **Path Parameters**: None
- **Query Parameters**:
  - `page`: 0
  - `size`: 10
  - `title`: Yamaha
- **Headers**: None
- **Authorization**: None
- **Request Body Type**: None

### 3.6 Get BikeListing by ID
- **HTTP Method**: GET
- **Full URL**: `{{baseUrl}}/api/bikelistings/{{listingId}}`
- **Path Parameters**: 
  - `listingId` (required)
- **Query Parameters**: None
- **Headers**: None
- **Authorization**: None
- **Request Body Type**: None

### 3.7 Update BikeListing
- **HTTP Method**: PUT
- **Full URL**: `{{baseUrl}}/api/bikelistings/{{listingId}}`
- **Path Parameters**: 
  - `listingId` (required)
- **Query Parameters**: None
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer {{sellerToken}}`
- **Authorization**: Bearer Token ({{sellerToken}})
- **Request Body Type**: raw (JSON)
- **Request Body**:
```json
{
  "title": "Yamaha YZF-R1 2023 - Updated",
  "price": 340000000,
  "description": "Updated description - excellent condition"
}
```

### 3.8 Delete BikeListing
- **HTTP Method**: DELETE
- **Full URL**: `{{baseUrl}}/api/bikelistings/{{listingId}}`
- **Path Parameters**: 
  - `listingId` (required)
- **Query Parameters**: None
- **Headers**:
  - `Authorization: Bearer {{sellerToken}}`
- **Authorization**: Bearer Token ({{sellerToken}})
- **Request Body Type**: None

---

## 🏪 4. SELLER MODULE (S-10 to S-18)

### S-10: Dashboard Stats
- **HTTP Method**: GET
- **Full URL**: `{{baseUrl}}/api/seller/{{sellerId}}/dashboard/stats`
- **Path Parameters**: 
  - `sellerId` (required)
- **Query Parameters**: None
- **Headers**:
  - `Authorization: Bearer {{sellerToken}}`
- **Authorization**: Bearer Token ({{sellerToken}})
- **Request Body Type**: None

### S-11: My Listings (Search - All)
- **HTTP Method**: GET
- **Full URL**: `{{baseUrl}}/api/seller/{{sellerId}}/listings/search?page=0&pageSize=20&sort=createdAt`
- **Path Parameters**: 
  - `sellerId` (required)
- **Query Parameters**:
  - `page`: 0
  - `pageSize`: 20
  - `sort`: createdAt
- **Headers**:
  - `Authorization: Bearer {{sellerToken}}`
- **Authorization**: Bearer Token ({{sellerToken}})
- **Request Body Type**: None

### S-11: My Listings (filter by status)
- **HTTP Method**: GET
- **Full URL**: `{{baseUrl}}/api/seller/{{sellerId}}/listings/search?status=PENDING&page=0&pageSize=20`
- **Path Parameters**: 
  - `sellerId` (required)
- **Query Parameters**:
  - `status`: PENDING
  - `page`: 0
  - `pageSize`: 20
- **Headers**:
  - `Authorization: Bearer {{sellerToken}}`
- **Authorization**: Bearer Token ({{sellerToken}})
- **Request Body Type**: None

### S-11: My Listings (filter by brand & price)
- **HTTP Method**: GET
- **Full URL**: `{{baseUrl}}/api/seller/{{sellerId}}/listings/search?brand=Yamaha&minPrice=100000000&maxPrice=500000000&page=0&pageSize=20`
- **Path Parameters**: 
  - `sellerId` (required)
- **Query Parameters**:
  - `brand`: Yamaha
  - `minPrice`: 100000000
  - `maxPrice`: 500000000
  - `page`: 0
  - `pageSize`: 20
- **Headers**:
  - `Authorization: Bearer {{sellerToken}}`
- **Authorization**: Bearer Token ({{sellerToken}})
- **Request Body Type**: None

### S-11: Listing Detail
- **HTTP Method**: GET
- **Full URL**: `{{baseUrl}}/api/seller/{{sellerId}}/listings/{{listingId}}/detail`
- **Path Parameters**: 
  - `sellerId` (required)
  - `listingId` (required)
- **Query Parameters**: None
- **Headers**:
  - `Authorization: Bearer {{sellerToken}}`
- **Authorization**: Bearer Token ({{sellerToken}})
- **Request Body Type**: None

### S-11: Listing Rejection Reason
- **HTTP Method**: GET
- **Full URL**: `{{baseUrl}}/api/seller/{{sellerId}}/listings/{{listingId}}/rejection`
- **Path Parameters**: 
  - `sellerId` (required)
  - `listingId` (required)
- **Query Parameters**: None
- **Headers**:
  - `Authorization: Bearer {{sellerToken}}`
- **Authorization**: Bearer Token ({{sellerToken}})
- **Request Body Type**: None

### S-11: Listing Result (Approve/Reject + InspectionReport)
- **HTTP Method**: GET
- **Full URL**: `{{baseUrl}}/api/seller/{{sellerId}}/listings/{{listingId}}/result`
- **Path Parameters**: 
  - `sellerId` (required)
  - `listingId` (required)
- **Query Parameters**: None
- **Headers**:
  - `Authorization: Bearer {{sellerToken}}`
- **Authorization**: Bearer Token ({{sellerToken}})
- **Request Body Type**: None
- **Response Contains**:
  - `listing`: SellerListingResponse
  - `inspectionReport`: InspectionReportResponse

### S-12: Create Listing (via Seller)
- **HTTP Method**: POST
- **Full URL**: `{{baseUrl}}/api/seller/{{sellerId}}/listings/create`
- **Path Parameters**: 
  - `sellerId` (required)
- **Query Parameters**: None
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer {{sellerToken}}`
- **Authorization**: Bearer Token ({{sellerToken}})
- **Request Body Type**: raw (JSON)
- **Request Body**:
```json
{
  "sellerId": "{{sellerId}}",
  "title": "Honda CBR600RR 2024",
  "description": "Perfect condition sport bike, garage kept",
  "bikeType": "Sport",
  "brand": "Honda",
  "model": "CBR600RR",
  "manufactureYear": 2024,
  "condition": "Excellent",
  "usageTime": "3 months",
  "reasonForSale": "Moving abroad",
  "price": 280000000,
  "locationCity": "Ha Noi",
  "pickupAddress": "456 Le Van Luong, Cau Giay, Ha Noi",
  "saveDraft": true
}
```

### S-12: Update Listing (PATCH)
- **HTTP Method**: PATCH
- **Full URL**: `{{baseUrl}}/api/seller/{{sellerId}}/listings/{{listingId}}`
- **Path Parameters**: 
  - `sellerId` (required)
  - `listingId` (required)
- **Query Parameters**: None
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer {{sellerToken}}`
- **Authorization**: Bearer Token ({{sellerToken}})
- **Request Body Type**: raw (JSON)
- **Request Body**:
```json
{
  "sellerId": "{{sellerId}}",
  "title": "Honda CBR600RR 2024 - Updated",
  "price": 275000000,
  "description": "Updated: Perfect condition, low mileage"
}
```

### S-13: Get Listing Images
- **HTTP Method**: GET
- **Full URL**: `{{baseUrl}}/api/seller/{{sellerId}}/listings/{{listingId}}/images`
- **Path Parameters**: 
  - `sellerId` (required)
  - `listingId` (required)
- **Query Parameters**: None
- **Headers**:
  - `Authorization: Bearer {{sellerToken}}`
- **Authorization**: Bearer Token ({{sellerToken}})
- **Request Body Type**: None

### S-13: Upload Listing Image
- **HTTP Method**: POST
- **Full URL**: `{{baseUrl}}/api/seller/{{sellerId}}/listings/{{listingId}}/images`
- **Path Parameters**: 
  - `sellerId` (required)
  - `listingId` (required)
- **Query Parameters**: None
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer {{sellerToken}}`
- **Authorization**: Bearer Token ({{sellerToken}})
- **Request Body Type**: raw (JSON)
- **Request Body**:
```json
{
  "imagePath": "/public/{{listingId}}/front.jpg"
}
```

### S-13: Delete Listing Image
- **HTTP Method**: DELETE
- **Full URL**: `{{baseUrl}}/api/seller/{{sellerId}}/listings/{{listingId}}/images/{{imageId}}`
- **Path Parameters**: 
  - `sellerId` (required)
  - `listingId` (required)
  - `imageId` (required)
- **Query Parameters**: None
- **Headers**:
  - `Authorization: Bearer {{sellerToken}}`
- **Authorization**: Bearer Token ({{sellerToken}})
- **Request Body Type**: None

### S-14: Preview Listing
- **HTTP Method**: GET
- **Full URL**: `{{baseUrl}}/api/seller/{{sellerId}}/listings/{{listingId}}/preview`
- **Path Parameters**: 
  - `sellerId` (required)
  - `listingId` (required)
- **Query Parameters**: None
- **Headers**:
  - `Authorization: Bearer {{sellerToken}}`
- **Authorization**: Bearer Token ({{sellerToken}})
- **Request Body Type**: None

### S-18: Get Drafts
- **HTTP Method**: GET
- **Full URL**: `{{baseUrl}}/api/seller/{{sellerId}}/drafts?sort=newest&page=0&pageSize=10`
- **Path Parameters**: 
  - `sellerId` (required)
- **Query Parameters**:
  - `sort`: newest
  - `page`: 0
  - `pageSize`: 10
- **Headers**:
  - `Authorization: Bearer {{sellerToken}}`
- **Authorization**: Bearer Token ({{sellerToken}})
- **Request Body Type**: None

### S-18: Submit Draft
- **HTTP Method**: POST
- **Full URL**: `{{baseUrl}}/api/seller/{{sellerId}}/drafts/{{listingId}}/submit`
- **Path Parameters**: 
  - `sellerId` (required)
  - `listingId` (required)
- **Query Parameters**: None
- **Headers**:
  - `Authorization: Bearer {{sellerToken}}`
- **Authorization**: Bearer Token ({{sellerToken}})
- **Request Body Type**: None

### S-18: Delete Draft
- **HTTP Method**: DELETE
- **Full URL**: `{{baseUrl}}/api/seller/{{sellerId}}/drafts/{{listingId}}`
- **Path Parameters**: 
  - `sellerId` (required)
  - `listingId` (required)
- **Query Parameters**: None
- **Headers**:
  - `Authorization: Bearer {{sellerToken}}`
- **Authorization**: Bearer Token ({{sellerToken}})
- **Request Body Type**: None

---

## 🔍 5. INSPECTOR MODULE (S-20 to S-24)

### S-20: Dashboard Stats
- **HTTP Method**: GET
- **Full URL**: `{{baseUrl}}/api/inspector/{{inspectorId}}/dashboard/stats`
- **Path Parameters**: 
  - `inspectorId` (required)
- **Query Parameters**: None
- **Headers**:
  - `Authorization: Bearer {{inspectorToken}}`
- **Authorization**: Bearer Token ({{inspectorToken}})
- **Request Body Type**: None

### S-21: Get Listings for Review (ALL)
- **HTTP Method**: GET
- **Full URL**: `{{baseUrl}}/api/inspector/{{inspectorId}}/listings?status=ALL&sort=newest&page=0&pageSize=10`
- **Path Parameters**: 
  - `inspectorId` (required)
- **Query Parameters**:
  - `status`: ALL
  - `sort`: newest
  - `page`: 0
  - `pageSize`: 10
- **Headers**:
  - `Authorization: Bearer {{inspectorToken}}`
- **Authorization**: Bearer Token ({{inspectorToken}})
- **Request Body Type**: None

### S-21: Get Listings for Review (PENDING)
- **HTTP Method**: GET
- **Full URL**: `{{baseUrl}}/api/inspector/{{inspectorId}}/listings?status=PENDING&sort=oldest&page=0&pageSize=10`
- **Path Parameters**: 
  - `inspectorId` (required)
- **Query Parameters**:
  - `status`: PENDING
  - `sort`: oldest
  - `page`: 0
  - `pageSize`: 10
- **Headers**:
  - `Authorization: Bearer {{inspectorToken}}`
- **Authorization**: Bearer Token ({{inspectorToken}})
- **Request Body Type**: None

### S-21: Get Listings for Review (REVIEWING)
- **HTTP Method**: GET
- **Full URL**: `{{baseUrl}}/api/inspector/{{inspectorId}}/listings?status=REVIEWING&sort=newest&page=0&pageSize=10`
- **Path Parameters**: 
  - `inspectorId` (required)
- **Query Parameters**:
  - `status`: REVIEWING
  - `sort`: newest
  - `page`: 0
  - `pageSize`: 10
- **Headers**:
  - `Authorization: Bearer {{inspectorToken}}`
- **Authorization**: Bearer Token ({{inspectorToken}})
- **Request Body Type**: None

### S-22: Get Listing Detail for Review
- **HTTP Method**: GET
- **Full URL**: `{{baseUrl}}/api/inspector/{{inspectorId}}/listings/{{listingId}}/detail`
- **Path Parameters**: 
  - `inspectorId` (required)
  - `listingId` (required)
- **Query Parameters**: None
- **Headers**:
  - `Authorization: Bearer {{inspectorToken}}`
- **Authorization**: Bearer Token ({{inspectorToken}})
- **Request Body Type**: None

### S-22: Lock Listing for Review
- **HTTP Method**: POST
- **Full URL**: `{{baseUrl}}/api/inspector/{{inspectorId}}/listings/{{listingId}}/lock`
- **Path Parameters**: 
  - `inspectorId` (required)
  - `listingId` (required)
- **Query Parameters**: None
- **Headers**:
  - `Authorization: Bearer {{inspectorToken}}`
- **Authorization**: Bearer Token ({{inspectorToken}})
- **Request Body Type**: None

### S-22: Unlock Listing
- **HTTP Method**: POST
- **Full URL**: `{{baseUrl}}/api/inspector/{{inspectorId}}/listings/{{listingId}}/unlock`
- **Path Parameters**: 
  - `inspectorId` (required)
  - `listingId` (required)
- **Query Parameters**: None
- **Headers**:
  - `Authorization: Bearer {{inspectorToken}}`
- **Authorization**: Bearer Token ({{inspectorToken}})
- **Request Body Type**: None

### S-23: Approve Listing
- **HTTP Method**: POST
- **Full URL**: `{{baseUrl}}/api/inspector/{{inspectorId}}/listings/{{listingId}}/approve`
- **Path Parameters**: 
  - `inspectorId` (required)
  - `listingId` (required)
- **Query Parameters**: None
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer {{inspectorToken}}`
- **Authorization**: Bearer Token ({{inspectorToken}})
- **Request Body Type**: raw (JSON)
- **Request Body**:
```json
{
  "reasonText": "Listing meets all quality standards. Photos are clear, description is detailed and accurate.",
  "reasonCode": "MEETS_STANDARDS",
  "note": "Good quality listing, approved without issues"
}
```

### S-23: Reject Listing
- **HTTP Method**: POST
- **Full URL**: `{{baseUrl}}/api/inspector/{{inspectorId}}/listings/reject`
- **Path Parameters**: 
  - `inspectorId` (required)
- **Query Parameters**: None
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer {{inspectorToken}}`
- **Authorization**: Bearer Token ({{inspectorToken}})
- **Request Body Type**: raw (JSON)
- **Request Body**:
```json
{
  "listingId": "{{listingId}}",
  "reasonCode": "LOW_QUALITY",
  "reasonText": "Images are blurry and description is insufficient",
  "note": "Seller should retake photos and add more details"
}
```

### S-24: Review History
- **HTTP Method**: GET
- **Full URL**: `{{baseUrl}}/api/inspector/{{inspectorId}}/reviews?from=2026-01-01&to=2026-12-31&page=0&pageSize=10`
- **Path Parameters**: 
  - `inspectorId` (required)
- **Query Parameters**:
  - `from`: 2026-01-01
  - `to`: 2026-12-31
  - `page`: 0
  - `pageSize`: 10
- **Headers**:
  - `Authorization: Bearer {{inspectorToken}}`
- **Authorization**: Bearer Token ({{inspectorToken}})
- **Request Body Type**: None

### S-24: Review Detail (Inspection Report)
- **HTTP Method**: GET
- **Full URL**: `{{baseUrl}}/api/inspector/{{inspectorId}}/reviews/{{listingId}}`
- **Path Parameters**: 
  - `inspectorId` (required)
  - `listingId` (required)
- **Query Parameters**: None
- **Headers**:
  - `Authorization: Bearer {{inspectorToken}}`
- **Authorization**: Bearer Token ({{inspectorToken}})
- **Request Body Type**: None

### S-24: Get Inspection Report for Listing
- **HTTP Method**: GET
- **Full URL**: `{{baseUrl}}/api/inspector/{{inspectorId}}/listings/{{listingId}}/report`
- **Path Parameters**: 
  - `inspectorId` (required)
  - `listingId` (required)
- **Query Parameters**: None
- **Headers**:
  - `Authorization: Bearer {{inspectorToken}}`
- **Authorization**: Bearer Token ({{inspectorToken}})
- **Request Body Type**: None

### S-24: Dispute - List Disputes
- **HTTP Method**: GET
- **Full URL**: `{{baseUrl}}/api/inspector/{{inspectorId}}/disputes?status=OPEN&page=0&pageSize=10`
- **Path Parameters**: 
  - `inspectorId` (required)
- **Query Parameters**:
  - `status`: OPEN
  - `page`: 0
  - `pageSize`: 10
- **Headers**:
  - `Authorization: Bearer {{inspectorToken}}`
- **Authorization**: Bearer Token ({{inspectorToken}})
- **Request Body Type**: None

### S-24: Dispute - Dispute Detail
- **HTTP Method**: GET
- **Full URL**: `{{baseUrl}}/api/inspector/{{inspectorId}}/disputes/1`
- **Path Parameters**: 
  - `inspectorId` (required)
  - `disputeId` (required, hardcoded as 1 in example)
- **Query Parameters**: None
- **Headers**:
  - `Authorization: Bearer {{inspectorToken}}`
- **Authorization**: Bearer Token ({{inspectorToken}})
- **Request Body Type**: None

---

## 💬 6. INSPECTION CHAT MODULE (S-40)

### S-40.1: Load Chat Thread (as INSPECTOR)
- **HTTP Method**: GET
- **Full URL**: `{{baseUrl}}/api/inspection-requests/{{inspectionRequestId}}/chat-thread`
- **Path Parameters**: 
  - `inspectionRequestId` (required)
- **Query Parameters**: None
- **Headers**:
  - `Authorization: Bearer {{inspectorToken}}`
- **Authorization**: Bearer Token ({{inspectorToken}})
- **Request Body Type**: None

### S-40.1: Load Chat Thread (as SELLER)
- **HTTP Method**: GET
- **Full URL**: `{{baseUrl}}/api/inspection-requests/{{inspectionRequestId}}/chat-thread`
- **Path Parameters**: 
  - `inspectionRequestId` (required)
- **Query Parameters**: None
- **Headers**:
  - `Authorization: Bearer {{sellerToken}}`
- **Authorization**: Bearer Token ({{sellerToken}})
- **Request Body Type**: None

### S-40.2: Send TEXT Message (as INSPECTOR)
- **HTTP Method**: POST
- **Full URL**: `{{baseUrl}}/api/inspection-requests/{{inspectionRequestId}}/chat-messages`
- **Path Parameters**: 
  - `inspectionRequestId` (required)
- **Query Parameters**: None
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer {{inspectorToken}}`
- **Authorization**: Bearer Token ({{inspectorToken}})
- **Request Body Type**: raw (JSON)
- **Request Body**:
```json
{
  "type": "TEXT",
  "text": "Hello, I need more details about the bike's engine condition. Can you provide recent service records?"
}
```

### S-40.2: Send TEXT Message (as SELLER)
- **HTTP Method**: POST
- **Full URL**: `{{baseUrl}}/api/inspection-requests/{{inspectionRequestId}}/chat-messages`
- **Path Parameters**: 
  - `inspectionRequestId` (required)
- **Query Parameters**: None
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer {{sellerToken}}`
- **Authorization**: Bearer Token ({{sellerToken}})
- **Request Body Type**: raw (JSON)
- **Request Body**:
```json
{
  "type": "TEXT",
  "text": "Sure, I have all the service records. The bike was serviced last month at Honda authorized center."
}
```

### S-40.3: Upload Image Message
- **HTTP Method**: POST
- **Full URL**: `{{baseUrl}}/api/inspection-requests/{{inspectionRequestId}}/chat-messages:upload`
- **Path Parameters**: 
  - `inspectionRequestId` (required)
- **Query Parameters**: None
- **Headers**:
  - `Authorization: Bearer {{sellerToken}}`
- **Authorization**: Bearer Token ({{sellerToken}})
- **Request Body Type**: formdata
- **Request Body Fields**:
  - `file`: (file upload - JPEG, PNG, GIF, WebP - max 5MB)
  - `caption`: "Service record from Honda center - January 2026"

### S-40.4: Mark Chat as Read
- **HTTP Method**: POST
- **Full URL**: `{{baseUrl}}/api/inspection-requests/{{inspectionRequestId}}/chat-thread/read`
- **Path Parameters**: 
  - `inspectionRequestId` (required)
- **Query Parameters**: None
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer {{inspectorToken}}`
- **Authorization**: Bearer Token ({{inspectorToken}})
- **Request Body Type**: raw (JSON)
- **Request Body**:
```json
{
  "lastReadMessageId": 1
}
```

---

## 📋 7. INSPECTION RESPONSE MODULE (S-42)

### S-42.1: Load Inspection Response Screen
- **HTTP Method**: GET
- **Full URL**: `{{baseUrl}}/api/seller/listings/{{listingId}}/inspection-response`
- **Path Parameters**: 
  - `listingId` (required)
- **Query Parameters**: None
- **Headers**:
  - `Authorization: Bearer {{sellerToken}}`
- **Authorization**: Bearer Token ({{sellerToken}})
- **Request Body Type**: None

### S-42.2: Upload Draft File
- **HTTP Method**: POST
- **Full URL**: `{{baseUrl}}/api/seller/inspection-requests/{{inspectionRequestId}}/response/requirements/{{requirementId}}/files`
- **Path Parameters**: 
  - `inspectionRequestId` (required)
  - `requirementId` (required)
- **Query Parameters**: None
- **Headers**:
  - `Authorization: Bearer {{sellerToken}}`
- **Authorization**: Bearer Token ({{sellerToken}})
- **Request Body Type**: formdata
- **Request Body Fields**:
  - `file`: (file upload)

### S-42.3: Delete Draft File
- **HTTP Method**: DELETE
- **Full URL**: `{{baseUrl}}/api/seller/inspection-requests/{{inspectionRequestId}}/response/files/{{fileId}}`
- **Path Parameters**: 
  - `inspectionRequestId` (required)
  - `fileId` (required)
- **Query Parameters**: None
- **Headers**:
  - `Authorization: Bearer {{sellerToken}}`
- **Authorization**: Bearer Token ({{sellerToken}})
- **Request Body Type**: None

### S-42.4: Submit Inspection Response
- **HTTP Method**: POST
- **Full URL**: `{{baseUrl}}/api/seller/inspection-requests/{{inspectionRequestId}}/response/submit`
- **Path Parameters**: 
  - `inspectionRequestId` (required)
- **Query Parameters**: None
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer {{sellerToken}}`
- **Authorization**: Bearer Token ({{sellerToken}})
- **Request Body Type**: raw (JSON)
- **Request Body**:
```json
{
  "answers": [
    {
      "requirementId": 1,
      "text": "The bike has been serviced regularly at Honda authorized center. Last service was on January 2026."
    },
    {
      "requirementId": 2,
      "text": "No accidents or damage history. Original paint and frame."
    }
  ]
}
```

---

## 🛒 8. PURCHASE REQUEST MODULE (S-50)

### S-50.1: Init Purchase Request Screen
- **HTTP Method**: GET
- **Full URL**: `{{baseUrl}}/api/products/{{productId}}/purchase-request/init`
- **Path Parameters**: 
  - `productId` (required)
- **Query Parameters**: None
- **Headers**:
  - `Authorization: Bearer {{buyerToken}}`
- **Authorization**: Bearer Token ({{buyerToken}})
- **Request Body Type**: None

### S-50.2: Review Purchase Request (no DB write)
- **HTTP Method**: POST
- **Full URL**: `{{baseUrl}}/api/products/{{productId}}/purchase-requests/review`
- **Path Parameters**: 
  - `productId` (required)
- **Query Parameters**: None
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer {{buyerToken}}`
- **Authorization**: Bearer Token ({{buyerToken}})
- **Request Body Type**: raw (JSON)
- **Request Body**:
```json
{
  "transactionType": "PURCHASE",
  "desiredTransactionTime": "2026-04-15T14:00:00",
  "note": "I would like to inspect the bike before finalizing the purchase"
}
```

### S-50.3: Create Purchase Request (PURCHASE)
- **HTTP Method**: POST
- **Full URL**: `{{baseUrl}}/api/products/{{productId}}/purchase-requests`
- **Path Parameters**: 
  - `productId` (required)
- **Query Parameters**: None
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer {{buyerToken}}`
- **Authorization**: Bearer Token ({{buyerToken}})
- **Request Body Type**: raw (JSON)
- **Request Body**:
```json
{
  "transactionType": "PURCHASE",
  "desiredTransactionTime": "2026-04-15T14:00:00",
  "note": "I would like to inspect the bike before finalizing"
}
```

### S-50.3: Create Purchase Request (DEPOSIT)
- **HTTP Method**: POST
- **Full URL**: `{{baseUrl}}/api/products/{{productId}}/purchase-requests`
- **Path Parameters**: 
  - `productId` (required)
- **Query Parameters**: None
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer {{buyerToken}}`
- **Authorization**: Bearer Token ({{buyerToken}})
- **Request Body Type**: raw (JSON)
- **Request Body**:
```json
{
  "transactionType": "DEPOSIT",
  "desiredTransactionTime": "2026-04-20T10:00:00",
  "note": "I want to deposit first and pick up the bike next week"
}
```

---

## 💰 9. SELLER TRANSACTIONS MODULE (S-52/S-53)

### S-52: Get Pending Transactions
- **HTTP Method**: GET
- **Full URL**: `{{baseUrl}}/api/seller/transactions/pending?page=0&size=10&sortBy=createdAt&sortDir=desc`
- **Path Parameters**: None
- **Query Parameters**:
  - `page`: 0
  - `size`: 10
  - `sortBy`: createdAt
  - `sortDir`: desc
- **Headers**:
  - `Authorization: Bearer {{sellerToken}}`
- **Authorization**: Bearer Token ({{sellerToken}})
- **Request Body Type**: None

### S-52: Get Pending (filter by PURCHASE)
- **HTTP Method**: GET
- **Full URL**: `{{baseUrl}}/api/seller/transactions/pending?page=0&size=10&transactionType=PURCHASE`
- **Path Parameters**: None
- **Query Parameters**:
  - `page`: 0
  - `size`: 10
  - `transactionType`: PURCHASE
- **Headers**:
  - `Authorization: Bearer {{sellerToken}}`
- **Authorization**: Bearer Token ({{sellerToken}})
- **Request Body Type**: None

### S-52: Get Pending (filter by DEPOSIT)
- **HTTP Method**: GET
- **Full URL**: `{{baseUrl}}/api/seller/transactions/pending?page=0&size=10&transactionType=DEPOSIT`
- **Path Parameters**: None
- **Query Parameters**:
  - `page`: 0
  - `size`: 10
  - `transactionType`: DEPOSIT
- **Headers**:
  - `Authorization: Bearer {{sellerToken}}`
- **Authorization**: Bearer Token ({{sellerToken}})
- **Request Body Type**: None

### S-52: Get Pending (keyword search)
- **HTTP Method**: GET
- **Full URL**: `{{baseUrl}}/api/seller/transactions/pending?page=0&size=10&keyword=Buyer`
- **Path Parameters**: None
- **Query Parameters**:
  - `page`: 0
  - `size`: 10
  - `keyword`: Buyer
- **Headers**:
  - `Authorization: Bearer {{sellerToken}}`
- **Authorization**: Bearer Token ({{sellerToken}})
- **Request Body Type**: None

### S-53: Get Transaction Detail
- **HTTP Method**: GET
- **Full URL**: `{{baseUrl}}/api/seller/transactions/{{requestId}}`
- **Path Parameters**: 
  - `requestId` (required)
- **Query Parameters**: None
- **Headers**:
  - `Authorization: Bearer {{sellerToken}}`
- **Authorization**: Bearer Token ({{sellerToken}})
- **Request Body Type**: None

### S-53: Confirm Transaction
- **HTTP Method**: POST
- **Full URL**: `{{baseUrl}}/api/seller/transactions/{{requestId}}/confirm`
- **Path Parameters**: 
  - `requestId` (required)
- **Query Parameters**: None
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer {{sellerToken}}`
- **Authorization**: Bearer Token ({{sellerToken}})
- **Request Body Type**: raw (JSON)
- **Request Body**:
```json
{
  "note": "Confirmed. Please come to the pickup address at the agreed time."
}
```

### S-53: Reject Transaction
- **HTTP Method**: POST
- **Full URL**: `{{baseUrl}}/api/seller/transactions/{{requestId}}/reject`
- **Path Parameters**: 
  - `requestId` (required)
- **Query Parameters**: None
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer {{sellerToken}}`
- **Authorization**: Bearer Token ({{sellerToken}})
- **Request Body Type**: raw (JSON)
- **Request Body**:
```json
{
  "reason": "The bike is no longer available. It has been sold to another buyer."
}
```

---

## 🛍️ 10. BUYER TRANSACTIONS MODULE (S-54)

### S-54: Get Transaction Detail (Buyer View)
- **HTTP Method**: GET
- **Full URL**: `{{baseUrl}}/api/buyer/transactions/{{requestId}}`
- **Path Parameters**: 
  - `requestId` (required)
- **Query Parameters**: None
- **Headers**:
  - `Authorization: Bearer {{buyerToken}}`
- **Authorization**: Bearer Token ({{buyerToken}})
- **Request Body Type**: None

### S-54: Cancel Transaction (Buyer)
- **HTTP Method**: POST
- **Full URL**: `{{baseUrl}}/api/buyer/transactions/{{requestId}}/cancel`
- **Path Parameters**: 
  - `requestId` (required)
- **Query Parameters**: None
- **Headers**:
  - `Authorization: Bearer {{buyerToken}}`
- **Authorization**: Bearer Token ({{buyerToken}})
- **Request Body Type**: None

---

## 🚚 11. SHIPPER DASHBOARD MODULE (S-60)

### S-60.F1: Dashboard Summary
- **HTTP Method**: GET
- **Full URL**: `{{baseUrl}}/api/shipper/dashboard/summary`
- **Path Parameters**: None
- **Query Parameters**: None
- **Headers**:
  - `Authorization: Bearer {{shipperToken}}`
- **Authorization**: Bearer Token ({{shipperToken}})
- **Request Body Type**: None

### S-60.F2: Assigned Deliveries
- **HTTP Method**: GET
- **Full URL**: `{{baseUrl}}/api/shipper/deliveries/assigned?page=0&pageSize=10`
- **Path Parameters**: None
- **Query Parameters**:
  - `page`: 0
  - `pageSize`: 10
- **Headers**:
  - `Authorization: Bearer {{shipperToken}}`
- **Authorization**: Bearer Token ({{shipperToken}})
- **Request Body Type**: None

---

## ✅ POSTMAN COLLECTION VARIABLES

| Variable | Default Value | Type | Purpose |
|----------|---------------|------|---------|
| `baseUrl` | http://localhost:4491 | string | API Base URL |
| `token` | (empty) | string | Generic auth token |
| `sellerToken` | (empty) | string | Seller authentication token |
| `buyerToken` | (empty) | string | Buyer authentication token |
| `inspectorToken` | (empty) | string | Inspector authentication token |
| `shipperToken` | (empty) | string | Shipper authentication token |
| `adminToken` | (empty) | string | Admin authentication token |
| `sellerId` | 1 | string | Seller user ID |
| `buyerId` | 2 | string | Buyer user ID |
| `inspectorId` | 3 | string | Inspector user ID |
| `shipperId` | 4 | string | Shipper user ID |
| `listingId` | 1 | string | Bike listing ID |
| `productId` | 1 | string | Product ID |
| `requestId` | 1 | string | Purchase request ID |
| `inspectionRequestId` | 1 | string | Inspection request ID |
| `userId` | 1 | string | User ID |
| `imageId` | 1 | string | Image ID |
| `requirementId` | 1 | string | Requirement ID |
| `fileId` | 1 | string | File ID |

---

## 📝 IMPORTANT NOTES

1. **Bearer Token Format**: `Authorization: Bearer {{tokenVariable}}`
2. **URL Variables**: All URLs use `{{variable}}` syntax that gets replaced by Postman collection variables
3. **Pagination**: Most list endpoints support pagination with `page` and `pageSize`/`size` parameters
4. **Sorting**: List endpoints support `sort` parameter (e.g., `createdAt`, `newest`, `oldest`)
5. **Status Filters**: Many endpoints support filtering by `status` parameter
6. **FormData**: File upload endpoints use `formdata` content type
7. **Raw JSON**: All POST/PUT/PATCH requests with data use `application/json` content type

---

**Last Updated**: Generated from CycleX_Full_API_Test.postman_collection.json
