import { isValidHexColor, isValidNumber, isValidRgbaColor } from "./validators"

export const primaryColorHex = '#428bca'
export const mutedColorHex = '#808080'
export const infoColorHex = '#5bc0de'
export const successColorHex = '#5cb85c'
export const dangerColorHex = '#d9534f'
export const warningColorHex = '#f0ad4e'

export const primaryColorRGBA = 'rgba(66,139,202,1)'
export const mutedColorRGBA = 'rgba(128,128,128,1)'
export const infoColorRGBA = 'rgba(91,192,222,1)'
export const successColorRGBA = 'rgba(92,184,92,1)'
export const dangerColorRGBA = 'rgba(217,83,79,1)'
export const warningColorRGBA = 'rgba(240,173,78,1)'
export const darkTextColorRGBA = 'rgba(48,48,48,1)'
export const lightTextColorRGBA = 'rgba(255,255,255,1)'
export const emptyColorRGBA = 'rgba(255,255,255,0)'

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
 * Converts an rgba() string to a hex color string (#rrggbb).
 * Opacity (alpha) value is ignored.
 * 
 * @param rgba A string in rgba(r, g, b, a) format
 * @returns A string in #rrggbb format
 */
export const rgbaToHex = (rgba: string): string => {
  const match = rgba.replace(/\s+/g, '').match(/^rgba?\((\d+),(\d+),(\d+),?.*\)$/i);
  
  if (!match) {
    throw new Error(`Invalid rgba color format: ${rgba}`);
  }

  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);

  const toHex = (n: number) => {
    const hex = n.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};
  
/**
 * Takes a color string (hex or rgba) and returns a standardized rgba() string.
 * @param color A string in hex (#fff, #ffffff) or rgba() format
 * @returns rgba(r, g, b, a) format string
 * @throws Error if the input is not a valid color
 */
export const normalizeToHex = (color: string) => {
    if (isValidHexColor(color)) {
      return color.replace(/\s+/g, '')
    }
    if (isValidRgbaColor(color)) {
      return rgbaToHex(color)
    }
    throw new Error(`Invalid color format: ${color}`)
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
    if (!isValidNumber(add)) {
      throw new Error('add must be valid numbers')
    }
    if (newOpacity && !isValidNumber(newOpacity)) {
      throw new Error('newOpacity must be valid numbers')
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
    return brightness > 450;
}

export const getHexCodeFromColorText = (colorText: string) => {
  switch(colorText) {
    case 'primary' :
        return primaryColorHex
    case 'muted' :
        return mutedColorHex
    case 'info' :
        return infoColorHex
    case 'success' :
        return successColorHex
    case 'danger' :
        return dangerColorHex
    case 'warning' :
        return warningColorHex
  }
  return ''
}

export const getRGBAFromColorText = (colorText: string) => {
  switch(colorText) {
    case 'primary' :
        return primaryColorRGBA
    case 'muted' :
        return mutedColorRGBA
    case 'info' :
        return infoColorRGBA
    case 'success' :
        return successColorRGBA
    case 'danger' :
        return dangerColorRGBA
    case 'warning' :
        return warningColorRGBA
  }
  return ''
}

export const getBasicTextColor = (backgroundColor: string) => {
  return getIsColorLight(backgroundColor) ? darkTextColorRGBA : lightTextColorRGBA
}
