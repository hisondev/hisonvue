import type { DeviceType } from "../types"

/** null 또는 undefined인지 확인 */
export const isNullOrUndefined = (value: any) => {
    if(value === null || value === undefined) return true
    return false
}

/** 객체 간 재귀 병합 (deep merge) */
export const deepMerge = (target: any, source: any) => {
    if (typeof target !== 'object' || typeof source !== 'object') return source

    const result = { ...target }
    for (const key in source) {
        if (
            source.hasOwnProperty(key) &&
            typeof source[key] === 'object' &&
            !Array.isArray(source[key]) &&
            source[key] !== null
        ) {
            result[key] = deepMerge(result[key] ?? {}, source[key])
        } else {
            result[key] = source[key]
        }
    }
    return result
}

/** 고유 UUID 생성 */
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

/** 문자열을 소문자로 변환 */
export const toLowerCase = (value: string | null) => {
    if (!value || typeof value !== 'string') return '';
    return value.toLowerCase();
};

/** 문자열을 대문자로 변환 */
export const toUpperCase = (value: string | null) => {
    if (!value || typeof value !== 'string') return '';
    return value.toUpperCase();
};

/**
 * 지정된 포맷에 맞게 문자열 마스킹 처리
 * - 예: format = 'AA-9999', value = 'ab1234' → 'AB-1234'
 */
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


/** 숫자만 추출 (0~9) */
export const getDigitsOnly = (value: string) => {
  return value.replace(/[^0-9]/g, '');
}

/** 화면 너비에 따른 디바이스 타입 반환 ('mb' | 'tb' | 'pc' | 'wd') */
export const getDeviceType = (width: number): DeviceType => {
  if (width < 768) return 'mb'
  if (width < 1200) return 'tb'
  if (width < 1980) return 'pc'
  return 'wd'
}

/**
 * 요소 클래스에서 color 정보 추출 후 CSS 클래스 생성
 * - ex) hison-color-primary → hison-color-primary-button-hover
 */
export const getColorClass = (el: HTMLElement, elTypeName: string, suffix: string) => {
    const color = getSpecificClassValueFromClassList(el.classList, 'color')
    if(color) return `hison-color-${color}-${elTypeName}-${suffix}`

    return `hison-color-primary-${elTypeName}-${suffix}`
}

/** 클래스 목록 중 특정 접두어(hison-{prefix}-)로 시작하는 첫 번째 클래스 반환 */
export const getSpecificClassNameFromClassList = (classList: DOMTokenList | string[], classStarts: string) => {
    return Array.from(classList).find(cls => cls.startsWith(`hison-${classStarts}-`))
}

/** 클래스에서 특정 접두어 값 추출 (예: hison-color-primary → 'primary') */
export const getSpecificClassValueFromClassList = (classList: DOMTokenList | string[], classStarts: string) => {
    const specificClassName = getSpecificClassNameFromClassList(classList, classStarts)
    if(specificClassName) {
        const parts = specificClassName.split('-')
        if(parts.length >= 3) return parts[2]
    }
    return null
}

/** 클래스 배열에서 특정 접두어에 해당하는 클래스 인덱스 반환 */
export const getIndexSpecificClassNameFromClassList = (classList: string[], classStarts: string) => {
  return classList.findIndex(cls => cls.startsWith(`hison-${classStarts}-`))
}

export const toClassString = (cls: any): string => {
    if (!cls) return ''
    if (typeof cls === 'string') return cls
    if (Array.isArray(cls)) return cls.map(toClassString).filter(Boolean).join(' ')
    if (typeof cls === 'object') {
        return Object.keys(cls).filter(k => !!cls[k]).join(' ')
    }
    return ''
}

/**
 * 반응형 클래스 문자열에서 현재 디바이스에 맞는 클래스만 추출
 * - 예: hison-col-6-mb hison-col-4-pc → 모바일이면 hison-col-6
 */
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
      staticClasses.push(cls)
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

export const addComponentNameToClass = (classList: string[], classStarts: string, defaultAttrName: string) => {
    const idx = getIndexSpecificClassNameFromClassList(classList, classStarts)
    if (idx !== -1) {
        classList[idx] = classList[idx]
    } else {
        classList.push(`hison-${classStarts}-${defaultAttrName}`)
    }
}

/**
 * 문자열에서 숫자와 단위를 분리하여 반환
 * - 예: '12px' → { number: 12, unit: 'px' }
 */
export const extractNumberAndUnit = (val: string) => {
    if (!val) return { number: 0, unit: '' };
    val = val.trim();

    const numberAndUnitRegex = /^([+-]?\d*\.?\d+)([a-zA-Z%]+)$/;
    const numberOnlyRegex = /^[+-]?\d*\.?\d+$/;
    const unitOnlyRegex = /^[a-zA-Z%]+$/;

    if (numberAndUnitRegex.test(val)) {
        const match = val.match(numberAndUnitRegex)!;
        return { number: parseFloat(match[1]), unit: match[2] };
    } else if (numberOnlyRegex.test(val)) {
        return { number: parseFloat(val), unit: '' };
    } else if (unitOnlyRegex.test(val)) {
        return { number: 0, unit: val };
    } else {
        return { number: 0, unit: '' };
    }
};

/**
 * 클래스 문자열에서 특정 prefix(hison-{prefix}-)로 시작하는 클래스들만 추출
 * 
 * @param classStr 전체 클래스 문자열 (예: 'hison-size-s-pc hison-color-primary-mb')
 * @param targetPrefix 'size', 'color', 'pos' 등 추출 대상 접두어
 * @returns 해당 prefix에 매칭되는 클래스 문자열 배열
 */
export const extractPrefixedClasses = (classStr: string, targetPrefix: string): string[] => {
  if (!classStr || !targetPrefix) return []

  const prefix = `hison-${targetPrefix}-`
  return classStr
    .trim()
    .split(/\s+/)
    .filter(cls => cls.startsWith(prefix))
}
