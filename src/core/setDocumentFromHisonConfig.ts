// setDocumentFromHisonConfig.ts
import { HisonConfig } from "../types";
import { adjustRgbaColor, getBasicTextColor, getInvertColor, normalizeToRgba } from "../utils";

export const applyCssVariables = (config: HisonConfig) => {
  const c = config.componentStyle;

  // 색상 순회 및 normalize 처리
  const colorCycleChange = (obj: Object, changeFunc: (value: string) => string) => {
    Object.entries(obj).forEach(([key, value]) => {
      if (key.endsWith('Color')) {
        if (typeof value === 'string') {
          (obj as any)[key] = changeFunc(value);
        } else if (typeof value === 'object' && value !== null) {
          Object.entries(value).forEach(([innerKey, innerValue]) => {
            if (innerKey.endsWith('Color') && typeof innerValue === 'string') {
              (value as any)[innerKey] = changeFunc(innerValue);
            }
          });
        }
      }
    });
  };

  colorCycleChange(c, normalizeToRgba);

  if (!c.filledTextColor) c.filledTextColor = getBasicTextColor(c.filledColor);
  if (!c.emptyTextColor) c.emptyTextColor = getBasicTextColor(c.emptyColor);

  const cc = c.componentColor;

  const applyDefaults = (target: any, baseColor: string) => {
    target.buttonColor ??= baseColor;
    target.borderColor ??= adjustRgbaColor(baseColor, -31);
    target.shadowColor ??= adjustRgbaColor(baseColor, -47);
    target.hoverColor ??= adjustRgbaColor(baseColor, -24);
    target.activeColor ??= adjustRgbaColor(baseColor, -24);
    target.emptyTextColor ??= baseColor;
    target.filledTextColor ??= getBasicTextColor(baseColor);
  };

  applyDefaults(cc.primary, c.primaryColor);
  applyDefaults(cc.muted, c.mutedColor);
  applyDefaults(cc.info, c.infoColor);
  applyDefaults(cc.success, c.successColor);
  applyDefaults(cc.danger, c.dangerColor);
  applyDefaults(cc.warning, c.warningColor);

  if (c.invertColor) {
    colorCycleChange(c, getInvertColor);
  }

  const cssVariables = `
:root {
  --hison-filledColor: ${c.filledColor};
  --hison-emptyColor: ${c.emptyColor};
  --hison-filledTextColor: ${c.filledTextColor};
  --hison-emptyTextColor: ${c.emptyTextColor};
  --hison-primary-buttonColor: ${cc.primary.buttonColor};
  --hison-primary-borderColor: ${cc.primary.borderColor};
  --hison-primary-shadowColor: ${cc.primary.shadowColor};
  --hison-primary-hoverColor: ${cc.primary.hoverColor};
  --hison-primary-activeColor: ${cc.primary.activeColor};
  --hison-primary-emptyTextColor: ${cc.primary.emptyTextColor};
  --hison-primary-filledTextColor: ${cc.primary.filledTextColor};
  --hison-muted-buttonColor: ${cc.muted.buttonColor};
  --hison-muted-borderColor: ${cc.muted.borderColor};
  --hison-muted-shadowColor: ${cc.muted.shadowColor};
  --hison-muted-hoverColor: ${cc.muted.hoverColor};
  --hison-muted-activeColor: ${cc.muted.activeColor};
  --hison-muted-emptyTextColor: ${cc.muted.emptyTextColor};
  --hison-muted-filledTextColor: ${cc.muted.filledTextColor};
  --hison-info-buttonColor: ${cc.info.buttonColor};
  --hison-info-borderColor: ${cc.info.borderColor};
  --hison-info-shadowColor: ${cc.info.shadowColor};
  --hison-info-hoverColor: ${cc.info.hoverColor};
  --hison-info-activeColor: ${cc.info.activeColor};
  --hison-info-emptyTextColor: ${cc.info.emptyTextColor};
  --hison-info-filledTextColor: ${cc.info.filledTextColor};
  --hison-success-buttonColor: ${cc.success.buttonColor};
  --hison-success-borderColor: ${cc.success.borderColor};
  --hison-success-shadowColor: ${cc.success.shadowColor};
  --hison-success-hoverColor: ${cc.success.hoverColor};
  --hison-success-activeColor: ${cc.success.activeColor};
  --hison-success-emptyTextColor: ${cc.success.emptyTextColor};
  --hison-success-filledTextColor: ${cc.success.filledTextColor};
  --hison-danger-buttonColor: ${cc.danger.buttonColor};
  --hison-danger-borderColor: ${cc.danger.borderColor};
  --hison-danger-shadowColor: ${cc.danger.shadowColor};
  --hison-danger-hoverColor: ${cc.danger.hoverColor};
  --hison-danger-activeColor: ${cc.danger.activeColor};
  --hison-danger-emptyTextColor: ${cc.danger.emptyTextColor};
  --hison-danger-filledTextColor: ${cc.danger.filledTextColor};
  --hison-warning-buttonColor: ${cc.warning.buttonColor};
  --hison-warning-borderColor: ${cc.warning.borderColor};
  --hison-warning-shadowColor: ${cc.warning.shadowColor};
  --hison-warning-hoverColor: ${cc.warning.hoverColor};
  --hison-warning-activeColor: ${cc.warning.activeColor};
  --hison-warning-emptyTextColor: ${cc.warning.emptyTextColor};
  --hison-warning-filledTextColor: ${cc.warning.filledTextColor};
  --hison-font-family: 'Arial, sans-serif';
}
`.trim();

  const styleId = 'hisonvue-css-variables';
  let styleElement = document.getElementById(styleId) as HTMLStyleElement | null;
  if (styleElement) {
    styleElement.remove();
  }
  styleElement = document.createElement('style');
  styleElement.id = styleId;
  styleElement.textContent = cssVariables;
  document.head.appendChild(styleElement);
};
