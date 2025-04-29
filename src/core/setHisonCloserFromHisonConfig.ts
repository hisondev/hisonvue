import { getVg, getVn } from "../plugins"
import { HisonConfig, HisonCloser } from "../types"

export const hisonCloser = {
  event : {
    cssEvent: {
      button_onBeforeClick: (e: MouseEvent) => { return true },
      button_onAfterClick: (e: MouseEvent) => {},
      button_onBeforeMouseover: (e: MouseEvent) => { return true },
      button_onAfterMouseover: (e: MouseEvent) => {},
      button_onBeforeMouseout: (e: MouseEvent) => { return true },
      button_onAfterMouseout: (e: MouseEvent) => {},
      button_onBeforeTouchstart: (e: TouchEvent) => { return true },
      button_onAfterTouchstart: (e: TouchEvent) => {},
      button_onBeforeTouchend: (e: TouchEvent) => { return true },
      button_onAfterTouchend: (e: TouchEvent) => {},
    }
  }
} as HisonCloser

export const setHisonCloserFromHisonConfig = (hisonConfig: HisonConfig) => {
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

  const vn = getVn(hisonConfig)
  const vg = getVg(hisonConfig)
  hisonCloser.note = vn
  hisonCloser.grid = vg
  hisonCloser.element ={
    buttonList: {}
  }
}
