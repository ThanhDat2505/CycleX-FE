import React from 'react';
import { Users, ShoppingBag, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { SummaryMetrics } from '../../types/adminDashboard';

interface StatCardsProps {
    summary: SummaryMetrics;
}

const StatCards: React.FC<StatCardsProps> = ({ summary }) => {
    const stats = [
        {
            label: 'Total Users',
            value: summary.totalUsers.toLocaleString(),
            trend: summary.userTrend,
            icon: Users,
            color: 'blue'
        },
        {
            label: 'Active Users',
            value: summary.activeUsers.toLocaleString(),
            trend: null,
            icon: TrendingUp,
            color: 'green'
        },
        {
            label: 'Total Orders',
            value: summary.totalOrders.toLocaleString(),
            trend: summary.orderTrend,
            icon: ShoppingBag,
            color: 'purple'
        },
        {
            label: 'Total Revenue',
            value: `${(summary.totalRevenue / 1000000).toFixed(1)}M`,
            trend: summary.revenueTrend,
            icon: DollarSign,
            color: 'emerald'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                const isPositive = stat.trend && stat.trend > 0;
                
                return (
                    <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
                                <Icon size={24} />
                            </div>
                            {stat.trend !== null && (
                                <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {isPositive ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                                    {Math.abs(stat.trend)}%
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default StatCards;
