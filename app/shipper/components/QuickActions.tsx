'use client';

import { MESSAGES } from '@/app/constants/messages';
import { Button } from '@/app/components/ui';
import { Truck, ArrowRight } from 'lucide-react';

interface QuickActionsProps {
    onViewAll: () => void;
}

/** Quick access section on Shipper Dashboard */
export function QuickActions({ onViewAll }: QuickActionsProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-gray-500" />
                {MESSAGES.S60_QUICK_ACCESS_TITLE}
            </h2>
            <div className="space-y-3">
                <Button
                    variant="primary"
                    onClick={onViewAll}
                    className="w-full justify-between group"
                >
                    <span>{MESSAGES.S60_BTN_VIEW_ALL}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-center">
                    <p className="text-sm text-gray-500">
                        {MESSAGES.S60_PLACEHOLDER_FEATURES}
                    </p>
                </div>
            </div>
        </div>
    );
}
