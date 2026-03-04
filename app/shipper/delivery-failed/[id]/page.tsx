'use client';

import { useRouter } from 'next/navigation';

export default function DeliveryFailedPage() {
    const router = useRouter();
    return (
        <div className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">S-64 Delivery Failed Report</h1>
            <p>Placeholder for S-64</p>
            <button onClick={() => router.back()} className="mt-4 px-4 py-2 bg-gray-200 rounded">Go Back</button>
        </div>
    );
}
