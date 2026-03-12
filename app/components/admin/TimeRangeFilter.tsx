import React from 'react';
import { Calendar } from 'lucide-react';
import { TimeRange } from '../../types/adminDashboard';

interface TimeRangeFilterProps {
    currentRange: TimeRange;
    onRangeChange: (range: TimeRange, startDate?: string, endDate?: string) => void;
}

const TimeRangeFilter: React.FC<TimeRangeFilterProps> = ({ currentRange, onRangeChange }) => {
    const [customDates, setCustomDates] = React.useState({ start: '', end: '' });

    const filters: { label: string; value: TimeRange }[] = [
        { label: 'Today', value: 'TODAY' },
        { label: '7D', value: 'LAST_7_DAYS' },
        { label: '30D', value: 'LAST_30_DAYS' },
        { label: 'Custom', value: 'CUSTOM' }
    ];

    const handleCustomDateChange = (type: 'start' | 'end', value: string) => {
        const newDates = { ...customDates, [type]: value };
        setCustomDates(newDates);
        if (newDates.start && newDates.end) {
            onRangeChange('CUSTOM', newDates.start, newDates.end);
        }
    };

    return (
        <div className="flex flex-col md:flex-row items-end md:items-center gap-4">
            {currentRange === 'CUSTOM' && (
                <div className="flex items-center gap-2 animate-fade-in bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
                    <input 
                        type="date" 
                        value={customDates.start}
                        onChange={(e) => handleCustomDateChange('start', e.target.value)}
                        className="text-xs font-bold text-gray-600 p-1.5 focus:outline-none bg-transparent"
                    />
                    <span className="text-gray-300">→</span>
                    <input 
                        type="date" 
                        value={customDates.end}
                        onChange={(e) => handleCustomDateChange('end', e.target.value)}
                        className="text-xs font-bold text-gray-600 p-1.5 focus:outline-none bg-transparent"
                    />
                </div>
            )}
            <div className="flex items-center space-x-1 bg-gray-100/80 p-1 rounded-xl backdrop-blur-sm border border-gray-100">
                {filters.map((filter) => (
                    <button
                        key={filter.value}
                        onClick={() => onRangeChange(filter.value)}
                        className={`px-4 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${
                            currentRange === filter.value
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-400 hover:text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TimeRangeFilter;
