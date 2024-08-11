
// Furniture Name: Letters, numbers, spaces, and common punctuation allowed
export const isValidCategory = (value: string) => {
    const pattern: RegExp = /^[A-Za-z0-9 ',-]{1,100}$/;
    return pattern.test(value)
}

// Model Number: Alphanumeric with optional dashes or underscores
export const isValidModel = (value: string) => {
    const pattern: RegExp = /^[A-Za-z0-9-_]{1,30}$/;
    return pattern.test(value)
}

// Material Type: Letters only (e.g., "Wood", "Metal")
export const isValidMaterial = (value: string) => {
    const pattern: RegExp = /^[A-Za-z ]{1,50}/;
    return pattern.test(value)
}

/**
 *  For ensuring that the dimensions are provided in a valid format like "Length x Width x Height".
 *  This allows digits with optional decimals, separated by "x". This ensures that dimensions like "50x100x200" or "50.5x100.3x200.7" are valid.
 * @param length 
 * @param width 
 * @param height 
 * @returns 
 */
export const isValidDimesions = (length: string, width: string, height: string) => {
    const pattern: RegExp = /^\d{1,3}(cm|in|m)?\s*x\s*\d{1,3}(cm|in|m)?\s*x\s*\d{1,3}(cm|in|m)?$/;
    return pattern.test(`${length}x${width}x${height}`)
}

// Weight: Positive decimal number, up to two decimal places
export const isValidWeight = (value: string) => {
    const pattern: RegExp = /^(0|[1-9]\d*)(\.\d{1,2})?$/;
    return pattern.test(value)
}
