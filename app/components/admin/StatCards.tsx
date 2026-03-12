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
            value: (summary?.totalUsers || 0).toLocaleString(),
            trend: summary?.userTrend || 0,
            icon: Users,
            color: 'blue'
        },
        {
            label: 'Active Users',
            value: (summary?.activeUsers || 0).toLocaleString(),
            trend: null,
            icon: TrendingUp,
            color: 'emerald'
        },
        {
            label: 'Total Orders',
            value: (summary?.totalOrders || 0).toLocaleString(),
            trend: summary?.orderTrend || 0,
            icon: ShoppingBag,
            color: 'purple'
        },
        {
            label: 'Total Revenue',
            value: `${((summary?.totalRevenue || 0) / 1000000).toFixed(1)}M`,
            trend: summary?.revenueTrend || 0,
            icon: DollarSign,
            color: 'amber'
        }
    ];

    const colorVariants: Record<string, string> = {
        blue: 'bg-blue-50 text-blue-600 border-blue-100',
        emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        purple: 'bg-purple-50 text-purple-600 border-purple-100',
        amber: 'bg-amber-50 text-amber-600 border-amber-100'
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                const isPositive = stat.trend && stat.trend > 0;
                
                return (
                    <div 
                        key={index} 
                        className={`bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up`}
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-3.5 rounded-2xl border ${colorVariants[stat.color]}`}>
                                <Icon size={22} strokeWidth={2.5} />
                            </div>
                            {stat.trend !== null && (
                                <div className={`flex items-center px-2 py-1 rounded-lg text-xs font-bold ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                    {isPositive ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
                                    {Math.abs(stat.trend)}%
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs font-black uppercase tracking-[0.15em] mb-1">{stat.label}</p>
                            <div className="flex items-baseline gap-1">
                                <h3 className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</h3>
                                {stat.label === 'Total Revenue' && <span className="text-xs font-bold text-gray-400">VND</span>}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default StatCards;
