import { PropType } from 'vue'
import { HCalendarEvent, HCalendarSpecialTimeMap } from "../../types";
import { HCalenderTimeFormat, HCalenderView } from '../../enums';

export const calendarProps = {
    /**
     * Unique identifier for the calendar component.
     * - Use `hison.component.getCalendar(id)` to access methods at runtime.
     * - ⚠️ Duplicate `id` values will throw an error at mount time.
     */
    id: { type: String, required: false },
    /**
     * Custom class string applied to the calender container.
     * - You can use `hison-col-*`, `hison-pos-*`, `hison-size-*` and other responsive classes
     * - These classes will be processed internally for device-specific application
     */
    class: { type: String, required: false },
    /**
     * Inline style string applied to the calendar container.
     * - Accepts valid CSS style text (e.g., 'margin-top: 20px; background-color: white')
     * - Merged with responsive and internal computed styles
     */
    style: { type: String, required: false },
    /**
     * Controls visibility of the calendar.
     * - `true`: calendar is visible
     * - `false`: `display: none` is applied
     * - Default: `true`
     * - Runtime method: `HCalendarMethods.setVisible(true|false)`
     */
    visible: { type: Boolean, default: true },
    /**
     * Whether the calendar is disabled.
     * - When `true`, date selection is disabled and style is dimmed
     * - Default: `false`
     * - Runtime method: `HCalendarMethods.setDisable(true|false)`
     */
    disable : { type: Boolean, default: false },
    /**
     * Initially selected date.
     * - Accepts a string or JS Date object
     * - Default: `new Date()`
     * - Runtime method: `HCalendarMethods.setSelectedDate(date)`
     */
    selectedDate : { type: [String, Date], default: new Date() },
    /**
     * Array of calendar events to display.
     * - Each event includes start/end time and optional metadata
     * - Default: `[]`
     * - Runtime method: `HCalendarMethods.setEvents(events)`
     */
    events : { type: Array as PropType<HCalendarEvent[]>, default: [] },
    /**
     * Background color for weekend headers.
     * - Accepts CSS color (e.g., '#ff0000' or 'rgba(255,0,0,0.2)')
     * - Applied via CSS variable `--vuecal-weekend-back-color`
     * - Runtime method: `HCalendarMethods.setWeekendColor(color)`
     */
    weekendColor : { type: String, required: false },
    /**
     * Indexes of days considered weekend.
     * - 0 = Sunday, 6 = Saturday
     * - Used with `weekendColor` to color specific headers
     * - If omitted, defaults based on `startWeekOnSunday`
     * - Runtime method: `HCalendarMethods.setWeekendDays(days)`
     */
    weekendDays : { type: Array as PropType<number[]>, required: false },
    /**
     * Whether to highlight today with a special background color.
     * - Default: `true`
     * - Runtime method: `HCalendarMethods.setShowTodayColor(true|false)`
     */
    showTodayColor : { type: Boolean, default: true },
    /**
     * Background color for the selected date cell.
     * - Accepts CSS color string
     * - Applied via `--vuecal-selected-back-color`
     * - Runtime method: `HCalendarMethods.setSelectedColor(color)`
     */
    selectedColor : { type: String, required: false },
    /**
     * Time highlight blocks for each day of the week.
     * - Used to visually mark time ranges like lunch breaks, meetings, etc.
     * - Accepts an object with keys from 0 (Sunday) to 6 (Saturday)
     * - Each value is an array of `{ from: number; to: number; className?: string }`
     * - Times are in minutes (e.g., `9 * 60` = 9:00 AM)
     * - Runtime method: `HCalendarMethods.setSpecialTime(map)`
     */
    specialTime : { type: Object as PropType<HCalendarSpecialTimeMap>, required: false},
    /**
     * Minimum height for date cells in 'month' view (in pixels).
     * - Useful for increasing vertical space per cell
     * - Runtime method: `HCalendarMethods.setDateCellMinHeight(height)`
     */
    dateCellMinHeight : { type: Number, required: false },
    /**
     * Maximum height for date cells in 'month' view (in pixels).
     * - If set, cells become scrollable via `overflow: auto`
     * - Runtime method: `HCalendarMethods.setDateCellMaxHeight(height)`
     */
    dateCellMaxHeight : { type: Number, required: false },
    /**
     * List of dates to disable (non-selectable).
     * - Format: string date array (e.g., `['2025-06-26', '2025-06-27']`)
     * - Disabled dates are visually dimmed and cannot be selected
     * - Runtime method: `HCalendarMethods.setDisableDays(dates)`
     */
    disableDays : { type: Array as PropType<string[]>, required: false },
    /**
     * Controls how events are shown in the month view.
     * - `false`: only shows event count
     * - `'short'`: show event titles only
     * - `true` or other string: show full event details
     * - Runtime method: `HCalendarMethods.setEventsOnMonthView(value)`
     */
    eventsOnMonthView : { type: [String, Boolean], default: false },
    /**
     * Weekday indexes to hide from the calendar.
     * - Format: number array from 0 (Sunday) to 6 (Saturday)
     * - For example, `[2, 3]` hides Tuesday and Wednesday
     * - Runtime method: `HCalendarMethods.setHideWeekdays(days)`
     */
    hideWeekdays : { type: Array as PropType<number[]>, required: false },
    /**
     * Whether to hide weekend days (Saturday and Sunday).
     * - Default: `false`
     * - Runtime method: `HCalendarMethods.setHideWeekends(true|false)`
     */
    hideWeekends : { type: Boolean, default: false },
    /**
     * Language of the calendar interface.
     * - Examples: `'en'`, `'ko'`, `'fr'`
     * - Default: `'en'`
     * - See vue-cal docs for full list of locales
     * - Runtime method: `HCalendarMethods.setLocale(locale)`
     */
    locale : { type: String, default: 'en' },
    /**
     * Maximum selectable date.
     * - Accepts string (e.g., `'2025-12-31'`) or JS Date object
     * - Dates after this will be visually disabled
     * - Runtime method: `HCalendarMethods.setMaxDate(date)`
     */
    maxDate : { type: [String, Date], required: false},
    /**
     * Minimum selectable date.
     * - Accepts string (e.g., `'2024-01-01'`) or JS Date object
     * - Dates before this will be visually disabled
     * - Runtime method: `HCalendarMethods.setMinDate(date)`
     */
    minDate : { type: [String, Date], required: false },
    /**
     * Whether the calendar week starts on Sunday (`true`) or Monday (`false`).
     * - Default: `false`
     * - Affects weekday order and logic for weekend coloring
     * - Runtime method: `HCalendarMethods.setStartWeekOnSunday(true|false)`
     */
    startWeekOnSunday : { type: Boolean, default: false  },
    /**
     * Whether to display time cells in 'week' and 'day' views.
     * - Default: `true`
     * - Disabling this hides the vertical time axis
     * - Runtime method: `HCalendarMethods.setShowTimeCell(true|false)`
     */
    time : { type: Boolean, default: true },
    /**
     * Height (in pixels) of each time cell in 'week' and 'day' views.
     * - For example, `timeCellHeight = 40` means each hour block is 40px high
     * - Runtime method: `HCalendarMethods.setTimeCellHeight(px)`
     */
    timeCellHeight : { type: Number, required: false },
    /**
     * Format of time labels displayed in time cells.
     * - Uses `HCalenderTimeFormat` enum (e.g., `'HH:mm'`, `'hh:mm{am}'`)
     * - Overrides `twelveHour` if provided
     * - Runtime method: `HCalendarMethods.setTimeFormat(format)`
     */
    timeFormat : { type: String as PropType<HCalenderTimeFormat>, required: false },
    /**
     * Start time for the time axis (in minutes).
     * - Example: `9 * 60` = 9:00 AM
     * - Range: `0` ~ `24 * 60`
     * - Runtime method: `HCalendarMethods.setTimeFrom(minutes)`
     */
    timeFrom : { type: Number, required: false },
    /**
     * Step interval for time cells (in minutes).
     * - Common values: `15`, `30`, `60`
     * - Defines the vertical resolution of the time axis
     * - Runtime method: `HCalendarMethods.setTimeStep(minutes)`
     */
    timeStep : { type: Number, required: false },
    /**
     * End time for the time axis (in minutes).
     * - Example: `18 * 60` = 6:00 PM
     * - Runtime method: `HCalendarMethods.setTimeTo(minutes)`
     */
    timeTo : { type: Number, required: false },
    /**
     * Whether to hide the title bar (month/year label and nav arrows).
     * - Default: `false`
     * - Runtime method: `HCalendarMethods.setHideTitleBar(true|false)`
     */
    hideTitleBar : { type: Boolean, default: false },
    /**
     * Whether to use 12-hour format with AM/PM labels.
     * - Default: `false`
     * - Ignored if `timeFormat` is explicitly set
     * - Runtime method: `HCalendarMethods.setTwelveHour(true|false)`
     */
    twelveHour : { type: Boolean, default: false },
    /**
     * Initial view mode of the calendar.
     * - Accepts values from `HCalenderView` enum:
     *   `'day'`, `'week'`, `'month'`, `'year'`, `'years'`
     * - This sets the default view on mount
     * - Runtime method: `HCalendarMethods.setActiveView(view)`
     */
    activeView : { type: String as PropType<HCalenderView>, required: false },
    /**
     * List of view types to exclude from navigation.
     * - Accepts array of `HCalenderView` enum values
     * - For example, `['years', 'year']` will disable access to year-based views
     * - If the current view is excluded, it will auto-switch to the next available view
     * - Runtime method: `HCalendarMethods.setDisableViews(views)`
     */
    disableViews : { type: Array as PropType<HCalenderView[]>, required: false },
}
