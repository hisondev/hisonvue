import { hisonCloser } from "../hisonCloser";
import { applyDefaultColor, getInvertColor, normalizeToRgba } from "../utils";
import {
  custom1ColorRGBA,
  custom2ColorRGBA,
  custom3ColorRGBA,
  custom4ColorRGBA,
  custom5ColorRGBA,
  dangerColorRGBA,
  darkTextColorRGBA,
  emptyColorRGBA,
  infoColorRGBA,
  lightTextColorRGBA,
  mutedColorRGBA,
  primaryColorRGBA,
  successColorRGBA,
  warningColorRGBA
} from "./getDefaultHisonConfig";

export const applyCssVariables = () => {
  const c = hisonCloser.componentStyle;

  c.primaryColor = c.primaryColor ? normalizeToRgba(c.primaryColor) : primaryColorRGBA
  c.mutedColor = c.mutedColor ? normalizeToRgba(c.mutedColor) : mutedColorRGBA
  c.infoColor = c.infoColor ? normalizeToRgba(c.infoColor) : infoColorRGBA
  c.successColor = c.successColor ? normalizeToRgba(c.successColor) : successColorRGBA
  c.dangerColor = c.dangerColor ? normalizeToRgba(c.dangerColor) : dangerColorRGBA
  c.warningColor = c.warningColor ? normalizeToRgba(c.warningColor) : warningColorRGBA
  c.custom1Color = c.custom1Color ? normalizeToRgba(c.custom1Color) : custom1ColorRGBA
  c.custom2Color = c.custom2Color ? normalizeToRgba(c.custom2Color) : custom2ColorRGBA
  c.custom3Color = c.custom3Color ? normalizeToRgba(c.custom3Color) : custom3ColorRGBA
  c.custom4Color = c.custom4Color ? normalizeToRgba(c.custom4Color) : custom4ColorRGBA
  c.custom5Color = c.custom5Color ? normalizeToRgba(c.custom5Color) : custom5ColorRGBA
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
  c.custom1InvertColor = getInvertColor(c.custom1Color)
  c.custom2InvertColor = getInvertColor(c.custom2Color)
  c.custom3InvertColor = getInvertColor(c.custom3Color)
  c.custom4InvertColor = getInvertColor(c.custom4Color)
  c.custom5InvertColor = getInvertColor(c.custom5Color)
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
  applyDefaultColor(cc.custom1, c.invertColor ? c.custom1InvertColor : c.custom1Color);
  applyDefaultColor(cc.custom2, c.invertColor ? c.custom2InvertColor : c.custom2Color);
  applyDefaultColor(cc.custom3, c.invertColor ? c.custom3InvertColor : c.custom3Color);
  applyDefaultColor(cc.custom4, c.invertColor ? c.custom4InvertColor : c.custom4Color);
  applyDefaultColor(cc.custom5, c.invertColor ? c.custom5InvertColor : c.custom5Color);

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
  
  --hison-custom1-buttonColor: ${cc.custom1.buttonColor};
  --hison-custom1-borderColor: ${cc.custom1.borderColor};
  --hison-custom1-shadowColor: ${cc.custom1.shadowColor};
  --hison-custom1-hoverColor: ${cc.custom1.hoverColor};
  --hison-custom1-activeColor: ${cc.custom1.activeColor};
  --hison-custom1-rowHoverColor: ${cc.custom1.rowHoverColor};
  --hison-custom1-stripeColor: ${cc.custom1.stripeColor};
  --hison-custom1-emptyTextColor: ${cc.custom1.emptyTextColor};
  --hison-custom1-filledTextColor: ${cc.custom1.filledTextColor};
  
  --hison-custom2-buttonColor: ${cc.custom2.buttonColor};
  --hison-custom2-borderColor: ${cc.custom2.borderColor};
  --hison-custom2-shadowColor: ${cc.custom2.shadowColor};
  --hison-custom2-hoverColor: ${cc.custom2.hoverColor};
  --hison-custom2-activeColor: ${cc.custom2.activeColor};
  --hison-custom2-rowHoverColor: ${cc.custom2.rowHoverColor};
  --hison-custom2-stripeColor: ${cc.custom2.stripeColor};
  --hison-custom2-emptyTextColor: ${cc.custom2.emptyTextColor};
  --hison-custom2-filledTextColor: ${cc.custom2.filledTextColor};
  
  --hison-custom3-buttonColor: ${cc.custom3.buttonColor};
  --hison-custom3-borderColor: ${cc.custom3.borderColor};
  --hison-custom3-shadowColor: ${cc.custom3.shadowColor};
  --hison-custom3-hoverColor: ${cc.custom3.hoverColor};
  --hison-custom3-activeColor: ${cc.custom3.activeColor};
  --hison-custom3-rowHoverColor: ${cc.custom3.rowHoverColor};
  --hison-custom3-stripeColor: ${cc.custom3.stripeColor};
  --hison-custom3-emptyTextColor: ${cc.custom3.emptyTextColor};
  --hison-custom3-filledTextColor: ${cc.custom3.filledTextColor};
  
  --hison-custom4-buttonColor: ${cc.custom4.buttonColor};
  --hison-custom4-borderColor: ${cc.custom4.borderColor};
  --hison-custom4-shadowColor: ${cc.custom4.shadowColor};
  --hison-custom4-hoverColor: ${cc.custom4.hoverColor};
  --hison-custom4-activeColor: ${cc.custom4.activeColor};
  --hison-custom4-rowHoverColor: ${cc.custom4.rowHoverColor};
  --hison-custom4-stripeColor: ${cc.custom4.stripeColor};
  --hison-custom4-emptyTextColor: ${cc.custom4.emptyTextColor};
  --hison-custom4-filledTextColor: ${cc.custom4.filledTextColor};
  
  --hison-custom5-buttonColor: ${cc.custom5.buttonColor};
  --hison-custom5-borderColor: ${cc.custom5.borderColor};
  --hison-custom5-shadowColor: ${cc.custom5.shadowColor};
  --hison-custom5-hoverColor: ${cc.custom5.hoverColor};
  --hison-custom5-activeColor: ${cc.custom5.activeColor};
  --hison-custom5-rowHoverColor: ${cc.custom5.rowHoverColor};
  --hison-custom5-stripeColor: ${cc.custom5.stripeColor};
  --hison-custom5-emptyTextColor: ${cc.custom5.emptyTextColor};
  --hison-custom5-filledTextColor: ${cc.custom5.filledTextColor};

  --hison-font-family: 'Arial, sans-serif';
  --hison-xs-min-height: ${c.minHeightXS};
  --hison-s-min-height: ${c.minHeightS};
  --hison-m-min-height: ${c.minHeightM};
  --hison-l-min-height: ${c.minHeightL};
  --hison-xl-min-height: ${c.minHeightXL};
  --hison-xs-font-size: ${c.fontSizeXS};
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
