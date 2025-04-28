import { HisonConfig } from "../types"
import { adjustRgbaColor, getInvertColor, getIsColorLight, normalizeToRgba } from "../utils"

export const applyCssVariables = (config: HisonConfig) => {
  const c = config.componentStyle

  const colorCycleChange = (obj: Object, changeFunc: Function) => {
    Object.entries(obj).forEach(([key, value]) => {
      if (key.endsWith('Color')) {
        if (typeof value === 'string') {
          (obj as any)[key] = changeFunc(value)
        } else if (typeof value === 'object' && value !== null) {
          Object.entries(value).forEach(([innerKey, innerValue]) => {
            if (innerKey.endsWith('Color') && typeof innerValue === 'string') {
              value[innerKey] = changeFunc(innerValue)
            }
          })
        }
      }
    })
  }

  colorCycleChange(c, normalizeToRgba)

  if(!c.filledTextColor) c.filledTextColor = getIsColorLight(c.filledColor) ? 'rgba(48,48,48,1)' : 'rgba(220,220,220,1)'
  if(!c.emptyTextColor) c.emptyTextColor = getIsColorLight(c.emptyTextColor) ? 'rgba(48,48,48,1)' : 'rgba(220,220,220,1)'

  const cc = c.componentColor
  if(!cc.primary.buttonColor) cc.primary.buttonColor = c.primaryColor
  if(!cc.primary.borderColor) cc.primary.borderColor = adjustRgbaColor(c.primaryColor, -31)
  if(!cc.primary.shadowColor) cc.primary.shadowColor = adjustRgbaColor(c.primaryColor, -47)
  if(!cc.primary.hoverColor) cc.primary.hoverColor = adjustRgbaColor(c.primaryColor, -24)
  if(!cc.primary.activeColor) cc.primary.activeColor = adjustRgbaColor(c.primaryColor, -24)

  if(!cc.muted.buttonColor) cc.muted.buttonColor = c.mutedColor
  if(!cc.muted.borderColor) cc.muted.borderColor = adjustRgbaColor(c.mutedColor, -31)
  if(!cc.muted.shadowColor) cc.muted.shadowColor = adjustRgbaColor(c.mutedColor, -47)
  if(!cc.muted.hoverColor) cc.muted.hoverColor = adjustRgbaColor(c.mutedColor, -24)
  if(!cc.muted.activeColor) cc.muted.activeColor = adjustRgbaColor(c.mutedColor, -24)

  if(!cc.info.buttonColor) cc.info.buttonColor = c.infoColor
  if(!cc.info.borderColor) cc.info.borderColor = adjustRgbaColor(c.infoColor, -31)
  if(!cc.info.shadowColor) cc.info.shadowColor = adjustRgbaColor(c.infoColor, -47)
  if(!cc.info.hoverColor) cc.info.hoverColor = adjustRgbaColor(c.infoColor, -24)
  if(!cc.info.activeColor) cc.info.activeColor = adjustRgbaColor(c.infoColor, -24)

  if(!cc.success.buttonColor) cc.success.buttonColor = c.successColor
  if(!cc.success.borderColor) cc.success.borderColor = adjustRgbaColor(c.successColor, -31)
  if(!cc.success.shadowColor) cc.success.shadowColor = adjustRgbaColor(c.successColor, -47)
  if(!cc.success.hoverColor) cc.success.hoverColor = adjustRgbaColor(c.successColor, -24)
  if(!cc.success.activeColor) cc.success.activeColor = adjustRgbaColor(c.successColor, -24)

  if(!cc.danger.buttonColor) cc.danger.buttonColor = c.dangerColor
  if(!cc.danger.borderColor) cc.danger.borderColor = adjustRgbaColor(c.dangerColor, -31)
  if(!cc.danger.shadowColor) cc.danger.shadowColor = adjustRgbaColor(c.dangerColor, -47)
  if(!cc.danger.hoverColor) cc.danger.hoverColor = adjustRgbaColor(c.dangerColor, -24)
  if(!cc.danger.activeColor) cc.danger.activeColor = adjustRgbaColor(c.dangerColor, -24)

  if(!cc.warning.buttonColor) cc.warning.buttonColor = c.warningColor
  if(!cc.warning.borderColor) cc.warning.borderColor = adjustRgbaColor(c.warningColor, -31)
  if(!cc.warning.shadowColor) cc.warning.shadowColor = adjustRgbaColor(c.warningColor, -47)
  if(!cc.warning.hoverColor) cc.warning.hoverColor = adjustRgbaColor(c.warningColor, -24)
  if(!cc.warning.activeColor) cc.warning.activeColor = adjustRgbaColor(c.warningColor, -24)

  if(c.invertColor) {
    colorCycleChange(c, getInvertColor)
  }
  
  const root = document.documentElement
  root.style.setProperty('--hison-filledColor', c.filledColor)
  root.style.setProperty('--hison-emptyColor', c.emptyColor)
  root.style.setProperty('--hison-filledTextColor', c.filledTextColor)
  root.style.setProperty('--hison-emptyTextColor', c.emptyTextColor)

  root.style.setProperty('--hison-emptyTextColor', c.emptyTextColor)
  root.style.setProperty('--hison-primary-buttonColor', cc.primary.buttonColor)
  root.style.setProperty('--hison-primary-borderColor', cc.primary.borderColor)
  root.style.setProperty('--hison-primary-shadowColor', cc.primary.shadowColor)
  root.style.setProperty('--hison-primary-hoverColor', cc.primary.hoverColor)
  root.style.setProperty('--hison-primary-activeColor', cc.primary.activeColor)
  root.style.setProperty('--hison-muted-buttonColor', cc.muted.buttonColor)
  root.style.setProperty('--hison-muted-borderColor', cc.muted.borderColor)
  root.style.setProperty('--hison-muted-shadowColor', cc.muted.shadowColor)
  root.style.setProperty('--hison-muted-hoverColor', cc.muted.hoverColor)
  root.style.setProperty('--hison-muted-activeColor', cc.muted.activeColor)
  root.style.setProperty('--hison-info-buttonColor', cc.info.buttonColor)
  root.style.setProperty('--hison-info-borderColor', cc.info.borderColor)
  root.style.setProperty('--hison-info-shadowColor', cc.info.shadowColor)
  root.style.setProperty('--hison-info-hoverColor', cc.info.hoverColor)
  root.style.setProperty('--hison-info-activeColor', cc.info.activeColor)
  root.style.setProperty('--hison-success-buttonColor', cc.success.buttonColor)
  root.style.setProperty('--hison-success-borderColor', cc.success.borderColor)
  root.style.setProperty('--hison-success-shadowColor', cc.success.shadowColor)
  root.style.setProperty('--hison-success-hoverColor', cc.success.hoverColor)
  root.style.setProperty('--hison-success-activeColor', cc.success.activeColor)
  root.style.setProperty('--hison-danger-buttonColor', cc.danger.buttonColor)
  root.style.setProperty('--hison-danger-borderColor', cc.danger.borderColor)
  root.style.setProperty('--hison-danger-shadowColor', cc.danger.shadowColor)
  root.style.setProperty('--hison-danger-hoverColor', cc.danger.hoverColor)
  root.style.setProperty('--hison-danger-activeColor', cc.danger.activeColor)
  root.style.setProperty('--hison-warning-buttonColor', cc.warning.buttonColor)
  root.style.setProperty('--hison-warning-borderColor', cc.warning.borderColor)
  root.style.setProperty('--hison-warning-shadowColor', cc.warning.shadowColor)
  root.style.setProperty('--hison-warning-hoverColor', cc.warning.hoverColor)
  root.style.setProperty('--hison-warning-activeColor', cc.warning.activeColor)

  const sizeRate = (() => {
      switch (config.componentStyle.size) {
        case 's': return 0.9
        case 'm': return 1
        case 'l': return 1.2
        case 'xl': return 1.3
        default: return 1
      }
  })()
  root.style.setProperty('--hison-size-rate', String(sizeRate))
  root.style.setProperty('--hison-font-family', 'Arial')
}
