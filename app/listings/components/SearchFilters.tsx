/**
 * SearchFilters Component
 * Filter panel for S-31 Listing Results page
 * Based on BR-S30-02: Supported filters
 *
 * Supports:
 * ✅ Price range (min/max)
 * ✅ Bike type
 * ✅ Brand
 * ✅ Condition
 * ❌ Inspection status (NOT supported per BR-S30-02)
 */

'use client';

import React, { useState } from 'react';
import { SearchFilters as SearchFiltersType } from '../../types/listing';
import { BIKE_TYPES, BIKE_BRANDS, CONDITION_OPTIONS, MESSAGES, UI_CONFIG } from '../../constants';
import { handlePriceKeyDown, handlePricePaste, validatePriceValue } from '../../utils/priceInputValidation';

interface SearchFiltersProps {
    filters: SearchFiltersType;
    onFiltersChange: (filters: SearchFiltersType) => void;
    onApply: () => void;
    onClear: () => void;
}

/** Style constants */
const STYLES = {
    container: 'bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24 transition-all duration-300',
    header: 'flex items-center justify-between mb-8 pb-4 border-b border-gray-100',
    title: 'text-xl font-bold text-gray-900 flex items-center gap-2',
    clearButton: 'text-xs font-semibold text-brand-primary hover:text-brand-primary-hover uppercase tracking-wider',
    section: 'mb-8',
    sectionTitle: 'text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest',
    inputGroup: 'grid grid-cols-2 gap-3',
    input: 'w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all ml-0',
    divider: 'my-8 border-gray-100',
    checkboxGroup: 'space-y-3',
    checkboxLabel: 'flex items-center gap-3 cursor-pointer group',
    checkbox: 'w-5 h-5 border-gray-300 rounded-md text-brand-primary focus:ring-brand-primary/20 transition-all cursor-pointer',
    checkboxText: 'text-sm text-gray-600 group-hover:text-gray-900 transition-colors',
    showMoreButton: 'text-xs font-bold text-brand-primary hover:text-brand-primary-hover mt-4 flex items-center gap-1 transition-all',
    applyButton: 'w-full bg-brand-primary text-white py-4 rounded-xl font-bold hover:bg-brand-primary-hover transition-all shadow-md shadow-brand-primary/20 active:scale-[0.98] mt-4',
} as const;

export default function SearchFilters({
    filters,
    onFiltersChange,
    onApply,
    onClear,
}: SearchFiltersProps) {
    const [showAllBrands, setShowAllBrands] = useState(false);
    const [showAllTypes, setShowAllTypes] = useState(false);

    const displayedBrands = showAllBrands ? BIKE_BRANDS : BIKE_BRANDS.slice(0, UI_CONFIG.INITIAL_VISIBLE_ITEMS);
    const displayedTypes = showAllTypes ? BIKE_TYPES : BIKE_TYPES.slice(0, UI_CONFIG.INITIAL_VISIBLE_ITEMS);

    const handleBikeTypeToggle = (type: string) => {
        const currentTypes = filters.bikeTypes || [];
        const newTypes = currentTypes.includes(type)
            ? currentTypes.filter(t => t !== type)
            : [...currentTypes, type];
        onFiltersChange({ ...filters, bikeTypes: newTypes });
    };

    const handleBrandToggle = (brand: string) => {
        const currentBrands = filters.brands || [];
        const newBrands = currentBrands.includes(brand)
            ? currentBrands.filter(b => b !== brand)
            : [...currentBrands, brand];
        onFiltersChange({ ...filters, brands: newBrands });
    };

    const handleConditionToggle = (condition: 'new' | 'used') => {
        const currentConditions = filters.conditions || [];
        const newConditions = currentConditions.includes(condition)
            ? currentConditions.filter(c => c !== condition)
            : [...currentConditions, condition];
        onFiltersChange({ ...filters, conditions: newConditions });
    };

    const hasActiveFilters = () => {
        return (
            filters.minPrice ||
            filters.maxPrice ||
            (filters.bikeTypes && filters.bikeTypes.length > 0) ||
            (filters.brands && filters.brands.length > 0) ||
            (filters.conditions && filters.conditions.length > 0)
        );
    };

    return (
        <div className={STYLES.container}>
            <div className={STYLES.header}>
                <h3 className={STYLES.title}>{MESSAGES.FILTER_TITLE}</h3>
                {hasActiveFilters() && (
                    <button onClick={onClear} className={STYLES.clearButton}>
                        {MESSAGES.FILTER_CLEAR_ALL}
                    </button>
                )}
            </div>

            {/* Price Range */}
            <div className={STYLES.section}>
                <h4 className={STYLES.sectionTitle}>{MESSAGES.FILTER_PRICE_RANGE}</h4>
                <div className={STYLES.inputGroup}>
                    <input
                        type="number"
                        min="0"
                        placeholder={MESSAGES.FILTER_PRICE_MIN}
                        value={filters.minPrice || ''}
                        onKeyDown={handlePriceKeyDown}
                        onPaste={handlePricePaste}
                        onChange={(e) => {
                            onFiltersChange({
                                ...filters,
                                minPrice: validatePriceValue(e.target.value),
                            });
                        }}
                        className={STYLES.input}
                    />
                    <input
                        type="number"
                        min="0"
                        placeholder={MESSAGES.FILTER_PRICE_MAX}
                        value={filters.maxPrice || ''}
                        onKeyDown={handlePriceKeyDown}
                        onPaste={handlePricePaste}
                        onChange={(e) => {
                            onFiltersChange({
                                ...filters,
                                maxPrice: validatePriceValue(e.target.value),
                            });
                        }}
                        className={STYLES.input}
                    />
                </div>
            </div>

            <hr className={STYLES.divider} />

            {/* Bike Type */}
            <div className={STYLES.section}>
                <h4 className={STYLES.sectionTitle}>{MESSAGES.FILTER_BIKE_TYPE}</h4>
                <div className={STYLES.checkboxGroup}>
                    {displayedTypes.map((type) => (
                        <label key={type} className={STYLES.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={filters.bikeTypes?.includes(type) || false}
                                onChange={() => handleBikeTypeToggle(type)}
                                className={STYLES.checkbox}
                            />
                            <span className={STYLES.checkboxText}>{type}</span>
                        </label>
                    ))}
                </div>
                {BIKE_TYPES.length > UI_CONFIG.INITIAL_VISIBLE_ITEMS && (
                    <button
                        onClick={() => setShowAllTypes(!showAllTypes)}
                        className={STYLES.showMoreButton}
                    >
                        {showAllTypes ? MESSAGES.FILTER_COLLAPSE : `${MESSAGES.FILTER_SHOW_MORE} (${BIKE_TYPES.length - UI_CONFIG.INITIAL_VISIBLE_ITEMS})`}
                    </button>
                )}
            </div>

            <hr className={STYLES.divider} />

            {/* Brand */}
            <div className={STYLES.section}>
                <h4 className={STYLES.sectionTitle}>{MESSAGES.FILTER_BRAND}</h4>
                <div className={STYLES.checkboxGroup}>
                    {displayedBrands.map((brand) => (
                        <label key={brand} className={STYLES.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={filters.brands?.includes(brand) || false}
                                onChange={() => handleBrandToggle(brand)}
                                className={STYLES.checkbox}
                            />
                            <span className={STYLES.checkboxText}>{brand}</span>
                        </label>
                    ))}
                </div>
                {BIKE_BRANDS.length > UI_CONFIG.INITIAL_VISIBLE_ITEMS && (
                    <button
                        onClick={() => setShowAllBrands(!showAllBrands)}
                        className={STYLES.showMoreButton}
                    >
                        {showAllBrands ? MESSAGES.FILTER_COLLAPSE : `${MESSAGES.FILTER_SHOW_MORE} (${BIKE_BRANDS.length - UI_CONFIG.INITIAL_VISIBLE_ITEMS})`}
                    </button>
                )}
            </div>

            <hr className={STYLES.divider} />

            {/* Condition */}
            <div className={STYLES.section}>
                <h4 className={STYLES.sectionTitle}>{MESSAGES.FILTER_CONDITION}</h4>
                <div className={STYLES.checkboxGroup}>
                    {CONDITION_OPTIONS.map((option) => (
                        <label key={option.value} className={STYLES.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={filters.conditions?.includes(option.value as 'new' | 'used') || false}
                                onChange={() => handleConditionToggle(option.value as 'new' | 'used')}
                                className={STYLES.checkbox}
                            />
                            <span className={STYLES.checkboxText}>{option.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Apply Button */}
            <button onClick={onApply} className={STYLES.applyButton}>
                {MESSAGES.FILTER_APPLY}
            </button>
        </div>
    );
}
