import { hisonCloser } from "..";
import { applyDefaultColor, getInvertColor, normalizeToRgba } from "../utils";
import { dangerColorRGBA, darkTextColorRGBA, emptyColorRGBA, infoColorRGBA, lightTextColorRGBA, mutedColorRGBA, primaryColorRGBA, successColorRGBA, warningColorRGBA } from "./getDefaultHisonConfig";

export const applyCssVariables = () => {
  const c = hisonCloser.componentStyle;

  c.primaryColor = c.primaryColor ? normalizeToRgba(c.primaryColor) : primaryColorRGBA
  c.mutedColor = c.mutedColor ? normalizeToRgba(c.mutedColor) : mutedColorRGBA
  c.infoColor = c.infoColor ? normalizeToRgba(c.infoColor) : infoColorRGBA
  c.successColor = c.successColor ? normalizeToRgba(c.successColor) : successColorRGBA
  c.dangerColor = c.dangerColor ? normalizeToRgba(c.dangerColor) : dangerColorRGBA
  c.warningColor = c.warningColor ? normalizeToRgba(c.warningColor) : warningColorRGBA
  c.filledColor = c.filledColor ? normalizeToRgba(c.filledColor) : primaryColorRGBA
  c.emptyColor = c.emptyColor ? normalizeToRgba(c.emptyColor) : emptyColorRGBA
  c.filledTextColor = c.filledTextColor ? normalizeToRgba(c.filledTextColor) : lightTextColorRGBA
  c.emptyTextColor = c.emptyTextColor ? normalizeToRgba(c.emptyTextColor) : darkTextColorRGBA

  c.primaryInvertColor = getInvertColor(c.primaryColor)
  c.mutedInvertColor = getInvertColor(c.mutedColor)
  c.infoInvertColor = getInvertColor(c.infoColor)
  c.successInvertColor = getInvertColor(c.successColor)
  c.dangerInvertColor = getInvertColor(c.dangerColor)
  c.warningInvertColor = getInvertColor(c.warningColor)
  c.filledInvertColor = getInvertColor(c.filledColor)
  c.emptyInvertColor = getInvertColor(c.emptyColor)
  c.filledTextInvertColor = getInvertColor(c.filledTextColor)
  c.emptyTextInvertColor = getInvertColor(c.emptyTextColor)

  const cc = c.componentColor;
  applyDefaultColor(cc.primary, c.invertColor ? c.primaryInvertColor : c.primaryColor);
  applyDefaultColor(cc.muted, c.invertColor ? c.mutedInvertColor : c.mutedColor);
  applyDefaultColor(cc.info, c.invertColor ? c.infoInvertColor : c.infoColor);
  applyDefaultColor(cc.success, c.invertColor ? c.successInvertColor : c.successColor);
  applyDefaultColor(cc.danger, c.invertColor ? c.dangerInvertColor : c.dangerColor);
  applyDefaultColor(cc.warning, c.invertColor ? c.warningInvertColor : c.warningColor);

  const cssVariables = `
:root {
  --hison-filledColor: ${c.invertColor ? c.filledInvertColor : c.filledColor};
  --hison-emptyColor: ${c.invertColor ? c.emptyInvertColor : c.emptyColor};
  --hison-filledTextColor: ${c.invertColor ? c.filledTextInvertColor : c.filledTextColor};
  --hison-emptyTextColor: ${c.invertColor ? c.emptyTextInvertColor : c.emptyTextColor};
  --hison-primary-buttonColor: ${cc.primary.buttonColor};
  --hison-primary-borderColor: ${cc.primary.borderColor};
  --hison-primary-shadowColor: ${cc.primary.shadowColor};
  --hison-primary-hoverColor: ${cc.primary.hoverColor};
  --hison-primary-activeColor: ${cc.primary.activeColor};
  --hison-primary-rowHoverColor: ${cc.primary.rowHoverColor};
  --hison-primary-stripeColor: ${cc.primary.stripeColor};
  --hison-primary-emptyTextColor: ${cc.primary.emptyTextColor};
  --hison-primary-filledTextColor: ${cc.primary.filledTextColor};

  --hison-muted-buttonColor: ${cc.muted.buttonColor};
  --hison-muted-borderColor: ${cc.muted.borderColor};
  --hison-muted-shadowColor: ${cc.muted.shadowColor};
  --hison-muted-hoverColor: ${cc.muted.hoverColor};
  --hison-muted-activeColor: ${cc.muted.activeColor};
  --hison-muted-rowHoverColor: ${cc.muted.rowHoverColor};
  --hison-muted-stripeColor: ${cc.muted.stripeColor};
  --hison-muted-emptyTextColor: ${cc.muted.emptyTextColor};
  --hison-muted-filledTextColor: ${cc.muted.filledTextColor};

  --hison-info-buttonColor: ${cc.info.buttonColor};
  --hison-info-borderColor: ${cc.info.borderColor};
  --hison-info-shadowColor: ${cc.info.shadowColor};
  --hison-info-hoverColor: ${cc.info.hoverColor};
  --hison-info-activeColor: ${cc.info.activeColor};
  --hison-info-rowHoverColor: ${cc.info.rowHoverColor};
  --hison-info-stripeColor: ${cc.info.stripeColor};
  --hison-info-emptyTextColor: ${cc.info.emptyTextColor};
  --hison-info-filledTextColor: ${cc.info.filledTextColor};

  --hison-success-buttonColor: ${cc.success.buttonColor};
  --hison-success-borderColor: ${cc.success.borderColor};
  --hison-success-shadowColor: ${cc.success.shadowColor};
  --hison-success-hoverColor: ${cc.success.hoverColor};
  --hison-success-activeColor: ${cc.success.activeColor};
  --hison-success-rowHoverColor: ${cc.success.rowHoverColor};
  --hison-success-stripeColor: ${cc.success.stripeColor};
  --hison-success-emptyTextColor: ${cc.success.emptyTextColor};
  --hison-success-filledTextColor: ${cc.success.filledTextColor};

  --hison-danger-buttonColor: ${cc.danger.buttonColor};
  --hison-danger-borderColor: ${cc.danger.borderColor};
  --hison-danger-shadowColor: ${cc.danger.shadowColor};
  --hison-danger-hoverColor: ${cc.danger.hoverColor};
  --hison-danger-activeColor: ${cc.danger.activeColor};
  --hison-danger-rowHoverColor: ${cc.danger.rowHoverColor};
  --hison-danger-stripeColor: ${cc.danger.stripeColor};
  --hison-danger-emptyTextColor: ${cc.danger.emptyTextColor};
  --hison-danger-filledTextColor: ${cc.danger.filledTextColor};

  --hison-warning-buttonColor: ${cc.warning.buttonColor};
  --hison-warning-borderColor: ${cc.warning.borderColor};
  --hison-warning-shadowColor: ${cc.warning.shadowColor};
  --hison-warning-hoverColor: ${cc.warning.hoverColor};
  --hison-warning-activeColor: ${cc.warning.activeColor};
  --hison-warning-rowHoverColor: ${cc.warning.rowHoverColor};
  --hison-warning-stripeColor: ${cc.warning.stripeColor};
  --hison-warning-emptyTextColor: ${cc.warning.emptyTextColor};
  --hison-warning-filledTextColor: ${cc.warning.filledTextColor};

  --hison-font-family: 'Arial, sans-serif';
  --hison-s-min-height: ${c.minHeightS};
  --hison-m-min-height: ${c.minHeightM};
  --hison-l-min-height: ${c.minHeightL};
  --hison-xl-min-height: ${c.minHeightXL};
  --hison-s-font-size: ${c.fontSizeS};
  --hison-m-font-size: ${c.fontSizeM};
  --hison-l-font-size: ${c.fontSizeL};
  --hison-xl-font-size: ${c.fontSizeXL};
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
