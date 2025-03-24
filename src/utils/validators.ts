/**
 * Validates whether a string is a proper 6-digit hex color code (e.g., "#ffffff").
 * @param color - The color string to validate
 * @returns `true` if valid, `false` otherwise
 */
export function isValidHexColor(color: string): boolean {
    return /^#[0-9a-fA-F]{6}$/.test(color)
}
  
/**
 * Validates whether a string is a positive integer with 'px' suffix (e.g., '300px').
 * @param value - The string to validate
 * @returns `true` if valid, `false` otherwise
 */
export function isValidPxValue(value: string): boolean {
    return /^[1-9][0-9]*px$/.test(value)
}
