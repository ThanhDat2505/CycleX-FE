'use client';

import React from 'react';
import { X } from 'lucide-react';
import { SearchFilters } from '../../types/listing';
import { MESSAGES } from '../../constants';

interface ActiveFiltersProps {
    filters: SearchFilters;
    onRemoveFilter: (key: keyof SearchFilters, value?: string) => void;
    onClearAll: () => void;
}

const STYLES = {
    wrapper: 'flex flex-wrap items-center gap-2 mb-4 animate-fade-in',
    label: 'text-sm font-medium text-gray-500 mr-1',
    chip: 'flex items-center gap-1 bg-white border border-gray-200 px-3 py-1.5 rounded-full text-sm text-gray-700 hover:border-brand-primary/30 transition-all shadow-sm group',
    chipText: 'font-medium',
    removeBtn: 'hover:text-red-500 transition-colors',
    clearBtn: 'text-sm text-brand-primary hover:underline font-medium px-2 py-1',
} as const;

/**
 * ActiveFilters - Displays clickable chips for each active filter
 * Allows users to quickly identify and remove specific filters
 */
export function ActiveFilters({ filters, onRemoveFilter, onClearAll }: ActiveFiltersProps) {
    const activeFiltersCount = [
        filters.minPrice,
        filters.maxPrice,
        ...(filters.bikeTypes || []),
        ...(filters.brands || []),
        ...(filters.conditions || []),
    ].filter(Boolean).length;

    if (activeFiltersCount === 0) return null;

    return (
        <div className={STYLES.wrapper}>
            <span className={STYLES.label}>{MESSAGES.FILTER_TITLE}:</span>

            {/* Price Range */}
            {(filters.minPrice || filters.maxPrice) && (
                <div className={STYLES.chip}>
                    <span className={STYLES.chipText}>
                        {filters.minPrice ? `${filters.minPrice.toLocaleString()}đ` : '0'}
                        {' - '}
                        {filters.maxPrice ? `${filters.maxPrice.toLocaleString()}đ` : '...'}
                    </span>
                    <button
                        onClick={() => {
                            onRemoveFilter('minPrice');
                            onRemoveFilter('maxPrice');
                        }}
                        className={STYLES.removeBtn}
                    >
                        <X size={14} />
                    </button>
                </div>
            )}

            {/* Bike Types */}
            {filters.bikeTypes?.map((type) => (
                <div key={`type-${type}`} className={STYLES.chip}>
                    <span className={STYLES.chipText}>{type}</span>
                    <button
                        onClick={() => onRemoveFilter('bikeTypes', type)}
                        className={STYLES.removeBtn}
                    >
                        <X size={14} />
                    </button>
                </div>
            ))}

            {/* Brands */}
            {filters.brands?.map((brand) => (
                <div key={`brand-${brand}`} className={STYLES.chip}>
                    <span className={STYLES.chipText}>{brand}</span>
                    <button
                        onClick={() => onRemoveFilter('brands', brand)}
                        className={STYLES.removeBtn}
                    >
                        <X size={14} />
                    </button>
                </div>
            ))}

            {/* Conditions */}
            {filters.conditions?.map((cond) => (
                <div key={`cond-${cond}`} className={STYLES.chip}>
                    <span className={STYLES.chipText}>{cond === 'new' ? 'Mới' : 'Đã sử dụng'}</span>
                    <button
                        onClick={() => onRemoveFilter('conditions', cond)}
                        className={STYLES.removeBtn}
                    >
                        <X size={14} />
                    </button>
                </div>
            ))}

            {/* Clear All */}
            <button onClick={onClearAll} className={STYLES.clearBtn}>
                {MESSAGES.FILTER_CLEAR_ALL}
            </button>
        </div>
    );
}
