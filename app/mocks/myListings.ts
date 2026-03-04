/**
 * Mock Data - My Listings (Seller's Listings)
 * Used for S-11 My Listings page when NEXT_PUBLIC_MOCK_API=true
 */

import { type ListingStatus } from '../constants';

export interface MyListing {
    id: number;
    brand: string;
    model: string;
    type: string;
    condition: string;
    price: number;
    location: string;
    status: ListingStatus;
    rejectionReason?: string;
    shipping: boolean;
    views: number;
    inquiries: number;
    createdDate: string;
    updatedDate: string;
}

/**
 * Mock listings for seller dashboard
 * In-memory store, resets on reload
 */
export const MOCK_MY_LISTINGS: MyListing[] = [
    {
        id: 1,
        brand: "Giant",
        model: "Escape 3",
        type: "Road Bike",
        condition: "Used",
        price: 8500000,
        location: "Hà Nội",
        status: "APPROVE",
        shipping: true,
        views: 120,
        inquiries: 2,
        createdDate: new Date(Date.now() - 86400000 * 7).toISOString(),
        updatedDate: new Date(Date.now() - 86400000).toISOString(),
    },
    {
        id: 2,
        brand: "Trek",
        model: "FX 2",
        type: "Mountain Bike",
        condition: "New",
        price: 12000000,
        location: "Hồ Chí Minh",
        status: "APPROVE",
        shipping: false,
        views: 85,
        inquiries: 1,
        createdDate: new Date(Date.now() - 86400000 * 5).toISOString(),
        updatedDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
        id: 3,
        brand: "Specialized",
        model: "Sirrus X",
        type: "Hybrid Bike",
        condition: "Used",
        price: 15500000,
        location: "Đà Nẵng",
        status: "PENDING",
        shipping: true,
        views: 45,
        inquiries: 0,
        createdDate: new Date(Date.now() - 86400000 * 3).toISOString(),
        updatedDate: new Date().toISOString(),
    },
    {
        id: 4,
        brand: "Cannondale",
        model: "Trail 5",
        type: "Mountain Bike",
        condition: "Used",
        price: 9500000,
        location: "Hà Nội",
        status: "REJECT",
        rejectionReason: "Images are blurry and bike condition is unclear. Please provide clearer photos showing frame details and components.",
        shipping: true,
        views: 12,
        inquiries: 0,
        createdDate: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedDate: new Date(Date.now() - 86400000).toISOString(),
    },
    {
        id: 5,
        brand: "Merida",
        model: "Scultura 400",
        type: "Road Bike",
        condition: "New",
        price: 18000000,
        location: "Đà Nẵng",
        status: "DRAFT",
        shipping: true,
        views: 0,
        inquiries: 0,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
    },
];
