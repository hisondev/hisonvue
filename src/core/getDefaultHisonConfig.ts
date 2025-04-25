import type { HisonConfig } from "../types";
import type { InterfaceDataWrapper } from "hisonjs";
import { DateFormat, DateTimeFormat, DayFormat, DayOfWeekFormat, HourFormat, HourMinuteFormat, MinuteFormat, MonthFormat, SecondFormat, Size, TimeFormat, YearFormat, YearMonthFormat } from "../enums";

export const getDefaultHisonConfig = () => {
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
    //vue
    primaryColor: '#eeffee',
    size: Size.m,
  }
  return hisonConfig;
}
