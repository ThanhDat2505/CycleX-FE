// components/Dashboard/MetricCard.tsx
import Link from "next/link";
import React from "react";

interface MetricCardProps {
    label: string;
    value: string | number;
    icon: string;
    change: string;
    href: string;
    isPositive?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
                                                          label,
                                                          value,
                                                          icon,
                                                          change,
                                                          href,
                                                          isPositive = false,
                                                      }) => {
    return (
        <Link href={href}>
            <div
                className="bg-white p-6 rounded-lg border border-gray-200 hover:border-[#FF8A00] hover:shadow-lg transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-3">
          <span className="text-xs font-semibold uppercase text-gray-600">
            {label}
          </span>
                    <span className="text-2xl">{icon}</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
                <div
                    className={`text-sm font-medium ${isPositive ? "text-green-600" : "text-gray-600"}`}
                >
                    {change}
                </div>
            </div>
        </Link>
    );
};
