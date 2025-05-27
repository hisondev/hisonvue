import { CSSProperties, PropType } from "vue";
import { BoolString, InputEditMode, InputType } from "../../enums";

export const inputProps = {
    /**
     * Unique identifier for the input.
     * - You can later retrieve its methods via `hison.vue.getButton(id)`
     * - ⚠️ Duplicate `id` values will throw an error at mount time
     */
    id: { type: String, required: false },

    modelValue: { type: String, required: false },
    /**
     * Custom class string applied to the input container.
     * - You can use `hison-col-*`, `hison-pos-*`, `hison-size-*` and other responsive classes
     * - These classes will be processed internally for device-specific application
     */
    class: { type: String, required: false },
    /**
     * Inline style string applied to the input container.
     * - Accepts valid CSS style text (e.g., 'padding: 10px; margin-top: 20px')
     * - Merged with dynamic computed styles like background and border settings
     */
    style: { type: [String, Object] as PropType<string | CSSProperties>, required: false },
    /**
     * Controls visibility of the input.
     * - Accepts string values: `'true'` or `'false'` (not boolean)
     * - Defaults to visible if not provided or if value is not `'false'`
     */
    visible: { type: String as PropType<BoolString>, required: false },
    /**
     * Tooltip text shown when hovering over the input.
     * - Maps to the `title` attribute.
     * - Can be retrieved or updated via `HButtonMethods.getTitle()` / `setTitle()`
     * - Default: `''` (no tooltip)
     */
    title : { type: String, required: false },


    //	number, date, month, year, minute, numchar, email, mask, password.	Input 타입의 유형을 설정한다.
    /**
     * 
     * export enum InputType {
            number = 'number', => 숫자타입

            date = 'date', => 날짜타입

            month = 'month', => 년월타입

            year = 'year', => 년 타입

            minute = 'minute', => 시분 타입

            numchar = 'numchar', => 숫자인 문자만 입력 가능(1,2,3,4,5,6,7,8,9,0)
            hison.utils.isNumber() 활용
            isNumber(str: string): boolean {
                return /^[0-9]+$/.test(str);
            },

            email = 'email', => 이메일 형식

            mask = 'mask', => 마스크 형식
            hison.utils.isValidMask() 활용
            * Checks if the given string matches the specified mask pattern.
            *
            * - A mask defines expected character types at each position:
            *   - `'A'` expects an uppercase letter (A-Z).
            *   - `'a'` expects a lowercase letter (a-z).
            *   - `'9'` expects a numeric digit (0-9).
            *   - Any other character in the mask must match exactly.
            * - Returns `true` if the string fully matches the mask pattern.
            * - Returns `false` if the string does not match the mask or has a different length.
            *
            * @param str The string to be validated.
            * @param mask The mask pattern defining expected character types.
            * @returns `true` if the string matches the mask pattern, otherwise `false`.
            *
            * @example
            * isValidMask("ABC123", "AAA999"); // true
            * isValidMask("abc123", "AAA999"); // false (lowercase letters don't match uppercase mask)
            * isValidMask("abc-123", "aaa-999"); // true
            * isValidMask("abcd123", "aaa-999"); // false (length mismatch)
            isValidMask(str: string, mask: string): boolean {
                if (str.length !== mask.length) {
                    return false;
                }
            
                for (let i = 0; i < str.length; i++) {
                    const char = str.charAt(i);
                    const maskChar = mask.charAt(i);
            
                    switch (maskChar) {
                        case 'A':
                            if (char < 'A' || char > 'Z') return false;
                            break;
                        case 'a':
                            if (char < 'a' || char > 'z') return false;
                            break;
                        case '9':
                            if (isNaN(parseInt(char))) return false;
                            break;
                        default:
                            if (char !== maskChar) return false;
                    }
                }
                return true;
            },

            password = 'password', => 패스워드 타입
        }
     * 
     */
    type : { type:  String as PropType<InputType>, required: false },
    /**
    type이 number인 경우 => hison.utils.getNumberFormat()활용
    * Formats a number according to a specified format pattern.
    *
    * - Uses `CustomOption.numberFormat` as the default format if none is provided.
    * - Supports various number formatting patterns, including:
    *   - `"#,###"` → `"1,234"`, '' (comma-separated thousands).
    *   - `"#,##0"` → `"1,234"`, '0' (ensures at least one digit).
    *   - `"#"` → `"1234"`, ''
    *   - `"0"` → `"1234"`, '0'
    *   - `".##"` → `"0.1"` (no grouping).
    *   - `".00"` → `"0.10"` (ensures at least one digit).
    * - Supports decimal formatting and percentage notation (`"%"`).
    * - Throws an error if the input is not a valid number or if the format is invalid.
    *
    * @param value The number to format.
    * @param format The desired format pattern (optional). Default: `'#,##0.##'`
    * @returns The formatted number as a string.
    *
    * @throws Error if the input value is not numeric or the format is invalid.
    *
    * @example
    * getNumberFormat(1234); // "1,234" (default format)
    * getNumberFormat(1234.5678, "#,###.00"); // "1,234.56"
    * getNumberFormat(0.25, "#,##0%"); // "25%" (percentage conversion)
    * getNumberFormat(-1234, "#,###"); // "-1,234"
    getNumberFormat(value: number, format?: string): string {
        value = hisonCore.utils.getToNumber(value);
        format = hisonCore.utils.getToString(format);

        const oriValue = value;
        if (!hisonCore.utils.isNumeric(value)) {
            throw new Error(`ER0021 Invalid number\n=>${JSON.stringify(oriValue)}`);
        }
        format = format ? format : customOption.utils.numberFormat;
        const regex = /^(.*?)([#0,.]+)(.*?)$/;
        const matches = format.match(regex);

        if (!matches) {
            throw new Error(`ER0022 Invalid format\n=>${JSON.stringify(format)}`);
        }

        const prefix = matches[1];
        const numberFormat = matches[2];
        const suffix = matches[3];
        const intergerFormat = numberFormat.split('.')[0];
        const decimalFormat = numberFormat.split('.').length > 1 ? numberFormat.split('.')[1] : '';

        if (suffix === '%' || suffix === ' %') value = value * 100;

        let numStr = hisonCore.utils.getToString(value);
        const isNegative = numStr[0] === '-';
        numStr = isNegative ? numStr.substring(1) : numStr;
        let interger = numStr.split('.')[0];
        let decimal = numStr.split('.').length > 1 ? numStr.split('.')[1] : '';
        
        let result: string;

        decimal = hisonCore.utils.getToFloat('0.' + decimal)
                .toLocaleString('en',{
                    minimumFractionDigits: decimalFormat.lastIndexOf('0') + 1,
                    maximumFractionDigits: decimalFormat.length
                    });
        if (decimal === '0') decimal = '';
        else decimal = decimal.substring(1);

        switch (intergerFormat) {
            case '#,###':
                if (hisonCore.utils.getToNumber(interger) === 0) {
                    result = decimal;
                }
                else {
                    interger = hisonCore.utils.getToFloat(interger).toLocaleString('en');
                    result = interger + decimal;
                }
                break;
            case '#,##0':
                interger = hisonCore.utils.getToFloat(interger).toLocaleString('en');
                result = interger + decimal;
                break;
            case '#':
                if (hisonCore.utils.getToNumber(interger) === 0) {
                    result = decimal;
                }
                else {
                    result = interger + decimal;
                }
                break;
            case '0':
                result = interger + decimal;
                break;
            default:
                throw new Error(`ER0023 Invalid format\n=>${JSON.stringify(format)}`);
        }
        result = isNegative ? '-' + result : result;
        return prefix + result + suffix;
    },

    type이 mask인 경우 => hison.utils.isValidMask()활용
    type이 date인 경우
    type이 month인 경우
    type이 year인 경우
    type이 time인 경우
    type이 minute인 경우
    날짜, 시간 형식은
    hison.utils.getDateWithFormat()활용
    * Formats a given date or datetime according to the specified format.
    *
    * - Accepts a `DateTimeObject`, `DateObject`, or a string representation of a date/datetime.
    * - If no format is provided, it defaults to `CustomOption.dateFormat` for dates 
    *   and `CustomOption.datetimeFormat` for datetimes.
    * - Supports various formats such as:
    *   - `'yyyy-MM-dd'` → `"2025-02-05"`
    *   - `'yyyy/MM/dd hh:mm:ss'` → `"2025/02/05 14:30:45"`
    *   - `'MMMM dd, yyyy'` → `"February 5, 2025"`
    * - Throws an error if the input date is invalid.
    *
    * @param datetime The date or datetime to format.
    * @param format The desired output format (optional). Default: `'yyyy-MM-dd'` or `'yyyy-MM-dd hh:mm:ss'`
    * @returns The formatted date/time as a string.
    *
    * @throws Error if the provided date is invalid.
    *
    * @example
    * getDateWithFormat("2025-02-05", AllDateTimeFormat[yyyy/MM/dd]); // "2025/02/05"
    * getDateWithFormat("2025-02-05 14:30:45", AllDateTimeFormat[MMMM dd, yyyy]); // "February 5, 2025"
    * getDateWithFormat({ y: 2025, M: 2, d: 5 }, AllDateTimeFormat[MM-dd-yyyy]); // "02-05-2025"
    getDateWithFormat(datetime: DateTimeObject | DateObject | string,
        format?: keyof typeof AllDateTimeFormat): string {
        const datetimeObj = hisonCore.utils.isObject(datetime) ? hisonCore.utils.deepCopyObject(datetime) : hisonCore.utils.getDatetimeObject(datetime as string);
        if (!format) {
            if (datetimeObj.h === undefined || datetimeObj.h === null) {
                format = customOption.utils.dateFormat;
            }
            else {
                format = customOption.utils.datetimeFormat;
            }
        }

        const y = datetimeObj.y.toString();
        const M = (datetimeObj.M || 1).toString().padStart(2, '0');
        const d = (datetimeObj.d || 1).toString().padStart(2, '0');
        const h = (datetimeObj.h || 0).toString().padStart(2, '0');
        const m = (datetimeObj.m || 0).toString().padStart(2, '0');
        const s = (datetimeObj.s || 0).toString().padStart(2, '0');

        if (!hisonCore.utils.isDate(y + M + d)) throw new Error(`ER0009 Please enter a valid date.\n=>${JSON.stringify(datetime)}`);
        if (!hisonCore.utils.isTime(h + m + s)) throw new Error(`ER0010 Please enter a valid date.\n=>${JSON.stringify(datetime)}`);

        const MMMM = hisonCore.utils.getMonthName(datetimeObj.M);
        const MMM = hisonCore.utils.getMonthName(datetimeObj.M, false);

        switch (format) {
            case 'yyyy':
                return y;
                
            case 'yyyyMM':
                return y + M;
            case 'yyyy-MM':
                return y + '-' + M;
            case 'yyyy/MM':
                return y + '/' + M;
            case 'yyyy. MM':
                return y + '. ' + M;
            case 'yyyy MM':
                return y + ' ' + M;
    
            case 'yyyyMMdd':
                return y + M + d;
            case 'yyyy-MM-dd':
                return y + '-' + M + '-' + d;
            case 'yyyy/MM/dd':
                return y + '/' + M + '/' + d;
            case 'yyyy. MM. dd':
                return y + '. ' + M + '. ' + d;
            case 'yyyy MM dd':
                return y + ' ' + M + ' ' + d;
    
            case 'yyyyMMdd hh':
                return y + M + d + ' ' + h;
            case 'yyyyMMdd hhmm':
                return y + M + d + ' ' + h + m;
            case 'yyyyMMdd hhmmss':
                return y + M + d + ' ' + h + m + s;
            case 'yyyyMMdd hh:mm':
                return y + M + d + ' ' + h + ':' + m;
            case 'yyyyMMdd hh:mm:ss':
                return y + M + d + ' ' + h + ':' + m + ':' + s;
            case 'yyyy-MM-dd hh':
                return y + '-' + M + '-' + d + ' ' + h;
            case 'yyyy-MM-dd hhmm':
                return y + '-' + M + '-' + d + ' ' + h + m;
            case 'yyyy-MM-dd hhmmss':
                return y + '-' + M + '-' + d + ' ' + h + m + s;
            case 'yyyy-MM-dd hh:mm':
                return y + '-' + M + '-' + d + ' ' + h + ':' + m;
            case 'yyyy-MM-dd hh:mm:ss':
                return y + '-' + M + '-' + d + ' ' + h + ':' + m + ':' + s;
            case 'yyyy/MM/dd hh':
                return y + '/' + M + '/' + d + ' ' + h;
            case 'yyyy/MM/dd hhmm':
                return y + '/' + M + '/' + d + ' ' + h + m;
            case 'yyyy/MM/dd hhmmss':
                return y + '/' + M + '/' + d + ' ' + h + m + s;
            case 'yyyy/MM/dd hh:mm':
                return y + '/' + M + '/' + d + ' ' + h + ':' + m;
            case 'yyyy/MM/dd hh:mm:ss':
                return y + '/' + M + '/' + d + ' ' + h + ':' + m + ':' + s;
            case 'yyyy. MM. dd hh':
                return y + '. ' + M + '. ' + d + ' ' + h;
            case 'yyyy. MM. dd hhmm':
                return y + '. ' + M + '. ' + d + ' ' + h + m;
            case 'yyyy. MM. dd hhmmss':
                return y + '. ' + M + '. ' + d + ' ' + h + m + s;
            case 'yyyy. MM. dd hh:mm':
                return y + '. ' + M + '. ' + d + ' ' + h + ':' + m;
            case 'yyyy. MM. dd hh:mm:ss':
                return y + '. ' + M + '. ' + d + ' ' + h + ':' + m + ':' + s;
            case 'yyyy MM dd hh':
                return y + ' ' + M + ' ' + d + ' ' + h;
            case 'yyyy MM dd hhmm':
                return y + ' ' + M + ' ' + d + ' ' + h + m;
            case 'yyyy MM dd hhmmss':
                return y + ' ' + M + ' ' + d + ' ' + h + m + s;
            case 'yyyy MM dd hh:mm':
                return y + ' ' + M + ' ' + d + ' ' + h + ':' + m;
            case 'yyyy MM dd hh:mm:ss':
                return y + ' ' + M + ' ' + d + ' ' + h + ':' + m + ':' + s;
    
            case 'MMyyyy':
                return M + y;
            case 'MM-yyyy':
                return M + '-' + y;
            case 'MM/yyyy':
                return M + '/' + y;
            case 'MM. yyyy':
                return M + '/' + y;
            case 'MM yyyy':
                return M + '/' + y;
            case 'MMMM yyyy':
                return MMMM + ' ' + y;
            case 'MMMM, yyyy':
                return MMMM + ', ' + y;
            case 'MMM yyyy':
                return MMM + ' ' + y;
            case 'MMM, yyyy':
                return MMM + ', ' + y;
    
            case 'MMddyyyy':
                return M + d + y;
            case 'MM-dd-yyyy':
                return M + '-' + d + '-' + y;
            case 'MM/dd/yyyy':
                return M + '/' + d + '/' + y;
            case 'MM. dd. yyyy':
                return M + '. ' + d + '. ' + y;
            case 'MMMM dd yyyy':
                return MMMM + ' ' + d + ' ' + y;
            case 'MMMM dd, yyyy':
                return MMMM + ' ' + d + ', ' + y;
            case 'MMM dd yyyy':
                return MMM + ' ' + d + ' ' + y;
            case 'MMM dd, yyyy':
                return MMM + ' ' + d + ', ' + y;
    
            case 'MMddyyyy hh':
                return M + d + y + ' ' + h;
            case 'MMddyyyy hhmm':
                return M + d + y + ' ' + h + m;
            case 'MMddyyyy hhmmss':
                return M + d + y + ' ' + h + m + s;
            case 'MMddyyyy hh:mm':
                return M + d + y + ' ' + h + ':' + m;
            case 'MMddyyyy hh:mm:ss':
                return M + d + y + ' ' + h + ':' + m + ':' + s;
            case 'MM-dd-yyyy hh':
                return M + '-' + d + '-' + y + ' ' + h;
            case 'MM-dd-yyyy hhmm':
                return M + '-' + d + '-' + y + ' ' + h + m;
            case 'MM-dd-yyyy hhmmss':
                return M + '-' + d + '-' + y + ' ' + h + m + s;
            case 'MM-dd-yyyy hh:mm':
                return M + '-' + d + '-' + y + ' ' + h + ':' + m;
            case 'MM-dd-yyyy hh:mm:ss':
                return M + '-' + d + '-' + y + ' ' + h + ':' + m + ':' + s;
            case 'MM/dd/yyyy hh':
                return M + '/' + d + '/' + y + ' ' + h;
            case 'MM/dd/yyyy hhmm':
                return M + '/' + d + '/' + y + ' ' + h + m;
            case 'MM/dd/yyyy hhmmss':
                return M + '/' + d + '/' + y + ' ' + h + m + s;
            case 'MM/dd/yyyy hh:mm':
                return M + '/' + d + '/' + y + ' ' + h + ':' + m;
            case 'MM/dd/yyyy hh:mm:ss':
                return M + '/' + d + '/' + y + ' ' + h + ':' + m + ':' + s;
            case 'MM. dd. yyyy hh':
                return M + '. ' + d + '. ' + y + ' ' + h;
            case 'MM. dd. yyyy hhmm':
                return M + '. ' + d + '. ' + y + ' ' + h + m;
            case 'MM. dd. yyyy hhmmss':
                return M + '. ' + d + '. ' + y + ' ' + h + m + s;
            case 'MM. dd. yyyy hh:mm':
                return M + '. ' + d + '. ' + y + ' ' + h + ':' + m;
            case 'MM. dd. yyyy hh:mm:ss':
                return M + '. ' + d + '. ' + y + ' ' + h + ':' + m + ':' + s;
            case 'MMMM dd yyyy hh':
                return MMMM + ' ' + d + ' ' + y + ' ' + h;
            case 'MMMM dd yyyy hhmm':
                return MMMM + ' ' + d + ' ' + y + ' ' + h + m;
            case 'MMMM dd yyyy hhmmss':
                return MMMM + ' ' + d + ' ' + y + ' ' + h + m + s;
            case 'MMMM dd yyyy hh:mm':
                return MMMM + ' ' + d + ' ' + y + ' ' + h + ':' + m;
            case 'MMMM dd yyyy hh:mm:ss':
                return MMMM + ' ' + d + ' ' + y + ' ' + h + ':' + m + ':' + s;
            case 'MMMM dd, yyyy hh':
                return MMMM + ' ' + d + ', ' + y + ' ' + h;
            case 'MMMM dd, yyyy hhmm':
                return MMMM + ' ' + d + ', ' + y + ' ' + h + m;
            case 'MMMM dd, yyyy hhmmss':
                return MMMM + ' ' + d + ', ' + y + ' ' + h + m + s;
            case 'MMMM dd, yyyy hh:mm':
                return MMMM + ' ' + d + ', ' + y + ' ' + h + ':' + m;
            case 'MMMM dd, yyyy hh:mm:ss':
                return MMMM + ' ' + d + ', ' + y + ' ' + h + ':' + m + ':' + s;
            case 'MMM dd yyyy hh':
                return MMM + ' ' + d + ' ' + y + ' ' + h;
            case 'MMM dd yyyy hhmm':
                return MMM + ' ' + d + ' ' + y + ' ' + h + m;
            case 'MMM dd yyyy hhmmss':
                return MMM + ' ' + d + ' ' + y + ' ' + h + m + s;
            case 'MMM dd yyyy hh:mm':
                return MMM + ' ' + d + ' ' + y + ' ' + h + ':' + m;
            case 'MMM dd yyyy hh:mm:ss':
                return MMM + ' ' + d + ' ' + y + ' ' + h + ':' + m + ':' + s;
            case 'MMM dd, yyyy hh':
                return MMM + ' ' + d + ', ' + y + ' ' + h;
            case 'MMM dd, yyyy hhmm':
                return MMM + ' ' + d + ', ' + y + ' ' + h + m;
            case 'MMM dd, yyyy hhmmss':
                return MMM + ' ' + d + ', ' + y + ' ' + h + m + s;
            case 'MMM dd, yyyy hh:mm':
                return MMM + ' ' + d + ', ' + y + ' ' + h + ':' + m;
            case 'MMM dd, yyyy hh:mm:ss':
                return MMM + ' ' + d + ', ' + y + ' ' + h + ':' + m + ':' + s;
    
            case 'ddMMyyyy':
                return d + M + y;
            case 'dd-MM-yyyy':
                return d + '-' + M + '-' + y;
            case 'dd/MM/yyyy':
                return d + '/' + M + '/' + y;
            case 'dd. MM. yyyy':
                return d + '. ' + M + '. ' + y;
            case 'dd MMMM yyyy':
                return d + ' ' + MMMM + ' ' + y;
            case 'dd MMM yyyy':
                return d + ' ' + MMM + ' ' + y;
    
            case 'ddMMyyyy hh':
                return d + M + y + ' ' + h;
            case 'ddMMyyyy hhmm':
                return d + M + y + ' ' + h + m;
            case 'ddMMyyyy hhmmss':
                return d + M + y + ' ' + h + m + s;
            case 'ddMMyyyy hh:mm':
                return d + M + y + ' ' + h + ':' + m;
            case 'ddMMyyyy hh:mm:ss':
                return d + M + y + ' ' + h + ':' + m + ':' + s;
            case 'dd-MM-yyyy hh':
                return d + '-' + M + '-' + y + ' ' + h;
            case 'dd-MM-yyyy hhmm':
                return d + '-' + M + '-' + y + ' ' + h + m;
            case 'dd-MM-yyyy hhmmss':
                return d + '-' + M + '-' + y + ' ' + h + m + s;
            case 'dd-MM-yyyy hh:mm':
                return d + '-' + M + '-' + y + ' ' + h + ':' + m;
            case 'dd-MM-yyyy hh:mm:ss':
                return d + '-' + M + '-' + y + ' ' + h + ':' + m + ':' + s;
            case 'dd/MM/yyyy hh':
                return d + '/' + M + '/' + y + ' ' + h;
            case 'dd/MM/yyyy hhmm':
                return d + '/' + M + '/' + y + ' ' + h + m;
            case 'dd/MM/yyyy hhmmss':
                return d + '/' + M + '/' + y + ' ' + h + m + s;
            case 'dd/MM/yyyy hh:mm':
                return d + '/' + M + '/' + y + ' ' + h + ':' + m;
            case 'dd/MM/yyyy hh:mm:ss':
                return d + '/' + M + '/' + y + ' ' + h + ':' + m + ':' + s;
            case 'dd. MM. yyyy hh':
                return d + '. ' + M + '. ' + y + ' ' + h;
            case 'dd. MM. yyyy hhmm':
                return d + '. ' + M + '. ' + y + ' ' + h + m;
            case 'dd. MM. yyyy hhmmss':
                return d + '. ' + M + '. ' + y + ' ' + h + m + s;
            case 'dd. MM. yyyy hh:mm':
                return d + '. ' + M + '. ' + y + ' ' + h + ':' + m;
            case 'dd. MM. yyyy hh:mm:ss':
                return d + '. ' + M + '. ' + y + ' ' + h + ':' + m + ':' + s;
            case 'dd MMMM yyyy hh':
                return d + ' ' + MMMM + ' ' + y + ' ' + h;
            case 'dd MMMM yyyy hhmm':
                return d + ' ' + MMMM + ' ' + y + ' ' + h + m;
            case 'dd MMMM yyyy hhmmss':
                return d + ' ' + MMMM + ' ' + y + ' ' + h + m + s;
            case 'dd MMMM yyyy hh:mm':
                return d + ' ' + MMMM + ' ' + y + ' ' + h + ':' + m;
            case 'dd MMMM yyyy hh:mm:ss':
                return d + ' ' + MMMM + ' ' + y + ' ' + h + ':' + m + ':' + s;
            case 'dd MMM yyyy hh':
                return d + ' ' + MMM + ' ' + y + ' ' + h;
            case 'dd MMM yyyy hhmm':
                return d + ' ' + MMM + ' ' + y + ' ' + h + m;
            case 'dd MMM yyyy hhmmss':
                return d + ' ' + MMM + ' ' + y + ' ' + h + m + s;
            case 'dd MMM yyyy hh:mm':
                return d + ' ' + MMM + ' ' + y + ' ' + h + ':' + m;
            case 'dd MMM yyyy hh:mm:ss':
                return d + ' ' + MMM + ' ' + y + ' ' + h + ':' + m + ':' + s;
    
            default:
                throw new Error(`ER0010 Invalid format.\n=>${JSON.stringify(format)}`);
        }
    },


     */
    format : { type: String, required: false },
    //필수 아님. defualt: editable. editable, readonly, disable	편집 상태 값을 설정한다. readonly, disable은 둘다 disable, css다름
    editMode : { type: String as PropType<InputEditMode>, required: false },
    // 	값이 true 인 경우는 필수 항목이다.(속성값으로 가지고 있음)
    required : { type: String as PropType<BoolString>, required: false },
    //필수 아님. default: false. true시 폰트를 굵게 설정한다.
    fontBold : { type: String as PropType<BoolString>, required: false },
    //필수 아님. default: false. true시 폰트를 이탤릭체로 설정한다.
    fontItalic : { type: String as PropType<BoolString>, required: false },
    //필수 아님. default: false. true시 폰트를 취소선을 설정한다.
    fontThruline : { type: String as PropType<BoolString>, required: false },
    //필수 아님. default: false. true시 폰트를 밑줄을 설정한다.
    fontUnderline : { type: String as PropType<BoolString>, required: false },
    //	입력할 수 있는 값의 최대 글자수를 설정한다. 지정하지 않을 경우 자릿수의 제한은 없다.
    maxLength : { type: String, required: false },
    //	입력할 수 있는 값의 최대 바이트수를 설정한다. 지정하지 않을 경우 자릿수의 제한은 없다.
    /**
     * Byte의 기준은
     * hison.utils.getByteLength()를 활용
     *   * Truncates a string to fit within a specified byte length.
         *
         * - Uses UTF-8 encoding rules to calculate byte size.
         * - Truncates the string at the point where the total byte length exceeds `cutByte`.
         * - Character byte sizes are determined as follows:
         *   - `charCode <= 0x7F` → 1 byte (ASCII characters).
         *   - `charCode <= 0x7FF` → `CustomOption.LESSOREQ_0X7FF_BYTE` bytes.
         *   - `charCode <= 0xFFFF` → `CustomOption.LESSOREQ_0XFFFF_BYTE` bytes.
         *   - `charCode > 0xFFFF` → `CustomOption.GREATER_0XFFFF_BYTE` bytes.
         *
         * @param str The input string to be truncated.
         * @param cutByte The maximum allowed byte length.
         * @returns The truncated string that fits within the given byte length.
         *
         * @example
         * getCutByteLength("Hello, World!", 5); // "Hello"
         * getCutByteLength("안녕하세요", 6); // "안녕" (each Korean character is 3 bytes)
         * getCutByteLength("𐍈𐍈𐍈", 4); // "𐍈" (each surrogate pair character is 4 bytes)
        getCutByteLength(str: string, cutByte: number): string {
            str = hisonCore.utils.getToString(str);
            cutByte = hisonCore.utils.getToNumber(cutByte);
            let byteLength = 0;
            let cutIndex = str.length;
            for (let i = 0; i < str.length; i++) {
                const charCode = str.charCodeAt(i);
                if (charCode <= 0x7F) {
                    byteLength += 1;
                } else if (charCode <= 0x7FF) {
                    byteLength += customOption.utils.LESSOREQ_0X7FF_BYTE;
                } else if (charCode <= 0xFFFF) {
                    byteLength += customOption.utils.LESSOREQ_0XFFFF_BYTE;
                } else {
                    byteLength += customOption.utils.GREATER_0XFFFF_BYTE;
                }
                if (byteLength > cutByte) {
                    cutIndex = i;
                    break;
                }
            }
            return str.substring(0, cutIndex);
        }
     */
    maxByte : { type: String, required: false },
    //	입력해야 할 값에 대한 부연 설명이 필요한 경우 표시되는 값을 설정한다.
    placeholder : { type: String, required: false },
}
