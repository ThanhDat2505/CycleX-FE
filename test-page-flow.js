/**
 * Test script to verify complete listing detail flow
 */

// Simulated backend response
const backendResponse = {
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

// ListingDetail type
class ListingDetail {
    listingId;
    title;
    price;
    description;
    brand;
    bikeType;
    images;
    locationCity;
    viewsCount;
    model;
    condition;
    status;

    constructor(data) {
        Object.assign(this, data);
    }
}

// Validation function
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

// Simulate getListingDetail function
async function getListingDetail(sellerId, listingId) {
    console.log(`Calling API with sellerId=${sellerId}, listingId=${listingId}`);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Validate complete response structure
    const validated = validateListingDetail(backendResponse);
    console.log(`✅ Fetched listing detail: ID ${listingId}`);
    return validated;
}

// Simulate page component behavior
async function testPage() {
    console.log('=== Testing Listing Detail Page Flow ===\n');

    const listingId = 49;
    const userId = null; // Not logged in
    const sellerId = userId || 0; // Use 0 for guest

    console.log(`Listing ID: ${listingId}`);
    console.log(`User ID: ${userId}`);
    console.log(`Seller ID (for API): ${sellerId}\n`);

    try {
        console.log('📡 Fetching listing detail...');
        const listing = await getListingDetail(sellerId, listingId);

        console.log('\n✅ SUCCESS: Listing loaded');
        console.log('Data:', JSON.stringify(listing, null, 2));

        // Simulate component render check
        console.log('\n=== Component Render Check ===');
        console.log(`Title: ${listing.title}`);
        console.log(`Price: ${listing.price}`);
        console.log(`Brand: ${listing.brand}`);
        console.log(`Images: ${listing.images.length} image(s)`);
        console.log(`Views: ${listing.viewsCount}`);
        console.log(`Model: ${listing.model || '(not provided)'}`);
        console.log(`Condition: ${listing.condition || '(not provided)'}`);
        console.log(`Description: ${listing.description ? '(provided)' : '(not provided)'}`);

    } catch (error) {
        console.log('❌ ERROR:', error.message);
    }
}

testPage();
