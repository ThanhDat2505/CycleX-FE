export function DeliveryListSkeleton() {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 animate-pulse">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                            <div className="h-5 w-24 bg-gray-200 rounded-full"></div>
                            <div className="h-4 w-20 bg-gray-200 rounded"></div>
                        </div>
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                        <div className="flex-1">
                            <div className="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
                            <div className="space-y-2">
                                <div className="h-4 w-full bg-gray-200 rounded"></div>
                                <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                        <div className="w-8 h-8 bg-gray-200 rounded-full self-center"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function DeliveryDetailSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 pb-24 animate-pulse">
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        <div>
                            <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
                            <div className="h-4 w-32 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex gap-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 py-1">
                        <div className="h-6 w-3/4 bg-gray-200 rounded mb-3"></div>
                        <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                    <div className="flex gap-4">
                        <div className="w-4 h-4 rounded-full bg-gray-200"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-24 bg-gray-200 rounded"></div>
                            <div className="h-5 w-1/2 bg-gray-200 rounded"></div>
                            <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                    <div className="border-t border-gray-100"></div>
                    <div className="flex gap-4">
                        <div className="w-4 h-4 rounded-full bg-gray-200"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-24 bg-gray-200 rounded"></div>
                            <div className="h-5 w-1/2 bg-gray-200 rounded"></div>
                            <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
