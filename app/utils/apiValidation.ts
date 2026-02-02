/**
 * API Response Validation Utilities
 * Centralized validation logic to eliminate duplicate code across services
 */

/**
 * Validates that a response exists and is not null/undefined
 */
export function validateResponse(response: unknown, context: string = 'response'): void {
    if (!response) {
        throw new Error(`No ${context} from server`);
    }
}

/**
 * Validates that a field is an array
 */
export function validateArray(data: unknown, fieldName: string): void {
    if (!Array.isArray(data)) {
        throw new Error(`Invalid response: ${fieldName} must be an array`);
    }
}

/**
 * Validates that a field is a number
 */
export function validateNumber(data: unknown, fieldName: string): void {
    if (typeof data !== 'number') {
        throw new Error(`Invalid response: ${fieldName} must be a number`);
    }
}

/**
 * Validates that a field is an object (not null, not array)
 */
export function validateObject(data: unknown, fieldName: string): void {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
        throw new Error(`Invalid response: ${fieldName} must be an object`);
    }
}

/**
 * Validates that a value is within a set of valid enum values
 */
export function validateEnum<T extends string>(
    value: unknown,
    validValues: readonly T[],
    fieldName: string
): void {
    if (!validValues.includes(value as T)) {
        throw new Error(
            `Invalid ${fieldName}: '${value}'. Valid values are: ${validValues.join(', ')}`
        );
    }
}

/**
 * Validates that a field is a string and not empty
 */
export function validateString(data: unknown, fieldName: string, required: boolean = true): void {
    if (required && (!data || typeof data !== 'string')) {
        throw new Error(`Invalid response: ${fieldName} is required and must be a string`);
    }
    if (!required && data !== undefined && typeof data !== 'string') {
        throw new Error(`Invalid response: ${fieldName} must be a string if provided`);
    }
}

/**
 * Validates that a number is positive (> 0)
 */
export function validatePositiveNumber(data: unknown, fieldName: string): void {
    validateNumber(data, fieldName);
    if ((data as number) < 0) {
        throw new Error(`Invalid response: ${fieldName} must be a positive number`);
    }
}

/**
 * Validates that a field is a boolean
 */
export function validateBoolean(data: unknown, fieldName: string): void {
    if (typeof data !== 'boolean') {
        throw new Error(`Invalid response: ${fieldName} must be a boolean`);
    }
}

/**
 * Validates a User object from auth API
 */
export function validateUser(user: any): void {
    validateObject(user, 'user');
    validateNumber(user.userId, 'user.userId');
    validateString(user.email, 'user.email');
    validateString(user.phone, 'user.phone');
    // Role validation is already handled by TS but good to verify at runtime
    const validRoles = ['BUYER', 'SELLER', 'ADMIN', 'INSPECTOR', 'SHIPPER'];
    validateEnum(user.role, validRoles, 'user.role');
}


