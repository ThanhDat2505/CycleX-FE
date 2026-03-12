import React from 'react';
import { ChartDataPoint } from '../../types/adminDashboard';

interface DashboardChartsProps {
    userData: ChartDataPoint[];
    orderData: ChartDataPoint[];
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ userData = [], orderData = [] }) => {
    // Ensure arrays are defined
    const safeUserData = userData || [];
    const safeOrderData = orderData || [];

    // Simple bar chart logic
    const maxValueUser = safeUserData.length > 0 ? Math.max(...safeUserData.map(d => d.value), 10) : 10;
    const maxValueOrder = safeOrderData.length > 0 ? Math.max(...safeOrderData.map(d => d.value), 10) : 10;

    const ChartGrid = () => (
        <div className="absolute inset-x-0 inset-y-0 flex flex-col justify-between pointer-events-none">
            {[0, 1, 2, 3].map((i) => (
                <div key={i} className="border-t border-gray-50 w-full h-0"></div>
            ))}
        </div>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 animate-fade-in" style={{ animationDelay: '200ms' }}>
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-lg font-black text-gray-900 tracking-tight">User Growth</h3>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">Daily acquisitions</p>
                    </div>
                </div>
                <div className="relative h-48 mt-4">
                    <ChartGrid />
                    {safeUserData.length === 0 ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No data available</p>
                        </div>
                    ) : (
                        <div className="flex items-end justify-between h-full gap-3 relative z-10 px-2">
                            {safeUserData.map((data, idx) => (
                                <div key={idx} className="flex-1 flex flex-col items-center group">
                                    <div 
                                        className="w-full bg-blue-500/10 rounded-t-xl group-hover:bg-blue-600 transition-all duration-500 relative cursor-pointer"
                                        aria-label={`${data.value} users on ${data.date}`}
                                        style={{ 
                                            height: `${Math.max((data.value / maxValueUser) * 100, 2)}%`,
                                            animation: `slideUp 1s ease-out ${idx * 100}ms forwards`,
                                            opacity: 0
                                        }}
                                    >
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-20 shadow-xl translate-y-2 group-hover:translate-y-0 pointer-events-none">
                                            {data.value.toLocaleString()} users
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-400 mt-3 truncate w-full text-center">
                                        {data.date ? data.date.split('-').slice(2).join('/') : '--'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 animate-fade-in" style={{ animationDelay: '300ms' }}>
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-lg font-black text-gray-900 tracking-tight">Order Volume</h3>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">Transactions count</p>
                    </div>
                </div>
                <div className="relative h-48 mt-4">
                    <ChartGrid />
                    {safeOrderData.length === 0 ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No data available</p>
                        </div>
                    ) : (
                        <div className="flex items-end justify-between h-full gap-3 relative z-10 px-2">
                            {safeOrderData.map((data, idx) => (
                                <div key={idx} className="flex-1 flex flex-col items-center group">
                                    <div 
                                        className="w-full bg-purple-500/10 rounded-t-xl group-hover:bg-purple-600 transition-all duration-500 relative cursor-pointer"
                                        style={{ 
                                            height: `${Math.max((data.value / maxValueOrder) * 100, 2)}%`,
                                            animation: `slideUp 1s ease-out ${(idx + 3) * 100}ms forwards`,
                                            opacity: 0
                                        }}
                                    >
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-20 shadow-xl translate-y-2 group-hover:translate-y-0 pointer-events-none">
                                            {data.value.toLocaleString()} orders
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-400 mt-3 truncate w-full text-center">
                                        {data.date ? data.date.split('-').slice(2).join('/') : '--'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardCharts;
