import type { HisonConfig } from "../types"
import { hisonCloser } from ".."
import { getVg, getVn } from "../plugins"

export const createHisonCloser = (hisonConfig: HisonConfig) => {
  // 이벤트 설정
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

  //컴포넌트 스타일 설정 
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
  
  // plugin설정
  const vn = getVn()
  const vg = getVg()
  hisonCloser.note = vn
  hisonCloser.grid = vg

  // 컴포넌트 리스트 생성
  hisonCloser.component = {
    buttonList: {}
  }
}
