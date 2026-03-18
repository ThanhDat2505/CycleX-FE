export interface ListingFormData {
    title: string;
    brand: string;
    model: string;
    category: string;
    condition: string;
    year: string;
    price: string;
    location: string;
    pickupAddress: string;
    description: string;
    usageTime: string;
    reasonForSale: string;
    shipping: boolean;
    // Address picker fields
    addressProvince: string;
    addressDistrict: string;
    addressWard: string;
    addressStreet: string;
    // Video upload
    videoUrl: string;
}
