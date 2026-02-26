/**
 * Price Input Validation Utilities
 * Extracted to follow DRY principle - used by both minPrice and maxPrice inputs
 */

import React from 'react';

/**
 * Prevents typing invalid characters in number inputs
 * Blocks: minus (-), plus (+), e, E (scientific notation)
 */
export const handlePriceKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const invalidKeys = ['-', '+', 'e', 'E'];
    if (invalidKeys.includes(e.key)) {
        e.preventDefault();
    }
};

/**
 * Prevents pasting negative numbers
 */
export const handlePricePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData('text');
    // Block if contains minus sign OR is negative number
    if (pastedText.includes('-') || Number(pastedText) < 0) {
        e.preventDefault();
    }
};

/**
 * Validates and returns price value (only accepts non-negative)
 * @returns number or undefined (for empty input)
 */
export const validatePriceValue = (value: string): number | undefined => {
    if (value === '') return undefined;
    const numValue = Number(value);
    return numValue >= 0 ? numValue : undefined;
};
