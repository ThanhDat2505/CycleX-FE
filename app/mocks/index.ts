/**
 * Mock Data - Index
 * Central export point for all mock data
 * Import from '@/app/mocks' to use any mock data
 */

// Auth mocks (users, OTP, login validation)
export * from './auth';

// Home page featured bikes
export { generateMockHomeBikes } from './homeBikes';

// Public listings for browse/search
export { generateMockListings, MOCK_LISTINGS, MOCK_LISTING_DETAILS } from './listings';

// Seller's my listings
export { MOCK_MY_LISTINGS, type MyListing } from './myListings';
