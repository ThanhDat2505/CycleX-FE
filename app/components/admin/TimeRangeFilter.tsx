import React from 'react';
import { TimeRange } from '../../types/adminDashboard';
import { Calendar } from 'lucide-react';

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
                <div className="flex items-center gap-2 animate-fade-in bg-white/5 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shadow-2xl">
                    <div className="flex items-center gap-2 px-3 py-1">
                        <Calendar size={14} className="text-brand-primary" />
                        <input 
                            type="date" 
                            value={customDates.start}
                            onChange={(e) => handleCustomDateChange('start', e.target.value)}
                            className="text-[10px] font-black uppercase tracking-widest text-gray-300 focus:outline-none bg-transparent [color-scheme:dark]"
                        />
                    </div>
                    <span className="text-gray-600 font-bold">→</span>
                    <div className="flex items-center gap-2 px-3 py-1">
                        <input 
                            type="date" 
                            value={customDates.end}
                            onChange={(e) => handleCustomDateChange('end', e.target.value)}
                            className="text-[10px] font-black uppercase tracking-widest text-gray-300 focus:outline-none bg-transparent [color-scheme:dark]"
                        />
                    </div>
                </div>
            )}
            
            <div className="flex items-center p-1 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl overflow-hidden">
                {filters.map((filter) => (
                    <button
                        key={filter.value}
                        onClick={() => onRangeChange(filter.value)}
                        className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${
                            currentRange === filter.value
                                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20 scale-100'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
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
