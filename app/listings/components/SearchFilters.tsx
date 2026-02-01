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
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">{MESSAGES.FILTER_TITLE}</h3>
                {hasActiveFilters() && (
                    <button
                        onClick={onClear}
                        className="text-sm text-brand-primary hover:underline"
                    >
                        {MESSAGES.FILTER_CLEAR_ALL}
                    </button>
                )}
            </div>

            {/* Price Range */}
            <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">{MESSAGES.FILTER_PRICE_RANGE}</h4>
                <div className="space-y-3">
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                </div>
            </div>

            <hr className="my-6" />

            {/* Bike Type */}
            <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">{MESSAGES.FILTER_BIKE_TYPE}</h4>
                <div className="space-y-2">
                    {displayedTypes.map((type) => (
                        <label key={type} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={filters.bikeTypes?.includes(type) || false}
                                onChange={() => handleBikeTypeToggle(type)}
                                className="w-4 h-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary"
                            />
                            <span className="text-sm text-gray-700">{type}</span>
                        </label>
                    ))}
                </div>
                {BIKE_TYPES.length > UI_CONFIG.INITIAL_VISIBLE_ITEMS && (
                    <button
                        onClick={() => setShowAllTypes(!showAllTypes)}
                        className="text-sm text-brand-primary hover:underline mt-2"
                    >
                        {showAllTypes ? MESSAGES.FILTER_COLLAPSE : `${MESSAGES.FILTER_SHOW_MORE} (${BIKE_TYPES.length - UI_CONFIG.INITIAL_VISIBLE_ITEMS})`}
                    </button>
                )}
            </div>

            <hr className="my-6" />

            {/* Brand */}
            <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">{MESSAGES.FILTER_BRAND}</h4>
                <div className="space-y-2">
                    {displayedBrands.map((brand) => (
                        <label key={brand} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={filters.brands?.includes(brand) || false}
                                onChange={() => handleBrandToggle(brand)}
                                className="w-4 h-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary"
                            />
                            <span className="text-sm text-gray-700">{brand}</span>
                        </label>
                    ))}
                </div>
                {BIKE_BRANDS.length > UI_CONFIG.INITIAL_VISIBLE_ITEMS && (
                    <button
                        onClick={() => setShowAllBrands(!showAllBrands)}
                        className="text-sm text-brand-primary hover:underline mt-2"
                    >
                        {showAllBrands ? MESSAGES.FILTER_COLLAPSE : `${MESSAGES.FILTER_SHOW_MORE} (${BIKE_BRANDS.length - UI_CONFIG.INITIAL_VISIBLE_ITEMS})`}
                    </button>
                )}
            </div>

            <hr className="my-6" />

            {/* Condition */}
            <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">{MESSAGES.FILTER_CONDITION}</h4>
                <div className="space-y-2">
                    {CONDITION_OPTIONS.map((option) => (
                        <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={filters.conditions?.includes(option.value as 'new' | 'used') || false}
                                onChange={() => handleConditionToggle(option.value as 'new' | 'used')}
                                className="w-4 h-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary"
                            />
                            <span className="text-sm text-gray-700">{option.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Apply Button */}
            <button
                onClick={onApply}
                className="w-full bg-brand-primary text-white py-3 rounded-lg font-medium hover:bg-brand-primary-hover transition-colors"
            >
                {MESSAGES.FILTER_APPLY}
            </button>
        </div>
    );
}
