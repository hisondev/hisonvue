import type { DeviceType } from "../types"

export const isNullOrUndefined = (value: any) => {
  if(value === null || value === undefined) return true
  return false
}

export const getUUID = () => {
    let d = new Date().getTime()
    if (typeof performance !== "undefined" && typeof performance.now === "function"){
        d += performance.now()
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (d + Math.random() * 16) % 16 | 0
        d = Math.floor(d / 16)
        return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16)
    })
}

export const toLowerCase = (value: string | null) => {
    if (!value || typeof value !== 'string') return '';
    return value.toLowerCase();
};
export const toUpperCase = (value: string | null) => {
    if (!value || typeof value !== 'string') return '';
    return value.toUpperCase();
};

export const getMaskValue = (value: string, format: string) => {
  if(typeof format !== 'string') return null;
  if(typeof value !== 'string') return null;
  const formatArr = format.split('');
  const valueArr = value.split('');
  let lastValue = '';
  let isValid;
  formatArr.every((formatPiece, idx) => {
      isValid = false;
      switch (formatPiece) {
        case 'A':
            if (/^[A-Z]$/.test(valueArr[idx])) {
                lastValue += valueArr[idx];
                isValid = true;
            }
            else if (/^[a-z]$/.test(valueArr[idx])) {
                lastValue += toUpperCase(valueArr[idx]);
                isValid = true;
            }
            break;
        case 'a':
            if (/^[a-z]$/.test(valueArr[idx])) {
                lastValue += valueArr[idx];
                isValid = true;
            }
            else if (/^[A-Z]$/.test(valueArr[idx])) {
                lastValue += toLowerCase(valueArr[idx]);
                isValid = true;
            }
            break;
        case '9':
            if (/^[0-9]$/.test(valueArr[idx])) {
                lastValue += valueArr[idx];
                isValid = true;
            }
            break;
        default:
            if (formatPiece === valueArr[idx]) {
                lastValue += valueArr[idx];
                isValid = true;
            }
            break;
      }
      return isValid;
  })
  return lastValue;
};

export const getDigitsOnly = (value: string) => {
  return value.replace(/[^0-9]/g, '');
}

export const getDeviceType = (width: number): DeviceType => {
  if (width < 768) return 'mb'
  if (width < 1200) return 'tb'
  if (width < 1980) return 'pc'
  return 'wd'
}

export const getColorClass = (el: HTMLElement, elTypeName: string, suffix: string) => {
    const color = getSpecificClassValueFromClassList(el.classList, 'color')
    if(color) return `hison-color-${color}-${elTypeName}-${suffix}`

    return `hison-color-primary-${elTypeName}-${suffix}`
}

export const getSpecificClassNameFromClassList = (classList: DOMTokenList | string[], classStarts: string) => {
    return Array.from(classList).find(cls => cls.startsWith(`hison-${classStarts}-`))
}

export const getSpecificClassValueFromClassList = (classList: DOMTokenList | string[], classStarts: string) => {
    const specificClassName = getSpecificClassNameFromClassList(classList, classStarts)
    if(specificClassName) {
        const parts = specificClassName.split('-')
        if(parts.length >= 3) return parts[2]
    }
    return null
}

export const getIndexSpecificClassNameFromClassList = (classList: string[], classStarts: string) => {
  return classList.findIndex(cls => cls.startsWith(`hison-${classStarts}-`))
}

export const extractResponsiveClasses = (
  classStr: string,
  device: 'mb' | 'tb' | 'pc' | 'wd'
): string[] => {
  const parts = classStr.trim().split(/\s+/)
  const map: Record<string, Partial<Record<'mb' | 'tb' | 'pc' | 'wd' | 'default', string>>> = {}
  const staticClasses: string[] = []

  for (const cls of parts) {
    const match = cls.match(/^(hison-(color|size|col|pos|layout-vertical-align)-[\w]+?)(?:-(mb|tb|pc|wd))?$/)
    if (match) {
      const base = match[1] // 예: hison-col-6
      const category = match[2] // col, pos, layout-vertical-align
      const bp = match[3] as 'mb' | 'tb' | 'pc' | 'wd' | undefined
      if (!map[category]) map[category] = {}
      if (bp) map[category]![bp] = base
      else map[category]!.default = base
    } else {
      staticClasses.push(cls) // 일반 클래스는 그대로 유지
    }
  }

  const responsiveClasses: string[] = []

  for (const bpMap of Object.values(map)) {
    const value =
      bpMap[device] ||
      (device === 'mb' ? bpMap.tb : undefined) ||
      (device === 'tb' ? bpMap.mb : undefined) ||
      (device === 'pc' ? bpMap.wd : undefined) ||
      (device === 'wd' ? bpMap.pc : undefined) ||
      bpMap.default

    if (value) responsiveClasses.push(value)
  }

  return [...staticClasses, ...responsiveClasses].filter(Boolean)
}

export const addComponentNameToClass = (classList: string[], classStarts: string, addComponentName: string, defaultAttrName: string) => {
    const idx = getIndexSpecificClassNameFromClassList(classList, classStarts)
    if (idx !== -1) {
        classList[idx] = classList[idx] + `-${addComponentName}`
    } else {
        classList.push(`hison-${classStarts}-${defaultAttrName}-${addComponentName}`)
    }
}
