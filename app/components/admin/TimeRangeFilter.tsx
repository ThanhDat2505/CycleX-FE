import React from 'react';
import { Calendar } from 'lucide-react';
import { TimeRange } from '../../types/adminDashboard';

interface TimeRangeFilterProps {
    currentRange: TimeRange;
    onRangeChange: (range: TimeRange) => void;
}

const TimeRangeFilter: React.FC<TimeRangeFilterProps> = ({ currentRange, onRangeChange }) => {
    const filters: { label: string; value: TimeRange }[] = [
        { label: 'Today', value: 'TODAY' },
        { label: '7D', value: 'LAST_7_DAYS' },
        { label: '30D', value: 'LAST_30_DAYS' },
        { label: 'Custom', value: 'CUSTOM' }
    ];

    return (
        <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-xl">
            {filters.map((filter) => (
                <button
                    key={filter.value}
                    onClick={() => onRangeChange(filter.value)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                        currentRange === filter.value
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200'
                    }`}
                >
                    {filter.label}
                </button>
            ))}
            <div className="h-6 w-px bg-gray-300 mx-1"></div>
            <button className="p-2 text-gray-500 hover:text-gray-900 transition-colors">
                <Calendar size={18} />
            </button>
        </div>
    );
};

export default TimeRangeFilter;
