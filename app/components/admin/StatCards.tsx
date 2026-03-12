import React from 'react';
import { Users, TrendingUp, ShoppingBag, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { SummaryMetrics } from '../../types/adminDashboard';
import { formatNumber, formatCompactNumber } from '../../utils/format';

interface StatCardsProps {
    summary: SummaryMetrics;
}

const StatCards: React.FC<StatCardsProps> = ({ summary }) => {
    const stats = [
        {
            label: 'Total Users',
            value: formatNumber(summary?.totalUsers || 0),
            trend: summary?.userTrend || 0,
            icon: Users,
            color: 'blue'
        },
        {
            label: 'Active Users',
            value: formatNumber(summary?.activeUsers || 0),
            trend: null,
            icon: TrendingUp,
            color: 'emerald'
        },
        {
            label: 'Total Orders',
            value: formatNumber(summary?.totalOrders || 0),
            trend: summary?.orderTrend || 0,
            icon: ShoppingBag,
            color: 'purple'
        },
        {
            label: 'Total Revenue',
            value: formatCompactNumber(summary?.totalRevenue || 0),
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
                                <div className={`mt-4 flex items-center gap-1.5 ${stat.trend >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    <div className={`p-1 rounded-lg ${stat.trend >= 0 ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                                        {stat.trend >= 0 ? <ArrowUpRight size={14} strokeWidth={3} /> : <ArrowDownRight size={14} strokeWidth={3} />}
                                    </div>
                                    <span className="text-[13px] font-black tracking-tight">
                                        {stat.trend >= 0 ? '+' : ''}{stat.trend}%
                                    </span>
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
