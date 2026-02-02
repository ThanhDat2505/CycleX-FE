/**
 * Test script to verify validateListingDetail logic
 * Simulates the API response from backend
 */

// Simulated response data from backend (from user's message)
const apiResponse = {
    listingId: 49,
    title: "Yamaha YZF-R15",
    brand: "Yamaha",
    model: "YZF-R15",
    price: 50000000.00,
    status: "APPROVED",
    viewsCount: 0,
    createdAt: "2026-02-02T09:00:58.758797",
    updatedAt: "2026-02-02T09:01:13"
};

// Validation function (copied from app/types/listing.ts)
function validateListingDetail(data) {
    if (!data || typeof data !== 'object') {
        throw new Error('Invalid listing data: not an object');
    }

    const required = ['listingId', 'title', 'price', 'brand', 'viewsCount'];
    for (const field of required) {
        if (data[field] === undefined) {
            throw new Error(`Invalid listing data: missing field '${field}'`);
        }
    }

    if (typeof data.listingId !== 'number') {
        throw new Error('Invalid listing data: listingId must be number');
    }

    if (typeof data.price !== 'number' || data.price < 0) {
        throw new Error('Invalid listing data: price must be non-negative number');
    }

    // Handle images field: use provided value or default to empty array
    const images = Array.isArray(data.images) ? data.images : [];

    if (data.condition && data.condition !== 'new' && data.condition !== 'used') {
        throw new Error('Invalid listing data: condition must be "new" or "used"');
    }

    if (data.status) {
        const validStatuses = [
            'DRAFT', 'PENDING', 'REVIEWING', 'NEED_MORE_INFO',
            'APPROVED', 'REJECTED', 'HELD', 'SOLD'
        ];
        if (!validStatuses.includes(data.status)) {
            throw new Error(`Invalid listing data: status must be one of ${validStatuses.join(', ')}`);
        }
    }

    return {
        ...data,
        images
    };
}

// Test
console.log('=== Testing validateListingDetail ===');
console.log('Input API response:', JSON.stringify(apiResponse, null, 2));
console.log('');

try {
    const result = validateListingDetail(apiResponse);
    console.log('✅ Validation PASSED');
    console.log('Output:', JSON.stringify(result, null, 2));
} catch (error) {
    console.log('❌ Validation FAILED');
    console.log('Error:', error.message);
}
