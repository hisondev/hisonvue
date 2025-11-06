import { getVanillanote } from 'vanillanote2'
import { isValidHexColor, normalizeToHex } from '../utils'
import { HisonConfig } from '..'
import { hisonCloser } from '../hisonCloser'

export const getVn = (hisonConfig: HisonConfig) => {
    setVnConfigWithHisonConfig(hisonConfig)
    const vn = getVanillanote(hisonConfig.component.note)
    return vn
}

const setVnConfigWithHisonConfig = (hisonConfig: HisonConfig) => {
    if(hisonCloser.componentStyle.primaryColor) {
        const primaryColor = normalizeToHex(hisonCloser.componentStyle.primaryColor)
        if (!isValidHexColor(primaryColor)) {
          console.warn(`[Hisonvue] Invalid mainColor: '${hisonCloser.componentStyle.primaryColor}'. Must be a valid hex color (e.g., '#ffffff').`)
        }
        hisonConfig.component.note.attributes.mainColor = primaryColor
    }
}
