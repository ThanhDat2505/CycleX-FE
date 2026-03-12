import React from 'react';
import { ChartDataPoint } from '../../types/adminDashboard';

interface DashboardChartsProps {
    userData: ChartDataPoint[];
    orderData: ChartDataPoint[];
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ userData, orderData }) => {
    // Simple bar chart logic
    const maxValueUser = Math.max(...userData.map(d => d.value), 10);
    const maxValueOrder = Math.max(...orderData.map(d => d.value), 10);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">User Growth</h3>
                    <span className="text-xs font-medium px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full">New Users</span>
                </div>
                <div className="flex items-end justify-between h-48 gap-2">
                    {userData.map((data, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center group">
                            <div 
                                className="w-full bg-blue-100 rounded-t-lg group-hover:bg-blue-600 transition-all relative"
                                style={{ height: `${(data.value / maxValueUser) * 100}%` }}
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                    {data.value} users
                                </div>
                            </div>
                            <span className="text-[10px] text-gray-400 mt-2 rotate-45 lg:rotate-0 origin-left lg:origin-center">{data.date.split('-').slice(1).join('/')}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Order Volume</h3>
                    <span className="text-xs font-medium px-2.5 py-1 bg-purple-50 text-purple-600 rounded-full">Transactions</span>
                </div>
                <div className="flex items-end justify-between h-48 gap-2">
                    {orderData.map((data, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center group">
                            <div 
                                className="w-full bg-purple-100 rounded-t-lg group-hover:bg-purple-600 transition-all relative"
                                style={{ height: `${(data.value / maxValueOrder) * 100}%` }}
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                    {data.value} orders
                                </div>
                            </div>
                            <span className="text-[10px] text-gray-400 mt-2 rotate-45 lg:rotate-0 origin-left lg:origin-center">{data.date.split('-').slice(1).join('/')}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardCharts;
