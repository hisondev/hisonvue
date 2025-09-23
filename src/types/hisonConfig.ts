import type { InterfaceDataWrapper } from "hisonjs";
import { DateFormat, DateTimeFormat, DayFormat, DayOfWeekFormat, HourFormat, HourMinuteFormat, MinuteFormat, MonthFormat, SecondFormat, Size, TimeFormat, YearFormat, YearMonthFormat } from "../enums";
import { VanillanoteConfig } from "vanillanote2";
import { VanillagridConfig } from "vanillagrid2";
import { Defaults } from "chart.js";

interface UtilsConfig {
  /**
   * The default format for displaying dates.
   *
   * This format is used throughout the `hisondev` solution for parsing 
   * and formatting date values.
   *
   * - Default value: `'yyyy-MM-dd'`
   * - Example output: `'2025-02-04'` (for February 4, 2025)
   * - Can be modified using `setDateFormat(format: string)`.
   */
  dateFormat: keyof typeof DateFormat;
  /**
   * The default format for displaying time.
   *
   * This format is used throughout the `hisondev` solution for parsing 
   * and formatting time values.
   *
   * - Default value: `'hh:mm:ss'`
   * - Example output: `'14:30:15'` (for 2:30:15 PM)
   * - Can be modified using `setTimeFormat(format: string)`.
   */
  timeFormat: keyof typeof TimeFormat;
  /**
   * The default format for displaying date and time.
   *
   * This format is used throughout the `hisondev` solution for parsing 
   * and formatting datetime values.
   *
   * - Default value: `'yyyy-MM-dd hh:mm:ss'`
   * - Example output: `'2025-02-04 14:30:15'` (for February 4, 2025, 2:30:15 PM)
   * - Can be modified using `setDatetimeFormat(format: string)`.
   */
  datetimeFormat: keyof typeof DateTimeFormat;
  /**
   * The default format for displaying the year.
   *
   * This format is used to represent year values in date-related operations.
   *
   * - Default value: `'yyyy'`
   * - Example output: `'2025'` (for the year 2025)
   * - Can be modified using `setYearFormat(format: string)`.
   */
  yearFormat: keyof typeof YearFormat;
  /**
   * The default format for displaying the month.
   *
   * This format is used to represent month values in date-related operations.
   *
   * - Default value: `'M'`
   * - Example output: `'2'` (for February)
   * - Can be modified using `setMonthFormat(format: string)`.
   */
  monthFormat: keyof typeof MonthFormat;
  /**
   * The default format for displaying year and month.
   *
   * This format is used to represent a combination of year and month in date-related operations.
   *
   * - Default value: `'yyyy-MM'`
   * - Example output: `'2025-02'` (for February 2025)
   * - Can be modified using `setYearMonthFormat(format: string)`.
   */
  yearMonthFormat: keyof typeof YearMonthFormat;
  /**
   * The default format for displaying the day of the month.
   *
   * This format is used to represent the day component in date-related operations.
   *
   * - Default value: `'d'`
   * - Example output: `'4'` (for the 4th day of the month)
   * - Can be modified using `setDayFormat(format: string)`.
   */
  dayFormat: keyof typeof DayFormat;
  /**
   * The default format for displaying the day of the week.
   *
   * This format is used to represent the day of the week in date-related operations.
   *
   * - Default value: `'d'`
   * - Example output: `'3'` (where 3 could represent Wednesday depending on locale settings)
   * - Can be modified using `setDayOfWeekFormat(format: string)`.
   */
  dayOfWeekFormat: keyof typeof DayOfWeekFormat;
  /**
   * Defines the default format for displaying the hour in 24-hour time operations.
   *
   * ### Behavior
   * - `'h'`  → Displays the hour without leading zero. (e.g., `"5"` for 5 AM, `"13"` for 1 PM)
   * - `'hh'` → Displays the hour with leading zero if needed. (e.g., `"05"` for 5 AM, `"13"` for 1 PM)
   *
   * ### Details
   * - This format is used internally in time-related methods like `getSysHour()`.
   * - If no specific format is provided when calling those methods, this default is used.
   *
   * ### Default Value
   * - `'h'`
   *
   * ### Example Outputs
   * - 5 AM → `'5'` with `'h'`, `'05'` with `'hh'`
   * - 1 PM → `'13'` with `'h'` or `'hh'`
   *
   * ### Modification
   * - Can be modified using the `setHourFormat(format: HourFormat)` method.
   */
  hourFormat: keyof typeof HourFormat;
  /**
   * The default format for displaying the hour and minute.
   *
   * This format is used to represent the time in hours and minutes.
   *
   * - Default value: `'hh:mm'`
   * - Example output: `'14:30'` (for 2:30 PM in 24-hour format)
   * - Can be modified using `setHourMinuteFormat(format: string)`.
   */
  hourMinuteFormat: keyof typeof HourMinuteFormat;
  /**
   * The default format for displaying the minute.
   *
   * This format is used to represent the minute component in time-related operations.
   *
   * - Default value: `'m'`
   * - Example output: `'5'` (for the 5th minute of the hour)
   * - Can be modified using `setMinuteFormat(format: string)`.
   */
  minuteFormat: keyof typeof MinuteFormat;
  /**
   * The default format for displaying the second.
   *
   * This format is used to represent the second component in time-related operations.
   *
   * - Default value: `'s'`
   * - Example output: `'45'` (for the 45th second of the minute)
   * - Can be modified using `setSecondFormat(format: string)`.
   */
  secondFormat: keyof typeof SecondFormat;
  /**
   * The default format for displaying numbers.
   *
   * This format is used to represent numeric values with grouping separators and decimal precision.
   *
   * - Default value: `"#,##0.##"`
   * - Example output: `"1,234.56"` (for the number `1234.56`)
   * - Can be modified using `setNumberFormat(format: string)`.
   */
  numberFormat: string;
  /**
   * The byte size used for characters with a char code less than or equal to `0x7FF`.
   *
   * This value defines the number of bytes required to encode characters in this range.
   *
   * - Default value: `2`
   * - Represents characters with `charCode <= 0x7FF`
   */
  LESSOREQ_0X7FF_BYTE: number;
  /**
   * The byte size used for characters with a char code less than or equal to `0xFFFF`.
   *
   * This value defines the number of bytes required to encode characters in this range.
   *
   * - Default value: `3`
   * - Represents characters with `charCode <= 0xFFFF`
   */
  LESSOREQ_0XFFFF_BYTE: number;
  /**
   * The byte size used for characters with a char code greater than `0xFFFF`.
   *
   * This value defines the number of bytes required to encode characters in this range.
   *
   * - Default value: `4`
   * - Represents characters with `charCode > 0xFFFF`
   */
  GREATER_0XFFFF_BYTE: number;
}
interface ShieldConfig {
  /**
   * The URL used to enforce access restrictions.
   *
   * If this value is set, the system verifies whether the current location matches 
   * the specified URL. If not, access may be blocked.
   *
   * - Default value: `""` (empty string, meaning no restriction)
   * - Used in `shield.excute(hison: Hison)` to validate the URL.
   */
  shieldURL: string;
  /**
   * A list of IP addresses that are allowed to bypass security restrictions.
   *
   * When the shield mechanism is activated, only these IPs are granted access.
   *
   * - Default value: `["0:0:0:0:0:0:0:1"]` (allows localhost)
   * - Used in `shield.excute(hison: Hison)` to verify access permissions.
   */
  exposeIpList: string[];
  /**
   * Determines whether the `Hison` instance should be frozen to prevent modifications.
   *
   * If `true`, the `Hison` object and its properties are deeply frozen using `Object.freeze()`, 
   * ensuring that no further changes can be made.
   *
   * - Default value: `true`
   * - Used in `shield.excute(hison: Hison)`, where `deepFreeze(hison)` is applied.
   */
  isFreeze: boolean;
  /**
   * Determines whether the browser's back navigation is allowed.
   *
   * If `false`, a mechanism is implemented to prevent the user from navigating back.
   *
   * - Default value: `false`
   * - Used in `shield.excute(hison: Hison)`, where `history.pushState()` is applied 
   *   to disable the back button.
   */
  isPossibleGoBack: boolean;
  /**
   * Determines whether developer tools can be opened.
   *
   * If `false`, an event listener is added to detect developer mode access (F12 key, 
   * browser dev tools, resizing, etc.), and alerts the user if an attempt is detected.
   *
   * - Default value: `false`
   * - Used in `shield.excute(hison: Hison)`, where `shieldFuncCreateBlockDevMode()` is triggered.
   */
  isPossibleOpenDevTool: boolean;
  /**
   * A custom function that is executed when detecting that developer tools may be opened.
   *
   * This hook allows developers to define specific behaviors when the system detects that 
   * the browser's developer tools are likely active.  
   * 
   * - By default, this function does nothing (`() => {}`).
   * - Developers can customize it using `hison.setDoDetectDevTool(func)`.
   * - Common custom actions include inserting a `debugger;`, showing alerts, or halting program flow.
   *
   * - Default value: `() => {}` (no action)
   * - Used in `shield.excute(hison: Hison)` when attempting to detect devtool access.
   *
   * ---
   * ### Example Usage
   *
   * ```typescript
   * hison.setDoDetectDevTool(() => {
   *   debugger; // Pause execution when devtools are detected
   * });
   * ```
   *
   * ### Notes
   * - This function is triggered during events like `resize`, `mousemove`, `focus`, and `blur` to detect suspicious behavior.
   * - It is up to the developer to define the action taken (e.g., throwing errors, stopping execution, etc.).
   *
   * @remarks
   * This hook offers flexibility without enforcing a specific anti-debugging behavior at the library level.
   * 
   * @see `hison.setDoDetectDevTool(func: () => void)`
   */
  doDetectDevTool(): void;
}
interface DataConfig {
  /**
   * A function that allows customization of how specific objects are inserted into a `DataModel`.
   *
   * In `hisondev`, all values inserted into a `DataModel` are **copied** to maintain data integrity.
   * However, certain JavaScript objects, such as `Date`, require a more flexible way of handling 
   * their copying process. Instead of manually defining conversion logic for every object type, 
   * `convertValue` provides a way for developers to customize how specific objects are transformed
   * before being inserted into a `DataModel`.
   *
   * - By default, this function **returns the input value as is**.
   * - Developers can override this function to implement custom conversion logic.
   * - Used in `DataModel._deepCopy(object)`, where it is applied to non-plain objects.
   *
   * ### Usage in `DataModel`
   * When copying an object, if it is not a plain `Object` or `Array`, `convertValue` is called:
   * ```typescript
   * if (object.constructor !== Object && object.constructor !== Array) {
   *     const convertValue = customOption.data.convertValue(object);
   *     return convertValue !== undefined ? convertValue : object;
   * }
   * ```
   *
   * ### Example: Customizing `convertValue` to Handle `Date` Objects
   * ```typescript
   * hison.setConvertValue((value: any) => {
   *     return value instanceof Date ? value.getTime() : value;
   * });
   * ```
   *
   * - The above example ensures that when a `Date` object is inserted into `DataModel`, 
   *   it is converted into a timestamp (`number`) instead of being copied as a reference.
   *
   * @param value The value to be processed before being inserted into `DataModel`.
   * @returns The customized or original value.
   */
  convertValue(value: any): any;
}
interface LinkConfig {
  /**
   * The default protocol used for API communication.
   *
   * - Default value: `'http://'`
   * - Used in `ApiLink` to construct request URLs.
   */
  protocol: string;
  /**
   * The default domain for API requests.
   *
   * - Default value: `'localhost:8080'`
   * - Used in `ApiLink` when constructing full request URLs.
   */
  domain: string;
  /**
   * The default controller path for API requests.
   *
   * This value is appended to the `protocol` and `domain` when making API calls.
   *
   * - Default value: `'/hison-api-link'`
   * - Used in `ApiLink` when constructing API request URLs.
   */
  controllerPath: string;
  /**
   * The timeout duration (in milliseconds) for API requests.
   *
   * If the request does not complete within this time, it will be aborted.
   *
   * - Default value: `10000` (10 seconds)
   * - Used in `ApiLink._getFetch()` to set request timeouts.
   */
  timeout : number;
  /**
   * The default protocol used for WebSocket connections.
   *
   * - Default value: `'ws://'`
   * - Used in `ApiLink` when initializing WebSocket communication.
   */
  webSocketProtocol: string;
  /**
   * The default WebSocket endpoint for caching-related communication.
   *
   * - Default value: `'/hison-websocket-endpoint'`
   * - Used in `ApiLink` when establishing WebSocket connections.
   */
  webSocketEndPoint: string;
  /**
   * The caching limit for stored API responses.
   *
   * Determines the maximum number of cached API responses before old ones are removed.
   *
   * - Default value: `10`
   * - Used in `ApiLink._getCachingResult()` for cache management.
   */
  cachingLimit: number,
  /**
   * Hook function executed before making a `GET` request.
   *
   * This function can be used to modify request parameters or cancel the request.
   *
   * - If it returns `false`, the request will be canceled.
   * - Default implementation returns `true`.
   *
   * @param resourcePath The API resource path being requested.
   * @param options Additional request options.
   * @returns `boolean | void` (Returning `false` cancels the request)
   */
  beforeGetRequest(resourcePath?: string, options?: Record<string, any>): boolean | void;
  /**
   * Hook function executed before making a `POST` request.
   *
   * This function allows modifying the request before it is sent.
   *
   * - If it returns `false`, the request will be canceled.
   * - Default implementation returns `true`.
   *
   * @param requestData The `DataWrapper` object containing the request data.
   * @param options Additional request options.
   * @returns `boolean | void` (Returning `false` cancels the request)
   */
  beforePostRequest(requestData?: InterfaceDataWrapper, options?: Record<string, any>): boolean | void;
  /**
   * Hook function executed before making a `PUT` request.
   *
   * - If it returns `false`, the request will be canceled.
   * - Default implementation returns `true`.
   *
   * @param requestData The `DataWrapper` object containing the request data.
   * @param options Additional request options.
   * @returns `boolean | void` (Returning `false` cancels the request)
   */
  beforePutRequest(requestData?: InterfaceDataWrapper, options?: Record<string, any>): boolean | void;
  /**
   * Hook function executed before making a `PATCH` request.
   *
   * - If it returns `false`, the request will be canceled.
   * - Default implementation returns `true`.
   *
   * @param requestData The `DataWrapper` object containing the request data.
   * @param options Additional request options.
   * @returns `boolean | void` (Returning `false` cancels the request)
   */
  beforePatchRequest(requestData?: InterfaceDataWrapper, options?: Record<string, any>): boolean | void;
  /**
   * Hook function executed before making a `DELETE` request.
   *
   * - If it returns `false`, the request will be canceled.
   * - Default implementation returns `true`.
   *
   * @param requestData The `DataWrapper` object containing the request data.
   * @param options Additional request options.
   * @returns `boolean | void` (Returning `false` cancels the request)
   */
  beforeDeleteRequest(requestData?: InterfaceDataWrapper, options?: Record<string, any>): boolean | void;
  /**
   * Hook function executed after completing a `GET` request.
   *
   * This function allows post-processing of the API response.
   *
   * - If it returns `false`, the response will be nullified.
   * - Default implementation does nothing.
   *
   * @param responseData The response object containing `data` and `response`.
   * @returns `boolean | void` (Returning `false` nullifies the response)
   */
  afterGetRequest<T = InterfaceDataWrapper>(responseData?: { data: T; response: Response }): boolean | void;
  /**
   * Hook function executed after completing a `POST` request.
   *
   * This function allows post-processing of the API response.
   *
   * - If it returns `false`, the response will be nullified.
   * - Default implementation does nothing.
   *
   * @param responseData The response object containing `data` and `response`.
   * @returns `boolean | void` (Returning `false` nullifies the response)
   */
  afterPostRequest<T = InterfaceDataWrapper>(responseData?: { data: T; response: Response }): boolean | void;
  /**
   * Hook function executed after completing a `PUT` request.
   *
   * This function allows post-processing of the API response.
   *
   * - If it returns `false`, the response will be nullified.
   * - Default implementation does nothing.
   *
   * @param responseData The response object containing `data` and `response`.
   * @returns `boolean | void` (Returning `false` nullifies the response)
   */
  afterPutRequest<T = InterfaceDataWrapper>(responseData?: { data: T; response: Response }): boolean | void;
  /**
   * Hook function executed after completing a `PATCH` request.
   *
   * This function allows post-processing of the API response.
   *
   * - If it returns `false`, the response will be nullified.
   * - Default implementation does nothing.
   *
   * @param responseData The response object containing `data` and `response`.
   * @returns `boolean | void` (Returning `false` nullifies the response)
   */
  afterPatchRequest<T = InterfaceDataWrapper>(responseData?: { data: T; response: Response }): boolean | void;
  /**
   * Hook function executed after completing a `DELETE` request.
   *
   * This function allows post-processing of the API response.
   *
   * - If it returns `false`, the response will be nullified.
   * - Default implementation does nothing.
   *
   * @param responseData The response object containing `data` and `response`.
   * @returns `boolean | void` (Returning `false` nullifies the response)
   */
  afterDeleteRequest<T = InterfaceDataWrapper>(responseData?: { data: T; response: Response }): boolean | void;
  /**
   * Hook function executed before making a `GET` request to a specified URL.
   *
   * This function allows modifying request parameters or canceling the request.
   *
   * - If it returns `false`, the request will be canceled.
   * - Default implementation returns `true`.
   *
   * @param url The API endpoint being requested.
   * @param options Additional request options.
   * @returns `boolean | void` (Returning `false` cancels the request)
   */
  beforeGetUrlRequest(url?: string, options?: Record<string, any>): boolean | void;
  /**
   * Hook function executed before making a `POST` request to a specified URL.
   *
   * This function allows modifying the request before it is sent.
   *
   * - If it returns `false`, the request will be canceled.
   * - Default implementation returns `true`.
   *
   * @param url The API endpoint being requested.
   * @param requestData The data being sent in the request.
   * @param options Additional request options.
   * @returns `boolean | void` (Returning `false` cancels the request)
   */
  beforePostUrlRequest(url?: string, requestData?: any, options?: Record<string, any>): boolean | void;
  /**
   * Hook function executed before making a `PUT` request to a specified URL.
   *
   * - If it returns `false`, the request will be canceled.
   * - Default implementation returns `true`.
   *
   * @param url The API endpoint being requested.
   * @param requestData The data being sent in the request.
   * @param options Additional request options.
   * @returns `boolean | void` (Returning `false` cancels the request)
   */
  beforePutUrlRequest(url?: string, requestData?: any, options?: Record<string, any>): boolean | void;
  /**
   * Hook function executed before making a `PATCH` request to a specified URL.
   *
   * - If it returns `false`, the request will be canceled.
   * - Default implementation returns `true`.
   *
   * @param url The API endpoint being requested.
   * @param requestData The data being sent in the request.
   * @param options Additional request options.
   * @returns `boolean | void` (Returning `false` cancels the request)
   */
  beforePatchUrlRequest(url?: string, requestData?: any, options?: Record<string, any>): boolean | void;
  /**
   * Hook function executed before making a `DELETE` request to a specified URL.
   *
   * - If it returns `false`, the request will be canceled.
   * - Default implementation returns `true`.
   *
   * @param url The API endpoint being requested.
   * @param requestData The data being sent in the request.
   * @param options Additional request options.
   * @returns `boolean | void` (Returning `false` cancels the request)
   */
  beforeDeleteUrlRequest(url?: string, requestData?: any, options?: Record<string, any>): boolean | void;
  /**
   * Hook function executed after completing a `GET` request to a specified URL.
   *
   * This function allows post-processing of the API response.
   *
   * - If it returns `false`, the response will be nullified.
   * - Default implementation does nothing.
   *
   * @param responseData The response object containing `data` and `response`.
   * @returns `boolean | void` (Returning `false` nullifies the response)
   */
  afterGetUrlRequest(responseData?: { data: any; response: Response }): boolean | void;
  /**
   * Hook function executed after completing a `POST` request to a specified URL.
   *
   * This function allows post-processing of the API response.
   *
   * - If it returns `false`, the response will be nullified.
   * - Default implementation does nothing.
   *
   * @param responseData The response object containing `data` and `response`.
   * @returns `boolean | void` (Returning `false` nullifies the response)
   */
  afterPostUrlRequest(responseData?: { data: any; response: Response }): boolean | void;
  /**
   * Hook function executed after completing a `PUT` request to a specified URL.
   *
   * This function allows post-processing of the API response.
   *
   * - If it returns `false`, the response will be nullified.
   * - Default implementation does nothing.
   *
   * @param responseData The response object containing `data` and `response`.
   * @returns `boolean | void` (Returning `false` nullifies the response)
   */
  afterPutUrlRequest(responseData?: { data: any; response: Response }): boolean | void;
  /**
   * Hook function executed after completing a `PATCH` request to a specified URL.
   *
   * This function allows post-processing of the API response.
   *
   * - If it returns `false`, the response will be nullified.
   * - Default implementation does nothing.
   *
   * @param responseData The response object containing `data` and `response`.
   * @returns `boolean | void` (Returning `false` nullifies the response)
   */
  afterPatchUrlRequest(responseData?: { data: any; response: Response }): boolean | void;
  /**
   * Hook function executed after completing a `DELETE` request to a specified URL.
   *
   * This function allows post-processing of the API response.
   *
   * - If it returns `false`, the response will be nullified.
   * - Default implementation does nothing.
   *
   * @param responseData The response object containing `data` and `response`.
   * @returns `boolean | void` (Returning `false` nullifies the response)
   */
  afterDeleteUrlRequest(responseData?: { data: any; response: Response }): boolean | void;
  /**
   * Intercepts and processes API responses before returning them to the caller.
   *
   * - If it returns `false`, the response is ignored.
   * - Default implementation returns `true`.
   *
   * @param result The `DataWrapper` object containing the API response.
   * @param response The raw `Response` object from the fetch request.
   * @returns `boolean | void` (Returning `false` cancels further processing)
   */
  interceptApiResult(result: InterfaceDataWrapper | undefined, response: Response): boolean | void;
  /**
   * Intercepts and processes API errors before returning them to the caller.
   *
   * - If it returns `false`, the error is ignored.
   * - Default implementation returns `true`.
   *
   * @param error The encountered error.
   * @returns `boolean | void` (Returning `false` cancels further error handling)
   */
  interceptApiError(error: any): boolean | void;
}

export interface ComponentStyleConfig {
  size: Size.s | Size.m | Size.l | Size.xl;

  primaryColor: string;
  mutedColor: string;
  infoColor: string;
  successColor: string;
  dangerColor: string;
  warningColor: string;
  filledColor: string;
  emptyColor: string;
  filledTextColor: string;
  emptyTextColor: string;
  /** Whether to invert colors. Used in dark mode. */
  invertColor: boolean;

  /** The default height of an element when it is small. The unit is 'rem'. (default 1.7) */
  minHeightS: number;
  /** The default height of an element when it is medium. The unit is 'rem'. (default 1.95) */
  minHeightM: number;
  /** The default height of an element when it is large. The unit is 'rem'. (default 2.25) */
  minHeightL: number;
  /** The default height of an element when it is extra large. The unit is 'rem'. (default 2.55) */
  minHeightXL: number;
  /** The default font size of an element when it is small. The unit is 'rem'. (default 0.7) */
  fontSizeS: number;
  /** The default font size of an element when it is medium. The unit is 'rem'. (default 0.75) */
  fontSizeM: number;
  /** The default font size of an element when it is large. The unit is 'rem'. (default 0.85) */
  fontSizeL: number;
  /** The default font size of an element when it is extra large. The unit is 'rem'. (default 1) */
  fontSizeXL: number;
}

export interface CssEvent {
  //클릭 등 이벤트가 활성화되는 빈 배경의 textbox 이벤트
  textbox_onBeforeFocus: (e: FocusEvent) => boolean;
  textbox_onAfterFocus: (e: FocusEvent) => void;
  textbox_onBeforeBlur: (e: FocusEvent) => boolean;
  textbox_onAfterBlur: (e: FocusEvent) => void;
  textbox_onBeforeClick: (e: MouseEvent) => boolean;
  textbox_onAfterClick: (e: MouseEvent) => void;
  textbox_onBeforeMouseover: (e: MouseEvent) => boolean;
  textbox_onAfterMouseover: (e: MouseEvent) => void;
  textbox_onBeforeMouseout: (e: MouseEvent) => boolean;
  textbox_onAfterMouseout: (e: MouseEvent) => void;
  textbox_onBeforeTouchstart: (e: TouchEvent) => boolean;
  textbox_onAfterTouchstart: (e: TouchEvent) => void;
  textbox_onBeforeTouchend: (e: TouchEvent) => boolean;
  textbox_onAfterTouchend: (e: TouchEvent) => void;

  button_onBeforeFocus: (e: FocusEvent) => boolean;
  button_onAfterFocus: (e: FocusEvent) => void;
  button_onBeforeBlur: (e: FocusEvent) => boolean;
  button_onAfterBlur: (e: FocusEvent) => void;
  button_onBeforeClick: (e: MouseEvent) => boolean;
  button_onAfterClick: (e: MouseEvent) => void;
  button_onBeforeMouseover: (e: MouseEvent) => boolean;
  button_onAfterMouseover: (e: MouseEvent) => void;
  button_onBeforeMouseout: (e: MouseEvent) => boolean;
  button_onAfterMouseout: (e: MouseEvent) => void;
  button_onBeforeTouchstart: (e: TouchEvent) => boolean;
  button_onAfterTouchstart: (e: TouchEvent) => void;
  button_onBeforeTouchend: (e: TouchEvent) => boolean;
  button_onAfterTouchend: (e: TouchEvent) => void;
  
  input_onBeforeFocus: (e: FocusEvent) => boolean;
  input_onAfterFocus: (e: FocusEvent) => void;
  input_onBeforeBlur: (e: FocusEvent) => boolean;
  input_onAfterBlur: (e: FocusEvent) => void;
  input_onBeforeMouseover: (e: MouseEvent) => boolean;
  input_onAfterMouseover: (e: MouseEvent) => void;
  input_onBeforeMouseout: (e: MouseEvent) => boolean;
  input_onAfterMouseout: (e: MouseEvent) => void;
  input_onBeforeTouchstart: (e: TouchEvent) => boolean;
  input_onAfterTouchstart: (e: TouchEvent) => void;
  input_onBeforeTouchend: (e: TouchEvent) => boolean;
  input_onAfterTouchend: (e: TouchEvent) => void;
}

export interface HisonvueEvent {
  cssEvent: CssEvent;
}

export interface ComponentConfig {
  /**
   * Use npm vanillanote2. See vanillanote2's specification.
   * The component's style follows HisonConfig's componentStyle property, so there may be properties in vanillanote that are ignored.
   */
  note: VanillanoteConfig;
  /**
   * Use npm vanillagrid2. See vanillagrid's specification.
   * The component's style follows HisonConfig's componentStyle property, so there may be properties in vanillagrid that are ignored.
   */
  grid: VanillagridConfig;
  /**
   * Use npm chart.js. ^4.5.0.  See chartjs's specification.
   * chart.js default properties
   */
  chart: Defaults;
  /**
   * The maximum size of all uploaded files that the fileset component will have by default.
   */
  filesetTotalSize: number
  /**
   * The maximum size per upload file that the fileset component will have by default.
   */
  filesetSize: number
}

/**
 * Configuration interface for global Hisonvue settings.
 *
 * @property primaryColor - The main color applied to all components (hex color string).
 * @property size - Default size used across all components (s, m, l, xl).
 * @property editorConfig - Default config for HNote (based on Vanillanote).
 */
export interface HisonConfig extends UtilsConfig, ShieldConfig, DataConfig, LinkConfig {
  componentStyle: ComponentStyleConfig;
  component: ComponentConfig;
  event: HisonvueEvent;
}
