import type { HisonConfig } from "../types";
import type { InterfaceDataWrapper } from "hisonjs";
import { DateFormat, DateTimeFormat, DayFormat, DayOfWeekFormat, HourFormat, HourMinuteFormat, MinuteFormat, MonthFormat, SecondFormat, Size, TimeFormat, YearFormat, YearMonthFormat } from "../enums";
import { adjustRgbaColor, colorCycleChange, getBasicTextColor, normalizeToRgba } from "../utils";

export const getDefaultHisonConfig = () => {
  const primaryColorRGBA = 'rgba(96,169,232,1)'
  const mutedColorRGBA = 'rgba(158,158,158,1)'
  const infoColorRGBA = 'rgba(121,232,252,1)'
  const successColorRGBA = 'rgba(122,214,122,1)'
  const dangerColorRGBA = 'rgba(247,113,109,1)'
  const warningColorRGBA = 'rgba(255,193,98,1)'
  const darkTextColorRGBA = 'rgba(48,48,48,1)'
  const lightTextColorRGBA = 'rgba(255,255,255,1)'
  const emptyColorRGBA = 'rgba(255,255,255,0)'

  const hisonConfig: HisonConfig = {
    //utils
    dateFormat : DateFormat['yyyy-MM-dd'],
    timeFormat : TimeFormat['hh:mm:ss'],
    datetimeFormat : DateTimeFormat['yyyy-MM-dd hh:mm:ss'],
    yearFormat : YearFormat.yyyy,
    monthFormat : MonthFormat.M,
    yearMonthFormat : YearMonthFormat['yyyy-MM'],
    dayFormat : DayFormat.d,
    dayOfWeekFormat : DayOfWeekFormat.d,
    hourFormat : HourFormat.h,
    hourMinuteFormat : HourMinuteFormat['hh:mm'],
    minuteFormat : MinuteFormat.m,
    secondFormat : SecondFormat.s,
    numberFormat : '#,##0.##',
    LESSOREQ_0X7FF_BYTE : 2,
    LESSOREQ_0XFFFF_BYTE : 3,
    GREATER_0XFFFF_BYTE : 4,
    //shield
    shieldURL : '',
    exposeIpList : ['0:0:0:0:0:0:0:1'],
    isFreeze : true,
    isPossibleGoBack : false,
    isPossibleOpenDevTool : false,
    doDetectDevTool() {},
    //data
    convertValue(value: any): any {return value;},
    //link
    protocol : 'http://',
    domain : 'localhost:8080',
    controllerPath : '/hison-api-link',
    timeout : 10000,
    webSocketProtocol : 'ws://',
    webSocketEndPoint : '/hison-websocket-endpoint',
    cachingLimit : 10,
    beforeGetRequest(resourcePath: string, options: Record<string, any>): boolean | void { return true; },
    beforePostRequest(requestData: InterfaceDataWrapper, options: Record<string, any>): boolean | void { return true; },
    beforePutRequest(requestData: InterfaceDataWrapper, options: Record<string, any>): boolean | void { return true; },
    beforePatchRequest(requestData: InterfaceDataWrapper, options: Record<string, any>): boolean | void { return true; },
    beforeDeleteRequest(requestData: InterfaceDataWrapper, options: Record<string, any>): boolean | void { return true; },
    afterGetRequest<T = InterfaceDataWrapper>(responseData: { data: T; response: Response }): boolean | void { return true; },
    afterPostRequest<T = InterfaceDataWrapper>(responseData: { data: T; response: Response }): boolean | void { return true; },
    afterPutRequest<T = InterfaceDataWrapper>(responseData: { data: T; response: Response }): boolean | void { return true; },
    afterPatchRequest<T = InterfaceDataWrapper>(responseData: { data: T; response: Response }): boolean | void { return true; },
    afterDeleteRequest<T = InterfaceDataWrapper>(responseData: { data: T; response: Response }): boolean | void { return true; },
    beforeGetUrlRequest(url: string, options: Record<string, any>): boolean | void { return true; },
    beforePostUrlRequest(url: string, requestData: any, options: Record<string, any>): boolean | void { return true; },
    beforePutUrlRequest(url: string, requestData: any, options: Record<string, any>): boolean | void { return true; },
    beforePatchUrlRequest(url: string, requestData: any, options: Record<string, any>): boolean | void { return true; },
    beforeDeleteUrlRequest(url: string, requestData: any, options: Record<string, any>): boolean | void { return true; },
    afterGetUrlRequest(responseData: { data: any; response: Response }): boolean | void { return true; },
    afterPostUrlRequest(responseData: { data: any; response: Response }): boolean | void { return true; },
    afterPutUrlRequest(responseData: { data: any; response: Response }): boolean | void { return true; },
    afterPatchUrlRequest(responseData: { data: any; response: Response }): boolean | void { return true; },
    afterDeleteUrlRequest(responseData: { data: any; response: Response }): boolean | void { return true; },
    interceptApiResult(result: InterfaceDataWrapper | undefined, response: Response): boolean | void { return true; },
    interceptApiError(error: any): boolean | void { return true; },
    
    componentStyle : {
      size: Size.m,
      filledColor: primaryColorRGBA,
      emptyColor: emptyColorRGBA,
      filledTextColor: lightTextColorRGBA,
      emptyTextColor: darkTextColorRGBA,
      primaryColor : primaryColorRGBA,
      mutedColor : mutedColorRGBA,
      infoColor : infoColorRGBA,
      successColor : successColorRGBA,
      dangerColor : dangerColorRGBA,
      warningColor : warningColorRGBA,
      invertColor : false,
    },
    event : {
      cssEvent : {
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
  }

  return hisonConfig;
}
