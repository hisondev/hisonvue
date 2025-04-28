import { isValidHexColor, isValidNumber, isValidRgbaColor } from "./validators"

/**
 * Converts a hex color string (#fff or #ffffff) to rgba(r, g, b, 1) format.
 */
export const hexToRgba = (hex: string) => {
    let r: number, g: number, b: number
  
    if (hex.length === 4) {
      // #rgb → #rrggbb 변환
      r = parseInt(hex[1] + hex[1], 16)
      g = parseInt(hex[2] + hex[2], 16)
      b = parseInt(hex[3] + hex[3], 16)
    } else if (hex.length === 7) {
      r = parseInt(hex.slice(1, 3), 16)
      g = parseInt(hex.slice(3, 5), 16)
      b = parseInt(hex.slice(5, 7), 16)
    } else {
      throw new Error(`Invalid hex color format: ${hex}`)
    }
  
    return `rgba(${r}, ${g}, ${b}, 1)`
}
  
/**
 * Takes a color string (hex or rgba) and returns a standardized rgba() string.
 * @param color A string in hex (#fff, #ffffff) or rgba() format
 * @returns rgba(r, g, b, a) format string
 * @throws Error if the input is not a valid color
 */
export const normalizeToRgba = (color: string) => {
    if (isValidHexColor(color)) {
      return hexToRgba(color)
    }
    if (isValidRgbaColor(color)) {
      return color.replace(/\s+/g, '') // 필요 시 공백 제거
    }
    throw new Error(`Invalid color format: ${color}`)
}

/**
 * Adjusts an rgba color by applying delta to r/g/b and setting a new opacity.
 * @param rgbaString An rgba color string like "rgba(255,255,255,1)"
 * @param add Amount to add to r/g/b values
 * @param newOpacity New alpha (opacity) value
 * @returns Updated rgba string
 */
export const adjustRgbaColor = (rgbaString: string, add: number, newOpacity?: number) => {
    if (!isValidNumber(add) || !isValidNumber(newOpacity)) {
      throw new Error('add and newOpacity must be valid numbers')
    }
  
    // Clamp function to enforce min/max
    const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max)
  
    const match = rgbaString.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(0|1|0?\.\d+))?\s*\)$/i)
    if (!match) {
      throw new Error('Invalid rgba color format')
    }
  
    let [, r, g, b, a] = match
    if(!newOpacity) newOpacity = Number(a)
  
    const rNum = clamp(parseInt(r) + add, 0, 255)
    const gNum = clamp(parseInt(g) + add, 0, 255)
    const bNum = clamp(parseInt(b) + add, 0, 255)
    const aNum = clamp(newOpacity, 0, 1)
  
    return `rgba(${rNum},${gNum},${bNum},${aNum})`
}

/**
 * Inverts an RGBA color string while preserving opacity.
 * Example: rgba(100,150,200,0.8) -> rgba(155,105,55,0.8)
 * @param rgba - RGBA color string
 * @returns Inverted RGBA color string
 */
export const getInvertColor = (rgba: string) => {
    const match = rgba.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+),\s*(\d*\.?\d+)\)$/);
  
    if (!match) throw new Error('Invalid RGBA format.');
  
    const [, r, g, b, a] = match.map(Number);
    const invertedR = 255 - r;
    const invertedG = 255 - g;
    const invertedB = 255 - b;
  
    return `rgba(${invertedR}, ${invertedG}, ${invertedB}, ${a})`;
}

/**
 * Determines whether an RGBA color is considered light or dark.
 * A color is "light" if the sum of RGB components is greater than (255*3)/2 = 382.5
 * @param rgba - RGBA color string
 * @returns `true` if light, `false` if dark
 */
export const getIsColorLight = (rgba: string) => {
    const match = rgba.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+),\s*(\d*\.?\d+)\)$/);
  
    if (!match) throw new Error('Invalid RGBA format.');
  
    const [, r, g, b, a] = match.map(Number);
  
    if (a <= 0.5) {
      return false;
    }
  
    const brightness = r + g + b;
    return brightness > 382.5;
}
  
