import type { HisonConfig } from "../types"
import { configureChartDefaults, getVg, getVn } from "../plugins"
import { hisonCloser } from "../hisonCloser"

export const createHisonCloser = (hisonConfig: HisonConfig) => {

  if(hisonConfig.event.cssEvent.textbox_onBeforeFocus) hisonCloser.event.cssEvent.textbox_onBeforeFocus = hisonConfig.event.cssEvent.textbox_onBeforeFocus
  if(hisonConfig.event.cssEvent.textbox_onAfterFocus) hisonCloser.event.cssEvent.textbox_onAfterFocus = hisonConfig.event.cssEvent.textbox_onAfterFocus
  if(hisonConfig.event.cssEvent.textbox_onBeforeBlur) hisonCloser.event.cssEvent.textbox_onBeforeBlur = hisonConfig.event.cssEvent.textbox_onBeforeBlur
  if(hisonConfig.event.cssEvent.textbox_onAfterBlur) hisonCloser.event.cssEvent.textbox_onAfterBlur = hisonConfig.event.cssEvent.textbox_onAfterBlur
  if(hisonConfig.event.cssEvent.textbox_onBeforeClick) hisonCloser.event.cssEvent.textbox_onBeforeClick = hisonConfig.event.cssEvent.textbox_onBeforeClick
  if(hisonConfig.event.cssEvent.textbox_onAfterClick) hisonCloser.event.cssEvent.textbox_onAfterClick = hisonConfig.event.cssEvent.textbox_onAfterClick
  if(hisonConfig.event.cssEvent.textbox_onBeforeMouseover) hisonCloser.event.cssEvent.textbox_onBeforeMouseover = hisonConfig.event.cssEvent.textbox_onBeforeMouseover
  if(hisonConfig.event.cssEvent.textbox_onAfterMouseover) hisonCloser.event.cssEvent.textbox_onAfterMouseover = hisonConfig.event.cssEvent.textbox_onAfterMouseover
  if(hisonConfig.event.cssEvent.textbox_onBeforeMouseout) hisonCloser.event.cssEvent.textbox_onBeforeMouseout = hisonConfig.event.cssEvent.textbox_onBeforeMouseout
  if(hisonConfig.event.cssEvent.textbox_onAfterMouseout) hisonCloser.event.cssEvent.textbox_onAfterMouseout = hisonConfig.event.cssEvent.textbox_onAfterMouseout
  if(hisonConfig.event.cssEvent.textbox_onBeforeTouchstart) hisonCloser.event.cssEvent.textbox_onBeforeTouchstart = hisonConfig.event.cssEvent.textbox_onBeforeTouchstart
  if(hisonConfig.event.cssEvent.textbox_onAfterTouchstart) hisonCloser.event.cssEvent.textbox_onAfterTouchstart = hisonConfig.event.cssEvent.textbox_onAfterTouchstart
  if(hisonConfig.event.cssEvent.textbox_onBeforeTouchend) hisonCloser.event.cssEvent.textbox_onBeforeTouchend = hisonConfig.event.cssEvent.textbox_onBeforeTouchend
  if(hisonConfig.event.cssEvent.textbox_onAfterTouchend) hisonCloser.event.cssEvent.textbox_onAfterTouchend = hisonConfig.event.cssEvent.textbox_onAfterTouchend

  if(hisonConfig.event.cssEvent.button_onBeforeFocus) hisonCloser.event.cssEvent.button_onBeforeFocus = hisonConfig.event.cssEvent.button_onBeforeFocus
  if(hisonConfig.event.cssEvent.button_onAfterFocus) hisonCloser.event.cssEvent.button_onAfterFocus = hisonConfig.event.cssEvent.button_onAfterFocus
  if(hisonConfig.event.cssEvent.button_onBeforeBlur) hisonCloser.event.cssEvent.button_onBeforeBlur = hisonConfig.event.cssEvent.button_onBeforeBlur
  if(hisonConfig.event.cssEvent.button_onAfterBlur) hisonCloser.event.cssEvent.button_onAfterBlur = hisonConfig.event.cssEvent.button_onAfterBlur
  if(hisonConfig.event.cssEvent.button_onBeforeClick) hisonCloser.event.cssEvent.button_onBeforeClick = hisonConfig.event.cssEvent.button_onBeforeClick
  if(hisonConfig.event.cssEvent.button_onAfterClick) hisonCloser.event.cssEvent.button_onAfterClick = hisonConfig.event.cssEvent.button_onAfterClick
  if(hisonConfig.event.cssEvent.button_onBeforeMouseover) hisonCloser.event.cssEvent.button_onBeforeMouseover = hisonConfig.event.cssEvent.button_onBeforeMouseover
  if(hisonConfig.event.cssEvent.button_onAfterMouseover) hisonCloser.event.cssEvent.button_onAfterMouseover = hisonConfig.event.cssEvent.button_onAfterMouseover
  if(hisonConfig.event.cssEvent.button_onBeforeMouseout) hisonCloser.event.cssEvent.button_onBeforeMouseout = hisonConfig.event.cssEvent.button_onBeforeMouseout
  if(hisonConfig.event.cssEvent.button_onAfterMouseout) hisonCloser.event.cssEvent.button_onAfterMouseout = hisonConfig.event.cssEvent.button_onAfterMouseout
  if(hisonConfig.event.cssEvent.button_onBeforeTouchstart) hisonCloser.event.cssEvent.button_onBeforeTouchstart = hisonConfig.event.cssEvent.button_onBeforeTouchstart
  if(hisonConfig.event.cssEvent.button_onAfterTouchstart) hisonCloser.event.cssEvent.button_onAfterTouchstart = hisonConfig.event.cssEvent.button_onAfterTouchstart
  if(hisonConfig.event.cssEvent.button_onBeforeTouchend) hisonCloser.event.cssEvent.button_onBeforeTouchend = hisonConfig.event.cssEvent.button_onBeforeTouchend
  if(hisonConfig.event.cssEvent.button_onAfterTouchend) hisonCloser.event.cssEvent.button_onAfterTouchend = hisonConfig.event.cssEvent.button_onAfterTouchend
  
  if(hisonConfig.event.cssEvent.input_onBeforeFocus) hisonCloser.event.cssEvent.input_onBeforeFocus = hisonConfig.event.cssEvent.input_onBeforeFocus
  if(hisonConfig.event.cssEvent.input_onAfterFocus) hisonCloser.event.cssEvent.input_onAfterFocus = hisonConfig.event.cssEvent.input_onAfterFocus
  if(hisonConfig.event.cssEvent.input_onBeforeBlur) hisonCloser.event.cssEvent.input_onBeforeBlur = hisonConfig.event.cssEvent.input_onBeforeBlur
  if(hisonConfig.event.cssEvent.input_onAfterBlur) hisonCloser.event.cssEvent.input_onAfterBlur = hisonConfig.event.cssEvent.input_onAfterBlur
  if(hisonConfig.event.cssEvent.input_onBeforeMouseover) hisonCloser.event.cssEvent.input_onBeforeMouseover = hisonConfig.event.cssEvent.input_onBeforeMouseover
  if(hisonConfig.event.cssEvent.input_onAfterMouseover) hisonCloser.event.cssEvent.input_onAfterMouseover = hisonConfig.event.cssEvent.input_onAfterMouseover
  if(hisonConfig.event.cssEvent.input_onBeforeMouseout) hisonCloser.event.cssEvent.input_onBeforeMouseout = hisonConfig.event.cssEvent.input_onBeforeMouseout
  if(hisonConfig.event.cssEvent.input_onAfterMouseout) hisonCloser.event.cssEvent.input_onAfterMouseout = hisonConfig.event.cssEvent.input_onAfterMouseout
  if(hisonConfig.event.cssEvent.input_onBeforeTouchstart) hisonCloser.event.cssEvent.input_onBeforeTouchstart = hisonConfig.event.cssEvent.input_onBeforeTouchstart
  if(hisonConfig.event.cssEvent.input_onAfterTouchstart) hisonCloser.event.cssEvent.input_onAfterTouchstart = hisonConfig.event.cssEvent.input_onAfterTouchstart
  if(hisonConfig.event.cssEvent.input_onBeforeTouchend) hisonCloser.event.cssEvent.input_onBeforeTouchend = hisonConfig.event.cssEvent.input_onBeforeTouchend
  if(hisonConfig.event.cssEvent.input_onAfterTouchend) hisonCloser.event.cssEvent.input_onAfterTouchend = hisonConfig.event.cssEvent.input_onAfterTouchend

  hisonCloser.componentStyle = {
    size : hisonConfig.componentStyle.size,
    filledColor : hisonConfig.componentStyle.filledColor,
    emptyColor : hisonConfig.componentStyle.emptyColor,
    filledTextColor : hisonConfig.componentStyle.filledTextColor,
    emptyTextColor : hisonConfig.componentStyle.emptyTextColor,
    primaryColor : hisonConfig.componentStyle.primaryColor,
    mutedColor : hisonConfig.componentStyle.mutedColor,
    infoColor : hisonConfig.componentStyle.infoColor,
    successColor : hisonConfig.componentStyle.successColor,
    dangerColor : hisonConfig.componentStyle.dangerColor,
    warningColor : hisonConfig.componentStyle.warningColor,
    invertColor : hisonConfig.componentStyle.invertColor,
    minHeightS: hisonConfig.componentStyle.minHeightS,
    minHeightM: hisonConfig.componentStyle.minHeightM,
    minHeightL: hisonConfig.componentStyle.minHeightL,
    minHeightXL: hisonConfig.componentStyle.minHeightXL,
    fontSizeS: hisonConfig.componentStyle.fontSizeS,
    fontSizeM: hisonConfig.componentStyle.fontSizeM,
    fontSizeL: hisonConfig.componentStyle.fontSizeL,
    fontSizeXL: hisonConfig.componentStyle.fontSizeXL,
    primaryInvertColor: null,
    mutedInvertColor: null,
    infoInvertColor: null,
    successInvertColor: null,
    dangerInvertColor: null,
    warningInvertColor: null,
    filledInvertColor: null,
    emptyInvertColor: null,
    filledTextInvertColor: null,
    emptyTextInvertColor: null,
    componentColor : {
      primary: {
        buttonColor : null,
        borderColor : null,
        shadowColor : null,
        hoverColor : null,
        activeColor : null,
        emptyTextColor : null,
        filledTextColor : null,
      },
      muted: {
        buttonColor : null,
        borderColor : null,
        shadowColor : null,
        hoverColor : null,
        activeColor : null,
        emptyTextColor : null,
        filledTextColor : null,
      },
      info: {
        buttonColor : null,
        borderColor : null,
        shadowColor : null,
        hoverColor : null,
        activeColor : null,
        emptyTextColor : null,
        filledTextColor : null,
      },
      success: {
        buttonColor : null,
        borderColor : null,
        shadowColor : null,
        hoverColor : null,
        activeColor : null,
        emptyTextColor : null,
        filledTextColor : null,
      },
      danger: {
        buttonColor : null,
        borderColor : null,
        shadowColor : null,
        hoverColor : null,
        activeColor : null,
        emptyTextColor : null,
        filledTextColor : null,
      },
      warning: {
        buttonColor : null,
        borderColor : null,
        shadowColor : null,
        hoverColor : null,
        activeColor : null,
        emptyTextColor : null,
        filledTextColor : null,
      }
    }
  } as any
  
  hisonCloser.componentConfig = {
    filesetSize : hisonConfig.component.filesetSize ?? Infinity,
    filesetTotalSize : hisonConfig.component.filesetTotalSize ?? Infinity,
  }

  const vn = getVn(hisonConfig)
  const vg = getVg(hisonConfig)
  hisonCloser.note = vn
  hisonCloser.grid = vg
  configureChartDefaults(hisonConfig)

  hisonCloser.component = {
    accordionList: {},
    baggieList: {},
    bannerList: {},
    buttonList: {},
    calendarList: {},
    captionList: {},
    chartList: {},
    drawerList: {},
    dropdownList: {},
    filesetList: {},
    gapList: {},
    imageboxList: {},
    inputList: {},
    inputGroupList: {},
    labelList: {},
    layoutList: {},
    listList: {},
    modalList: {},
    paginationList: {},
    paragraphList: {},
    popupList: {},
    spinnerList: {},
    tableList: {},
  }
}
