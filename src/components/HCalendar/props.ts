import { PropType, CSSProperties } from 'vue'
import { HCalendarEvent, HCalendarSpecialTimeMap } from '../../types'
import {
    H_CALENDAR_TIME_FORMAT_VALUES,
    H_CALENDAR_VIEW_VALUES,
    HCalendarTimeFormat,
    HCalendarTimeFormatValue,
    HCalendarView,
    HCalendarViewValue,
} from '../../enums'

export const calendarProps = {
    /**
     * Unique identifier for the calendar component.
     * - Use `hison.component.getCalendar(id)` to access methods at runtime.
     * - ⚠️ Duplicate `id` values will throw an error at mount time.
     */
    id: { type: String, required: false },

    /**
     * Custom class applied to the calendar (string / array / object all supported).
     * - Works with responsive classes like `hison-col-*`, `hison-size-*`, etc.
     */
    class: {
        type: [String, Array, Object] as PropType<
        string | string[] | Record<string, boolean>
        >,
        required: false,
    },

    /**
     * Inline style for the calendar (string, object, or an array of objects).
     */
    style: {
        type: [String, Object, Array] as PropType<
        string | CSSProperties | CSSProperties[]
        >,
        required: false,
    },

    /**
     * Controls visibility of the calendar.
     * - true: visible / false: display: none
     */
    visible: { type: Boolean, default: true },

    /**
     * Whether the calendar is disabled (selection blocked + dimmed style).
     */
    disable: { type: Boolean, default: false },

    /**
     * Initially selected date.
     * - String (e.g. '2025-01-01') or Date
     */
    selectedDate: {
        type: [String, Date] as PropType<string | Date>,
        default: () => new Date(),
    },

    /**
     * Array of calendar events to display.
     */
    events: {
        type: Array as PropType<HCalendarEvent[]>,
        default: () => [],
    },

    /**
     * Weekend header background color (CSS color).
     */
    weekendColor: { type: String, required: false },

    /**
     * Weekend day indexes (0..6). Example: [0,6] for Sun/Sat.
     */
    weekendDays: {
        type: Array as PropType<number[]>,
        required: false,
        validator: (arr: unknown) =>
        Array.isArray(arr) && arr.every(n => Number.isInteger(n) && n >= 0 && n <= 6),
    },

    /**
     * Whether to highlight today's cell background.
     */
    showTodayColor: { type: Boolean, default: true },

    /**
     * Selected date cell background color (CSS color).
     */
    selectedColor: { type: String, required: false },

    /**
     * Time highlight blocks per day.
     */
    specialTime: {
        type: Object as PropType<HCalendarSpecialTimeMap>,
        required: false,
    },

    /**
     * Min height (px) for date cells in 'month' view.
     */
    dateCellMinHeight: { type: Number, required: false },

    /**
     * Max height (px) for date cells in 'month' view (enables scroll).
     */
    dateCellMaxHeight: { type: Number, required: false },

    /**
     * Disabled (non-selectable) date strings. Example: ['2025-06-26']
     */
    disableDays: {
        type: Array as PropType<string[]>,
        required: false,
        default: undefined,
    },

    /**
     * Controls how events are shown in the month view.
     * - false  : show only count
     * - 'short': show titles only
     * - true or any other string: show full details
     */
    eventsOnMonthView: {
        type: [String, Boolean] as PropType<boolean | string>,
        default: false,
    },

    /**
     * Weekday indexes (0..6) to hide.
     */
    hideWeekdays: {
        type: Array as PropType<number[]>,
        required: false,
        validator: (arr: unknown) =>
        Array.isArray(arr) && arr.every(n => Number.isInteger(n) && n >= 0 && n <= 6),
    },

    /**
     * Whether to hide weekends (Sat/Sun).
     */
    hideWeekends: { type: Boolean, default: false },

    /**
     * Calendar locale. Example: 'en', 'ko', 'fr'.
     */
    locale: { type: String, default: 'en' },

    /**
     * Max selectable date (string or Date).
     */
    maxDate: { type: [String, Date] as PropType<string | Date>, required: false },

    /**
     * Min selectable date (string or Date).
     */
    minDate: { type: [String, Date] as PropType<string | Date>, required: false },

    /**
     * Week starts on Sunday (true) or Monday (false).
     */
    startWeekOnSunday: { type: Boolean, default: false },

    /**
     * Whether to display time-axis in week/day view.
     */
    time: { type: Boolean, default: true },

    /**
     * Time cell height in week/day view (px).
     */
    timeCellHeight: { type: Number, required: false },

    /**
     * Time label format (overrides twelveHour if provided).
     * - Accepts enum or literal string (with Volar completion).
     */
    timeFormat: {
        type: String as PropType<HCalendarTimeFormat | HCalendarTimeFormatValue>,
        required: false,
        validator: (v: any) =>
        v == null || (H_CALENDAR_TIME_FORMAT_VALUES as readonly string[]).includes(v),
    },

    /**
     * Time axis start (minutes from 0..1440).
     */
    timeFrom: {
        type: Number,
        required: false,
        validator: (n: any) => n == null || (Number.isFinite(n) && n >= 0 && n <= 1440),
    },

    /**
     * Time axis step (minutes).
     */
    timeStep: {
        type: Number,
        required: false,
        validator: (n: any) => n == null || (Number.isFinite(n) && n > 0 && n <= 1440),
    },

    /**
     * Time axis end (minutes from 0..1440).
     */
    timeTo: {
        type: Number,
        required: false,
        validator: (n: any) => n == null || (Number.isFinite(n) && n >= 0 && n <= 1440),
    },

    /**
     * Hide title bar (month/year & nav).
     */
    hideTitleBar: { type: Boolean, default: false },

    /**
     * Use 12-hour clock with AM/PM labels.
     * - Ignored if `timeFormat` is set.
     */
    twelveHour: { type: Boolean, default: false },

    /**
     * Initial view mode of the calendar.
     * - Accepts enum or literal ('day' | 'week' | 'month' | 'year' | 'years')
     */
    activeView: {
        type: String as PropType<HCalendarView | HCalendarViewValue>,
        required: false,
        validator: (v: any) =>
        v == null || (H_CALENDAR_VIEW_VALUES as readonly string[]).includes(v),
    },

    /**
     * List of views to disable in navigation.
     * - All values must be in ('day'|'week'|'month'|'year'|'years')
     */
    disableViews: {
        type: Array as PropType<(HCalendarView | HCalendarViewValue)[]>,
        required: false,
        validator: (arr: any) =>
        arr == null ||
        (Array.isArray(arr) &&
            arr.every(v => (H_CALENDAR_VIEW_VALUES as readonly string[]).includes(v))),
    },
}
