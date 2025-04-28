/**
 * Validates whether a string is a proper hex color code.
 * Accepts both 3-digit (#fff) and 6-digit (#ffffff) formats.
 * @param color - The color string to validate
 * @returns `true` if valid, `false` otherwise
 */
export const isValidHexColor = (color: string) => {
    return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(color)
  }
  
/**
 * Validates whether a string is a positive integer with 'px' suffix (e.g., '300px').
 * @param value - The string to validate
 * @returns `true` if valid, `false` otherwise
 */
export const isValidPxValue= (value: string) => {
    return /^[1-9][0-9]*px$/.test(value)
}

/**
 * Validates whether a string is a proper rgba() color format.
 * @param color - The color string to validate
 * @returns `true` if valid, `false` otherwise
 */
export const isValidRgbaColor= (color: string) => {
    return /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(\s*,\s*(0|1|0?\.\d+))?\s*\)$/.test(color)
}

/**
 * Checks if the given value is a finite number.
 */
export const isValidNumber= (value: any) => {
    return typeof value === 'number' && isFinite(value)
}
