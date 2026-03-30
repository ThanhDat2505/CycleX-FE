import React from 'react';
import { TimeRange } from '../../types/adminDashboard';
import { Calendar } from '@/app/components/ui/Icons';

interface TimeRangeFilterProps {
    currentRange: TimeRange;
    onRangeChange: (range: TimeRange, startDate?: string, endDate?: string) => void;
}

const TimeRangeFilter: React.FC<TimeRangeFilterProps> = ({ currentRange, onRangeChange }) => {
    const [customDates, setCustomDates] = React.useState({ start: '', end: '' });

    const filters: { label: string; value: TimeRange }[] = [
        { label: 'Hôm nay', value: 'TODAY' },
        { label: '7 Ngày', value: 'LAST_7_DAYS' },
        { label: '30 Ngày', value: 'LAST_30_DAYS' },
        { label: 'Tùy chọn', value: 'CUSTOM' }
    ];

    const handleCustomDateChange = (type: 'start' | 'end', value: string) => {
        const newDates = { ...customDates, [type]: value };
        setCustomDates(newDates);
        if (newDates.start && newDates.end) {
            onRangeChange('CUSTOM', newDates.start, newDates.end);
        }
    };

    return (
        <div className="flex flex-col md:flex-row items-center gap-3">
            {currentRange === 'CUSTOM' && (
                <div className="flex items-center gap-2 animate-fade-in bg-white border border-gray-200 rounded-2xl p-1.5 shadow-sm">
                    <div className="flex items-center gap-2 px-3 py-1.5">
                        <Calendar size={14} className="text-brand-primary shrink-0" />
                        <input
                            type="date"
                            value={customDates.start}
                            onChange={(e) => handleCustomDateChange('start', e.target.value)}
                            className="text-sm font-medium text-gray-700 focus:outline-none bg-transparent [color-scheme:light]"
                        />
                    </div>
                    <span className="text-gray-400 font-bold">→</span>
                    <div className="flex items-center gap-2 px-3 py-1.5">
                        <input
                            type="date"
                            value={customDates.end}
                            onChange={(e) => handleCustomDateChange('end', e.target.value)}
                            className="text-sm font-medium text-gray-700 focus:outline-none bg-transparent [color-scheme:light]"
                        />
                    </div>
                </div>
            )}

            <div className="flex items-center p-1 bg-gray-100 rounded-2xl border border-gray-200 overflow-hidden">
                {filters.map((filter) => (
                    <button
                        key={filter.value}
                        onClick={() => onRangeChange(filter.value)}
                        className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
                            currentRange === filter.value
                                ? 'bg-brand-primary text-white shadow-sm'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
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
