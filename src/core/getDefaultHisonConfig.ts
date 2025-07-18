import type { HisonConfig } from "../types";
import type { InterfaceDataWrapper } from "hisonjs";
import { DateFormat, DateTimeFormat, DayFormat, DayOfWeekFormat, HourFormat, HourMinuteFormat, MinuteFormat, MonthFormat, SecondFormat, Size, TimeFormat, YearFormat, YearMonthFormat } from "../enums";
import { getVanillanoteConfig } from "vanillanote2";
import { getVanillagridConfig } from "vanillagrid2";
import { hison } from "..";
import { Chart } from "chart.js";

export const primaryColorRGBA = 'rgba(208,232,242,1)'
export const mutedColorRGBA = 'rgba(158,158,158,1)'
export const infoColorRGBA = 'rgba(121,232,252,1)'
export const successColorRGBA = 'rgba(122,214,122,1)'
export const dangerColorRGBA = 'rgba(247,113,109,1)'
export const warningColorRGBA = 'rgba(255,193,98,1)'
export const darkTextColorRGBA = 'rgba(48,48,48,1)'
export const lightTextColorRGBA = 'rgba(255,255,255,1)'
export const emptyColorRGBA = 'rgba(255,255,255,1)'

export const getDefaultHisonConfig = () => {
  const getIcon = (key: string) => {
    const iconSpan = document.createElement('span');
    iconSpan.classList.add('material-symbols-rounded');
    iconSpan.textContent = key;
    return iconSpan
  }

  //set note config
  const vanillanoteConfig = getVanillanoteConfig();

  //set grid config
  const vanillagridConfig = getVanillagridConfig();
  vanillagridConfig.footerFormula = {
      "$$COUNT_CHECK" : function (colValues) {
          let count = 0;
          colValues.forEach((val) => {
              if(val === 'Y') count = count + 1;
          });
          return String(count);
      }
  }
  vanillagridConfig.dataType = {
    radio : {
        //cell의 style에 justify-content, text-align 속성을 지정한다.
        cellStyle: {
            justifyContent: "center",
            textAlign: "center",
        },
        //cell이 선택된 상태에서 'Enter' key가 눌리면 해당 cell의 value를 "Y"로 변경한다.
        onSelectedAndKeyDown : function (event, gridId, data) {
            if(event.key === 'Enter' || event.key === ' ') {
                hison.component.getGrid(gridId)!.setColSameValue(data.colId, "N", true);
                hison.component.getGrid(gridId)!.setCellValue(data.rowIndex, data.colId, "Y", true);
                event.stopPropagation();
                event.preventDefault();
                return false;
            }
            return false;
        },
        //cell을 마우스로 선택하면 cell의 value를 "Y"로 변경한다.
        onClick : function (event, gridId, data) {
            hison.component.getGrid(gridId)!.setColSameValue(data.colId, "N", true);
            hison.component.getGrid(gridId)!.setCellValue(data.rowIndex, data.colId, "Y", true);
        },
        //value를 그대로 반환한다.
        getValue: function (gridId, value) {
            return value;
        },
        //value가 "Y"일 때 "true"를 아니면 "false"를 반환한다.
        getText: function (gridId, value) {
            const text = value === "Y" ? "true" : "false";
            return text;
        },
        //radio type의 input이며 data가 "Y"일 때 checked 상태인 html 요소를 반환한다.
        getChildNode: function (gridId, data) {
            const childNode: any = document.createElement("input");
            childNode.setAttribute("type", "radio");
            childNode.setAttribute("name", data.name? data.name : data.colId);
            childNode.setAttribute("value", "" + data.rowIndex);
            childNode._gridId = gridId;
            childNode.rowIndex = data.rowIndex;
            childNode.colId = data.colId;
            childNode.checked = data.value === "Y";
            return childNode;
        },
        //filter는 체크된 값은 "●", 아닌 값은 "○"를 적용한다.
        getFilterValue: function (gridId, value) {
            const filterValue = value === "Y" ? "●" : "○";
            return filterValue;
        },
    }
  }

  //set chart config
  const chartConfig = Chart.defaults

  const hisonConfig: HisonConfig = {
    //utils
    dateFormat : DateFormat['yyyy-MM-dd'],
    timeFormat : TimeFormat['HH:mm:ss'],
    datetimeFormat : DateTimeFormat['yyyy-MM-dd HH:mm:ss'],
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
    component : {
      note : vanillanoteConfig,
      grid : vanillagridConfig,
      chart : chartConfig,
      fileSetTotalSize: Infinity,
      fileSetSize: Infinity,
    },
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
        button_onBeforeFocus: (e: FocusEvent) => { return true },
        button_onAfterFocus: (e: FocusEvent) => {},
        button_onBeforeBlur: (e: FocusEvent) => { return true },
        button_onAfterBlur: (e: FocusEvent) => {},
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
        
        input_onBeforeFocus: (e: FocusEvent) => { return true },
        input_onAfterFocus: (e: FocusEvent) => {},
        input_onBeforeBlur: (e: FocusEvent) => { return true },
        input_onAfterBlur: (e: FocusEvent) => {},
        input_onBeforeMouseover: (e: MouseEvent) => { return true },
        input_onAfterMouseover: (e: MouseEvent) => {},
        input_onBeforeMouseout: (e: MouseEvent) => { return true },
        input_onAfterMouseout: (e: MouseEvent) => {},
        input_onBeforeTouchstart: (e: TouchEvent) => { return true },
        input_onAfterTouchstart: (e: TouchEvent) => {},
        input_onBeforeTouchend: (e: TouchEvent) => { return true },
        input_onAfterTouchend: (e: TouchEvent) => {},
      }
    }
  }

  return hisonConfig;
}
