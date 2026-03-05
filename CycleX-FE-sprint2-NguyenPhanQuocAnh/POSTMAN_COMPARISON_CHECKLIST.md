# Comprehensive Postman Collection vs Code Comparison Report

## VERIFICATION STATUS: IN PROGRESS

### Task
Compare all 72+ endpoints from the Postman collection against the existing API service files to identify any discrepancies in:
- HTTP methods
- Endpoint URLs
- Query parameters
- Path parameters
- Headers
- Request body structure
- Authorization

---

## ENDPOINTS TO VERIFY

### MODULE 1: Auth (10 endpoints)
- [ ] 1.1 Register - SELLER (POST /api/auth/register)
- [ ] 1.2 Register - BUYER (POST /api/auth/register)
- [ ] 1.3 Register - INSPECTOR (POST /api/auth/register)
- [ ] 1.4 Register - SHIPPER (POST /api/auth/register)
- [ ] 1.5 Send OTP (POST /api/auth/send-otp)
- [ ] 1.6 Verify OTP (POST /api/auth/verify-otp)
- [ ] 1.7 Login - SELLER (POST /api/auth/login)
- [ ] 1.8 Login - BUYER (POST /api/auth/login)
- [ ] 1.9 Login - INSPECTOR (POST /api/auth/login)
- [ ] 1.10 Login - SHIPPER (POST /api/auth/login)

### MODULE 2: Users CRUD (5 endpoints)
- [ ] 2.1 Create User (POST /api/users)
- [ ] 2.2 Get All Users (GET /api/users)
- [ ] 2.3 Get User by ID (GET /api/users/{userId})
- [ ] 2.4 Update User (PUT /api/users/{userId})
- [ ] 2.5 Delete User (DELETE /api/users/{userId})

### MODULE 3: BikeListings CRUD (8 endpoints)
- [ ] 3.1 Create BikeListing (POST /api/bikelistings)
- [ ] 3.2 Get All BikeListings (GET /api/bikelistings?page=0&size=10)
- [ ] 3.3 Filter by status (GET /api/bikelistings?status=...)
- [ ] 3.4 Filter by city (GET /api/bikelistings?city=...)
- [ ] 3.5 Search by title (GET /api/bikelistings?title=...)
- [ ] 3.6 Get BikeListing by ID (GET /api/bikelistings/{id})
- [ ] 3.7 Update BikeListing (PUT /api/bikelistings/{id})
- [ ] 3.8 Delete BikeListing (DELETE /api/bikelistings/{id})

### MODULE 4: Seller Module (18 endpoints)
- [ ] S-10: Dashboard Stats (GET /api/seller/{sellerId}/dashboard/stats)
- [ ] S-11: My Listings Search (GET /api/seller/{sellerId}/listings/search)
- [ ] S-11: Listing Detail (GET /api/seller/{sellerId}/listings/{listingId}/detail)
- [ ] S-11: Rejection Reason (GET /api/seller/{sellerId}/listings/{listingId}/rejection)
- [ ] S-11: Listing Result (GET /api/seller/{sellerId}/listings/{listingId}/result)
- [ ] S-12: Create Listing (POST /api/seller/{sellerId}/listings/create)
- [ ] S-12: Update Listing (PATCH /api/seller/{sellerId}/listings/{listingId})
- [ ] S-13: Get Listing Images (GET /api/seller/{sellerId}/listings/{listingId}/images)
- [ ] S-13: Upload Listing Image (POST /api/seller/{sellerId}/listings/{listingId}/images)
- [ ] S-13: Delete Listing Image (DELETE /api/seller/{sellerId}/listings/{listingId}/images/{imageId})
- [ ] S-14: Preview Listing (GET /api/seller/{sellerId}/listings/{listingId}/preview)
- [ ] S-18: Get Drafts (GET /api/seller/{sellerId}/drafts)
- [ ] S-18: Submit Draft (POST /api/seller/{sellerId}/drafts/{listingId}/submit)
- [ ] S-18: Delete Draft (DELETE /api/seller/{sellerId}/drafts/{listingId})

### MODULE 5: Inspector Module (15 endpoints)
- [ ] S-20: Dashboard Stats (GET /api/inspector/{inspectorId}/dashboard/stats)
- [ ] S-21: Get Listings for Review (GET /api/inspector/{inspectorId}/listings)
- [ ] S-22: Listing Detail (GET /api/inspector/{inspectorId}/listings/{listingId}/detail)
- [ ] S-22: Lock Listing (POST /api/inspector/{inspectorId}/listings/{listingId}/lock)
- [ ] S-22: Unlock Listing (POST /api/inspector/{inspectorId}/listings/{listingId}/unlock)
- [ ] S-23: Approve Listing (POST /api/inspector/{inspectorId}/listings/{listingId}/approve)
- [ ] S-23: Reject Listing (POST /api/inspector/{inspectorId}/listings/reject)
- [ ] S-24: Review History (GET /api/inspector/{inspectorId}/reviews)
- [ ] S-24: Review Detail (GET /api/inspector/{inspectorId}/reviews/{listingId})
- [ ] S-24: Inspection Report (GET /api/inspector/{inspectorId}/listings/{listingId}/report)
- [ ] Disputes: List Disputes (GET /api/inspector/{inspectorId}/disputes)
- [ ] Disputes: Dispute Detail (GET /api/inspector/{inspectorId}/disputes/{disputeId})

### MODULE 6: Chat (6 endpoints)
- [ ] S-40.1: Load Chat Thread (GET /api/inspection-requests/{inspectionRequestId}/chat-thread)
- [ ] S-40.2: Send TEXT Message (POST /api/inspection-requests/{inspectionRequestId}/chat-messages)
- [ ] S-40.3: Upload Image Message (POST /api/inspection-requests/{inspectionRequestId}/chat-messages:upload)
- [ ] S-40.4: Mark Chat as Read (POST /api/inspection-requests/{inspectionRequestId}/chat-thread/read)

### MODULE 7: Inspection Response (4 endpoints)
- [ ] S-42.1: Load Response Screen (GET /api/seller/listings/{listingId}/inspection-response)
- [ ] S-42.2: Upload Draft File (POST /api/seller/inspection-requests/{inspectionRequestId}/response/requirements/{requirementId}/files)
- [ ] S-42.3: Delete Draft File (DELETE /api/seller/inspection-requests/{inspectionRequestId}/response/files/{fileId})
- [ ] S-42.4: Submit Response (POST /api/seller/inspection-requests/{inspectionRequestId}/response/submit)

### MODULE 8: Purchase Request (4 endpoints)
- [ ] S-50.1: Init Purchase (GET /api/products/{productId}/purchase-request/init)
- [ ] S-50.2: Review Purchase (POST /api/products/{productId}/purchase-requests/review)
- [ ] S-50.3: Create Purchase (POST /api/products/{productId}/purchase-requests)

### MODULE 9: Seller Transactions (7 endpoints)
- [ ] S-52: Get Pending Transactions (GET /api/seller/transactions/pending)
- [ ] S-53: Get Transaction Detail (GET /api/seller/transactions/{requestId})
- [ ] S-53: Confirm Transaction (POST /api/seller/transactions/{requestId}/confirm)
- [ ] S-53: Reject Transaction (POST /api/seller/transactions/{requestId}/reject)

### MODULE 10: Buyer Transactions (2 endpoints)
- [ ] S-54: Get Transaction Detail (GET /api/buyer/transactions/{requestId})
- [ ] S-54: Cancel Transaction (POST /api/buyer/transactions/{requestId}/cancel)

### MODULE 11: Shipper Dashboard (2 endpoints)
- [ ] S-60.F1: Dashboard Summary (GET /api/shipper/dashboard/summary)
- [ ] S-60.F2: Assigned Deliveries (GET /api/shipper/deliveries/assigned)

---

## FINDINGS

(To be filled in as verification proceeds)

---

**Date:** March 5, 2026  
**Status:** Verification in progress
